import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import path from 'path';
import fs from 'fs/promises';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken, verifyFacultyToken, verifyAuthToken } from '@/lib/auth';
import { saveImageAsWebp, isAllowedImageType } from '@/lib/image';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const LAB_IMAGES_DIR = path.join(process.cwd(), 'public', 'uploads', 'research-labs');

async function ensureDirExists() {
  await fs.mkdir(LAB_IMAGES_DIR, { recursive: true });
}

async function verifyAnyUserToken() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get('auth_token')?.value ||
    cookieStore.get('admin_token')?.value ||
    cookieStore.get('faculty_token')?.value;

  if (!token) return null;

  const authUser = await verifyAuthToken(token);
  if (authUser) return authUser;

  const admin = await verifyAdminToken(token);
  if (admin) return { ...admin, role: 'admin' as const };

  const faculty = await verifyFacultyToken(token);
  if (faculty) return { ...faculty, role: 'faculty' as const };

  return null;
}

// GET /api/research/[id] (Public)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lab = await prisma.researchLab.findUnique({
      where: { id },
      include: {
        faculties: {
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

    if (!lab) {
      return NextResponse.json({ error: 'Research laboratory not found' }, { status: 404 });
    }

    return NextResponse.json(lab);
  } catch (error) {
    console.error('GET /api/research/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch research laboratory details' }, { status: 500 });
  }
}

// PUT /api/research/[id] (Admin/Faculty update)
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
    const existingLab = await prisma.researchLab.findUnique({ where: { id } });

    if (!existingLab) {
      return NextResponse.json({ error: 'Research laboratory not found' }, { status: 404 });
    }

    await ensureDirExists();

    const formData = await request.formData();
    const name = formData.get('name') as string | null;
    const category = formData.get('category') as string | null;
    const description = formData.get('description') as string | null;
    const imageUrlInput = formData.get('imageUrl') as string | null;
    const imageFile = formData.get('image') as File | null;
    const facultyIdsStr = formData.get('facultyIds') as string | null;

    let newImagePath = existingLab.image;

    if (imageUrlInput && imageUrlInput.trim() !== '') {
      newImagePath = imageUrlInput.trim();
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
        `lab_${id}`,
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

    const updatedLab = await prisma.researchLab.update({
      where: { id },
      data: {
        name: name ? name.trim() : existingLab.name,
        category: category ? category.trim() : existingLab.category,
        description: description ? description.trim() : existingLab.description,
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

    return NextResponse.json({ success: true, lab: updatedLab });
  } catch (error) {
    console.error('PUT /api/research/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update research laboratory' }, { status: 500 });
  }
}

// DELETE /api/research/[id] (Admin/Faculty delete)
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
    const existingLab = await prisma.researchLab.findUnique({ where: { id } });

    if (!existingLab) {
      return NextResponse.json({ error: 'Research laboratory not found' }, { status: 404 });
    }

    await prisma.researchLab.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Research laboratory deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/research/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete research laboratory' }, { status: 500 });
  }
}
