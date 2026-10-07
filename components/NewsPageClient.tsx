'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Trophy,
  Newspaper,
  ArrowUpRight,
} from 'lucide-react';
import Hero from '@/components/Hero';

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  day: string;
  month: string;
  year: string;
  image: string;
  desc: string;
  link?: string | null;
}

export interface AwardItem {
  id: string;
  title: string;
  date: string;
  year: string;
  image?: string | null;
  description: string;
  link?: string | null;
}

interface NewsPageClientProps {
  news: NewsItem[];
  awards: AwardItem[];
  heroData: {
    title: string;
    subtitle: string;
    image: string;
  };
}

export default function NewsPageClient({
  news,
  awards,
  heroData,
}: NewsPageClientProps) {
  const [activeTab, setActiveTab] = useState<'news' | 'awards'>('news');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('award')) {
        setActiveTab('awards');
      } else if (hash.includes('news')) {
        setActiveTab('news');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    const interval = setInterval(handleHashChange, 200);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      clearInterval(interval);
    };
  }, []);

  const handleTabClick = (tab: 'news' | 'awards') => {
    setActiveTab(tab);
    window.history.pushState(null, '', `#${tab}`);
  };

  return (
    <div className="pb-24 relative bg-slate-50/50 font-sans">
      {/* Hero Header */}
      <Hero
        title={heroData.title}
        badge="HOME > NEWS"
        subtitle={heroData.subtitle}
        bgImage={heroData.image}
      />

      {/* Tab Selector Bar - Matching programs page aesthetic */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center pt-6">
        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-xl border border-cyan-accent/30 shadow-lg rounded-2xl sm:rounded-3xl">
          <button
            type="button"
            onClick={() => handleTabClick('news')}
            className={`px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold tracking-wide transition-all duration-300 cursor-pointer ${activeTab === 'news'
              ? 'bg-cyan-accent text-white shadow-md'
              : 'text-oxford hover:text-cyan-accent hover:bg-slate-50'
              }`}
          >
            News
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('awards')}
            className={`px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold tracking-wide transition-all duration-300 cursor-pointer ${activeTab === 'awards'
              ? 'bg-cyan-accent text-white shadow-md'
              : 'text-oxford hover:text-cyan-accent hover:bg-slate-50'
              }`}
          >
            Awards
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-12">
        {/* ------------------------------------------------------------- */}
        {/* TAB 1: NEWS & MEDIA HIGHLIGHTS                                */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'news' && (
          <section className="space-y-10 animate-fadeIn">
            {/* Section Header */}
            <div className="space-y-3 pb-6 border-b border-slate-200">
              <div className="w-14 h-1 bg-cyan-accent rounded-full" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-oxford tracking-tight">
                News &amp; Media Highlights
              </h2>

            </div>

            {/* News Cards Grid */}
            {news.length === 0 ? (
              <div className="py-20 text-center space-y-3 text-slate-500 font-sans bg-white rounded-2xl border border-slate-200">
                <Newspaper className="w-10 h-10 mx-auto text-slate-400" />
                <p className="text-base font-semibold text-slate-800">
                  No news articles available at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                {news.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200/85 rounded-3xl shadow-xs overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-0">
                      {/* Image and Date container */}
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                        {/* Date Badge */}
                        <div className="absolute top-4 left-4 z-10 bg-oxford/90 backdrop-blur-md text-white font-sans font-bold text-xs px-3.5 py-2 rounded-xl flex flex-col items-center justify-center text-center shadow-lg border border-white/15">
                          <span className="text-base leading-none text-cyan-accent">{item.day}</span>
                          <span className="text-[10px] uppercase tracking-wider leading-none mt-0.5">{item.month}</span>
                          <span className="text-[9px] font-medium leading-none mt-0.5 text-slate-300">{item.year}</span>
                        </div>

                        <Image
                          src={item.image || '/cusat-building.png'}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>

                      {/* Text Container */}
                      <div className="p-6 sm:p-8 space-y-3">
                        <h3 className="font-sans text-lg sm:text-xl font-bold text-oxford leading-snug group-hover:text-cyan-accent transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed text-justify font-sans">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    {/* Footer link */}
                    <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0">
                      <div className="w-full h-px bg-slate-100 mb-4" />
                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm font-bold text-cyan-accent group-hover:text-cyan-dark uppercase tracking-wider transition-colors inline-flex items-center gap-1 hover:underline"
                        >
                          <span>Read Full Story / Link</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider inline-flex items-center gap-1">
                          <span>Department Headline</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: AWARDS & HONORS                                        */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'awards' && (
          <section className="space-y-10 animate-fadeIn">
            {/* Section Header */}
            <div className="space-y-3 pb-6 border-b border-slate-200">
              <div className="w-14 h-1 bg-cyan-accent rounded-full" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-oxford tracking-tight">
                Awards &amp; Accolades
              </h2>
            </div>

            {/* Awards Cards Grid */}
            {awards.length === 0 ? (
              <div className="py-20 text-center space-y-3 text-slate-500 font-sans bg-white rounded-2xl border border-slate-200">
                <Trophy className="w-10 h-10 mx-auto text-slate-400" />
                <p className="text-base font-semibold text-slate-800">
                  No honors or awards recorded yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                {awards.map((award) => (
                  <div
                    key={award.id}
                    className="bg-white border border-slate-200/85 rounded-3xl shadow-xs overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-0">
                      {/* Image container without date */}
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                        <Image
                          src={award.image || '/cusat-building.png'}
                          alt={award.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>

                      {/* Text Container */}
                      <div className="p-6 sm:p-8 space-y-3">
                        <h3 className="font-sans text-lg sm:text-xl font-bold text-oxford leading-snug group-hover:text-cyan-accent transition-colors line-clamp-2">
                          {award.title}
                        </h3>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed text-justify font-sans">
                          {award.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer link */}
                    <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0">
                      <div className="w-full h-px bg-slate-100 mb-4" />
                      {award.link ? (
                        <a
                          href={award.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm font-bold text-cyan-accent group-hover:text-cyan-dark uppercase tracking-wider transition-colors inline-flex items-center gap-1 hover:underline"
                        >
                          <span>Read Full Story / Link</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider inline-flex items-center gap-1">
                          <span>Department Distinction</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
