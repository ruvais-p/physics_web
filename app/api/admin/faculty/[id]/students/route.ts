import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';
import { saveImageAsWebp, isAllowedImageType } from '@/lib/image';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const STUDENTS_DIR = path.join(process.cwd(), 'public', 'uploads', 'faculty', 'students');

async function authenticateAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

// POST /api/admin/faculty/[id]/students - Create student record for faculty
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await authenticateAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: facultyId } = await params;

  try {
    const faculty = await prisma.faculty.findUnique({ where: { id: facultyId } });
    if (!faculty) {
      return NextResponse.json({ error: 'Faculty record not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const name = formData.get('name') as string | null;
    const description = formData.get('description') as string | null;
    const imageFile = formData.get('image') as File | null;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Student Name is required.' }, { status: 400 });
    }

    let imagePath: string | null = null;

    if (imageFile && imageFile.size > 0) {
      if (!isAllowedImageType(imageFile.type) && !isAllowedImageType(imageFile.name)) {
        return NextResponse.json(
          { error: 'Invalid student image format. Supported formats are JPG, PNG, and WebP.' },
          { status: 400 }
        );
      }

      if (imageFile.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { error: 'Student image file size exceeds the 10MB limit.' },
          { status: 400 }
        );
      }

      // Convert image to WebP and save
      const { relativePath } = await saveImageAsWebp(
        imageFile,
        STUDENTS_DIR,
        `student_${facultyId}`,
        { quality: 85, maxWidth: 1200 }
      );
      imagePath = relativePath;
    }

    const newStudent = await prisma.facultyStudent.create({
      data: {
        facultyId,
        name: name.trim(),
        description: description?.trim() || null,
        image: imagePath,
      },
    });

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.error('Admin POST faculty student error:', error);
    return NextResponse.json({ error: 'Failed to create student record' }, { status: 500 });
  }
}
