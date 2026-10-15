'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Trophy,
  Gift,
  FileText,
  ExternalLink,
} from 'lucide-react';

export interface AlumniAchievement {
  id: string;
  awardName: string;
  recipient: string;
  batch?: string | null;
  date: string;
  photo: string | null;
  desc: string;
}

export interface AlumniSponsoredProgram {
  id: string;
  programName: string;
  nature: string;
  date: string;
  photo: string | null;
  sponsor?: string | null;
  desc: string;
  proofUrl?: string | null;
  isRecurring: boolean;
}

interface AlumniShowcaseTabsProps {
  initialAchievements?: AlumniAchievement[];
  initialPrograms?: AlumniSponsoredProgram[];
}

export default function AlumniShowcaseTabs({
  initialAchievements = [],
  initialPrograms = [],
}: AlumniShowcaseTabsProps = {}) {
  const [activeTab, setActiveTab] = useState<'achievements' | 'programs'>('achievements');
  const [programFilter, setProgramFilter] = useState<'All' | 'Award' | 'Donation'>('All');

  if (initialAchievements.length === 0 && initialPrograms.length === 0) {
    return null;
  }

  const filteredPrograms = initialPrograms.filter((prog) => {
    if (programFilter === 'All') return true;
    return prog.nature === programFilter;
  });

  return (
    <section
      id="alumni-showcase"
      className="w-full py-16 sm:py-20 lg:py-24 bg-white border-t border-stone-200/80"
      aria-label="Alumni Achievements and Sponsored Programs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#002147] tracking-tight">
            Alumni Impact &amp; Recognition
          </h2>
          <p className="mt-3 text-base sm:text-lg text-stone-600 leading-relaxed">
            Celebrating global accolades earned by our alumni and philanthropic initiatives supporting department students and research.
          </p>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-12">
          <div className="inline-flex p-1.5 rounded-2xl bg-stone-100 border border-stone-200/90 shadow-inner">
            {/* Tab 1: Achievements & Awards */}
            <button
              type="button"
              id="tab-achievements"
              onClick={() => setActiveTab('achievements')}
              className={`inline-flex items-center gap-2.5 px-5 sm:px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#002147] ${
                activeTab === 'achievements'
                  ? 'bg-[#002147] text-white shadow-md'
                  : 'text-stone-600 hover:text-[#002147] hover:bg-stone-200/60'
              }`}
              aria-selected={activeTab === 'achievements'}
              role="tab"
            >
              <Trophy
                className={`w-4 h-4 ${
                  activeTab === 'achievements' ? 'text-cyan-300' : 'text-stone-500'
                }`}
              />
              <span>Achievements &amp; Awards</span>
              <span
                className={`ml-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  activeTab === 'achievements'
                    ? 'bg-white/20 text-white'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                {initialAchievements.length}
              </span>
            </button>

            {/* Tab 2: Sponsored Programs */}
            <button
              type="button"
              id="tab-programs"
              onClick={() => setActiveTab('programs')}
              className={`inline-flex items-center gap-2.5 px-5 sm:px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#002147] ${
                activeTab === 'programs'
                  ? 'bg-[#002147] text-white shadow-md'
                  : 'text-stone-600 hover:text-[#002147] hover:bg-stone-200/60'
              }`}
              aria-selected={activeTab === 'programs'}
              role="tab"
            >
              <Gift
                className={`w-4 h-4 ${
                  activeTab === 'programs' ? 'text-cyan-300' : 'text-stone-500'
                }`}
              />
              <span>Sponsored Programs</span>
              <span
                className={`ml-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  activeTab === 'programs'
                    ? 'bg-white/20 text-white'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                {initialPrograms.length}
              </span>
            </button>
          </div>

          {/* Sub-filter pills for Tab 2 (Sponsored Programs: All / Award / Donation) */}
          {activeTab === 'programs' && (
            <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-stone-100/90 border border-stone-200 text-xs">
              {(['All', 'Award', 'Donation'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setProgramFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    programFilter === filter
                      ? 'bg-white text-[#002147] shadow-xs border border-stone-200'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {filter === 'All' ? 'All Programs' : `${filter}s`}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* TAB 1 CONTENT: Alumni Achievements & Awards */}
        {activeTab === 'achievements' && (
          <div
            id="tabpanel-achievements"
            role="tabpanel"
            aria-labelledby="tab-achievements"
            className="animate-in fade-in duration-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {initialAchievements.map((item) => (
                <article
                  key={item.id}
                  className="group bg-white rounded-2xl border border-stone-200/90 hover:border-[#0284C7]/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Photo Container */}
                  <div className="relative h-60 sm:h-72 w-full bg-stone-100 overflow-hidden">
                    <Image
                      src={item.photo || '/campus.jpg'}
                      alt={item.awardName}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Recipient Overlay at bottom of photo */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                      {item.batch && (
                        <p className="text-xs font-medium text-cyan-200">
                          {item.batch}
                        </p>
                      )}
                      <h4 className="text-lg font-bold text-white drop-shadow-sm">
                        {item.recipient}
                      </h4>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Name of the Award/Achievement */}
                      <h3 className="text-xl font-bold text-[#002147] group-hover:text-[#0284C7] transition-colors leading-snug">
                        {item.awardName}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-stone-600 mt-3 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                      <span className="font-medium">
                        Conferred: <strong className="text-stone-800">{item.date}</strong>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2 CONTENT: Alumni Sponsored Programs */}
        {activeTab === 'programs' && (
          <div
            id="tabpanel-programs"
            role="tabpanel"
            aria-labelledby="tab-programs"
            className="animate-in fade-in duration-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {filteredPrograms.map((program) => (
                <article
                  key={program.id}
                  className="group bg-white rounded-2xl border border-stone-200/90 hover:border-[#0284C7]/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Photo Container */}
                  <div className="relative h-60 sm:h-72 w-full bg-stone-100 overflow-hidden">
                    <Image
                      src={program.photo || '/campus.jpg'}
                      alt={program.programName}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Sponsor Overlay at bottom of photo */}
                    {program.sponsor && (
                      <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                        <p className="text-xs font-medium text-cyan-200 drop-shadow-sm">
                          {program.sponsor}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Name of Program */}
                      <h3 className="text-xl font-bold text-[#002147] group-hover:text-[#0284C7] transition-colors leading-snug">
                        {program.programName}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-stone-600 mt-3 leading-relaxed">
                        {program.desc}
                      </p>
                    </div>

                    {/* Card Footer with Classification, Date, and Proof Download link */}
                    <div className="mt-5 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-stone-700">Type:</span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                            program.nature === 'Award'
                              ? 'bg-amber-50 text-amber-900 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                          }`}
                        >
                          {program.nature}
                        </span>
                        {program.isRecurring && (
                          <span className="font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[11px]">
                            Recurring
                          </span>
                        )}
                        <span className="text-stone-300">·</span>
                        <span className="font-medium text-stone-600">
                          {program.date}
                        </span>
                      </div>

                      {/* Proof Document Link */}
                      {program.proofUrl && (
                        <a
                          href={program.proofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-bold text-[#0284C7] hover:text-[#002147] hover:underline"
                          title="View Program Proof / Document"
                        >
                          <FileText className="w-3.5 h-3.5 text-cyan-600" />
                          <span>View Proof Document</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
