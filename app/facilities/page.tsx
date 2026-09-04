'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Hero from '@/components/Hero';
import FacilityCard, { FacilityItem } from '@/components/FacilityCard';
import { FACILITIES } from '@/lib/data';
import { RefreshCw, Wrench, FileText, Clock } from 'lucide-react';

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

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

  const categories = ['ALL', ...Array.from(new Set(facilities.map((f) => f.category || 'Central Facility')))];

  const filteredFacilities =
    selectedCategory === 'ALL'
      ? facilities
      : facilities.filter((f) => (f.category || 'Central Facility') === selectedCategory);

  return (
    <div className="space-y-12 pb-20 relative font-sans">
      {/* Hero Header matching main homepage design */}
      <Hero
        title="CENTRAL FACILITIES"
        badge="HOME > FACILITIES"
        subtitle="Equipped with FE-SEM, XRD Diffractometer, Confocal Raman Spectrometer, and VSM Magnetometers."
        bgImage="/physics.png"
      />

      {/* Main Content Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
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
                {cat === 'ALL' ? 'All Research Facilities' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Facilities Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3 text-slate-500 font-sans">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-cyan-600" />
            <p className="text-sm font-medium">Loading research facilities...</p>
          </div>
        ) : filteredFacilities.length === 0 ? (
          <div className="py-20 text-center space-y-3 text-slate-500 font-sans bg-white rounded-2xl border border-slate-200">
            <Wrench className="w-10 h-10 mx-auto text-slate-400" />
            <p className="text-base font-semibold text-slate-800">No research facilities found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFacilities.map((facility) => (
              <FacilityCard key={facility.id} facility={facility} />
            ))}
          </div>
        )}

        {/* Requisition & Usage Procedures */}
        <div className="bg-surface-low border border-slate-200 rounded-3xl p-8 lg:p-10 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold text-cyan-accent uppercase tracking-widest block font-sans">
              USAGE GUIDELINES
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-oxford">
              Sample Submission & Booking Procedures
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700 font-sans">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-accent/10 text-cyan-dark flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-bold text-oxford text-sm">Online Requisition</h3>
              <p className="text-slate-600 leading-relaxed">
                Download the official sample analysis form and submit requisition details online or at the instrument lab.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-accent/10 text-cyan-dark flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-bold text-oxford text-sm">Sample Preparation</h3>
              <p className="text-slate-600 leading-relaxed">
                Samples must be non-hazardous, dry, and properly packed according to specific instrument requirements.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-accent/10 text-cyan-dark flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-bold text-oxford text-sm">Payment & Result Collection</h3>
              <p className="text-slate-600 leading-relaxed">
                Fees payable via online CUSAT portal. Data reports emailed within 3-5 working days upon analysis completion.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 font-sans">
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <Clock className="w-4 h-4 text-cyan-accent" />
              <span>Facility Working Hours: Monday – Friday (9:30 AM – 4:30 PM)</span>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 bg-oxford text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow hover:bg-oxford-dark transition-colors"
            >
              <FileText className="w-4 h-4 text-cyan-accent" />
              <span>Download Requisition Form</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
