import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import path from 'path';
import fs from 'fs/promises';
import { prisma } from '@/lib/prisma';
import { verifyFacultyToken } from '@/lib/auth';
import { saveImageAsWebp, isAllowedImageType } from '@/lib/image';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const STUDENTS_DIR = path.join(process.cwd(), 'public', 'uploads', 'faculty', 'students');

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

// PUT /api/faculty/students/[id] - Update Student Record
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Verify ownership
    const existingStudent = await prisma.facultyStudent.findFirst({
      where: { uid: id, facultyId: payload.id },
    });

    if (!existingStudent) {
      return NextResponse.json(
        { error: 'Student record not found or access denied.' },
        { status: 404 }
      );
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

    // Handle Image Deletion
    if (deleteImage && existingStudent.image) {
      await deletePhysicalFile(existingStudent.image);
      updatedImagePath = null;
    }

    // Handle New Image Upload
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
        `student_${payload.id}`,
        { quality: 85, maxWidth: 1200 }
      );

      // Remove old image if replacing
      if (existingStudent.image) {
        await deletePhysicalFile(existingStudent.image);
      }

      updatedImagePath = relativePath;
    }

    const updatedStudent = await prisma.facultyStudent.update({
      where: { uid: id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        image: updatedImagePath,
      },
    });

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error('PUT /api/faculty/students/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update student record' }, { status: 500 });
  }
}

// DELETE /api/faculty/students/[id] - Delete Student Record
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Verify ownership
    const existingStudent = await prisma.facultyStudent.findFirst({
      where: { uid: id, facultyId: payload.id },
    });

    if (!existingStudent) {
      return NextResponse.json(
        { error: 'Student record not found or access denied.' },
        { status: 404 }
      );
    }

    // Unlink image file from disk
    if (existingStudent.image) {
      await deletePhysicalFile(existingStudent.image);
    }

    // Delete record from database
    await prisma.facultyStudent.delete({
      where: { uid: id },
    });

    return NextResponse.json({ success: true, message: 'Student record deleted successfully.' });
  } catch (error) {
    console.error('DELETE /api/faculty/students/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete student record' }, { status: 500 });
  }
}
