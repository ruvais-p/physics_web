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

// GET /api/admin/faculty/[id]/publications - Fetch all publications for a faculty member
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await authenticateAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: facultyId } = await params;

  try {
    const publications = await prisma.facultyPublication.findMany({
      where: { facultyId },
      orderBy: { publicationDate: 'desc' },
    });

    return NextResponse.json(publications);
  } catch (error) {
    console.error('Admin GET faculty publications error:', error);
    return NextResponse.json({ error: 'Failed to fetch publications' }, { status: 500 });
  }
}

// POST /api/admin/faculty/[id]/publications - Create a publication for a faculty member
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
    const { title, journal, authors, publicationDate, externalLink, doi, category, description } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Publication Title is required.' }, { status: 400 });
    }

    const newPublication = await prisma.facultyPublication.create({
      data: {
        facultyId,
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
    console.error('Admin POST faculty publication error:', error);
    return NextResponse.json({ error: 'Failed to create publication' }, { status: 500 });
  }
}
