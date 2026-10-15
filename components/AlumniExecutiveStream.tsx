'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export interface AlumniExecutiveMember {
  id: string;
  name: string;
  role: string;
  batch?: string | null;
  image: string | null;
  badgeColor?: {
    bg: string;
    text: string;
    border: string;
  };
}

export function getRoleBadgeStyle(role: string) {
  const r = role.toLowerCase();
  if (r.includes('patron')) {
    return {
      bg: 'bg-amber-100/95',
      text: 'text-amber-950',
      border: 'border-amber-300',
    };
  }
  if (r.includes('president') && !r.includes('vice')) {
    return {
      bg: 'bg-[#002147]/95',
      text: 'text-white',
      border: 'border-cyan-400/40',
    };
  }
  if (r.includes('vice president')) {
    return {
      bg: 'bg-teal-100/95',
      text: 'text-teal-950',
      border: 'border-teal-300',
    };
  }
  if (r.includes('general secretary') || (r.includes('secretary') && !r.includes('joint'))) {
    return {
      bg: 'bg-sky-100/95',
      text: 'text-sky-950',
      border: 'border-sky-300',
    };
  }
  if (r.includes('joint secretary')) {
    return {
      bg: 'bg-indigo-100/95',
      text: 'text-indigo-950',
      border: 'border-indigo-300',
    };
  }
  if (r.includes('treasurer')) {
    return {
      bg: 'bg-emerald-100/95',
      text: 'text-emerald-950',
      border: 'border-emerald-300',
    };
  }
  return {
    bg: 'bg-slate-100/95',
    text: 'text-slate-900',
    border: 'border-slate-300',
  };
}

export const ALUMNI_EXECUTIVE_MEMBERS: AlumniExecutiveMember[] = [
  {
    id: 'exec-1',
    name: 'Prof. (Dr.) M. R. Anantharaman',
    role: 'Patron & Chief Advisor',
    batch: 'Distinguished Faculty & Former HoD',
    image: '/alumni/anantharaman.jpg',
    badgeColor: {
      bg: 'bg-amber-100/95',
      text: 'text-amber-950',
      border: 'border-amber-300',
    },
  },
  {
    id: 'exec-2',
    name: 'Dr. S. Prasanth',
    role: 'President',
    batch: 'Class of 1998 · M.Sc. & Ph.D.',
    image: '/alumni/prasanth.jpg',
    badgeColor: {
      bg: 'bg-[#002147]/95',
      text: 'text-white',
      border: 'border-cyan-400/40',
    },
  },
  {
    id: 'exec-3',
    name: 'Dr. Lakshmi K. Menon',
    role: 'Vice President',
    batch: 'Class of 2004 · M.Sc. Physics',
    image: '/alumni/lakshmi.jpg',
    badgeColor: {
      bg: 'bg-teal-100/95',
      text: 'text-teal-950',
      border: 'border-teal-300',
    },
  },
  {
    id: 'exec-4',
    name: 'Dr. Anandhu R. Nair',
    role: 'General Secretary',
    batch: 'Class of 2018 · Ph.D.',
    image: '/alumni/anandhu.jpg',
    badgeColor: {
      bg: 'bg-sky-100/95',
      text: 'text-sky-950',
      border: 'border-sky-300',
    },
  },
  {
    id: 'exec-5',
    name: 'Dr. Priya S. Warrier',
    role: 'Joint Secretary',
    batch: 'Class of 2015 · M.Sc. Physics',
    image: '/alumni/priya.jpg',
    badgeColor: {
      bg: 'bg-indigo-100/95',
      text: 'text-indigo-950',
      border: 'border-indigo-300',
    },
  },
  {
    id: 'exec-6',
    name: 'Prof. Rajesh K. Menon',
    role: 'Treasurer',
    batch: 'Class of 2012 · Ph.D.',
    image: '/alumni/rajesh.jpg',
    badgeColor: {
      bg: 'bg-emerald-100/95',
      text: 'text-emerald-950',
      border: 'border-emerald-300',
    },
  },
];

interface AlumniExecutiveStreamProps {
  initialExecutives?: AlumniExecutiveMember[];
}

export default function AlumniExecutiveStream({
  initialExecutives,
}: AlumniExecutiveStreamProps = {}) {
  const [isPaused, setIsPaused] = useState(false);

  const membersList =
    initialExecutives && initialExecutives.length > 0
      ? initialExecutives
      : ALUMNI_EXECUTIVE_MEMBERS;

  // Duplicate items for a seamless, gap-free infinite horizontal scroll
  const duplicatedMembers = [
    ...membersList,
    ...membersList,
    ...membersList,
  ];

  return (
    <section
      id="alumni-executive-members"
      className="w-full py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-[#faf7f2] via-white to-[#faf7f2] overflow-hidden"
      aria-label="Alumni Association Executive Committee"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#002147] tracking-tight">
            Executive Committee Members
          </h2>
        </div>
      </div>

      {/* Full-bleed Horizontal Auto-Moving Track with Left/Right Gradient Fades */}
      <div className="relative w-full overflow-hidden py-2">
        {/* Left Gradient Fade Mask */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 lg:w-40 bg-gradient-to-r from-[#faf7f2] via-[#faf7f2]/80 to-transparent z-20"
          aria-hidden="true"
        />

        {/* Right Gradient Fade Mask */}
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 lg:w-40 bg-gradient-to-l from-[#faf7f2] via-[#faf7f2]/80 to-transparent z-20"
          aria-hidden="true"
        />

        {/* Horizontal Marquee Container */}
        <div
          className="cursor-pointer overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="animate-horizontal-marquee flex items-stretch gap-6 sm:gap-8 px-4"
            style={{
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          >
            {duplicatedMembers.map((member, idx) => {
              const badge = member.badgeColor || getRoleBadgeStyle(member.role);
              const photoSrc = member.image || '/avatar-placeholder.png';
              return (
                <article
                  key={`${member.id}-${idx}`}
                  className="group w-[280px] sm:w-[320px] shrink-0 bg-white rounded-2xl border border-stone-200/90 hover:border-[#0284C7]/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Photo Header */}
                  <div className="relative h-64 sm:h-72 w-full bg-stone-100 overflow-hidden">
                    <Image
                      src={photoSrc}
                      alt={`Photo of ${member.name}, ${member.role}`}
                      fill
                      sizes="(max-width: 640px) 280px, 320px"
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      priority={idx < 3}
                    />
                    {/* Subtle Gradient Overlay on Photo Bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Position Badge positioned on image */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        {member.role}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-center">
                    <div>
                      {member.batch && (
                        <p className="text-xs font-semibold text-[#0284C7] mb-1">
                          {member.batch}
                        </p>
                      )}
                      <h3 className="text-lg sm:text-xl font-bold text-[#002147] group-hover:text-[#0284C7] transition-colors leading-snug">
                        {member.name}
                      </h3>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
