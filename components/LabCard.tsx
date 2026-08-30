import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface ResearchLabItem {
  id: string;
  name: string;
  category?: string | null;
  shortDesc?: string | null;
  description: string;
  image?: string | null;
  faculties?: any[];
}

interface LabCardProps {
  lab: ResearchLabItem;
  variant?: 'light' | 'dark';
}

function deriveShortDesc(lab: ResearchLabItem): string {
  if (lab.shortDesc && lab.shortDesc.trim()) return lab.shortDesc.trim();
  if (!lab.description) return 'Research Laboratory in the Department of Physics.';
  // Clean markdown syntax for card preview
  const clean = lab.description
    .replace(/^#+\s+/gm, '')
    .replace(/\*+/g, '')
    .replace(/`+/g, '')
    .replace(/>\s+/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
  return clean.length > 130 ? clean.slice(0, 130) + '...' : clean;
}

export default function LabCard({ lab, variant = 'light' }: LabCardProps) {
  const isDark = variant === 'dark';
  const displayImage = lab.image || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80';
  const shortDescription = deriveShortDesc(lab);

  return (
    <div
      className={`group flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl rounded-2xl border transition-all duration-300 font-sans ${
        isDark
          ? 'bg-[#000A1E]/80 backdrop-blur-md border-white/10 hover:border-cyan-accent/50'
          : 'bg-white border-slate-200 hover:border-cyan-accent/40'
      }`}
    >
      {/* Laboratory Image */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-900">
        <Image
          src={displayImage}
          alt={lab.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {lab.category && (
          <span className="absolute top-3 left-3 bg-oxford/90 backdrop-blur-md text-cyan-accent text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-cyan-accent/20">
            {lab.category}
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3
            className={`font-serif text-xl font-bold leading-tight transition-colors duration-300 ${
              isDark ? 'text-white group-hover:text-cyan-accent' : 'text-oxford group-hover:text-cyan-accent'
            }`}
          >
            {lab.name}
          </h3>

          <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {shortDescription}
          </p>
        </div>

        {/* View Details Button */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <Link
            href={`/research/${lab.id}`}
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-cyan-600 hover:text-cyan-500 transition-colors cursor-pointer group/btn"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
