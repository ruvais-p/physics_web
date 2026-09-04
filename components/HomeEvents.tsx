'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

interface EventItem {
  id: number | string;
  title: string;
  description: string;
  image: string;
  date: string;
  venue?: string | null;
  apply_link?: string | null;
}

const FALLBACK_EVENTS: EventItem[] = [
  {
    id: 1,
    title: '15th Department Endowment & Memorial Oration Lecture',
    date: '2026-07-19',
    venue: 'Department Auditorium (Main Block)',
    description: 'Distinguished national physicists will speak on breakthroughs in low-temperature magnetics and topological insulators, followed by an interactive research panel.',
    image: '/eventssss.jpg',
  },
  {
    id: 2,
    title: 'Hands-On Workshop on FE-SEM & micro-Raman Spectroscopy',
    date: '2026-07-06',
    venue: 'Central Instrumentation Facility (CIF), CUSAT',
    description: 'A focused session on equipment slot bookings and instrumentation data analysis for regional researchers. Participants will receive hands-on training.',
    image: '/innovation-microscope.png',
  },
  {
    id: 3,
    title: 'National Seminar on Cosmology & Quantum Gravity (CQG-2026)',
    date: '2026-06-30',
    venue: 'Seminar Hall, Department of Physics',
    description: 'Presenting recent simulations and mathematical formulations on gravitational waves and cosmic expansions. Guest lectures by eminent scientists.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
  },
];

export default function HomeEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeEvents() {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setEvents(data);
          } else {
            setEvents(FALLBACK_EVENTS);
          }
        } else {
          setEvents(FALLBACK_EVENTS);
        }
      } catch (err) {
        console.error('Failed to fetch home page events:', err);
        setEvents(FALLBACK_EVENTS);
      } finally {
        setLoading(false);
      }
    }
    fetchHomeEvents();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs animate-pulse flex flex-col justify-between">
            <div>
              <div className="aspect-[16/9] w-full bg-slate-200" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="h-5 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-full" />
                <div className="h-3 bg-slate-200 rounded w-5/6" />
              </div>
            </div>
            <div className="p-6 pt-0 flex justify-between items-center">
              <div className="h-3 bg-slate-200 rounded w-1/4" />
              <div className="h-4 bg-slate-200 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const displayedEvents = events.slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {displayedEvents.map((ev) => {
        const d = new Date(ev.date);
        const isValidDate = !isNaN(d.getTime());
        const day = isValidDate ? d.getDate() : '--';
        const month = isValidDate ? d.toLocaleDateString('en-US', { month: 'short' }) : '---';
        const year = isValidDate ? d.getFullYear() : '----';
        const venueName = ev.venue || 'Department of Physics, CUSAT';

        return (
          <div
            key={ev.id}
            className="bg-white border border-slate-200/85 rounded-2xl shadow-xs overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Card Image Cover & Date Badge */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                {/* Date Badge */}
                <div className="absolute top-3 left-3 z-10 bg-cyan-accent text-white font-sans font-bold text-[10px] px-3 py-1.5 rounded-xl flex flex-col items-center justify-center text-center shadow-md">
                  <span className="text-base sm:text-lg leading-none font-extrabold">{day}</span>
                  <span className="text-[9px] uppercase tracking-wider leading-none mt-0.5">{month}</span>
                </div>

                <img
                  src={ev.image || '/eventssss.jpg'}
                  alt={ev.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-oxford/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Card Body Content */}
              <div className="p-6 space-y-3">
                {venueName && (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 font-sans">
                    <MapPin className="w-3.5 h-3.5 text-cyan-accent shrink-0" />
                    <span className="truncate">{venueName}</span>
                  </div>
                )}

                <h3 className="font-sans text-base sm:text-lg font-bold text-oxford leading-snug group-hover:text-cyan-accent transition-colors line-clamp-2">
                  {ev.title}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3 font-sans">
                  {ev.description}
                </p>
              </div>
            </div>

            {/* Card Footer Link */}
            <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 font-sans">{year}</span>
              <Link
                href={`/events/${ev.id}`}
                className="text-xs font-bold text-cyan-accent group-hover:text-cyan-dark uppercase tracking-wider inline-flex items-center gap-1 transition-colors"
              >
                <span>Event Details</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

