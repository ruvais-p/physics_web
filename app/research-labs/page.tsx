'use client';

import { useState } from 'react';
import Hero from '@/components/Hero';
import LabCard from '@/components/LabCard';
import { RESEARCH_LABS } from '@/lib/data';

export default function ResearchLabsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', ...Array.from(new Set(RESEARCH_LABS.map((l) => l.category)))];

  const filteredLabs =
    selectedCategory === 'ALL'
      ? RESEARCH_LABS
      : RESEARCH_LABS.filter((l) => l.category === selectedCategory);

  return (
    <div className="space-y-12 pb-20">
      
      {/* Hero */}
      <Hero
        badge="DEPARTMENT RESEARCH LABS"
        title="Specialized Research Laboratories & Centers"
        subtitle="Exploring nanostructures, quantum condensed matter, laser spectroscopy, solar energy, and theoretical gravitation."
        bgImage="https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=1600&q=80"
      />

      {/* Category Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-wrap items-center justify-center gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-oxford text-white shadow'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat === 'ALL' ? 'All Laboratories' : cat}
            </button>
          ))}
        </div>

        {/* Labs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLabs.map((lab) => (
            <LabCard key={lab.id} lab={lab} />
          ))}
        </div>

      </section>

    </div>
  );
}
