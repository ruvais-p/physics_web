import Hero from '@/components/Hero';
import ResearchContent from '@/components/ResearchContent';
import type { ResearchPageData } from '@/components/ResearchContent';
import { prisma } from '@/lib/prisma';
import { sanitizeWebUrl } from '@/lib/url-security';

export const revalidate = 300;

async function getLabs(): Promise<ResearchPageData['labs']> {
  try {
    return await prisma.researchLab.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        description: true,
        image: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Failed to fetch research laboratories:', error);
    return [];
  }
}

async function getFacilities(): Promise<ResearchPageData['facilities']> {
  try {
    return await prisma.facility.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Failed to fetch research facilities:', error);
    return [];
  }
}

async function getPublications(): Promise<ResearchPageData['publications']> {
  try {
    const publications = await prisma.facultyPublication.findMany({
      where: { faculty: { isActive: true } },
      select: {
        id: true,
        title: true,
        authors: true,
        journal: true,
        publicationDate: true,
        externalLink: true,
        doi: true,
        category: true,
        description: true,
        createdAt: true,
      },
      orderBy: [
        { publicationDate: { sort: 'desc', nulls: 'last' } },
        { createdAt: 'desc' },
      ],
    });

    return publications.map((publication) => ({
      id: publication.id,
      title: publication.title,
      authors: publication.authors
        ? publication.authors.split(',').map((author) => author.trim()).filter(Boolean)
        : [],
      journal: publication.journal || '',
      year: publication.publicationDate?.getFullYear() ?? publication.createdAt.getFullYear(),
      volume: '',
      doi: sanitizeWebUrl(publication.doi || publication.externalLink, false) || '',
      citations: 0,
      category: publication.category || '',
      abstract: publication.description || '',
    }));
  } catch (error) {
    console.error('Failed to fetch research publications:', error);
    return [];
  }
}

export default async function ResearchPage() {
  const [labs, publications, facilities] = await Promise.all([
    getLabs(),
    getPublications(),
    getFacilities(),
  ]);

  return (
    <div className="space-y-0 pb-20 relative font-sans">
      <Hero
        title="RESEARCH & INNOVATION"
        badge="HOME > RESEARCH"
        subtitle="Exploring fundamental physics and developing innovative nanomaterial solutions for global challenges."
        bgImage="/physics.png"
      />

      <ResearchContent labs={labs} publications={publications} facilities={facilities} />
    </div>
  );
}
