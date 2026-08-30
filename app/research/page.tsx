'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LabCard, { ResearchLabItem } from '@/components/LabCard';
import { RESEARCH_LABS } from '@/lib/data';
import { RefreshCw, FlaskConical } from 'lucide-react';

export default function ResearchPage() {
  const [labs, setLabs] = useState<ResearchLabItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    async function fetchLabs() {
      setLoading(true);
      try {
        const res = await fetch('/api/research');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setLabs(data);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic research labs:', err);
      }
      // Fallback to static data if API/DB returns empty
      const staticLabs: ResearchLabItem[] = RESEARCH_LABS.map((sl) => ({
        id: sl.id,
        name: sl.name,
        category: sl.category,
        shortDesc: sl.shortDesc,
        description: sl.description,
        image: sl.image,
      }));
      setLabs(staticLabs);
      setLoading(false);
    }

    fetchLabs().finally(() => setLoading(false));
  }, []);

  const categories = ['ALL', ...Array.from(new Set(labs.map((l) => l.category || 'General')))];

  const filteredLabs =
    selectedCategory === 'ALL'
      ? labs
      : labs.filter((l) => (l.category || 'General') === selectedCategory);

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
        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 pt-52 pb-32 sm:pt-64 sm:pb-44 text-center space-y-3">
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

      {/* Main Content Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 font-sans">
        {/* Category Filters */}
        {categories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-oxford text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat === 'ALL' ? 'All Research Laboratories' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Labs Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3 text-slate-500 font-sans">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-cyan-600" />
            <p className="text-sm font-medium">Loading research laboratories...</p>
          </div>
        ) : filteredLabs.length === 0 ? (
          <div className="py-20 text-center space-y-3 text-slate-500 font-sans bg-white rounded-2xl border border-slate-200">
            <FlaskConical className="w-10 h-10 mx-auto text-slate-400" />
            <p className="text-base font-semibold text-slate-800">No research laboratories found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredLabs.map((lab) => (
              <LabCard key={lab.id} lab={lab} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
