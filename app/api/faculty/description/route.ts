import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyFacultyToken } from '@/lib/auth';

// Helper to extract clean plain-text snippet for Faculty.bio
function extractPlainTextSnippet(markdown: string): string {
  if (!markdown) return '';
  return markdown
    .replace(/^#+\s+/gm, '') // Remove headers
    .replace(/[*_~`>]/g, '') // Remove formatting chars
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links [title](url) to title
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 300);
}

// GET /api/faculty/description
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

    const doc = await prisma.facultyDescription.findUnique({
      where: { facultyId: payload.id },
    });

    const faculty = await prisma.faculty.findUnique({
      where: { id: payload.id },
      select: { bio: true },
    });

    return NextResponse.json({
      uid: doc?.uid || null,
      facultyId: payload.id,
      description: doc?.description || faculty?.bio || '',
      updatedAt: doc?.updatedAt || null,
    });
  } catch (error) {
    console.error('GET /api/faculty/description error:', error);
    return NextResponse.json({ error: 'Failed to fetch description' }, { status: 500 });
  }
}

// PUT /api/faculty/description
export async function PUT(request: Request) {
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
    const { description } = body;

    if (description === undefined || typeof description !== 'string') {
      return NextResponse.json({ error: 'Description must be a string' }, { status: 400 });
    }

    const rawMarkdown = description.trim();

    // Upsert FacultyDescription record in DB
    const updatedDesc = await prisma.facultyDescription.upsert({
      where: { facultyId: payload.id },
      update: {
        description: rawMarkdown,
      },
      create: {
        facultyId: payload.id,
        description: rawMarkdown,
      },
    });

    // Also update summary in Faculty.bio
    const bioSnippet = extractPlainTextSnippet(rawMarkdown);
    await prisma.faculty.update({
      where: { id: payload.id },
      data: { bio: bioSnippet },
    });

    return NextResponse.json({
      success: true,
      uid: updatedDesc.uid,
      facultyId: updatedDesc.facultyId,
      description: updatedDesc.description,
      updatedAt: updatedDesc.updatedAt,
    });
  } catch (error) {
    console.error('PUT /api/faculty/description error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while saving professional description.' },
      { status: 500 }
    );
  }
}
