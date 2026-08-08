import Image from 'next/image';
import { FacultyMember, Scholar } from '@/lib/data';

interface FacultyCardProps {
  person: FacultyMember | Scholar;
  onClick?: () => void;
}

export default function FacultyCard({ person, onClick }: FacultyCardProps) {
  const isFaculty = person.type === 'faculty';

  return (
    <div 
      onClick={onClick}
      className="group faculty-member-card block cursor-pointer transition-all duration-300 flex flex-col h-full space-y-3"
    >
      
      {/* Top Image: Rectangular/Square aspect-ratio, grayscale by default, colored on hover */}
      <div className="relative w-full aspect-[4/5] sm:aspect-square overflow-hidden bg-slate-50 border border-slate-100">
        <Image
          src={person.image}
          alt={person.name}
          fill
          className="object-cover faculty-card-image"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Card Details Body - Left-aligned text below the image */}
      <div className="flex-1 flex flex-col items-start text-left font-sans">
        {/* Name in Oxford Blue */}
        <h3 className="text-base sm:text-lg font-bold text-oxford group-hover:text-cyan-dark transition-colors leading-snug">
          {person.name}
        </h3>

        {/* Designation / Qualifications or Scholar Info */}
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          {isFaculty ? (
            <>
              {(person as FacultyMember).designation} | {(person as FacultyMember).qualification}
              {(person as FacultyMember).room && ` | Office Room: ${(person as FacultyMember).room}`}
            </>
          ) : (
            <>
              Ph.D. Research Scholar | Supervisor: {(person as Scholar).supervisor} | Topic: {(person as Scholar).topic}
            </>
          )}
        </p>
      </div>

    </div>
  );
}
