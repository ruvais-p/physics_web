'use client';

import React from 'react';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';
import type { StaffMember } from '@/lib/data';

interface StaffCardProps {
  person: StaffMember;
}

export default function StaffCard({ person }: StaffCardProps) {
  return (
    <div className="render-lazy group staff-member-card flex flex-col h-full space-y-3 font-sans transition-all duration-300">
      {/* Top Image */}
      <div className="relative w-full aspect-square overflow-hidden rounded-3xl bg-slate-50 border border-slate-100/80 shadow-sm">
        <Image
          src={person.image || '/faculty.png'}
          alt={person.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Card Details Body */}
      <div className="flex-1 flex flex-col items-start text-left pt-1 space-y-1.5 w-full">
        {/* Name */}
        <h3 className="text-lg sm:text-xl font-bold text-oxford transition-colors leading-snug group-hover:text-cyan-dark">
          {person.name}
        </h3>

        {/* Designation */}
        <p className="text-sm sm:text-base font-semibold text-cyan-accent leading-snug">
          {person.designation}
        </p>

        {/* Room / Office Location */}
        {person.room && (
          <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5 pt-0.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{person.room}</span>
          </p>
        )}

        {/* Email */}
        {person.email && (
          <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <a
              href={`mailto:${person.email}`}
              className="text-cyan-dark hover:underline truncate"
            >
              {person.email}
            </a>
          </p>
        )}

        {/* Phone */}
        {person.phone && (
          <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <a
              href={`tel:${person.phone}`}
              className="text-slate-600 hover:text-slate-900"
            >
              {person.phone}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
