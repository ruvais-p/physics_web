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

// GET /api/courses/schemes (Public)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    const courses = await prisma.course.findMany({
      where: courseId ? { id: courseId } : undefined,
      include: {
        schemes: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { id: 'asc' },
    });

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('GET /api/courses/schemes error:', error);
    return NextResponse.json({ error: 'Failed to fetch course schemes' }, { status: 500 });
  }
}

// POST /api/courses/schemes (Admin/Faculty create)
export async function POST(request: Request) {
  try {
    const user = await verifyAnyUserToken();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureDirExists();

    const formData = await request.formData();
    const courseId = formData.get('courseId') as string;
    const year = formData.get('year') as string;
    const scheme = formData.get('scheme') as string;
    const sortOrderStr = formData.get('sortOrder') as string;
    const pdfFile = formData.get('pdf') as File | null;
    const externalPdfUrl = formData.get('pdfUrl') as string | null;

    if (!courseId || !year || !scheme) {
      return NextResponse.json(
        { error: 'Missing required fields: courseId, year, and scheme are required.' },
        { status: 400 }
      );
    }

    // Verify target course exists
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: 'Target course not found.' }, { status: 404 });
    }

    let finalPdfUrl = externalPdfUrl || '/cvs/cv_placeholder.pdf';

    // Handle PDF upload if file provided
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
      const fileName = `scheme_${courseId}_${timestamp}_${sanitizedName}`;
      const filePath = path.join(CURRICULUM_DIR, fileName);

      const bytes = await pdfFile.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(bytes));

      finalPdfUrl = `/uploads/curriculum/${fileName}`;
    }

    const sortOrder = sortOrderStr ? parseInt(sortOrderStr, 10) : 0;

    const newScheme = await prisma.curriculumScheme.create({
      data: {
        courseId,
        year,
        scheme,
        pdfUrl: finalPdfUrl,
        sortOrder,
        createdBy: user.id,
      },
    });

    return NextResponse.json({ success: true, scheme: newScheme });
  } catch (error) {
    console.error('POST /api/courses/schemes error:', error);
    return NextResponse.json({ error: 'Failed to create curriculum scheme' }, { status: 500 });
  }
}
