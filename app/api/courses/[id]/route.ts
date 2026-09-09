import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/api-auth';

async function verifyAuthorizedUser() {
  return getAdminSession();
}

// GET /api/courses/[id] - Fetch specific course details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        schemes: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('GET /api/courses/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}

// PUT /api/courses/[id] - Update course details (Admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuthorizedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Admin login required.' }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
    }

    const body = await request.json();
    const { code, title, level, duration, eligibility, description, highlights } = body;

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        code: code !== undefined ? code.trim() : existing.code,
        title: title !== undefined ? title.trim() : existing.title,
        level: level !== undefined ? level.trim() : existing.level,
        duration: duration !== undefined ? duration.trim() : existing.duration,
        eligibility: eligibility !== undefined ? eligibility.trim() : existing.eligibility,
        description: description !== undefined ? description.trim() : existing.description,
        highlights: Array.isArray(highlights) ? highlights.filter((h: string) => h && h.trim()) : existing.highlights,
      },
      include: {
        schemes: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    return NextResponse.json({ success: true, course: updatedCourse });
  } catch (error) {
    console.error('PUT /api/courses/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}

// DELETE /api/courses/[id] - Delete a course (Admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuthorizedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Admin login required.' }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
    }

    // Delete course (schemes cascade deleted in DB)
    await prisma.course.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/courses/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
