import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/public/scholars - Fetch all research scholars
export async function GET() {
  try {
    const students = await prisma.facultyStudent.findMany({
      include: {
        faculty: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const scholars = students.map((s) => ({
      id: s.uid,
      name: s.name,
      description: s.description,
      image: s.image,
      facultyId: s.facultyId,
      supervisor: s.faculty?.name || 'Department Faculty',
    }));

    return NextResponse.json(scholars);
  } catch (error) {
    console.error('GET /api/public/scholars error:', error);
    return NextResponse.json({ error: 'Failed to fetch scholars' }, { status: 500 });
  }
}
