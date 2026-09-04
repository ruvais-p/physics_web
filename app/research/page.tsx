'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Hero from '@/components/Hero';
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
    <div className="space-y-0 pb-20 relative">
      {/* Hero Header matching main homepage design */}
      <Hero
        title="RESEARCH & INNOVATION"
        badge="HOME > RESEARCH"
        subtitle="Exploring fundamental physics and developing innovative nanomaterial solutions for global challenges."
        bgImage="/physics.png"
      />

      {/* Main Research Laboratories Section */}
      <section id="labs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-12 font-sans">
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
