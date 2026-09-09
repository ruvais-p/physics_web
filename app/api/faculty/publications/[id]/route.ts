import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyFacultyToken } from '@/lib/auth';

// PUT /api/faculty/publications/[id] - Update a publication
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
    const existing = await prisma.facultyPublication.findUnique({
      where: { id },
    });

    if (!existing || existing.facultyId !== payload.id) {
      return NextResponse.json({ error: 'Publication record not found or access denied.' }, { status: 404 });
    }

    const body = await request.json();
    const { title, journal, authors, publicationDate, externalLink, doi, category, description } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Publication Title is required.' }, { status: 400 });
    }

    const updatedPublication = await prisma.facultyPublication.update({
      where: { id },
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
    console.error('PUT /api/faculty/publications/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update publication' }, { status: 500 });
  }
}

// DELETE /api/faculty/publications/[id] - Delete a publication
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
    const existing = await prisma.facultyPublication.findUnique({
      where: { id },
    });

    if (!existing || existing.facultyId !== payload.id) {
      return NextResponse.json({ error: 'Publication record not found or access denied.' }, { status: 404 });
    }

    await prisma.facultyPublication.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Publication deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/faculty/publications/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete publication' }, { status: 500 });
  }
}
