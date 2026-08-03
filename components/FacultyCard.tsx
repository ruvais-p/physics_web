import Image from 'next/image';
import { Mail, Phone, MapPin, BookOpen, Award } from 'lucide-react';
import { FacultyMember, Scholar } from '@/lib/data';

interface FacultyCardProps {
  person: FacultyMember | Scholar;
}

export default function FacultyCard({ person }: FacultyCardProps) {
  const isFaculty = person.type === 'faculty';

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm hover-lift flex flex-col justify-between space-y-4">
      <div>
        {/* Header: Photo & Basic Details */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-oxford/20 shadow-md">
            <Image
              src={person.image}
              alt={person.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div>
            <span className="inline-block bg-surface-low text-oxford font-sans text-xs font-semibold px-2.5 py-0.5 rounded-full mb-1 border border-cyan-accent/20">
              {isFaculty ? (person as FacultyMember).designation : `Ph.D. Scholar (${(person as Scholar).fellowship})`}
            </span>
            <h3 className="font-serif text-lg font-bold text-oxford leading-snug">
              {person.name}
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              {isFaculty ? (person as FacultyMember).qualification : `Supervisor: ${(person as Scholar).supervisor}`}
            </p>
          </div>
        </div>

        {/* Bio / Topic */}
        {isFaculty ? (
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-3">
            {(person as FacultyMember).bio}
          </p>
        ) : (
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 mb-3 text-xs text-slate-700">
            <span className="font-semibold text-oxford block mb-0.5">Research Topic:</span>
            <span className="italic">{(person as Scholar).topic}</span>
          </div>
        )}

        {/* Tags / Research Focus */}
        {isFaculty && (person as FacultyMember).researchFocus && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(person as FacultyMember).researchFocus.map((area, idx) => (
              <span
                key={idx}
                className="bg-surface-gray text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded border border-slate-200"
              >
                {area}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info & Stats */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5">
            <Mail className="w-3.5 h-3.5 text-cyan-accent" />
            <a href={`mailto:${person.email}`} className="hover:text-oxford transition-colors">
              {person.email}
            </a>
          </div>
          {isFaculty && (person as FacultyMember).room && (
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Room: {(person as FacultyMember).room}</span>
            </div>
          )}
        </div>

        {isFaculty && (
          <div className="text-right bg-slate-50 px-2.5 py-1 rounded border border-slate-200/60">
            <span className="block font-bold text-oxford text-xs flex items-center space-x-1">
              <BookOpen className="w-3 h-3 text-cyan-accent inline" />
              <span>{(person as FacultyMember).publicationsCount} Papers</span>
            </span>
            <span className="text-[10px] text-slate-400">
              {(person as FacultyMember).citations} Citations
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
