import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken, verifyFacultyToken, verifyAuthToken } from '@/lib/auth';
import { COURSES } from '@/lib/data';

async function verifyAuthorizedUser() {
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

// Default initial syllabus schemes to seed if needed
const DEFAULT_INITIAL_SCHEMES: Record<string, Array<{ year: string; scheme: string; pdfUrl: string; sortOrder: number }>> = {
  c1: [
    { year: 'First Year (Semesters 1 & 2)', scheme: '2024 CBCS Scheme', pdfUrl: '/cvs/cv_placeholder.pdf', sortOrder: 1 },
    { year: 'Second Year (Semesters 3 & 4)', scheme: '2024 CBCS Scheme', pdfUrl: '/cvs/cv_placeholder.pdf', sortOrder: 2 },
  ],
  c2: [
    { year: 'Year 1 (Coursework)', scheme: '2024 PhD Regulations', pdfUrl: '/cvs/cv_placeholder.pdf', sortOrder: 1 },
    { year: 'Years 2 - 5 (Research)', scheme: '2024 PhD Regulations', pdfUrl: '/cvs/cv_placeholder.pdf', sortOrder: 2 },
  ],
  c3: [
    { year: 'Years 1 & 2 (Foundational)', scheme: '2024 Integrated Scheme', pdfUrl: '/cvs/cv_placeholder.pdf', sortOrder: 1 },
    { year: 'Year 3 (B.Sc. Honours Exit Option)', scheme: '2024 Integrated Scheme', pdfUrl: '/cvs/cv_placeholder.pdf', sortOrder: 2 },
    { year: 'Years 4 & 5 (M.Sc. Advanced)', scheme: '2024 Integrated Scheme', pdfUrl: '/cvs/cv_placeholder.pdf', sortOrder: 3 },
  ],
};

// GET /api/courses - List all courses with curriculum schemes
export async function GET() {
  try {
    let courses = await prisma.course.findMany({
      include: {
        schemes: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { id: 'asc' },
    });

    // Auto-seed initial courses from static data if database is empty
    if (courses.length === 0) {
      for (const c of COURSES) {
        await prisma.course.create({
          data: {
            id: c.id,
            code: c.code || '',
            title: c.title,
            level: c.level,
            duration: c.duration,
            eligibility: c.eligibility,
            description: c.description,
            highlights: c.highlights || [],
            schemes: {
              create: DEFAULT_INITIAL_SCHEMES[c.id] || [],
            },
          },
        });
      }
      courses = await prisma.course.findMany({
        include: {
          schemes: {
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: { id: 'asc' },
      });
    }

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('GET /api/courses error:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

// POST /api/courses - Create a new course (Admin or Faculty authorized)
export async function POST(request: Request) {
  try {
    const user = await verifyAuthorizedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Admin or Faculty login required.' }, { status: 401 });
    }

    const body = await request.json();
    const { id, code, title, level, duration, eligibility, description, highlights } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Course Title is required.' }, { status: 400 });
    }
    if (!duration || !duration.trim()) {
      return NextResponse.json({ error: 'Duration is required.' }, { status: 400 });
    }
    if (!description || !description.trim()) {
      return NextResponse.json({ error: 'Course Description is required.' }, { status: 400 });
    }

    // Generate unique course ID if not provided
    let courseId = id?.trim();
    if (!courseId) {
      courseId = `c_${Date.now()}`;
    }

    // Check if ID already exists
    const existing = await prisma.course.findUnique({ where: { id: courseId } });
    if (existing) {
      courseId = `c_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    }

    const newCourse = await prisma.course.create({
      data: {
        id: courseId,
        code: code?.trim() || '',
        title: title.trim(),
        level: level?.trim() || 'MSc',
        duration: duration.trim(),
        eligibility: eligibility?.trim() || '',
        description: description.trim(),
        highlights: Array.isArray(highlights) ? highlights.filter((h: string) => h && h.trim()) : [],
      },
      include: {
        schemes: true,
      },
    });

    return NextResponse.json({ success: true, course: newCourse }, { status: 201 });
  } catch (error) {
    console.error('POST /api/courses error:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}
