'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FlaskConical } from 'lucide-react';
import LabCard, { type ResearchLabItem } from '@/components/LabCard';

export interface ResearchPageData {
  labs: ResearchLabItem[];
}

export default function ResearchContent({ labs }: ResearchPageData) {
  const router = useRouter();

  // Gracefully handle legacy bookmark hashes by redirecting to dedicated pages
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('publication') || hash.includes('journal')) {
        router.replace('/journals');
      } else if (
        hash.includes('facility') ||
        hash.includes('facilities') ||
        hash.includes('central')
      ) {
        router.replace('/facilities');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [router]);

  return (
    <>
      {/* Sub-nav Pill Selector Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center pt-8">
        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-xl border border-cyan-accent/30 shadow-lg rounded-2xl sm:rounded-3xl">
          <span className="px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold tracking-wide bg-cyan-accent text-white shadow-md">
            Research Laboratories
          </span>
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
          <Link
            href="/facilities"
            className="px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold tracking-wide transition-all duration-300 text-oxford hover:text-cyan-accent hover:bg-slate-50 cursor-pointer"
          >
            Facilities
          </Link>
        </div>
      </div>

      <section
        id="labs"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-10 font-sans"
      >
        <div className="text-center space-y-3">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1E36]">
            Research Laboratories
          </h2>
        </div>

        {labs.length === 0 ? (
          <EmptyState
            icon={FlaskConical}
            message="No research laboratories are available."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {labs.map((lab) => (
              <LabCard key={lab.id} lab={lab} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function EmptyState({
  icon: Icon,
  message,
}: {
  icon: typeof FlaskConical;
  message: string;
}) {
  return (
    <div className="py-20 text-center space-y-3 text-slate-500 font-sans bg-white rounded-2xl border border-slate-200">
      <Icon className="w-10 h-10 mx-auto text-slate-400" />
      <p className="text-base font-semibold text-slate-800">{message}</p>
    </div>
  );
}
