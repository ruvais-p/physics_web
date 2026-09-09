import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/api-auth';

async function verifyAuthorizedUser() {
  return getAdminSession();
}

// GET /api/courses - List all courses with curriculum schemes
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        schemes: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { id: 'asc' },
    });

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('GET /api/courses error:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

// POST /api/courses - Create a new course (Admin only)
export async function POST(request: Request) {
  try {
    const user = await verifyAuthorizedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Admin login required.' }, { status: 401 });
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
