import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sanitizeWebUrl } from '@/lib/url-security';

// GET /api/public/projects - Fetch all faculty research projects with lead faculty details
export async function GET() {
  try {
    const projects = await prisma.facultyProject.findMany({
      where: { faculty: { isActive: true } },
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

    return NextResponse.json(
      projects.map((project) => ({
        ...project,
        externalLink: sanitizeWebUrl(project.externalLink, false),
      })),
    );
  } catch (error) {
    console.error('Failed to fetch public projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
