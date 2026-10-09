import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { saveImageAsWebp, isAllowedImageType } from '@/lib/image';
import { getAdminSession } from '@/lib/api-auth';
import { deleteUploadedFile } from '@/lib/file-security';
import { sanitizeWebUrl } from '@/lib/url-security';

import { revalidatePublicPages } from '@/lib/public-cache';

interface Params {
  params: Promise<{ id?: string; imageId?: string }>;
}

// PUT /api/event-images/[imageId] - Replace existing gallery image or update caption
export async function PUT(request: Request, { params }: Params) {
  const user = await getAdminSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const rawId = resolvedParams.imageId || resolvedParams.id || '';
    const imageId = parseInt(rawId, 10);

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
    let hasCaptionUpdate = false;
    let newCaption: string | null = null;

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

      if (formData.has('caption')) {
        hasCaptionUpdate = true;
        const cap = (formData.get('caption') as string || '').trim();
        newCaption = cap ? cap : null;
      }
    } else {
      const body = await request.json();
      if (body.imageUrl && body.imageUrl.trim()) {
        newImagePath = sanitizeWebUrl(body.imageUrl) || '';
      }
      if (body.caption !== undefined) {
        hasCaptionUpdate = true;
        const cap = typeof body.caption === 'string' ? body.caption.trim() : '';
        newCaption = cap ? cap : null;
      }
    }

    if (!newImagePath && !hasCaptionUpdate) {
      return NextResponse.json({ error: 'Replacement image file, URL, or caption is required' }, { status: 400 });
    }

    // Clean up old physical file if image is replaced and was stored in local uploads directory
    if (newImagePath && existingImage.imagePath.startsWith('/uploads/')) {
      try {
        await deleteUploadedFile(existingImage.imagePath, 'events');
      } catch {
        console.warn('Could not delete old file:', existingImage.imagePath);
      }
    }

    const updateData: { imagePath?: string; caption?: string | null } = {};
    if (newImagePath) updateData.imagePath = newImagePath;
    if (hasCaptionUpdate) updateData.caption = newCaption;

    // Update imagePath and/or caption preserving existing id, eventId, and sortOrder
    const updatedImage = await (prisma as any).eventImage.update({
      where: { id: imageId },
      data: updateData,
    });

    revalidatePublicPages();
    return NextResponse.json(updatedImage);
  } catch (error) {
    console.error('Error updating gallery image:', error);
    return NextResponse.json({ error: 'Failed to update gallery image' }, { status: 500 });
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
    const rawId = resolvedParams.imageId || resolvedParams.id || '';
    const imageId = parseInt(rawId, 10);

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
      } catch {
        console.warn('File removal warning:', existingImage.imagePath);
      }
    }

    // Delete database record
    await (prisma as any).eventImage.delete({
      where: { id: imageId },
    });

    revalidatePublicPages();
    return NextResponse.json({ success: true, message: 'Gallery image deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 });
  }
}
