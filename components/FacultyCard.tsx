'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FacultyMember, Scholar } from '@/lib/data';

interface FacultyCardProps {
  person: FacultyMember | Scholar;
  onClick?: () => void;
  horizontal?: boolean;
}

export default function FacultyCard({ person, onClick, horizontal }: FacultyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isFaculty = person.type === 'faculty';
  const isClickable = Boolean(onClick || isFaculty);

  const fullText = isFaculty
    ? `${(person as FacultyMember).designation} | ${(person as FacultyMember).qualification}${
        (person as FacultyMember).room ? ` | Office Room: ${(person as FacultyMember).room}` : ''
      }`
    : `Ph.D. Research Scholar | Supervisor: ${(person as Scholar).supervisor}${
        (person as Scholar).topic ? ` | Topic: ${(person as Scholar).topic}` : ''
      }`;

  const isLongText = fullText.length > 110;

  if (horizontal) {
    return (
      <div 
        onClick={onClick}
        className={`render-lazy group faculty-member-card transition-all duration-300 grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 lg:gap-14 items-start ${
          isClickable ? 'cursor-pointer' : 'cursor-default'
        }`}
      >
        {/* Left Image: Occupies 1 column, perfectly aligning with grid below */}
        <div className="relative w-full aspect-square overflow-hidden rounded-3xl bg-slate-50 border border-slate-100/80 shadow-sm">
          <Image
            src={person.image}
            alt={person.name}
            fill
            className="object-cover faculty-card-image"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Right Details Body: Occupies remaining 2 columns */}
        <div className="md:col-span-2 flex flex-col items-start text-left font-sans pt-1">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-oxford tracking-tight mb-3">
            Head of Department
          </h2>

          <h3 className={`text-xl sm:text-2xl font-bold text-oxford transition-colors leading-snug ${
            isClickable ? 'group-hover:text-cyan-dark' : ''
          }`}>
            {person.name}
          </h3>

          <p className="text-base sm:text-lg text-slate-600 mt-2 leading-relaxed">
            {fullText}
          </p>

          {isFaculty && (person as FacultyMember).email && (
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              Email: <span className="text-cyan-dark">{(person as FacultyMember).email}</span>
            </p>
          )}

          {isFaculty && (
            <span className="mt-4 inline-flex items-center text-sm font-semibold text-cyan-dark group-hover:text-cyan-accent transition-colors">
              View Profile &rarr;
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={`render-lazy group faculty-member-card block transition-all duration-300 flex flex-col h-full space-y-3 ${
        isClickable ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      
      {/* Top Image: Rectangular/Square aspect-ratio, rounded corners */}
      <div className="relative w-full aspect-square overflow-hidden rounded-3xl bg-slate-50 border border-slate-100/80 shadow-sm">
        <Image
          src={person.image}
          alt={person.name}
          fill
          className="object-cover faculty-card-image"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Card Details Body - Left-aligned text below the image */}
      <div className="flex-1 flex flex-col items-start text-left font-sans pt-1">
        {/* Name in Oxford Blue */}
        <h3 className={`text-lg sm:text-xl font-bold text-oxford transition-colors leading-snug ${
          isClickable ? 'group-hover:text-cyan-dark' : ''
        }`}>
          {person.name}
        </h3>

        {/* Designation / Qualifications or Scholar Info */}
        <p className={`text-sm sm:text-base text-slate-600 mt-2 leading-relaxed ${
          isLongText && !isExpanded ? 'line-clamp-3' : ''
        }`}>
          {fullText}
        </p>

        {isLongText && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="mt-1 text-xs text-cyan-dark hover:text-cyan-accent underline font-semibold cursor-pointer transition-colors"
          >
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        )}
      </div>

    </div>
  );
}
