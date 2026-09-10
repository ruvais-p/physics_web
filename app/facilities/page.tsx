import Link from 'next/link';
import { Wrench } from 'lucide-react';
import Hero from '@/components/Hero';
import FacilityCard, { type FacilityItem } from '@/components/FacilityCard';
import { prisma } from '@/lib/prisma';
import { getPageHero } from '@/lib/page-hero';

export const revalidate = 300;

async function getFacilities(): Promise<FacilityItem[]> {
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
    console.error('Failed to fetch facilities:', error);
    return [];
  }
}

export default async function FacilitiesPage() {
  const [facilities, heroData] = await Promise.all([
    getFacilities(),
    getPageHero('facilities'),
  ]);

  return (
    <div className="space-y-12 pb-20 relative font-sans">
      <Hero
        title={heroData.title}
        badge="HOME > FACILITIES"
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
          <Link
            href="/journals"
            className="px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold tracking-wide transition-all duration-300 text-oxford hover:text-cyan-accent hover:bg-slate-50 cursor-pointer"
          >
            Publications
          </Link>
          <span className="px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold tracking-wide bg-cyan-accent text-white shadow-md">
            Central Facilities
          </span>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {facilities.length === 0 ? (
          <div className="py-20 text-center space-y-3 text-slate-500 font-sans bg-white rounded-2xl border border-slate-200">
            <Wrench className="w-10 h-10 mx-auto text-slate-400" />
            <p className="text-base font-semibold text-slate-800">
              No research facilities are available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((facility) => (
              <FacilityCard key={facility.id} facility={facility} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
