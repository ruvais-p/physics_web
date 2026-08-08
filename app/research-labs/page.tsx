'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
    <div className="space-y-12 pb-20 relative">
      
      {/* Page Header (Campus image background) */}
      <div className="-mt-[116px] sm:-mt-[128px] relative bg-slate-900 text-white overflow-hidden">
        {/* Background Image with Dark Blue Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/physics.png"
            alt="Research Laboratories Banner"
            fill
            className="object-cover opacity-45"
            priority
          />
          <div className="absolute inset-0 bg-oxford/75 mix-blend-multiply" />
        </div>

        {/* Content (Centered) */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 pt-36 pb-16 sm:pb-20 text-center space-y-3">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase">
            Research Laboratories
          </h1>
          
          {/* Centered Breadcrumbs */}
          <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm font-sans font-medium text-slate-300">
            <Link href="/" className="hover:text-cyan-accent transition-colors">Home</Link>
            <span>&gt;</span>
            <span className="text-white font-semibold">Research Laboratories</span>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 font-sans">
        
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
