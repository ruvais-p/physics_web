import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import path from 'path';
import fs from 'fs/promises';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';
import { saveImageAsWebp, isAllowedImageType } from '@/lib/image';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_CV_TYPES = ['application/pdf'];
const MAX_CV_SIZE = 10 * 1024 * 1024; // 10 MB

const IMAGES_DIR = path.join(process.cwd(), 'public', 'uploads', 'faculty', 'images');
const CVS_DIR = path.join(process.cwd(), 'public', 'uploads', 'faculty', 'cvs');

async function authenticateAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

async function ensureDirectoriesExist() {
  await fs.mkdir(IMAGES_DIR, { recursive: true });
  await fs.mkdir(CVS_DIR, { recursive: true });
}

async function deletePhysicalFile(relativeWebPath: string | null) {
  if (!relativeWebPath) return;
  try {
    const cleanPath = relativeWebPath.replace(/^\//, '');
    const absolutePath = path.join(process.cwd(), 'public', cleanPath);
    await fs.unlink(absolutePath);
  } catch (err: any) {
    if (err.code !== 'ENOENT') {
      console.error(`Failed to delete old physical file ${relativeWebPath}:`, err);
    }
  }
}

// POST /api/admin/faculty/[id]/documents - Admin Upload/Replace Profile Photo or CV
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
    await ensureDirectoriesExist();

    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;
    const cvFile = formData.get('cv') as File | null;

    if ((!imageFile || imageFile.size === 0) && (!cvFile || cvFile.size === 0)) {
      return NextResponse.json(
        { error: 'Please select a profile image or CV document to upload.' },
        { status: 400 }
      );
    }

    const existingDoc = await prisma.facultyDocument.findUnique({
      where: { facultyId },
    });

    let newImagePath: string | null = existingDoc?.image || null;
    let newCvPath: string | null = existingDoc?.cv || null;
    // Process Profile Image Upload
    if (imageFile && imageFile.size > 0) {
      if (!isAllowedImageType(imageFile.type) && !isAllowedImageType(imageFile.name)) {
        return NextResponse.json(
          { error: 'Invalid image format. Supported formats are JPG, PNG, and WebP.' },
          { status: 400 }
        );
      }

      if (imageFile.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { error: 'Profile image size exceeds maximum limit of 10 MB.' },
          { status: 400 }
        );
      }

      const { relativePath } = await saveImageAsWebp(
        imageFile,
        IMAGES_DIR,
        `img_${facultyId}`,
        { quality: 85, maxWidth: 1200 }
      );

      if (existingDoc?.image) {
        await deletePhysicalFile(existingDoc.image);
      }

      newImagePath = relativePath;
    }

    if (cvFile && cvFile.size > 0) {
      if (!ALLOWED_CV_TYPES.includes(cvFile.type) && !cvFile.name.endsWith('.pdf')) {
        return NextResponse.json(
          { error: 'Invalid CV format. Only PDF files are allowed.' },
          { status: 400 }
        );
      }

      if (cvFile.size > MAX_CV_SIZE) {
        return NextResponse.json(
          { error: 'CV file size exceeds maximum limit of 10 MB.' },
          { status: 400 }
        );
      }

      const fileName = `cv_${facultyId}_${Date.now()}.pdf`;
      const filePath = path.join(CVS_DIR, fileName);

      const bytes = await cvFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await fs.writeFile(filePath, buffer);

      if (existingDoc?.cv) {
        await deletePhysicalFile(existingDoc.cv);
      }

      newCvPath = `/uploads/faculty/cvs/${fileName}`;
    }

    const updatedDoc = await prisma.facultyDocument.upsert({
      where: { facultyId },
      update: {
        image: newImagePath,
        cv: newCvPath,
      },
      create: {
        facultyId,
        image: newImagePath,
        cv: newCvPath,
      },
    });

    return NextResponse.json({
      success: true,
      image: updatedDoc.image,
      cv: updatedDoc.cv,
    });
  } catch (error) {
    console.error('Admin POST faculty documents error:', error);
    return NextResponse.json({ error: 'Failed to process document upload' }, { status: 500 });
  }
}

// DELETE /api/admin/faculty/[id]/documents?type=image|cv - Admin Delete Document
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await authenticateAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: facultyId } = await params;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (type !== 'image' && type !== 'cv') {
    return NextResponse.json({ error: 'Invalid type parameter. Must be "image" or "cv".' }, { status: 400 });
  }

  try {
    const existingDoc = await prisma.facultyDocument.findUnique({
      where: { facultyId },
    });

    if (!existingDoc) {
      return NextResponse.json({ error: 'No document record found.' }, { status: 404 });
    }

    if (type === 'image' && existingDoc.image) {
      await deletePhysicalFile(existingDoc.image);
      await prisma.facultyDocument.update({
        where: { facultyId },
        data: { image: null },
      });
    } else if (type === 'cv' && existingDoc.cv) {
      await deletePhysicalFile(existingDoc.cv);
      await prisma.facultyDocument.update({
        where: { facultyId },
        data: { cv: null },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Faculty ${type === 'image' ? 'profile image' : 'CV document'} deleted successfully.`,
    });
  } catch (error) {
    console.error('Admin DELETE faculty document error:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
