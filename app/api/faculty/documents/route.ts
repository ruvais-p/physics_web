import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import path from 'path';
import fs from 'fs/promises';
import { prisma } from '@/lib/prisma';
import { verifyFacultyToken } from '@/lib/auth';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_CV_TYPES = ['application/pdf'];
const MAX_CV_SIZE = 10 * 1024 * 1024; // 10 MB

const IMAGES_DIR = path.join(process.cwd(), 'public', 'uploads', 'faculty', 'images');
const CVS_DIR = path.join(process.cwd(), 'public', 'uploads', 'faculty', 'cvs');

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

// GET /api/faculty/documents
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

    const doc = await prisma.facultyDocument.findUnique({
      where: { facultyId: payload.id },
    });

    return NextResponse.json({
      uid: doc?.uid || null,
      facultyId: payload.id,
      image: doc?.image || null,
      cv: doc?.cv || null,
      updatedAt: doc?.updatedAt || null,
    });
  } catch (error) {
    console.error('GET /api/faculty/documents error:', error);
    return NextResponse.json({ error: 'Failed to fetch document details' }, { status: 500 });
  }
}

// POST /api/faculty/documents (Upload/Replace Profile Image or CV)
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

    // Fetch current document record to check for old files
    const existingDoc = await prisma.facultyDocument.findUnique({
      where: { facultyId: payload.id },
    });

    let newImagePath: string | null = existingDoc?.image || null;
    let newCvPath: string | null = existingDoc?.cv || null;

    const timestamp = Date.now();

    // Process Profile Image Upload
    if (imageFile && imageFile.size > 0) {
      if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
        return NextResponse.json(
          { error: 'Invalid image format. Supported formats are JPG, PNG, and WebP.' },
          { status: 400 }
        );
      }

      if (imageFile.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { error: 'Profile image size exceeds maximum allowed limit of 5 MB.' },
          { status: 400 }
        );
      }

      // Determine extension
      let ext = '.jpg';
      if (imageFile.type === 'image/png') ext = '.png';
      else if (imageFile.type === 'image/webp') ext = '.webp';

      const fileName = `img_${payload.id}_${timestamp}${ext}`;
      const filePath = path.join(IMAGES_DIR, fileName);

      // Save buffer to disk
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await fs.writeFile(filePath, buffer);

      // Remove previous physical image file if replacing
      if (existingDoc?.image) {
        await deletePhysicalFile(existingDoc.image);
      }

      newImagePath = `/uploads/faculty/images/${fileName}`;
    }

    // Process CV Upload
    if (cvFile && cvFile.size > 0) {
      if (!ALLOWED_CV_TYPES.includes(cvFile.type) && !cvFile.name.endsWith('.pdf')) {
        return NextResponse.json(
          { error: 'Invalid CV file format. Only PDF documents are allowed.' },
          { status: 400 }
        );
      }

      if (cvFile.size > MAX_CV_SIZE) {
        return NextResponse.json(
          { error: 'CV file size exceeds maximum allowed limit of 10 MB.' },
          { status: 400 }
        );
      }

      const fileName = `cv_${payload.id}_${timestamp}.pdf`;
      const filePath = path.join(CVS_DIR, fileName);

      const bytes = await cvFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await fs.writeFile(filePath, buffer);

      // Remove previous physical CV file if replacing
      if (existingDoc?.cv) {
        await deletePhysicalFile(existingDoc.cv);
      }

      newCvPath = `/uploads/faculty/cvs/${fileName}`;
    }

    // Upsert database record
    const updatedDoc = await prisma.facultyDocument.upsert({
      where: { facultyId: payload.id },
      update: {
        image: newImagePath,
        cv: newCvPath,
      },
      create: {
        facultyId: payload.id,
        image: newImagePath,
        cv: newCvPath,
      },
    });

    return NextResponse.json({
      success: true,
      uid: updatedDoc.uid,
      facultyId: updatedDoc.facultyId,
      image: updatedDoc.image,
      cv: updatedDoc.cv,
      updatedAt: updatedDoc.updatedAt,
    });
  } catch (error) {
    console.error('POST /api/faculty/documents upload error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing document uploads.' },
      { status: 500 }
    );
  }
}

// DELETE /api/faculty/documents?type=image|cv
export async function DELETE(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type !== 'image' && type !== 'cv') {
      return NextResponse.json({ error: 'Invalid type parameter. Must be "image" or "cv".' }, { status: 400 });
    }

    const existingDoc = await prisma.facultyDocument.findUnique({
      where: { facultyId: payload.id },
    });

    if (!existingDoc) {
      return NextResponse.json({ error: 'No document record found.' }, { status: 404 });
    }

    if (type === 'image' && existingDoc.image) {
      await deletePhysicalFile(existingDoc.image);
      await prisma.facultyDocument.update({
        where: { facultyId: payload.id },
        data: { image: null },
      });
    } else if (type === 'cv' && existingDoc.cv) {
      await deletePhysicalFile(existingDoc.cv);
      await prisma.facultyDocument.update({
        where: { facultyId: payload.id },
        data: { cv: null },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Faculty ${type === 'image' ? 'profile image' : 'CV document'} deleted successfully.`,
    });
  } catch (error) {
    console.error('DELETE /api/faculty/documents error:', error);
    return NextResponse.json({ error: 'Failed to delete document.' }, { status: 500 });
  }
}
