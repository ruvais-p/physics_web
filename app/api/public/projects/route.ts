import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/public/projects - Fetch all faculty research projects with lead faculty details
export async function GET() {
  try {
    const projects = await prisma.facultyProject.findMany({
      include: {
        faculty: {
          select: {
            id: true,
            name: true,
            designation: true,
            department: true,
            documents: {
              select: {
                image: true,
              },
            },
          },
        },
      },
      orderBy: [
        { startDate: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Failed to fetch public projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
