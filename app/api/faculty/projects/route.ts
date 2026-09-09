import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyFacultyToken } from '@/lib/auth';

// Helper to determine project status based on endDate
function calculateStatus(endDateInput: string | null | undefined): string {
  if (!endDateInput || !endDateInput.trim()) {
    return 'Ongoing';
  }
  const end = new Date(endDateInput);
  if (isNaN(end.getTime())) {
    return 'Ongoing';
  }
  const now = new Date();
  return end < now ? 'Completed' : 'Ongoing';
}

// GET /api/faculty/projects - Fetch logged-in faculty's projects
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

    const currentFaculty = await prisma.faculty.findUnique({
      where: { id: payload.id },
      select: { name: true },
    });

    const projects = await prisma.facultyProject.findMany({
      where: {
        OR: [
          { facultyId: payload.id },
          ...(currentFaculty?.name ? [{ otherFaculty: { contains: currentFaculty.name, mode: 'insensitive' as const } }] : []),
        ],
      },
      include: {
        faculty: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('GET /api/faculty/projects error:', error);
    return NextResponse.json({ error: 'Failed to fetch research projects' }, { status: 500 });
  }
}

// POST /api/faculty/projects - Create a new research project
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

    const body = await request.json();
    const { title, description, agency, role, funding, startDate, endDate, externalLink, otherFaculty } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Project Title is required.' }, { status: 400 });
    }

    const status = calculateStatus(endDate);

    const newProject = await prisma.facultyProject.create({
      data: {
        facultyId: payload.id,
        title: title.trim(),
        description: description?.trim() || null,
        agency: agency?.trim() || null,
        role: role?.trim() || 'Principal Investigator',
        funding: funding?.trim() || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        externalLink: externalLink?.trim() || null,
        otherFaculty: otherFaculty?.trim() || null,
        status,
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('POST /api/faculty/projects error:', error);
    return NextResponse.json({ error: 'Failed to create research project' }, { status: 500 });
  }
}
