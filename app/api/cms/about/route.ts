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

// GET CMS About Us record
export async function GET() {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const aboutRecord = await prisma.aboutUs.findFirst({
      orderBy: { id: 'asc' },
    });

    return NextResponse.json(aboutRecord || { content: '', image: '' });
  } catch (error) {
    console.error('Error fetching CMS about us record:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about us details' },
      { status: 500 }
    );
  }
}

// POST/PUT save CMS About Us details
export async function POST(request: Request) {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const existing = await prisma.aboutUs.findFirst({
      orderBy: { id: 'asc' },
    });

    const contentType = request.headers.get('content-type') || '';
    let content = existing?.content || '';
    let imagePath = existing?.image || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      if (formData.has('content')) {
        content = (formData.get('content') as string || '').trim();
      }

      const imageFile = formData.get('image') as File | null;
      const imageUrlInput = (formData.get('imageUrl') as string || '').trim();

      if (imageFile && imageFile.size > 0) {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const ext = path.extname(imageFile.name) || '.jpg';
        const filename = `dept_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await writeFile(path.join(uploadDir, filename), buffer);

        imagePath = `/uploads/${filename}`;
      } else if (imageUrlInput) {
        imagePath = imageUrlInput;
      }
    } else {
      const body = await request.json();
      if (body.content !== undefined) content = (body.content || '').trim();
      if (body.image !== undefined) imagePath = (body.image || '').trim();
    }

    if (!content) {
      return NextResponse.json({ error: 'About Us content is required' }, { status: 400 });
    }

    let result;
    if (existing) {
      result = await prisma.aboutUs.update({
        where: { id: existing.id },
        data: {
          content,
          image: imagePath || null,
        },
      });
    } else {
      result = await prisma.aboutUs.create({
        data: {
          content,
          image: imagePath || null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error saving about us details:', error);
    return NextResponse.json(
      { error: 'Failed to save about us details' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  return POST(request);
}
