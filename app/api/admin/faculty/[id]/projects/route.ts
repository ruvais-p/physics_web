import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

async function authenticateAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

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

// POST /api/admin/faculty/[id]/projects - Create research project for faculty member
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
    const faculty = await prisma.faculty.findUnique({ where: { id: facultyId } });
    if (!faculty) {
      return NextResponse.json({ error: 'Faculty record not found' }, { status: 404 });
    }

    const body = await request.json();
    const { title, description, agency, role, funding, startDate, endDate, externalLink, otherFaculty } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Project Title is required.' }, { status: 400 });
    }

    const status = calculateStatus(endDate);

    const newProject = await prisma.facultyProject.create({
      data: {
        facultyId,
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
    console.error('Admin POST faculty project error:', error);
    return NextResponse.json({ error: 'Failed to create research project' }, { status: 500 });
  }
}
