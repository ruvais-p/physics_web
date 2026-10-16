import Hero from '@/components/Hero';
import AlumniExecutiveStream from '@/components/AlumniExecutiveStream';
import AlumniShowcaseTabs from '@/components/AlumniShowcaseTabs';
import { getPageHero } from '@/lib/page-hero';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Alumni Association | Department of Physics, CUSAT',
  description:
    'Executive committee members of the Physics Alumni Association (PhyCA), Department of Physics, Cochin University of Science and Technology (CUSAT).',
};

export const revalidate = 60;

export default async function AlumniPage() {
  let executives: any[] = [];
  let achievements: any[] = [];
  let sponsoredPrograms: any[] = [];
  let heroData: any = {};

  try {
    const results = await Promise.all([
      prisma.alumniExecutive
        ? prisma.alumniExecutive.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
          })
        : [],
      prisma.alumniAchievement
        ? prisma.alumniAchievement.findMany({
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
          })
        : [],
      prisma.alumniSponsoredProgram
        ? prisma.alumniSponsoredProgram.findMany({
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
          })
        : [],
      getPageHero('alumni'),
    ]);

    executives = results[0] || [];
    achievements = results[1] || [];
    sponsoredPrograms = results[2] || [];
    heroData = results[3] || {};
  } catch (err) {
    console.error('Failed to load alumni records from DB:', err);
    heroData = await getPageHero('alumni').catch(() => ({}));
  }

  return (
    <div id="alumni-page" className="min-h-screen bg-surface-canvas text-on-surface font-sans">
      {/* Full-bleed Hero Header */}
      <Hero
        title={heroData.title || 'ALUMNI ASSOCIATION'}
        badge="HOME > ALUMNI"
        bgImage={heroData.image}
      />

      {/* Alumni Association Executive Members Horizontal Stream */}
      <AlumniExecutiveStream initialExecutives={executives} />

      {/* Alumni Achievements & Sponsored Programs Tabs */}
      <AlumniShowcaseTabs
        initialAchievements={achievements}
        initialPrograms={sponsoredPrograms}
      />
    </div>
  );
}
