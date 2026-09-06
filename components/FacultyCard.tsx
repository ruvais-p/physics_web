'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FacultyMember, Scholar } from '@/lib/data';

interface FacultyCardProps {
  person: FacultyMember | Scholar;
  onClick?: () => void;
}

export default function FacultyCard({ person, onClick }: FacultyCardProps) {
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

  return (
    <div 
      onClick={onClick}
      className={`group faculty-member-card block transition-all duration-300 flex flex-col h-full space-y-3 ${
        isClickable ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      
      {/* Top Image: Rectangular/Square aspect-ratio, rounded corners, grayscale by default, colored on hover */}
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
