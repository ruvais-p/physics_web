import Link from 'next/link';
import Hero from '@/components/Hero';
import JournalsContent from '@/components/JournalsContent';
import { prisma } from '@/lib/prisma';
import { getPageHero } from '@/lib/page-hero';
import type { Publication } from '@/lib/data';
import { sanitizeWebUrl } from '@/lib/url-security';

export const revalidate = 300;

async function getPublications(): Promise<Publication[]> {
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
    console.error('Failed to fetch journal publications:', error);
    return [];
  }
}

export default async function JournalsPage() {
  const [publications, heroData] = await Promise.all([
    getPublications(),
    getPageHero('journals'),
  ]);

  return (
    <div className="space-y-12 pb-20 font-sans">
      <Hero
        title={heroData.title}
        badge="HOME > JOURNALS"
        subtitle={heroData.subtitle}
        bgImage={heroData.image}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center pt-2">
        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-xl border border-cyan-accent/30 shadow-lg rounded-2xl sm:rounded-3xl">
          <Link
            href="/research"
            className="px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold tracking-wide transition-all duration-300 text-oxford hover:text-cyan-accent hover:bg-slate-50 cursor-pointer"
          >
            Research Laboratories
          </Link>
          <Link
            href="/projects"
            className="px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold tracking-wide transition-all duration-300 text-oxford hover:text-cyan-accent hover:bg-slate-50 cursor-pointer"
          >
            Projects &amp; Grants
          </Link>
          <span className="px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold tracking-wide bg-cyan-accent text-white shadow-md">
            Publications
          </span>
          <Link
            href="/facilities"
            className="px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold tracking-wide transition-all duration-300 text-oxford hover:text-cyan-accent hover:bg-slate-50 cursor-pointer"
          >
            Central Facilities
          </Link>
        </div>
      </div>

      <JournalsContent publications={publications} />
    </div>
  );
}
