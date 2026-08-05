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
      className="group block overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm hover-lift flex flex-col h-full cursor-pointer transition-all duration-300"
    >
      
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
      <div className="p-5 flex-1 flex flex-col justify-center">
        {/* Name */}
        <h3 className="font-serif text-lg sm:text-xl font-bold text-oxford leading-snug group-hover:text-cyan-accent transition-colors">
          {person.name}
        </h3>

        {/* Designation */}
        <p className="text-sm font-semibold text-slate-800 mt-1">
          {isFaculty ? (person as FacultyMember).designation : `Ph.D. Research Scholar`}
        </p>
      </div>

    </div>
  );
}
