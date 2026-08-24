import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuthToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';

async function checkAuth() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get('auth_token')?.value ||
    cookieStore.get('admin_token')?.value ||
    cookieStore.get('faculty_token')?.value;

  if (!token) return null;
  return verifyAuthToken(token);
}

interface Params {
  params: Promise<{ imageId: string }>;
}

// PUT /api/event-images/[imageId] - Replace existing gallery image
export async function PUT(request: Request, { params }: Params) {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Admin or Faculty session required.' }, { status: 401 });
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
        if (file.size > 5 * 1024 * 1024) {
          return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
        }
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const ext = path.extname(file.name) || '.jpg';
        const filename = `gallery_${existingImage.eventId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });
        await writeFile(path.join(uploadDir, filename), buffer);
        newImagePath = `/uploads/${filename}`;
      } else if (imageUrlInput) {
        newImagePath = imageUrlInput;
      }
    } else {
      const body = await request.json();
      if (body.imageUrl && body.imageUrl.trim()) {
        newImagePath = body.imageUrl.trim();
      }
    }

    if (!newImagePath) {
      return NextResponse.json({ error: 'Replacement image file or URL is required' }, { status: 400 });
    }

    // Clean up old physical file if it was stored in local uploads directory
    if (existingImage.imagePath.startsWith('/uploads/')) {
      try {
        const oldFilePath = path.join(process.cwd(), 'public', existingImage.imagePath);
        await unlink(oldFilePath);
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
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Admin or Faculty session required.' }, { status: 401 });
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
        const filePath = path.join(process.cwd(), 'public', existingImage.imagePath);
        await unlink(filePath);
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
