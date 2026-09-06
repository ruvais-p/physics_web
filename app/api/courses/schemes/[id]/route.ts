import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import path from 'path';
import fs from 'fs/promises';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken, verifyFacultyToken, verifyAuthToken } from '@/lib/auth';

const ALLOWED_PDF_TYPES = ['application/pdf'];
const MAX_PDF_SIZE = 15 * 1024 * 1024; // 15 MB
const CURRICULUM_DIR = path.join(process.cwd(), 'public', 'uploads', 'curriculum');

async function ensureDirExists() {
  await fs.mkdir(CURRICULUM_DIR, { recursive: true });
}

async function deletePhysicalFile(relativeWebPath: string | null) {
  if (!relativeWebPath || relativeWebPath.includes('cv_placeholder.pdf')) return;
  try {
    const cleanPath = relativeWebPath.replace(/^\//, '');
    const absolutePath = path.join(process.cwd(), 'public', cleanPath);
    await fs.unlink(absolutePath);
  } catch (err: any) {
    if (err.code !== 'ENOENT') {
      console.error(`Failed to delete physical file ${relativeWebPath}:`, err);
    }
  }
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

// PUT /api/courses/schemes/[id] (Admin/Faculty update)
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
    const existingScheme = await prisma.curriculumScheme.findUnique({
      where: { id },
    });

    if (!existingScheme) {
      return NextResponse.json({ error: 'Curriculum scheme not found' }, { status: 404 });
    }

    await ensureDirExists();

    const formData = await request.formData();
    const year = formData.get('year') as string | null;
    const scheme = formData.get('scheme') as string | null;
    const sortOrderStr = formData.get('sortOrder') as string | null;
    const pdfFile = formData.get('pdf') as File | null;
    const externalPdfUrl = formData.get('pdfUrl') as string | null;

    let newPdfUrl = existingScheme.pdfUrl;

    if (externalPdfUrl && externalPdfUrl.trim() !== '') {
      newPdfUrl = externalPdfUrl;
    }

    if (pdfFile && pdfFile.size > 0) {
      if (!ALLOWED_PDF_TYPES.includes(pdfFile.type) && !pdfFile.name.endsWith('.pdf')) {
        return NextResponse.json(
          { error: 'Invalid file format. Only PDF documents are allowed.' },
          { status: 400 }
        );
      }

      if (pdfFile.size > MAX_PDF_SIZE) {
        return NextResponse.json(
          { error: 'PDF file size exceeds maximum limit of 15 MB.' },
          { status: 400 }
        );
      }

      const timestamp = Date.now();
      const sanitizedName = pdfFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const fileName = `scheme_${existingScheme.courseId}_${timestamp}_${sanitizedName}`;
      const filePath = path.join(CURRICULUM_DIR, fileName);

      const bytes = await pdfFile.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(bytes));

      // Remove old file if replacing custom upload
      if (existingScheme.pdfUrl && !existingScheme.pdfUrl.includes('cv_placeholder.pdf')) {
        await deletePhysicalFile(existingScheme.pdfUrl);
      }

      newPdfUrl = `/uploads/curriculum/${fileName}`;
    }

    const updatedScheme = await prisma.curriculumScheme.update({
      where: { id },
      data: {
        year: year ?? existingScheme.year,
        scheme: scheme ?? existingScheme.scheme,
        pdfUrl: newPdfUrl,
        sortOrder: sortOrderStr ? parseInt(sortOrderStr, 10) : existingScheme.sortOrder,
      },
    });

    return NextResponse.json({ success: true, scheme: updatedScheme });
  } catch (error) {
    console.error('PUT /api/courses/schemes/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update curriculum scheme' }, { status: 500 });
  }
}

// DELETE /api/courses/schemes/[id] (Admin/Faculty delete)
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
    const existingScheme = await prisma.curriculumScheme.findUnique({
      where: { id },
    });

    if (!existingScheme) {
      return NextResponse.json({ error: 'Curriculum scheme not found' }, { status: 404 });
    }

    // Delete attached physical PDF if custom uploaded
    await deletePhysicalFile(existingScheme.pdfUrl);

    // Delete record from DB
    await prisma.curriculumScheme.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Curriculum scheme deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/courses/schemes/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete curriculum scheme' }, { status: 500 });
  }
}
