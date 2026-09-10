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
const FACILITY_IMAGES_DIR = path.join(process.cwd(), 'public', 'uploads', 'facilities');

async function ensureDirExists() {
  await fs.mkdir(FACILITY_IMAGES_DIR, { recursive: true });
}

async function verifyAnyUserToken() {
  return getAdminSession();
}

// GET /api/facilities/[id] (Public)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const facility = await prisma.facility.findUnique({
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

    if (!facility) {
      return NextResponse.json({ error: 'Facility not found' }, { status: 404 });
    }

    return NextResponse.json(facility);
  } catch (error) {
    console.error('GET /api/facilities/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch facility details' }, { status: 500 });
  }
}

// PUT /api/facilities/[id] (Admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAnyUserToken();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existingFacility = await prisma.facility.findUnique({ where: { id } });

    if (!existingFacility) {
      return NextResponse.json({ error: 'Facility not found' }, { status: 404 });
    }

    await ensureDirExists();

    const formData = await request.formData();
    const name = formData.get('name') as string | null;
    const description = formData.get('description') as string | null;
    const imageUrlInput = formData.get('imageUrl') as string | null;
    const imageFile = formData.get('image') as File | null;
    const facultyIdsStr = formData.get('facultyIds') as string | null;

    let newImagePath = existingFacility.image;

    if (imageUrlInput && imageUrlInput.trim() !== '') {
      const safeImageUrl = sanitizeWebUrl(imageUrlInput);
      if (!safeImageUrl) {
        return NextResponse.json({ error: 'Image URL must use http, https, or a local path.' }, { status: 400 });
      }
      newImagePath = safeImageUrl;
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
        FACILITY_IMAGES_DIR,
        `facility_${id}`,
        { quality: 85, maxWidth: 1920 }
      );

      newImagePath = relativePath;
    }

    let facultyConnectDisconnect: any = {};
    if (facultyIdsStr !== null) {
      const facultyIds: string[] = JSON.parse(facultyIdsStr);
      facultyConnectDisconnect = {
        faculties: {
          set: facultyIds.map((fId) => ({ id: fId })),
        },
      };
    }

    const updatedFacility = await prisma.facility.update({
      where: { id },
      data: {
        name: name ? name.trim() : existingFacility.name,
        description: description ? description.trim() : existingFacility.description,
        image: newImagePath,
        ...facultyConnectDisconnect,
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
    return NextResponse.json({ success: true, facility: updatedFacility });
  } catch (error) {
    console.error('PUT /api/facilities/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update facility' }, { status: 500 });
  }
}

// DELETE /api/facilities/[id] (Admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAnyUserToken();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existingFacility = await prisma.facility.findUnique({ where: { id } });

    if (!existingFacility) {
      return NextResponse.json({ error: 'Facility not found' }, { status: 404 });
    }

    await prisma.facility.delete({ where: { id } });

    revalidatePublicPages();
    return NextResponse.json({ success: true, message: 'Facility deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/facilities/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete facility' }, { status: 500 });
  }
}
