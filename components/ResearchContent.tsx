'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, FlaskConical, Search, Wrench } from 'lucide-react';
import LabCard, { type ResearchLabItem } from '@/components/LabCard';
import PublicationsTable from '@/components/PublicationsTable';
import FacilityCard, { type FacilityItem } from '@/components/FacilityCard';
import type { Publication } from '@/lib/data';

type ResearchTab = 'labs' | 'publications' | 'facilities';

export interface ResearchPageData {
  labs: ResearchLabItem[];
  publications: Publication[];
  facilities: FacilityItem[];
}

export default function ResearchContent({
  labs,
  publications,
  facilities,
}: ResearchPageData) {
  const [activeTab, setActiveTab] = useState<ResearchTab>('labs');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();

      if (hash.includes('publication')) {
        setActiveTab('publications');
      } else if (
        hash.includes('facility') ||
        hash.includes('facilities') ||
        hash.includes('central')
      ) {
        setActiveTab('facilities');
      } else if (hash.includes('lab')) {
        setActiveTab('labs');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabClick = (tab: ResearchTab) => {
    setActiveTab(tab);
    window.history.pushState(null, '', `#${tab}`);
  };

  const effectiveQuery = searchQuery.trim().toLowerCase();
  const filteredPublications = publications.filter((publication) => {
    if (!effectiveQuery) return true;

    return (
      publication.title.toLowerCase().includes(effectiveQuery) ||
      publication.journal.toLowerCase().includes(effectiveQuery) ||
      publication.authors.some((author) => author.toLowerCase().includes(effectiveQuery)) ||
      publication.category.toLowerCase().includes(effectiveQuery) ||
      publication.year.toString().includes(effectiveQuery)
    );
  });

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center pt-8">
        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-xl border border-cyan-accent/30 shadow-lg rounded-2xl sm:rounded-3xl">
          <button
            type="button"
            onClick={() => handleTabClick('labs')}
            className={`px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold tracking-wide transition-all duration-300 cursor-pointer ${
              activeTab === 'labs'
                ? 'bg-cyan-accent text-white shadow-md'
                : 'text-oxford hover:text-cyan-accent hover:bg-slate-50'
            }`}
          >
            Research Laboratories
          </button>
          <Link
            href="/projects"
            className="px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold tracking-wide transition-all duration-300 text-oxford hover:text-cyan-accent hover:bg-slate-50 cursor-pointer"
          >
            Projects &amp; Grants
          </Link>
          <button
            type="button"
            onClick={() => handleTabClick('publications')}
            className={`px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold tracking-wide transition-all duration-300 cursor-pointer ${
              activeTab === 'publications'
                ? 'bg-cyan-accent text-white shadow-md'
                : 'text-oxford hover:text-cyan-accent hover:bg-slate-50'
            }`}
          >
            Publications
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('facilities')}
            className={`px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold tracking-wide transition-all duration-300 cursor-pointer ${
              activeTab === 'facilities'
                ? 'bg-cyan-accent text-white shadow-md'
                : 'text-oxford hover:text-cyan-accent hover:bg-slate-50'
            }`}
          >
            Central Facilities
          </button>
        </div>
      </div>

      {activeTab === 'labs' && (
        <section
          id="labs"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-10 font-sans"
        >
          <div className="text-center space-y-3">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1E36]">
              Research Laboratories
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
              Our specialized research facilities drive groundbreaking discoveries across advanced materials, laser photonics, and quantum systems.
            </p>
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
      )}

      {activeTab === 'publications' && (
        <section
          id="publications"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-10 font-sans"
        >
          <div className="text-center space-y-3">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1E36]">
              Department Publications
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
              Peer-reviewed research articles, high-impact letters, and conference proceedings authored by our faculty and scholars.
            </p>
          </div>

          {publications.length === 0 ? (
            <EmptyState icon={BookOpen} message="No publications are available." />
          ) : (
            <>
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-2 bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-sm focus-within:border-cyan-accent focus-within:ring-2 focus-within:ring-cyan-accent/20 transition-all">
                  <div className="relative flex-1 flex items-center">
                    <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="publications-search-input"
                      type="search"
                      placeholder="Search by title, author, journal, or year..."
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      className="w-full pl-11 pr-4 py-2 text-sm sm:text-base bg-transparent border-none focus:outline-none text-slate-800 placeholder:text-slate-400 font-sans"
                    />
                  </div>

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-2 py-1 cursor-pointer transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <PublicationsTable
                publications={filteredPublications}
                emptyMessage="No publications found matching your query."
              />
            </>
          )}
        </section>
      )}

      {activeTab === 'facilities' && (
        <section
          id="facilities"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-10 font-sans"
        >
          <div className="text-center space-y-3">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1E36]">
              Central Instrumentation Facilities
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
              Advanced analytical instrumentation including FE-SEM, XRD Diffractometer, Spectrophotometers, and Magnetron Sputterers.
            </p>
          </div>

          {facilities.length === 0 ? (
            <EmptyState icon={Wrench} message="No central facilities are available." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {facilities.map((facility) => (
                <FacilityCard key={facility.id} facility={facility} />
              ))}
            </div>
          )}
        </section>
      )}
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
