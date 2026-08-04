import Image from 'next/image';
import Link from 'next/link';
import { ResearchLab } from '@/lib/data';

interface LabCardProps {
  lab: ResearchLab;
  variant?: 'light' | 'dark';
}

export default function LabCard({ lab, variant = 'light' }: LabCardProps) {
  const isDark = variant === 'dark';

  return (
    <Link
      href={`/research-labs#${lab.id}`}
      className={`group block overflow-hidden shadow-sm hover-lift flex flex-col h-full cursor-pointer rounded-xl border transition-all duration-300 ${
        isDark
          ? 'bg-[#000A1E]/60 backdrop-blur-md border-white/10 hover:border-cyan-accent/40'
          : 'bg-white border-slate-200 hover:border-cyan-accent/20'
      }`}
    >
      {/* Lab Thumbnail Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100/5">
        <Image
          src={lab.image}
          alt={lab.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex items-center justify-center min-h-[84px]">
        <h3
          className={`font-serif text-lg sm:text-xl font-bold leading-snug text-center transition-colors duration-300 ${
            isDark ? 'text-white group-hover:text-cyan-accent' : 'text-oxford group-hover:text-cyan-accent'
          }`}
        >
          {lab.name}
        </h3>
      </div>
    </Link>
  );
}
