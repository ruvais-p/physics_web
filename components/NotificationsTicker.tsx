'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  category: string;
  link: string;
  isActive: boolean;
  date: string;
}

export default function NotificationsTicker() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await fetch('/api/notifications');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setItems(data);
          }
        }
      } catch (err) {
        console.error('Error loading running notifications:', err);
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, []);

  if (loading || items.length === 0) {
    return null;
  }

  return (
    <section className="w-full relative z-20">
      <div className="w-full bg-white border-y border-slate-200/80 shadow-lg px-6 sm:px-12 lg:px-16 py-3.5 sm:py-4 flex items-center gap-4 overflow-hidden">
        {/* Badge */}
        <div className="flex items-center space-x-2 shrink-0 bg-heritage-red/10 border border-heritage-red/20 px-3 py-1.5 rounded-lg text-heritage-red z-10">
          <Bell className="w-4 h-4 animate-bounce" />
          <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap">
            Announcements
          </span>
        </div>

        {/* Running Continuous Marquee Ticker */}
        <div className="overflow-hidden whitespace-nowrap flex-1 py-1 relative">
          <div className="animate-marquee inline-flex space-x-10 items-center text-slate-800 font-medium text-sm">
            {items.map((item, idx) => (
              <Link
                key={`notif-${item.id || idx}`}
                href={item.link || '#'}
                className="hover:text-cyan-accent transition-colors flex items-center space-x-2 group"
              >
                <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded border border-sky-300">
                  {item.date}
                </span>
                <span className="group-hover:underline">{item.title}</span>
                <span className="text-slate-300 font-bold ml-4">✦</span>
              </Link>
            ))}

            {/* Duplicate array for seamless infinite looping */}
            {items.map((item, idx) => (
              <Link
                key={`dup-${item.id || idx}`}
                href={item.link || '#'}
                className="hover:text-cyan-accent transition-colors flex items-center space-x-2 group"
              >
                <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded border border-sky-300">
                  {item.date}
                </span>
                <span className="group-hover:underline">{item.title}</span>
                <span className="text-slate-300 font-bold ml-4">✦</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
