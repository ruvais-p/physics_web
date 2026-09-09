import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { saveImageAsWebp, isAllowedImageType } from '@/lib/image';
import { getAdminSession } from '@/lib/api-auth';
import { deleteUploadedFile } from '@/lib/file-security';
import { sanitizeWebUrl } from '@/lib/url-security';

interface Params {
  params: Promise<{ imageId: string }>;
}

// PUT /api/event-images/[imageId] - Replace existing gallery image
export async function PUT(request: Request, { params }: Params) {
  const user = await getAdminSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const imageId = parseInt(resolvedParams.imageId, 10);

    if (isNaN(imageId)) {
      return NextResponse.json({ error: 'Invalid image ID' }, { status: 400 });
    }

    const existingImage = await (prisma as any).eventImage.findUnique({
      where: { id: imageId },
    });

    if (!existingImage) {
      return NextResponse.json({ error: 'Gallery image not found' }, { status: 404 });
    }

    const contentType = request.headers.get('content-type') || '';
    let newImagePath = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('image') as File | null;
      const imageUrlInput = (formData.get('imageUrl') as string || '').trim();

      if (file && file.size > 0) {
        if (file.size > 10 * 1024 * 1024) {
          return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
        }

        if (!isAllowedImageType(file.type || file.name)) {
          return NextResponse.json({ error: 'Unsupported image format' }, { status: 400 });
        }

        const { relativePath } = await saveImageAsWebp(
          file,
          'public/uploads/events',
          `gallery_${existingImage.eventId}`,
          { quality: 85, maxWidth: 1920 }
        );
        newImagePath = relativePath;
      } else if (imageUrlInput) {
        newImagePath = sanitizeWebUrl(imageUrlInput) || '';
      }
    } else {
      const body = await request.json();
      if (body.imageUrl && body.imageUrl.trim()) {
        newImagePath = sanitizeWebUrl(body.imageUrl) || '';
      }
    }

    if (!newImagePath) {
      return NextResponse.json({ error: 'Replacement image file or URL is required' }, { status: 400 });
    }

    // Clean up old physical file if it was stored in local uploads directory
    if (existingImage.imagePath.startsWith('/uploads/')) {
      try {
        await deleteUploadedFile(existingImage.imagePath, 'events');
      } catch (err) {
        console.warn('Could not delete old file:', existingImage.imagePath);
      }
    }

    // Update imagePath preserving existing id, eventId, and sortOrder
    const updatedImage = await (prisma as any).eventImage.update({
      where: { id: imageId },
      data: { imagePath: newImagePath },
    });

    return NextResponse.json(updatedImage);
  } catch (error) {
    console.error('Error replacing gallery image:', error);
    return NextResponse.json({ error: 'Failed to replace gallery image' }, { status: 500 });
  }
}

// DELETE /api/event-images/[imageId] - Delete single gallery image
export async function DELETE(request: Request, { params }: Params) {
  const user = await getAdminSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const imageId = parseInt(resolvedParams.imageId, 10);

    if (isNaN(imageId)) {
      return NextResponse.json({ error: 'Invalid image ID' }, { status: 400 });
    }

    const existingImage = await (prisma as any).eventImage.findUnique({
      where: { id: imageId },
    });

    if (!existingImage) {
      return NextResponse.json({ error: 'Gallery image not found' }, { status: 404 });
    }

    // Unlink physical file from disk if stored in /uploads/
    if (existingImage.imagePath.startsWith('/uploads/')) {
      try {
        await deleteUploadedFile(existingImage.imagePath, 'events');
      } catch (err) {
        console.warn('File removal warning:', existingImage.imagePath);
      }
    }

    // Delete database record
    await (prisma as any).eventImage.delete({
      where: { id: imageId },
    });

    return NextResponse.json({ success: true, message: 'Gallery image deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 });
  }
}
