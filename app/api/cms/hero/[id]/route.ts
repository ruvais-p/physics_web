import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuthToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { writeFile } from 'fs/promises';
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

// PUT update hero slide
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const heroId = parseInt(id, 10);
    if (isNaN(heroId)) {
      return NextResponse.json({ error: 'Invalid hero ID' }, { status: 400 });
    }

    const existingSlide = await prisma.hero.findUnique({
      where: { id: heroId },
    });

    if (!existingSlide) {
      return NextResponse.json({ error: 'Hero item not found' }, { status: 404 });
    }

    const contentType = request.headers.get('content-type') || '';
    let title = existingSlide.title;
    let description = existingSlide.description;
    let is_visible = existingSlide.is_visible;
    let imagePath = existingSlide.image;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      if (formData.has('title')) title = (formData.get('title') as string || '').trim();
      if (formData.has('description')) description = (formData.get('description') as string || '').trim();
      if (formData.has('is_visible')) is_visible = formData.get('is_visible') === 'true';

      const imageFile = formData.get('image') as File | null;
      const imageUrlInput = (formData.get('imageUrl') as string || '').trim();

      if (imageFile && imageFile.size > 0) {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const ext = path.extname(imageFile.name) || '.jpg';
        const filename = `hero_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await writeFile(path.join(uploadDir, filename), buffer);

        imagePath = `/uploads/${filename}`;
      } else if (imageUrlInput) {
        imagePath = imageUrlInput;
      }
    } else {
      const body = await request.json();
      if (body.title !== undefined) title = (body.title || '').trim();
      if (body.description !== undefined) description = (body.description || '').trim();
      if (body.is_visible !== undefined) is_visible = Boolean(body.is_visible);
      if (body.image !== undefined && body.image.trim()) imagePath = body.image.trim();
    }

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (title.length > 80) {
      return NextResponse.json({ error: 'Title must not exceed 80 characters' }, { status: 400 });
    }
    if (description.length > 200) {
      return NextResponse.json({ error: 'Description must not exceed 200 characters' }, { status: 400 });
    }

    const updatedSlide = await prisma.hero.update({
      where: { id: heroId },
      data: {
        title,
        description,
        image: imagePath,
        is_visible,
      },
    });

    return NextResponse.json({
      success: true,
      slide: updatedSlide,
    });
  } catch (error) {
    console.error('Error updating hero slide:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while updating hero item.' },
      { status: 500 }
    );
  }
}

// DELETE hero slide
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const heroId = parseInt(id, 10);
    if (isNaN(heroId)) {
      return NextResponse.json({ error: 'Invalid hero ID' }, { status: 400 });
    }

    await prisma.hero.delete({
      where: { id: heroId },
    });

    return NextResponse.json({
      success: true,
      message: 'Hero item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to delete hero item.' },
      { status: 500 }
    );
  }
}
