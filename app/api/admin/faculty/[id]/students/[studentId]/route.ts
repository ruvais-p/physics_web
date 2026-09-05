import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import path from 'path';
import fs from 'fs/promises';
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

async function deletePhysicalFile(relativeWebPath: string | null) {
  if (!relativeWebPath || relativeWebPath.includes('faculty.png')) return;
  try {
    const cleanPath = relativeWebPath.replace(/^\//, '');
    const absolutePath = path.join(process.cwd(), 'public', cleanPath);
    await fs.unlink(absolutePath);
  } catch (err: any) {
    if (err.code !== 'ENOENT') {
      console.error(`Failed to delete student image ${relativeWebPath}:`, err);
    }
  }
}

// PUT /api/admin/faculty/[id]/students/[studentId] - Update student record
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; studentId: string }> }
) {
  const admin = await authenticateAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: facultyId, studentId } = await params;

  try {
    const existingStudent = await prisma.facultyStudent.findFirst({
      where: { uid: studentId, facultyId },
    });

    if (!existingStudent) {
      return NextResponse.json({ error: 'Student record not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const name = formData.get('name') as string | null;
    const description = formData.get('description') as string | null;
    const imageFile = formData.get('image') as File | null;
    const deleteImage = formData.get('deleteImage') === 'true';

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Student Name is required.' }, { status: 400 });
    }

    let updatedImagePath: string | null = existingStudent.image;

    if (deleteImage && existingStudent.image) {
      await deletePhysicalFile(existingStudent.image);
      updatedImagePath = null;
    }

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

      // Convert to WebP and save
      const { relativePath } = await saveImageAsWebp(
        imageFile,
        STUDENTS_DIR,
        `student_${facultyId}`,
        { quality: 85, maxWidth: 1200 }
      );

      if (existingStudent.image) {
        await deletePhysicalFile(existingStudent.image);
      }

      updatedImagePath = relativePath;
    }

    const updatedStudent = await prisma.facultyStudent.update({
      where: { uid: studentId },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        image: updatedImagePath,
      },
    });

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error('Admin PUT faculty student error:', error);
    return NextResponse.json({ error: 'Failed to update student record' }, { status: 500 });
  }
}

// DELETE /api/admin/faculty/[id]/students/[studentId] - Delete student record
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; studentId: string }> }
) {
  const admin = await authenticateAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: facultyId, studentId } = await params;

  try {
    const existingStudent = await prisma.facultyStudent.findFirst({
      where: { uid: studentId, facultyId },
    });

    if (!existingStudent) {
      return NextResponse.json({ error: 'Student record not found' }, { status: 404 });
    }

    if (existingStudent.image) {
      await deletePhysicalFile(existingStudent.image);
    }

    await prisma.facultyStudent.delete({
      where: { uid: studentId },
    });

    return NextResponse.json({ success: true, message: 'Student record deleted successfully.' });
  } catch (error) {
    console.error('Admin DELETE faculty student error:', error);
    return NextResponse.json({ error: 'Failed to delete student record' }, { status: 500 });
  }
}
