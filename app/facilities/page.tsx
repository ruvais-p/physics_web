'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import FacilityCard, { FacilityItem } from '@/components/FacilityCard';
import { FACILITIES } from '@/lib/data';
import { RefreshCw, Wrench } from 'lucide-react';

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFacilities() {
      setLoading(true);
      try {
        const res = await fetch('/api/facilities');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setFacilities(data);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic facilities:', err);
      }
      // Fallback to static data if API/DB returns empty
      const staticFacilities: FacilityItem[] = FACILITIES.map((f) => ({
        id: f.id,
        name: f.name,
        description: f.description,
        image: f.image,
        category: f.category,
        bookingStatus: f.bookingStatus,
        make: f.make,
        model: f.model,
        specifications: f.specifications,
        inCharge: f.inCharge,
        chargeInternal: f.chargeInternal,
        chargeExternal: f.chargeExternal,
      }));
      setFacilities(staticFacilities);
      setLoading(false);
    }

    fetchFacilities().finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-12 pb-20 relative font-sans">
      {/* Hero Header matching main homepage design */}
      <Hero
        title="CENTRAL FACILITIES"
        badge="HOME > FACILITIES"
        subtitle="Equipped with FE-SEM, XRD Diffractometer, Confocal Raman Spectrometer, and VSM Magnetometers."
        bgImage="/physics.png"
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
            href="/journals"
            className="px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold tracking-wide transition-all duration-300 text-oxford hover:text-cyan-accent hover:bg-slate-50 cursor-pointer"
          >
            Publications
          </Link>
          <button
            className="px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold tracking-wide transition-all duration-300 bg-cyan-accent text-white shadow-md cursor-default"
          >
            Central Facilities
          </button>
        </div>
      </div>

      {/* Main Content Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Facilities Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3 text-slate-500 font-sans">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-cyan-600" />
            <p className="text-sm font-medium">Loading research facilities...</p>
          </div>
        ) : facilities.length === 0 ? (
          <div className="py-20 text-center space-y-3 text-slate-500 font-sans bg-white rounded-2xl border border-slate-200">
            <Wrench className="w-10 h-10 mx-auto text-slate-400" />
            <p className="text-base font-semibold text-slate-800">No research facilities found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((facility) => (
              <FacilityCard key={facility.id} facility={facility} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
