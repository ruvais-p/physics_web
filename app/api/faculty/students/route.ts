import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import path from 'path';
import fs from 'fs/promises';
import { prisma } from '@/lib/prisma';
import { verifyFacultyToken } from '@/lib/auth';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

const STUDENTS_DIR = path.join(process.cwd(), 'public', 'uploads', 'faculty', 'students');

async function ensureDirExist() {
  await fs.mkdir(STUDENTS_DIR, { recursive: true });
}

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

    await ensureDirExist();

    const formData = await request.formData();
    const name = formData.get('name') as string | null;
    const description = formData.get('description') as string | null;
    const imageFile = formData.get('image') as File | null;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Student Name is required.' }, { status: 400 });
    }

    let imagePath: string | null = null;

    if (imageFile && imageFile.size > 0) {
      if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
        return NextResponse.json(
          { error: 'Invalid student image format. Supported formats are JPG, PNG, and WebP.' },
          { status: 400 }
        );
      }

      if (imageFile.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { error: 'Student image file size exceeds the 5MB limit.' },
          { status: 400 }
        );
      }

      let ext = '.jpg';
      if (imageFile.type === 'image/png') ext = '.png';
      else if (imageFile.type === 'image/webp') ext = '.webp';

      const timestamp = Date.now();
      const fileName = `student_${payload.id}_${timestamp}${ext}`;
      const filePath = path.join(STUDENTS_DIR, fileName);

      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await fs.writeFile(filePath, buffer);

      imagePath = `/uploads/faculty/students/${fileName}`;
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
