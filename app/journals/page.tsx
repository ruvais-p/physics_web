'use client';

import { useState } from 'react';
import Hero from '@/components/Hero';
import JournalCard from '@/components/JournalCard';
import { PUBLICATIONS } from '@/lib/data';
import { Search, BookOpen, ExternalLink, Filter } from 'lucide-react';

export default function JournalsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', ...Array.from(new Set(PUBLICATIONS.map((p) => p.category)))];

  const filteredPublications = PUBLICATIONS.filter((pub) => {
    const matchesCat = selectedCategory === 'ALL' || pub.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      pub.title.toLowerCase().includes(q) ||
      pub.journal.toLowerCase().includes(q) ||
      pub.authors.some((a) => a.toLowerCase().includes(q)) ||
      pub.year.toString().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-12 pb-20">
      
      {/* Hero */}
      <Hero
        badge="DEPARTMENT PUBLICATIONS"
        title="Peer-Reviewed Journals & Publications"
        subtitle="Exploring ground-breaking papers authored by our faculty and research scholars in Physical Review, ACS, Nature Physics, and EPJ."
        bgImage="https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&q=80"
      />

      {/* Filter & Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-oxford text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="journals-search-input"
              type="text"
              placeholder="Search author, title, journal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-accent/50 text-slate-800"
            />
          </div>

        </div>

        {/* Publications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPublications.length > 0 ? (
            filteredPublications.map((pub) => (
              <JournalCard key={pub.id} publication={pub} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500">
              No research papers found matching your query.
            </div>
          )}
        </div>

      </section>

    </div>
  );
}
