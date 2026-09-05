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

// GET /api/research (Public)
export async function GET() {
  try {
    const labs = await prisma.researchLab.findMany({
      include: {
        faculties: {
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

// POST /api/research (Admin/Faculty Create)
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

    let finalImagePath = imageUrlInput || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80';

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

    return NextResponse.json({ success: true, lab: newLab });
  } catch (error) {
    console.error('POST /api/research error:', error);
    return NextResponse.json({ error: 'Failed to create research laboratory' }, { status: 500 });
  }
}
