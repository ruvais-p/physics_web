import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/api-auth';
import { saveImageAsWebp, isAllowedImageType } from '@/lib/image';
import { sanitizeWebUrl } from '@/lib/url-security';
import { revalidatePublicPages } from '@/lib/public-cache';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const CENTRES_IMAGES_DIR = path.join(process.cwd(), 'public', 'uploads', 'centres');

async function ensureDirExists() {
  await fs.mkdir(CENTRES_IMAGES_DIR, { recursive: true });
}

// GET /api/centres (Public)
export async function GET() {
  try {
    const centres = await prisma.associatedCentre.findMany({
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
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(centres);
  } catch (error) {
    console.error('GET /api/centres error:', error);
    return NextResponse.json({ error: 'Failed to fetch associated centres' }, { status: 500 });
  }
}

// POST /api/centres (Admin only)
export async function POST(request: Request) {
  try {
    const user = await getAdminSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureDirExists();

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const websiteInput = formData.get('website') as string | null;
    const imageUrlInput = formData.get('imageUrl') as string | null;
    const imageFile = formData.get('image') as File | null;
    const facultyIdsStr = formData.get('facultyIds') as string | null;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Centre Name is required.' }, { status: 400 });
    }

    if (!description || !description.trim()) {
      return NextResponse.json({ error: 'Centre Description is required.' }, { status: 400 });
    }

    let finalImagePath = imageUrlInput ? sanitizeWebUrl(imageUrlInput) : null;
    const finalWebsite = websiteInput ? sanitizeWebUrl(websiteInput, false) : null;

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
        CENTRES_IMAGES_DIR,
        'centre',
        { quality: 85, maxWidth: 1920 }
      );

      finalImagePath = relativePath;
    }

    const facultyIds: string[] = facultyIdsStr ? JSON.parse(facultyIdsStr) : [];

    const newCentre = await prisma.associatedCentre.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        image: finalImagePath,
        website: finalWebsite,
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
    return NextResponse.json({ success: true, centre: newCentre });
  } catch (error) {
    console.error('POST /api/centres error:', error);
    return NextResponse.json({ error: 'Failed to create centre' }, { status: 500 });
  }
}
