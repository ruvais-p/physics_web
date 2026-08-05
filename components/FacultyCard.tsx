import Image from 'next/image';
import { Mail, MapPin, BookOpen } from 'lucide-react';
import { FacultyMember, Scholar } from '@/lib/data';

interface FacultyCardProps {
  person: FacultyMember | Scholar;
}

export default function FacultyCard({ person }: FacultyCardProps) {
  const isFaculty = person.type === 'faculty';

  return (
    <div className="group block overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm hover-lift flex flex-col h-full transition-all duration-300">
      
      {/* Top Image: Large Square filling the card width */}
      <div className="relative w-full aspect-square overflow-hidden bg-slate-100">
        <Image
          src={person.image}
          alt={person.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Card Details Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Name */}
          <h3 className="font-serif text-lg sm:text-xl font-bold text-oxford leading-snug group-hover:text-cyan-accent transition-colors">
            {person.name}
          </h3>

          {/* Designation */}
          <p className="text-sm font-semibold text-slate-800 mt-1">
            {isFaculty ? (person as FacultyMember).designation : `Ph.D. Research Scholar`}
          </p>

          {/* Department / Subtitle */}
          <p className="text-xs text-slate-500 mt-0.5">
            {isFaculty 
              ? `Department of Physics • ${(person as FacultyMember).qualification}` 
              : `Department of Physics • ${(person as Scholar).fellowship}`
            }
          </p>

          {/* Bio / Research Topic Description */}
          {isFaculty ? (
            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mt-3">
              {(person as FacultyMember).bio}
            </p>
          ) : (
            <div className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <span className="font-semibold text-oxford">Topic: </span>
              <span className="italic">{(person as Scholar).topic}</span>
            </div>
          )}

          {/* Research Focus Badges for Faculty */}
          {isFaculty && (person as FacultyMember).researchFocus && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {(person as FacultyMember).researchFocus.slice(0, 3).map((area, idx) => (
                <span
                  key={idx}
                  className="bg-slate-50 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded border border-slate-200"
                >
                  {area}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer info: Email, Room & Stats */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-sans">
          <div className="space-y-1 min-w-0 flex-1 pr-3">
            <div className="flex items-center space-x-1.5 min-w-0">
              <Mail className="w-3.5 h-3.5 text-cyan-accent shrink-0" />
              <a href={`mailto:${person.email}`} className="hover:text-oxford transition-colors truncate block">
                {person.email}
              </a>
            </div>
            {isFaculty && (person as FacultyMember).room && (
              <div className="flex items-center space-x-1.5 min-w-0">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">Room: {(person as FacultyMember).room}</span>
              </div>
            )}
            {!isFaculty && (person as Scholar).supervisor && (
              <div className="text-[11px] text-slate-400">
                Supervisor: {(person as Scholar).supervisor}
              </div>
            )}
          </div>

          {/* Stats for Faculty */}
          {isFaculty && (
            <div className="text-right shrink-0 bg-slate-50 px-2.5 py-1 rounded border border-slate-200/60">
              <span className="block font-bold text-oxford text-xs flex items-center space-x-1 justify-end">
                <BookOpen className="w-3 h-3 text-cyan-accent inline shrink-0" />
                <span>{(person as FacultyMember).publicationsCount} Papers</span>
              </span>
              <span className="text-[10px] text-slate-400">
                {(person as FacultyMember).citations} Citations
              </span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
