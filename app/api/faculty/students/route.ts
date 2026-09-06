import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { verifyFacultyToken } from '@/lib/auth';
import { saveImageAsWebp, isAllowedImageType } from '@/lib/image';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const STUDENTS_DIR = path.join(process.cwd(), 'public', 'uploads', 'faculty', 'students');

// GET /api/faculty/students
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('faculty_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyFacultyToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }

    const students = await prisma.facultyStudent.findMany({
      where: { facultyId: payload.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error('GET /api/faculty/students error:', error);
    return NextResponse.json({ error: 'Failed to fetch student records' }, { status: 500 });
  }
}

// POST /api/faculty/students (Create Student Record)
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('faculty_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyFacultyToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
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

      // Convert image to WebP and store
      const { relativePath } = await saveImageAsWebp(
        imageFile,
        STUDENTS_DIR,
        `student_${payload.id}`,
        { quality: 85, maxWidth: 1200 }
      );
      imagePath = relativePath;
    }

    const newStudent = await prisma.facultyStudent.create({
      data: {
        facultyId: payload.id,
        name: name.trim(),
        description: description?.trim() || null,
        image: imagePath,
      },
    });

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.error('POST /api/faculty/students error:', error);
    return NextResponse.json({ error: 'Failed to create student record' }, { status: 500 });
  }
}
