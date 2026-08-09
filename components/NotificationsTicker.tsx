'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  category: string;
  link: string;
  date: string;
}

const DUMMY_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Admissions 2026: Online registration for Integrated M.Sc. and M.Sc. Physics programs is open.',
    category: 'Admission',
    link: '/courses',
    date: 'Aug 10, 2026',
  },
  {
    id: 'notif-2',
    title: 'National Symposium on Quantum Materials & Device Physics (NSQMDP-2026) scheduled for Oct 12-14.',
    category: 'Event',
    link: '#',
    date: 'Aug 08, 2026',
  },
  {
    id: 'notif-3',
    title: 'Ph.D. Interview List: Autumn Semester 2026 shortlist and schedule have been published.',
    category: 'Research',
    link: '#',
    date: 'Aug 05, 2026',
  },
  {
    id: 'notif-4',
    title: 'Special Lecture: Prof. Suresh (IISc) on "Topological Phase Transitions in Modern Insulators" on Aug 18.',
    category: 'Colloquium',
    link: '#',
    date: 'Aug 02, 2026',
  },
  {
    id: 'notif-5',
    title: 'Instrumentation Update: The newly installed FE-SEM system in the CIF is now open for slot booking.',
    category: 'Facility',
    link: '/facilities',
    date: 'Jul 28, 2026',
  },
];

export default function NotificationsTicker() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch('/api/notifications');
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (err) {
        console.error('Failed to fetch announcements from DB:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <section className="w-full relative z-20">
        <div className="w-full bg-white border-y border-slate-200/80 shadow-md px-6 sm:px-12 lg:px-16 py-3.5 sm:py-4 flex items-center gap-4 overflow-hidden">
          <div className="flex items-center space-x-2 shrink-0 bg-heritage-red/10 border border-heritage-red/20 px-3 py-1.5 rounded-lg text-heritage-red z-10 shadow-sm animate-pulse">
            <Bell className="w-4 h-4 text-heritage-red" />
            <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap font-sans">
              Announcements
            </span>
          </div>
          <div className="text-slate-400 text-xs font-sans animate-pulse">
            Loading latest department announcements...
          </div>
        </div>
      </section>
    );
  }

  const activeList = notifications.length > 0 ? notifications : DUMMY_NOTIFICATIONS;

  // Ensure enough items for seamless infinite marquee animation
  const repeatedList = activeList.length < 5
    ? [...activeList, ...activeList, ...activeList, ...activeList]
    : [...activeList, ...activeList];

  return (
    <section className="w-full relative z-20">
      <div className="w-full bg-white border-y border-slate-200/80 shadow-md px-6 sm:px-12 lg:px-16 py-3.5 sm:py-4 flex items-center gap-4 overflow-hidden">
        {/* Badge */}
        <div className="flex items-center space-x-2 shrink-0 bg-heritage-red border border-heritage-red px-3.5 py-2 rounded-lg text-white z-10 shadow-md animate-pulse">
          <Bell className="w-4 h-4 text-white fill-white/20 animate-bounce" />
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider whitespace-nowrap font-sans">
            Announcements
          </span>
        </div>

        {/* Running Continuous Marquee Ticker */}
        <div className="overflow-hidden whitespace-nowrap flex-1 py-1 relative">
          <div className="animate-marquee inline-flex space-x-16 items-center text-slate-800 font-sans text-base">
            {repeatedList.map((item, idx) => (
              <Link
                key={`notif-${item.id}-${idx}`}
                href={item.link || '#'}
                className="hover:text-cyan-accent transition-colors duration-200 flex items-center space-x-3 group"
              >
                <span className="bg-sky-50 text-sky-800 text-[11px] sm:text-[12px] font-extrabold px-3 py-1 rounded-md border border-sky-200 font-sans tracking-wide uppercase shrink-0">
                  {item.category}
                </span>
                <span className="group-hover:underline text-[15px] sm:text-[16px] font-semibold leading-none tracking-wide text-slate-800">
                  {item.title}
                </span>
                <span className="text-slate-500 text-[12px] sm:text-[13px] font-mono shrink-0">({item.date})</span>
                <span className="text-slate-300 font-bold ml-6 shrink-0 select-none">✦</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


