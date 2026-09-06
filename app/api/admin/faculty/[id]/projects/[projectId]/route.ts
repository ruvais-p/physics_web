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

// PUT /api/admin/faculty/[id]/projects/[projectId] - Update research project
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; projectId: string }> }
) {
  const admin = await authenticateAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: facultyId, projectId } = await params;

  try {
    const existing = await prisma.facultyProject.findUnique({
      where: { id: projectId },
    });

    if (!existing || existing.facultyId !== facultyId) {
      return NextResponse.json({ error: 'Project record not found' }, { status: 404 });
    }

    const body = await request.json();
    const { title, description, agency, role, funding, startDate, endDate, externalLink, otherFaculty } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Project Title is required.' }, { status: 400 });
    }

    const status = calculateStatus(endDate);

    const updatedProject = await prisma.facultyProject.update({
      where: { id: projectId },
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
    console.error('Admin PUT faculty project error:', error);
    return NextResponse.json({ error: 'Failed to update research project' }, { status: 500 });
  }
}

// DELETE /api/admin/faculty/[id]/projects/[projectId] - Delete research project
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; projectId: string }> }
) {
  const admin = await authenticateAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: facultyId, projectId } = await params;

  try {
    const existing = await prisma.facultyProject.findUnique({
      where: { id: projectId },
    });

    if (!existing || existing.facultyId !== facultyId) {
      return NextResponse.json({ error: 'Project record not found' }, { status: 404 });
    }

    await prisma.facultyProject.delete({
      where: { id: projectId },
    });

    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Admin DELETE faculty project error:', error);
    return NextResponse.json({ error: 'Failed to delete research project' }, { status: 500 });
  }
}
