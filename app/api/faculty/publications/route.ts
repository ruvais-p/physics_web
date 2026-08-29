import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyFacultyToken } from '@/lib/auth';

// GET /api/faculty/publications - Fetch logged-in faculty's publications
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

    const publications = await prisma.facultyPublication.findMany({
      where: { facultyId: payload.id },
      orderBy: { publicationDate: 'desc' },
    });

    return NextResponse.json(publications);
  } catch (error) {
    console.error('GET /api/faculty/publications error:', error);
    return NextResponse.json({ error: 'Failed to fetch publications' }, { status: 500 });
  }
}

// POST /api/faculty/publications - Create a new publication for logged-in faculty
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
    const { title, journal, authors, publicationDate, externalLink, doi, category, description } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Publication Title is required.' }, { status: 400 });
    }

    const newPublication = await prisma.facultyPublication.create({
      data: {
        facultyId: payload.id,
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

    return NextResponse.json(newPublication, { status: 201 });
  } catch (error) {
    console.error('POST /api/faculty/publications error:', error);
    return NextResponse.json({ error: 'Failed to create publication' }, { status: 500 });
  }
}
