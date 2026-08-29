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

// PUT /api/admin/faculty/[id]/publications/[publicationId] - Edit publication
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; publicationId: string }> }
) {
  const admin = await authenticateAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: facultyId, publicationId } = await params;

  try {
    const existing = await prisma.facultyPublication.findUnique({
      where: { id: publicationId },
    });

    if (!existing || existing.facultyId !== facultyId) {
      return NextResponse.json({ error: 'Publication record not found' }, { status: 404 });
    }

    const body = await request.json();
    const { title, journal, authors, publicationDate, externalLink, doi, category, description } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Publication Title is required.' }, { status: 400 });
    }

    const updatedPublication = await prisma.facultyPublication.update({
      where: { id: publicationId },
      data: {
        title: title.trim(),
        journal: journal?.trim() || null,
        authors: authors?.trim() || null,
        publicationDate: publicationDate ? new Date(publicationDate) : null,
        externalLink: externalLink?.trim() || null,
        doi: doi?.trim() || null,
        category: category?.trim() || 'Journal Article',
        description: description?.trim() || null,
      },
    });

    return NextResponse.json(updatedPublication);
  } catch (error) {
    console.error('Admin PUT faculty publication error:', error);
    return NextResponse.json({ error: 'Failed to update publication' }, { status: 500 });
  }
}

// DELETE /api/admin/faculty/[id]/publications/[publicationId] - Delete publication
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; publicationId: string }> }
) {
  const admin = await authenticateAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: facultyId, publicationId } = await params;

  try {
    const existing = await prisma.facultyPublication.findUnique({
      where: { id: publicationId },
    });

    if (!existing || existing.facultyId !== facultyId) {
      return NextResponse.json({ error: 'Publication record not found' }, { status: 404 });
    }

    await prisma.facultyPublication.delete({
      where: { id: publicationId },
    });

    return NextResponse.json({ success: true, message: 'Publication deleted successfully' });
  } catch (error) {
    console.error('Admin DELETE faculty publication error:', error);
    return NextResponse.json({ error: 'Failed to delete publication' }, { status: 500 });
  }
}
