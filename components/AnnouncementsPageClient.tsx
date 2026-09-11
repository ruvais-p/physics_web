'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Bell, 
  ExternalLink, 
  Calendar, 
  Tag, 
  ArrowUpRight 
} from 'lucide-react';
import Hero from '@/components/Hero';

export interface AnnouncementItem {
  id: string;
  title: string;
  content?: string | null;
  category: string;
  link: string;
  date: string;
  rawDate?: string;
}

export default function AnnouncementsPageClient({
  announcements,
  heroData,
}: {
  announcements: AnnouncementItem[];
  heroData?: { title: string; subtitle: string; image: string };
}) {
  return (
    <div className="pb-24 relative min-h-screen bg-slate-50/50">
      {/* Hero Header */}
      <Hero
        title={heroData?.title || 'ANNOUNCEMENTS & NOTICES'}
        badge="HOME > ANNOUNCEMENTS"
        subtitle={heroData?.subtitle || 'Official circulars, examination schedules, academic notifications, and departmental announcements.'}
        bgImage={heroData?.image || '/campus.jpg'}
      />

      {/* Main Container */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-14">
        <div className="space-y-8">

          {/* Section Heading & Overview */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
            <div className="space-y-3">
              <div className="w-14 h-1 bg-cyan-accent rounded-full" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-oxford tracking-tight">
                Official Department Notices
              </h2>
              <p className="text-slate-600 max-w-2xl text-base sm:text-lg font-sans">
                Browse through all current circulars, academic notifications, admission bulletins, and administrative updates.
              </p>
            </div>

            {/* Total Count Badge */}
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200/80 px-4 py-2.5 rounded-xl shadow-xs self-start md:self-auto">
              <Bell className="w-4 h-4 text-cyan-accent" />
              <span>{announcements.length} {announcements.length === 1 ? 'Notice' : 'Notices'}</span>
            </div>
          </div>

          {/* Announcements List */}
          {announcements.length > 0 ? (
            <div className="space-y-4">
              {announcements.map((item, index) => {
                const hasValidLink = item.link && item.link !== '#' && item.link.trim() !== '';
                const isExternal = hasValidLink && (item.link.startsWith('http://') || item.link.startsWith('https://'));

                return (
                  <div
                    key={item.id || index}
                    className="bg-white border border-slate-200/80 hover:border-cyan-accent/50 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-2 flex-1">
                      {/* Meta Tags (Category & Date) */}
                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-50 border border-cyan-200/70 text-cyan-800 uppercase tracking-wider text-[11px] font-bold">
                          <Tag className="w-3 h-3 text-cyan-accent" />
                          <span>{item.category || 'General'}</span>
                        </span>

                        <span className="inline-flex items-center gap-1.5 text-slate-500 font-mono text-[12px]">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.date}</span>
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-bold text-oxford group-hover:text-cyan-accent transition-colors leading-snug">
                        {item.title}
                      </h3>

                      {/* Content / Snippet if available */}
                      {item.content && (
                        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl line-clamp-2">
                          {item.content}
                        </p>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0 w-full sm:w-auto pt-2 sm:pt-0">
                      {hasValidLink ? (
                        <a
                          href={item.link}
                          target={isExternal ? '_blank' : '_self'}
                          rel={isExternal ? 'noopener noreferrer' : undefined}
                          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-oxford hover:bg-cyan-accent text-white text-xs font-bold transition-all duration-200 shadow-xs group-hover:shadow-md cursor-pointer"
                        >
                          <span>View Notice</span>
                          {isExternal ? (
                            <ExternalLink className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          )}
                        </a>
                      ) : (
                        <span className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-500 text-xs font-semibold">
                          <span>Notice Published</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Bell className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-800">No announcements found</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  There are currently no active announcements in the department database.
                </p>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
