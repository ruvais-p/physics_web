import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/api-auth';
import { saveImageAsWebp, isAllowedImageType } from '@/lib/image';
import { sanitizeWebUrl } from '@/lib/url-security';
import { revalidatePublicPages } from '@/lib/public-cache';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const LAB_IMAGES_DIR = path.join(process.cwd(), 'public', 'uploads', 'research-labs');

async function ensureDirExists() {
  await fs.mkdir(LAB_IMAGES_DIR, { recursive: true });
}

async function verifyAnyUserToken() {
  return getAdminSession();
}

// GET /api/research (Public)
export async function GET() {
  try {
    const labs = await prisma.researchLab.findMany({
      include: {
        faculties: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            email: true,
            designation: true,
            department: true,
            documents: {
              select: {
                image: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(labs);
  } catch (error) {
    console.error('GET /api/research error:', error);
    return NextResponse.json({ error: 'Failed to fetch research laboratories' }, { status: 500 });
  }
}

// POST /api/research (Admin only)
export async function POST(request: Request) {
  try {
    const user = await verifyAnyUserToken();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureDirExists();

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const category = (formData.get('category') as string) || 'Experimental';
    const description = formData.get('description') as string;
    const imageUrlInput = formData.get('imageUrl') as string | null;
    const imageFile = formData.get('image') as File | null;
    const facultyIdsStr = formData.get('facultyIds') as string | null;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Laboratory Name is required.' }, { status: 400 });
    }

    if (!description || !description.trim()) {
      return NextResponse.json({ error: 'Laboratory Description is required.' }, { status: 400 });
    }

    let finalImagePath = imageUrlInput ? sanitizeWebUrl(imageUrlInput) : null;

    if (imageUrlInput && !finalImagePath) {
      return NextResponse.json({ error: 'Image URL must use http, https, or a local path.' }, { status: 400 });
    }

    if (imageFile && imageFile.size > 0) {
      if (!isAllowedImageType(imageFile.type) && !isAllowedImageType(imageFile.name)) {
        return NextResponse.json(
          { error: 'Invalid image format. Supported formats are JPG, PNG, and WebP.' },
          { status: 400 }
        );
      }

      if (imageFile.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { error: 'Image size exceeds maximum limit of 10 MB.' },
          { status: 400 }
        );
      }

      const { relativePath } = await saveImageAsWebp(
        imageFile,
        LAB_IMAGES_DIR,
        'lab',
        { quality: 85, maxWidth: 1920 }
      );

      finalImagePath = relativePath;
    }

    const facultyIds: string[] = facultyIdsStr ? JSON.parse(facultyIdsStr) : [];

    const newLab = await prisma.researchLab.create({
      data: {
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        image: finalImagePath,
        faculties: {
          connect: facultyIds.map((id) => ({ id })),
        },
      },
      include: {
        faculties: {
          select: {
            id: true,
            name: true,
            email: true,
            designation: true,
            documents: { select: { image: true } },
          },
        },
      },
    });

    revalidatePublicPages();
    return NextResponse.json({ success: true, lab: newLab });
  } catch (error) {
    console.error('POST /api/research error:', error);
    return NextResponse.json({ error: 'Failed to create research laboratory' }, { status: 500 });
  }
}
