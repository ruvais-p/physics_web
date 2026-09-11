import ProjectsPageClient from '@/components/ProjectsPageClient';
import type { ProjectData } from '@/components/ProjectsTable';
import { prisma } from '@/lib/prisma';
import { getPageHero } from '@/lib/page-hero';
import { sanitizeWebUrl } from '@/lib/url-security';

export const revalidate = 300;

export default async function ProjectsPage() {
  let projects: ProjectData[] = [];

  const [records, heroData] = await Promise.all([
    prisma.facultyProject.findMany({
      where: { faculty: { isActive: true } },
      select: {
        id: true,
        title: true,
        description: true,
        agency: true,
        role: true,
        funding: true,
        startDate: true,
        endDate: true,
        externalLink: true,
        otherFaculty: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        faculty: {
          select: { id: true, name: true, designation: true, department: true },
        },
      },
      orderBy: [{ startDate: 'desc' }, { createdAt: 'desc' }],
    }).catch((error) => {
      console.error('Failed to fetch public projects:', error);
      return [];
    }),
    getPageHero('projects'),
  ]);

  projects = records.map((project) => ({
    ...project,
    startDate: project.startDate?.toISOString() || null,
    endDate: project.endDate?.toISOString() || null,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    externalLink: sanitizeWebUrl(project.externalLink, false),
  }));

  return <ProjectsPageClient projects={projects} heroData={heroData} />;
}

