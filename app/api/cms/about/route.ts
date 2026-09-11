import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/api-auth';
import { revalidatePublicPages } from '@/lib/public-cache';
import { saveImageAsWebp, isAllowedImageType } from '@/lib/image';
import { sanitizeWebUrl } from '@/lib/url-security';

// GET CMS About Us record
export async function GET() {
  const user = await getAdminSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const aboutRecord = await prisma.aboutUs.findFirst({
      orderBy: { id: 'asc' },
    });

    return NextResponse.json(aboutRecord || { content: '', image: null });
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
  const user = await getAdminSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const existing = await prisma.aboutUs.findFirst({
      orderBy: { id: 'asc' },
    });

    const contentType = request.headers.get('content-type') || '';
    let content = existing?.content || '';
    let imagePath = existing?.image || null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      if (formData.has('content')) {
        content = (formData.get('content') as string || '').trim();
      }
      const imageFile = formData.get('image') as File | null;
      const imageUrlInput = (formData.get('imageUrl') as string || '').trim();

      if (imageFile && imageFile.size > 0) {
        if (!isAllowedImageType(imageFile.type || imageFile.name)) {
          return NextResponse.json({ error: 'Unsupported image format' }, { status: 400 });
        }
        const { relativePath } = await saveImageAsWebp(
          imageFile,
          'public/uploads',
          'about_building',
          { quality: 85, maxWidth: 2048 }
        );
        imagePath = relativePath;
      } else if (imageUrlInput) {
        imagePath = sanitizeWebUrl(imageUrlInput) || imagePath;
      }
    } else {
      const body = await request.json();
      if (body.content !== undefined) content = (body.content || '').trim();
      if (body.image !== undefined) imagePath = sanitizeWebUrl(body.image) || imagePath;
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
          image: imagePath,
        },
      });
    } else {
      result = await prisma.aboutUs.create({
        data: {
          content,
          image: imagePath,
        },
      });
    }

    revalidatePublicPages();
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

