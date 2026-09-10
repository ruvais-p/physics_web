import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/api-auth';
import { revalidatePublicPages } from '@/lib/public-cache';
import { deleteUploadedFile, hasPdfSignature } from '@/lib/file-security';
import { sanitizeWebUrl } from '@/lib/url-security';

const ALLOWED_PDF_TYPES = ['application/pdf'];
const MAX_PDF_SIZE = 15 * 1024 * 1024; // 15 MB
const CURRICULUM_DIR = path.join(process.cwd(), 'public', 'uploads', 'curriculum');

async function ensureDirExists() {
  await fs.mkdir(CURRICULUM_DIR, { recursive: true });
}

async function deletePhysicalFile(relativeWebPath: string | null) {
  if (!relativeWebPath || relativeWebPath.includes('cv_placeholder.pdf')) return;
  try {
    await deleteUploadedFile(relativeWebPath, 'curriculum');
  } catch (error) {
    console.error(`Failed to delete physical file ${relativeWebPath}:`, error);
  }
}

async function verifyAnyUserToken() {
  return getAdminSession();
}

// PUT /api/courses/schemes/[id] (Admin only)
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
      const safePdfUrl = sanitizeWebUrl(externalPdfUrl);
      if (!safePdfUrl) {
        return NextResponse.json({ error: 'PDF URL must use http, https, or a local path.' }, { status: 400 });
      }
      newPdfUrl = safePdfUrl;
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
      const sanitizedName = path.parse(pdfFile.name).name.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80);
      const fileName = `scheme_${existingScheme.courseId}_${timestamp}_${sanitizedName || 'document'}.pdf`;
      const filePath = path.join(CURRICULUM_DIR, fileName);

      const bytes = await pdfFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      if (!hasPdfSignature(buffer)) {
        return NextResponse.json({ error: 'The uploaded file is not a valid PDF.' }, { status: 400 });
      }
      await fs.writeFile(filePath, buffer);

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

    revalidatePublicPages();
    return NextResponse.json({ success: true, scheme: updatedScheme });
  } catch (error) {
    console.error('PUT /api/courses/schemes/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update curriculum scheme' }, { status: 500 });
  }
}

// DELETE /api/courses/schemes/[id] (Admin only)
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

    revalidatePublicPages();
    return NextResponse.json({ success: true, message: 'Curriculum scheme deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/courses/schemes/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete curriculum scheme' }, { status: 500 });
  }
}
