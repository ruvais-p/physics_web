'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

export interface HomeEventItem {
  id: number | string;
  title: string;
  description: string;
  image: string;
  date: string;
  venue?: string | null;
  apply_link?: string | null;
}

export default function HomeEvents({ events }: { events: HomeEventItem[] }) {
  const [expandedIds, setExpandedIds] = useState<Record<string | number, boolean>>({});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
      {events.map((ev) => {
        const d = new Date(ev.date);
        const isValidDate = !isNaN(d.getTime());
        const formattedDate = isValidDate
          ? d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
          : null;
        const venueName = ev.venue || 'Department of Physics, CUSAT';
        const isExpanded = !!expandedIds[ev.id];
        const isLongDesc = (ev.description?.trim().length ?? 0) > 100;

        return (
          <div key={ev.id} className="space-y-4 group flex flex-col justify-between">
            {/* The Image Card */}
            <Link
              href={`/events/${ev.id}`}
              className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col justify-end p-5 border border-slate-200/80 bg-slate-900 cursor-pointer block"
            >
              {/* Full Background Image */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={ev.image || '/eventssss.jpg'}
                  alt={ev.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Gradient Overlay for Text Legibility */}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/45 to-transparent group-hover:from-black/95 group-hover:via-black/55 transition-colors duration-500" />

              {/* Title on top of Image */}
              <div className="relative z-20">
                <h3 className="text-lg sm:text-xl font-bold text-white leading-snug group-hover:text-cyan-accent transition-colors duration-200 line-clamp-2 drop-shadow-md">
                  {ev.title}
                </h3>
              </div>
            </Link>

            {/* Below the Card: Date, Location, Register, Description, Read More toggle */}
            <div className="space-y-2.5 px-1">
              {/* Meta block: Date and Location tight grouping */}
              <div className="space-y-0.5">
                {/* Date & Register Link Row */}
                <div className="flex items-center justify-between gap-3">
                  {formattedDate && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-accent">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>{formattedDate}</span>
                    </div>
                  )}

                  {ev.apply_link && (
                    <a
                      href={ev.apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-cyan-accent hover:bg-cyan-dark px-3 py-1 rounded-full uppercase tracking-wider transition-colors shadow-xs"
                    >
                      <span>Register</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Location / Venue below the Date */}
                {venueName && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-accent">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{venueName}</span>
                  </div>
                )}
              </div>

              {/* Expandable Description */}
              {ev.description && (
                <div className="space-y-1.5">
                  <p
                    className={`text-slate-600 text-xs sm:text-sm leading-relaxed font-normal transition-all duration-300 ${
                      isExpanded || !isLongDesc ? '' : 'line-clamp-2'
                    }`}
                  >
                    {ev.description}
                  </p>

                  {/* Inline Read More / Show Less Toggle Button (Only if description is long) */}
                  {isLongDesc && (
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedIds((prev) => ({
                          ...prev,
                          [ev.id]: !prev[ev.id],
                        }))
                      }
                      className="inline-flex items-center gap-1 text-xs font-bold text-cyan-accent hover:text-cyan-dark uppercase tracking-wider transition-colors pt-0.5 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Show Less' : 'Read More'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
