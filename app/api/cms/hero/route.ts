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

// GET all hero items (CMS Panel)
export async function GET() {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const slides = await prisma.hero.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' },
      ],
    });

    return NextResponse.json(slides);
  } catch (error) {
    console.error('Error fetching CMS hero slides:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero slides' },
      { status: 500 }
    );
  }
}

// POST create new hero slide (Max 10 records, title <= 80, description <= 200)
export async function POST(request: Request) {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const totalCount = await prisma.hero.count();
    if (totalCount >= 10) {
      return NextResponse.json(
        { error: 'Maximum limit of 10 Hero items reached. Please delete an existing item before adding a new one.' },
        { status: 400 }
      );
    }

    const contentType = request.headers.get('content-type') || '';
    let title = '';
    let description = '';
    let is_visible = true;
    let imagePath = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      title = (formData.get('title') as string || '').trim();
      description = (formData.get('description') as string || '').trim();
      is_visible = formData.get('is_visible') !== 'false';
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
      title = (body.title || '').trim();
      description = (body.description || '').trim();
      is_visible = body.is_visible !== false;
      imagePath = (body.image || '').trim();
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
    if (!imagePath) {
      return NextResponse.json({ error: 'Image file or image URL is required' }, { status: 400 });
    }

    // Get maximum existing order
    const maxOrderItem = await prisma.hero.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });
    const newOrder = (maxOrderItem?.order ?? 0) + 1;

    const newSlide = await prisma.hero.create({
      data: {
        title,
        description,
        image: imagePath,
        is_visible,
        order: newOrder,
      },
    });

    return NextResponse.json({
      success: true,
      slide: newSlide,
    });
  } catch (error) {
    console.error('Error creating hero slide:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while creating hero item.' },
      { status: 500 }
    );
  }
}
