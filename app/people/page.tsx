'use client';

import { useState } from 'react';
import FacultyCard from '@/components/FacultyCard';
import { FACULTY_MEMBERS, SCHOLARS } from '@/lib/data';
import { Search, UserCheck, GraduationCap } from 'lucide-react';

export default function PeoplePage() {
  const [activeTab, setActiveTab] = useState<'faculty' | 'scholars'>('faculty');
  const [searchQuery, setSearchQuery] = useState('');

  const currentList = activeTab === 'faculty' ? FACULTY_MEMBERS : SCHOLARS;

  const filteredList = currentList.filter((person) => {
    const q = searchQuery.toLowerCase();
    const nameMatch = person.name.toLowerCase().includes(q);
    const emailMatch = person.email.toLowerCase().includes(q);
    const topicMatch =
      person.type === 'faculty'
        ? (person as any).researchFocus.some((f: string) => f.toLowerCase().includes(q))
        : (person as any).topic.toLowerCase().includes(q);
    return nameMatch || emailMatch || topicMatch;
  });

  return (
    <div className="space-y-12 pb-20">
      
      {/* Page Header (No Hero image, clean text block) */}
      <div className="-mt-[84px] sm:-mt-[96px] bg-slate-50 border-b border-slate-200/80 pt-36 sm:pt-44 pb-12 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 pt-4">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-cyan-accent">
            People & Academics
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-oxford">
            Faculty & Research Scholars
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed font-sans">
            Meet the distinguished professors, scientists, and PhD scholars driving scientific research across experimental and theoretical physics.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          
          {/* Option Buttons: Faculty vs Scholars */}
          <div className="flex items-center space-x-2 bg-surface-low p-1.5 rounded-lg border border-slate-200 w-full md:w-auto font-sans">
            <button
              id="tab-faculty-btn"
              onClick={() => setActiveTab('faculty')}
              className={`flex-1 md:flex-initial flex items-center justify-center space-x-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-all ${
                activeTab === 'faculty'
                  ? 'bg-oxford text-white shadow-sm'
                  : 'text-slate-600 hover:text-oxford hover:bg-slate-100'
              }`}
            >
              <UserCheck className="w-4 h-4 text-cyan-accent" />
              <span>Faculty Members ({FACULTY_MEMBERS.length})</span>
            </button>

            <button
              id="tab-scholars-btn"
              onClick={() => setActiveTab('scholars')}
              className={`flex-1 md:flex-initial flex items-center justify-center space-x-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-all ${
                activeTab === 'scholars'
                  ? 'bg-oxford text-white shadow-sm'
                  : 'text-slate-600 hover:text-oxford hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-cyan-accent" />
              <span>Research Scholars ({SCHOLARS.length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 font-sans">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="people-search-input"
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-accent/50 text-slate-800"
            />
          </div>

        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
          {filteredList.length > 0 ? (
            filteredList.map((person) => (
              <FacultyCard key={person.id} person={person} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500">
              No matching records found for "{searchQuery}".
            </div>
          )}
        </div>

      </section>

    </div>
  );
}
