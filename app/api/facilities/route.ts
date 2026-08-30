import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import path from 'path';
import fs from 'fs/promises';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken, verifyFacultyToken, verifyAuthToken } from '@/lib/auth';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const FACILITY_IMAGES_DIR = path.join(process.cwd(), 'public', 'uploads', 'facilities');

async function ensureDirExists() {
  await fs.mkdir(FACILITY_IMAGES_DIR, { recursive: true });
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

// GET /api/facilities (Public)
export async function GET() {
  try {
    const facilities = await prisma.facility.findMany({
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

    return NextResponse.json(facilities);
  } catch (error) {
    console.error('GET /api/facilities error:', error);
    return NextResponse.json({ error: 'Failed to fetch facilities' }, { status: 500 });
  }
}

// POST /api/facilities (Admin/Faculty Create)
export async function POST(request: Request) {
  try {
    const user = await verifyAnyUserToken();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureDirExists();

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const imageUrlInput = formData.get('imageUrl') as string | null;
    const imageFile = formData.get('image') as File | null;
    const facultyIdsStr = formData.get('facultyIds') as string | null;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Facility Name is required.' }, { status: 400 });
    }

    if (!description || !description.trim()) {
      return NextResponse.json({ error: 'Facility Description is required.' }, { status: 400 });
    }

    let finalImagePath = imageUrlInput || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80';

    if (imageFile && imageFile.size > 0) {
      if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
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

      let ext = '.jpg';
      if (imageFile.type === 'image/png') ext = '.png';
      else if (imageFile.type === 'image/webp') ext = '.webp';

      const fileName = `facility_${Date.now()}${ext}`;
      const filePath = path.join(FACILITY_IMAGES_DIR, fileName);

      const bytes = await imageFile.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(bytes));

      finalImagePath = `/uploads/facilities/${fileName}`;
    }

    const facultyIds: string[] = facultyIdsStr ? JSON.parse(facultyIdsStr) : [];

    const newFacility = await prisma.facility.create({
      data: {
        name: name.trim(),
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

    return NextResponse.json({ success: true, facility: newFacility });
  } catch (error) {
    console.error('POST /api/facilities error:', error);
    return NextResponse.json({ error: 'Failed to create facility' }, { status: 500 });
  }
}
