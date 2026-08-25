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

// PUT /api/faculty/projects/[id] - Update a research project
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const existing = await prisma.facultyProject.findUnique({
      where: { id },
    });

    if (!existing || existing.facultyId !== payload.id) {
      return NextResponse.json({ error: 'Project record not found or access denied.' }, { status: 404 });
    }

    const body = await request.json();
    const { title, description, agency, role, funding, startDate, endDate, externalLink, otherFaculty } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Project Title is required.' }, { status: 400 });
    }

    const status = calculateStatus(endDate);

    const updatedProject = await prisma.facultyProject.update({
      where: { id },
      data: {
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

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('PUT /api/faculty/projects/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update research project' }, { status: 500 });
  }
}

// DELETE /api/faculty/projects/[id] - Delete a research project
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const existing = await prisma.facultyProject.findUnique({
      where: { id },
    });

    if (!existing || existing.facultyId !== payload.id) {
      return NextResponse.json({ error: 'Project record not found or access denied.' }, { status: 404 });
    }

    await prisma.facultyProject.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/faculty/projects/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete research project' }, { status: 500 });
  }
}
