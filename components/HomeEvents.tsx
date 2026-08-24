'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

interface EventItem {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  venue?: string | null;
  apply_link?: string | null;
}

export default function HomeEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeEvents() {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data: EventItem[] = await res.json();
          setEvents(data);
        }
      } catch (err) {
        console.error('Failed to fetch home page events:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHomeEvents();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 items-start animate-pulse">
            <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 bg-slate-200 rounded-xl" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
        <Calendar className="w-8 h-8 mx-auto text-slate-400" />
        <p className="text-xs sm:text-sm font-semibold text-slate-700">No events scheduled at the moment</p>
        <p className="text-[11px] text-slate-500 font-sans">Check back soon for department seminars and workshops.</p>
      </div>
    );
  }

  // Display top 3 latest events on the homepage
  const displayedEvents = events.slice(0, 3);

  return (
    <div className="space-y-6">
      {displayedEvents.map((ev) => {
        const d = new Date(ev.date);
        const isValidDate = !isNaN(d.getTime());
        const day = isValidDate ? d.getDate() : '--';
        const month = isValidDate ? d.toLocaleDateString('en-US', { month: 'short' }) : '---';
        const year = isValidDate ? d.getFullYear() : '----';
        const venueName = ev.venue || 'Department Auditorium, CUSAT';

        return (
          <div key={ev.id} className="flex gap-4 items-start group">
            {/* Date Badge */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 bg-cyan-accent text-white rounded-xl flex flex-col items-center justify-center text-center p-1.5 shadow-xs font-sans font-bold group-hover:bg-cyan-dark transition-colors duration-200">
              <span className="text-sm sm:text-base leading-none">{day}</span>
              <span className="text-[9px] uppercase tracking-wider leading-none mt-0.5">{month}</span>
              <span className="text-[8px] font-medium leading-none mt-0.5">{year}</span>
            </div>

            {/* Event Details */}
            <div className="space-y-1 flex-1">
              <Link
                href={`/events/${ev.id}`}
                className="font-sans text-sm sm:text-base font-bold text-cyan-accent hover:text-cyan-dark leading-snug block transition-colors line-clamp-2"
              >
                {ev.title}
              </Link>
              
              {venueName && (
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 font-sans">
                  <MapPin className="w-3 h-3 text-cyan-accent shrink-0" />
                  <span className="truncate">{venueName}</span>
                </div>
              )}

              <p className="text-slate-600 text-xs sm:text-sm leading-normal line-clamp-2">
                {ev.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
