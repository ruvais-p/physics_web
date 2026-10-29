import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/api-auth';
import { saveImageAsWebp, isAllowedImageType } from '@/lib/image';
import { sanitizeWebUrl } from '@/lib/url-security';
import { revalidatePublicPages } from '@/lib/public-cache';
import { deleteUploadedFile } from '@/lib/file-security';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const CENTRES_IMAGES_DIR = path.join(process.cwd(), 'public', 'uploads', 'centres');

async function ensureDirExists() {
  await fs.mkdir(CENTRES_IMAGES_DIR, { recursive: true });
}

// GET /api/centres/[id] (Public)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const centre = await prisma.associatedCentre.findUnique({
      where: { id },
      include: {
        faculties: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            email: true,
            designation: true,
            department: true,
            bio: true,
            documents: {
              select: {
                image: true,
              },
            },
          },
        },
      },
    });

    if (!centre) {
      return NextResponse.json({ error: 'Associated centre not found' }, { status: 404 });
    }

    return NextResponse.json(centre);
  } catch (error) {
    console.error('GET /api/centres/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch centre details' }, { status: 500 });
  }
}

// PUT /api/centres/[id] (Admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAdminSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existingCentre = await prisma.associatedCentre.findUnique({ where: { id } });

    if (!existingCentre) {
      return NextResponse.json({ error: 'Associated centre not found' }, { status: 404 });
    }

    await ensureDirExists();

    const formData = await request.formData();
    const name = formData.get('name') as string | null;
    const description = formData.get('description') as string | null;
    const websiteInput = formData.get('website') as string | null;
    const imageUrlInput = formData.get('imageUrl') as string | null;
    const imageFile = formData.get('image') as File | null;
    const removeImage = formData.get('removeImage') === 'true';
    const facultyIdsStr = formData.get('facultyIds') as string | null;

    let finalImagePath = existingCentre.image;

    if (removeImage) {
      if (existingCentre.image && existingCentre.image.startsWith('/uploads/centres/')) {
        await deleteUploadedFile(existingCentre.image, 'centres').catch(() => {});
      }
      finalImagePath = null;
    } else if (imageFile && imageFile.size > 0) {
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

      // Remove old image if stored locally
      if (existingCentre.image && existingCentre.image.startsWith('/uploads/centres/')) {
        await deleteUploadedFile(existingCentre.image, 'centres').catch(() => {});
      }

      const { relativePath } = await saveImageAsWebp(
        imageFile,
        CENTRES_IMAGES_DIR,
        'centre',
        { quality: 85, maxWidth: 1920 }
      );

      finalImagePath = relativePath;
    } else if (imageUrlInput) {
      const sanitized = sanitizeWebUrl(imageUrlInput);
      if (!sanitized) {
        return NextResponse.json({ error: 'Image URL must use http, https, or a local path.' }, { status: 400 });
      }
      finalImagePath = sanitized;
    }

    let finalWebsite = existingCentre.website;
    if (websiteInput !== null) {
      finalWebsite = websiteInput.trim() ? sanitizeWebUrl(websiteInput, false) : null;
    }

    const facultyIds: string[] | null = facultyIdsStr ? JSON.parse(facultyIdsStr) : null;

    const updatedCentre = await prisma.associatedCentre.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(description && { description: description.trim() }),
        image: finalImagePath,
        website: finalWebsite,
        ...(facultyIds !== null && {
          faculties: {
            set: facultyIds.map((fId) => ({ id: fId })),
          },
        }),
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
    return NextResponse.json({ success: true, centre: updatedCentre });
  } catch (error) {
    console.error('PUT /api/centres/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update centre' }, { status: 500 });
  }
}

// DELETE /api/centres/[id] (Admin only)
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAdminSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.associatedCentre.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: 'Associated centre not found' }, { status: 404 });
    }

    if (existing.image && existing.image.startsWith('/uploads/centres/')) {
      await deleteUploadedFile(existing.image, 'centres').catch(() => {});
    }

    await prisma.associatedCentre.delete({ where: { id } });

    revalidatePublicPages();
    return NextResponse.json({ success: true, message: 'Associated centre deleted' });
  } catch (error) {
    console.error('DELETE /api/centres/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete centre' }, { status: 500 });
  }
}
