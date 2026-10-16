import Hero from '@/components/Hero';
import ResearchContent from '@/components/ResearchContent';
import type { ResearchPageData } from '@/components/ResearchContent';
import { prisma } from '@/lib/prisma';
import { getPageHero } from '@/lib/page-hero';

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
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  } catch (error) {
    console.error('Failed to fetch research laboratories:', error);
    return [];
  }
}

export default async function ResearchPage() {
  const [labs, heroData] = await Promise.all([
    getLabs(),
    getPageHero('research'),
  ]);

  return (
    <div className="space-y-0 pb-20 relative font-sans">
      <Hero
        title={heroData.title}
        badge="HOME > RESEARCH"
        subtitle={heroData.subtitle}
        bgImage={heroData.image}
      />

      <ResearchContent labs={labs} />
    </div>
  );
}
