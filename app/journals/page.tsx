'use client';

import { useState } from 'react';
import Link from 'next/link';
import PublicationsTable from '@/components/PublicationsTable';
import Hero from '@/components/Hero';
import { PUBLICATIONS } from '@/lib/data';
import { Search, Award, ExternalLink, BookOpen } from 'lucide-react';

const FEATURED_JOURNALS = [
  {
    id: 'prb',
    name: 'Physical Review B & Letters',
    publisher: 'American Physical Society (APS)',
    category: 'Condensed Matter & Quantum Materials',
    indexing: 'SCI / Scopus Q1',
    description: 'Premier peer-reviewed journals dedicated to experimental and theoretical research in condensed matter physics, quantum materials, and solid state phenomena.',
    link: 'https://journals.aps.org/prb/',
    tags: ['Magnetism', 'Superconductivity', 'Nanostructures'],
  },
  {
    id: 'acs',
    name: 'ACS Applied Materials & Interfaces',
    publisher: 'American Chemical Society (ACS)',
    category: 'Advanced Materials & Energy',
    indexing: 'SCI / Scopus Q1',
    description: 'International journal publishing cutting-edge research in functional nanomaterials, solar energy conversion, battery electrolytes, and hybrid composites.',
    link: 'https://pubs.acs.org/journal/aamick',
    tags: ['Solar Cells', 'Perovskites', 'Energy Storage'],
  },
  {
    id: 'optics',
    name: 'Optics Letters & Applied Optics',
    publisher: 'Optica Publishing Group (OSA)',
    category: 'Photonics & Nonlinear Optics',
    indexing: 'SCI / Scopus Q1',
    description: 'Rapid dissemination of high-impact discoveries in laser physics, nonlinear optical propagation, photothermal diagnostics, and optoelectronic sensors.',
    link: 'https://opg.optica.org/ol/home.cfm',
    tags: ['Z-Scan', 'Laser Spectroscopy', 'Fiber Optics'],
  },
  {
    id: 'epj',
    name: 'European Physical Journal C',
    publisher: 'Springer Nature & EDP Sciences',
    category: 'Cosmology, Particles & Gravitation',
    indexing: 'SCI / Scopus Q1',
    description: 'Leading journal covering theoretical and experimental investigations in dark energy, general relativity, quantum cosmology, and high energy physics.',
    link: 'https://link.springer.com/journal/10052',
    tags: ['Dark Energy', 'General Relativity', 'Cosmology'],
  },
  {
    id: 'jps',
    name: 'Journal of Power Sources',
    publisher: 'Elsevier Science',
    category: 'Energy Conversion & Supercapacitors',
    indexing: 'SCI / Scopus Q1',
    description: 'High-impact international venue focusing on advanced energy storage, solid-state supercapacitors, polymer nanocomposites, and fuel cell technologies.',
    link: 'https://www.sciencedirect.com/journal/journal-of-power-sources',
    tags: ['Supercapacitors', 'Conducting Polymers', 'Nanotubes'],
  },
  {
    id: 'jap',
    name: 'Journal of Applied Physics',
    publisher: 'AIP Publishing',
    category: 'Applied Physics & Semiconductors',
    indexing: 'SCI / Scopus Q2',
    description: 'Authoritative research on semiconductor thin films, transparent conducting oxides, dielectric phenomena, and applied physical instrumentation.',
    link: 'https://pubs.aip.org/aip/jap',
    tags: ['Thin Films', 'Oxides', 'Photovoltaics'],
  },
];

export default function JournalsPage() {
  const [activeTab, setActiveTab] = useState<'publications' | 'journals'>('publications');
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');

  const effectiveQuery = (submittedQuery || searchQuery).toLowerCase();

  const filteredPublications = PUBLICATIONS.filter((pub) => {
    if (!effectiveQuery) return true;
    return (
      pub.title.toLowerCase().includes(effectiveQuery) ||
      pub.journal.toLowerCase().includes(effectiveQuery) ||
      pub.authors.some((a) => a.toLowerCase().includes(effectiveQuery)) ||
      pub.category?.toLowerCase().includes(effectiveQuery) ||
      pub.year.toString().includes(effectiveQuery)
    );
  });

  const filteredJournals = FEATURED_JOURNALS.filter((jnl) => {
    if (!effectiveQuery) return true;
    return (
      jnl.name.toLowerCase().includes(effectiveQuery) ||
      jnl.publisher.toLowerCase().includes(effectiveQuery) ||
      jnl.category.toLowerCase().includes(effectiveQuery) ||
      jnl.tags.some((t) => t.toLowerCase().includes(effectiveQuery))
    );
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSubmittedQuery('');
  };

  return (
    <div className="space-y-12 pb-20 font-sans">
      {/* Hero Header matching main homepage design */}
      <Hero
        title="PUBLICATIONS & JOURNALS"
        badge="HOME > JOURNALS"
        subtitle="Exploring ground-breaking papers authored by our faculty and research scholars in Physical Review, ACS, Nature Physics, and EPJ."
        bgImage="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1920&auto=format&fit=crop"
      />

      {/* Tab Selector Bar - Glassmorphic Pill Tab */}
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
          <button
            className="px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold tracking-wide transition-all duration-300 bg-cyan-accent text-white shadow-md cursor-default"
          >
            Publications
          </button>
          <Link
            href="/facilities"
            className="px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold tracking-wide transition-all duration-300 text-oxford hover:text-cyan-accent hover:bg-slate-50 cursor-pointer"
          >
            Central Facilities
          </Link>
        </div>
      </div>

      {/* Search Bar with Search Button */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-sm focus-within:border-cyan-accent focus-within:ring-2 focus-within:ring-cyan-accent/20 transition-all"
          >
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="journals-search-input"
                type="text"
                placeholder={
                  activeTab === 'publications'
                    ? 'Search by title, author, journal, or year...'
                    : 'Search journals by name, publisher, scope...'
                }
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSubmittedQuery(e.target.value);
                }}
                className="w-full pl-11 pr-4 py-2 text-sm sm:text-base bg-transparent border-none focus:outline-none text-slate-800 placeholder:text-slate-400 font-sans"
              />
            </div>

            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-2 py-1 cursor-pointer transition-colors"
              >
                Clear
              </button>
            )}

            <button
              id="journals-search-button"
              type="submit"
              className="px-5 py-2.5 bg-oxford hover:bg-cyan-900 text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5 shrink-0 hover:shadow-md"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </form>
        </div>

        {/* Tab 1: Publications Table */}
        {activeTab === 'publications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-oxford">
                Department Publications
              </h2>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {filteredPublications.length} Papers
              </span>
            </div>

            <PublicationsTable
              publications={filteredPublications}
              emptyMessage="No research papers found matching your query."
            />
          </div>
        )}

        {/* Tab 2: Journals Grid */}
        {activeTab === 'journals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-oxford">
                Indexed Physics Journals &amp; Venues
              </h2>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {filteredJournals.length} Venues
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredJournals.length > 0 ? (
                filteredJournals.map((jnl) => (
                  <div
                    key={jnl.id}
                    className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-5 group"
                  >
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <Award className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{jnl.indexing}</span>
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {jnl.publisher}
                        </span>
                      </div>

                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-oxford group-hover:text-cyan-dark transition-colors leading-snug">
                        {jnl.name}
                      </h3>

                      <p className="text-xs font-semibold text-cyan-dark">
                        {jnl.category}
                      </p>

                      <p className="text-sm text-slate-600 leading-relaxed">
                        {jnl.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {jnl.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setActiveTab('publications');
                          const term = jnl.name.split('&')[0].trim();
                          setSearchQuery(term);
                          setSubmittedQuery(term);
                        }}
                        className="text-xs font-bold text-oxford hover:text-cyan-dark transition-colors cursor-pointer"
                      >
                        View Papers &rarr;
                      </button>
                      <a
                        href={jnl.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-dark hover:underline"
                      >
                        <span>Journal Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500">
                  <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No journals found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
