'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LabCard, { ResearchLabItem } from '@/components/LabCard';
import ResearchDomainsSection from '@/components/ResearchDomainsSection';
import { RESEARCH_LABS } from '@/lib/data';
import { RefreshCw, FlaskConical } from 'lucide-react';

export default function ResearchPage() {
  const [labs, setLabs] = useState<ResearchLabItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-0 pb-20 relative">
      {/* Page Header (Campus image background - Matches Homepage Hero Height) */}
      <div className="-mt-[140px] sm:-mt-[165px] lg:-mt-[180px] relative w-full bg-slate-900 text-white overflow-hidden min-h-[620px] sm:min-h-[720px] lg:min-h-[780px] flex items-center justify-center">
        {/* Background Image with Top Blue Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/physics.png"
            alt="Research Banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#002147]/80 via-[#002147]/30 to-transparent" />
        </div>

        {/* Hero Content (Centered Text) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 text-center space-y-4 pt-16 sm:pt-20 lg:pt-24">
          {/* Breadcrumbs Above Title */}
          <div className="flex items-center justify-center space-x-3 text-xl sm:text-2xl lg:text-3xl font-sans font-bold text-slate-100 drop-shadow-md">
            <Link href="/" className="hover:text-cyan-accent transition-colors">Home</Link>
            <span>&gt;</span>
            <span className="text-white font-extrabold">Research</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase drop-shadow-lg">
            Research & Innovation
          </h1>
        </div>
      </div>

      {/* 1. Research Domains Section (Matching Reference Image Style) */}
      <div id="domains">
        <ResearchDomainsSection />
      </div>

      {/* 2. Main Research Laboratories Section */}
      <section id="labs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-12 font-sans border-t border-slate-200/60">
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold text-cyan-600 uppercase tracking-widest block">
            State-of-the-Art Facilities
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1E36]">
            Research Laboratories
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Our specialized research facilities drive groundbreaking discoveries across advanced materials, laser photonics, and quantum systems.
          </p>
        </div>

        {/* Labs Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3 text-slate-500 font-sans">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-cyan-600" />
            <p className="text-sm font-medium">Loading research laboratories...</p>
          </div>
        ) : labs.length === 0 ? (
          <div className="py-20 text-center space-y-3 text-slate-500 font-sans bg-white rounded-2xl border border-slate-200">
            <FlaskConical className="w-10 h-10 mx-auto text-slate-400" />
            <p className="text-base font-semibold text-slate-800">No research laboratories found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {labs.map((lab) => (
              <LabCard key={lab.id} lab={lab} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
