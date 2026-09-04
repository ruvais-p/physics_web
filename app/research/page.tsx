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
    <div className="space-y-12 pb-20 relative">
      {/* Page Header (Campus image background) */}
      <div className="-mt-[116px] sm:-mt-[128px] relative w-full bg-slate-900 text-white overflow-hidden min-h-[620px] sm:min-h-[720px] lg:min-h-[780px] flex items-center justify-center">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/physics.png"
            alt="Research Laboratories Banner"
            fill
            className="object-cover opacity-45"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Top Left Breadcrumbs */}
        <div className="absolute top-36 sm:top-40 left-6 sm:left-12 lg:left-16 z-20 flex items-center space-x-2 text-xl sm:text-2xl font-sans font-semibold text-slate-300">
          <Link href="/" className="hover:text-cyan-accent transition-colors">Home</Link>
          <span>&gt;</span>
          <span className="text-white font-bold">Research Laboratories</span>
        </div>

        {/* Hero Title (Centered) */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 text-center space-y-4 pt-12">
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white uppercase drop-shadow-md">
            Research Laboratories
          </h1>
        </div>
      </div>

      {/* Main Content Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 font-sans">
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
