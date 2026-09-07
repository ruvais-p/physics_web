'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Hero from '@/components/Hero';
import LabCard, { ResearchLabItem } from '@/components/LabCard';
import PublicationsTable from '@/components/PublicationsTable';
import FacilityCard, { FacilityItem } from '@/components/FacilityCard';
import { RESEARCH_LABS, PUBLICATIONS, FACILITIES, Publication } from '@/lib/data';
import { RefreshCw, FlaskConical, Search, BookOpen, Wrench, ExternalLink } from 'lucide-react';

export default function ResearchPage() {
  const [activeTab, setActiveTab] = useState<'labs' | 'publications' | 'facilities'>('labs');
  const [labs, setLabs] = useState<ResearchLabItem[]>([]);
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Publications search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');

  useEffect(() => {
    async function loadResearchData() {
      setLoading(true);

      // 1. Load Labs
      try {
        const res = await fetch('/api/research');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setLabs(data);
          } else {
            setLabs(RESEARCH_LABS);
          }
        } else {
          setLabs(RESEARCH_LABS);
        }
      } catch (err) {
        console.error('Failed to load dynamic research labs:', err);
        setLabs(RESEARCH_LABS);
      }

      // 2. Load Facilities
      try {
        const fRes = await fetch('/api/facilities');
        if (fRes.ok) {
          const fData = await fRes.json();
          if (Array.isArray(fData) && fData.length > 0) {
            setFacilities(fData);
          } else {
            setFacilities(FACILITIES);
          }
        } else {
          setFacilities(FACILITIES);
        }
      } catch (err) {
        console.error('Failed to load dynamic facilities:', err);
        setFacilities(FACILITIES);
      }

      setLoading(false);
    }

    loadResearchData();
  }, []);

  // Sync tab with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (!hash) return;
      if (hash.includes('publication')) {
        setActiveTab('publications');
      } else if (hash.includes('facility') || hash.includes('facilities') || hash.includes('central')) {
        setActiveTab('facilities');
      } else if (hash.includes('lab')) {
        setActiveTab('labs');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabClick = (tab: 'labs' | 'publications' | 'facilities') => {
    setActiveTab(tab);
    window.history.pushState(null, '', `#${tab}`);
  };

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

  return (
    <div className="space-y-0 pb-20 relative font-sans">
      {/* Hero Header matching main homepage design */}
      <Hero
        title="RESEARCH & INNOVATION"
        badge="HOME > RESEARCH"
        subtitle="Exploring fundamental physics and developing innovative nanomaterial solutions for global challenges."
        bgImage="/physics.png"
      />

      {/* Tab Selector Bar - Glassmorphic Pill Tab matching courses page */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center pt-8">
        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-xl border border-cyan-accent/30 shadow-lg rounded-2xl sm:rounded-3xl">
          <button
            onClick={() => handleTabClick('labs')}
            className={`px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold tracking-wide transition-all duration-300 cursor-pointer ${activeTab === 'labs'
                ? 'bg-cyan-accent text-white shadow-md'
                : 'text-oxford hover:text-cyan-accent hover:bg-slate-50'
              }`}
          >
            Research Laboratories
          </button>
          <Link
            href="/projects"
            className="px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold tracking-wide transition-all duration-300 text-oxford hover:text-cyan-accent hover:bg-slate-50 cursor-pointer"
          >
            Projects &amp; Grants
          </Link>
          <button
            onClick={() => handleTabClick('publications')}
            className={`px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold tracking-wide transition-all duration-300 cursor-pointer ${activeTab === 'publications'
                ? 'bg-cyan-accent text-white shadow-md'
                : 'text-oxford hover:text-cyan-accent hover:bg-slate-50'
              }`}
          >
            Publications
          </button>
          <button
            onClick={() => handleTabClick('facilities')}
            className={`px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold tracking-wide transition-all duration-300 cursor-pointer ${activeTab === 'facilities'
                ? 'bg-cyan-accent text-white shadow-md'
                : 'text-oxford hover:text-cyan-accent hover:bg-slate-50'
              }`}
          >
            Central Facilities
          </button>
        </div>
      </div>

      {/* 1. Research Laboratories Tab */}
      {activeTab === 'labs' && (
        <section id="labs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-10 font-sans">
          <div className="text-center space-y-3">
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
      )}

      {/* 2. Publications Tab */}
      {activeTab === 'publications' && (
        <section id="publications" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-10 font-sans">
          <div className="text-center space-y-3">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1E36]">
              Department Publications
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
              Peer-reviewed research articles, high-impact letters, and conference proceedings authored by our faculty and scholars.
            </p>
          </div>

          {/* Search Bar with Search Button */}
          <div className="max-w-2xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmittedQuery(searchQuery);
              }}
              className="flex items-center gap-2 bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-sm focus-within:border-cyan-accent focus-within:ring-2 focus-within:ring-cyan-accent/20 transition-all"
            >
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="publications-search-input"
                  type="text"
                  placeholder="Search by title, author, journal, or year..."
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
                  onClick={() => {
                    setSearchQuery('');
                    setSubmittedQuery('');
                  }}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-2 py-1 cursor-pointer transition-colors"
                >
                  Clear
                </button>
              )}

              <button
                type="submit"
                className="px-5 py-2.5 bg-oxford hover:bg-cyan-900 text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5 shrink-0 hover:shadow-md"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </form>
          </div>

          {/* Publications Table */}
          <PublicationsTable
            publications={filteredPublications}
            emptyMessage="No publications found matching your query."
          />
        </section>
      )}


      {/* 3. Central Facilities Tab */}
      {activeTab === 'facilities' && (
        <section id="facilities" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-10 font-sans">
          <div className="text-center space-y-3">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1E36]">
              Central Instrumentation Facilities
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
              Advanced analytical instrumentation including FE-SEM, XRD Diffractometer, Spectrophotometers, and Magnetron Sputterers.
            </p>
          </div>

          {/* Facilities Grid */}
          {loading ? (
            <div className="py-20 text-center space-y-3 text-slate-500 font-sans">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-cyan-600" />
              <p className="text-sm font-medium">Loading central facilities...</p>
            </div>
          ) : facilities.length === 0 ? (
            <div className="py-20 text-center space-y-3 text-slate-500 font-sans bg-white rounded-2xl border border-slate-200">
              <Wrench className="w-10 h-10 mx-auto text-slate-400" />
              <p className="text-base font-semibold text-slate-800">No central facilities found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {facilities.map((fac) => (
                <FacilityCard key={fac.id} facility={fac} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
