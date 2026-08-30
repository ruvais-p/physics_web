import { Publication } from '@/lib/data';
import { ExternalLink, Quote } from 'lucide-react';

interface JournalCardProps {
  publication: Publication;
}

export default function JournalCard({ publication }: JournalCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover-lift flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        {/* Category & Year */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="bg-surface-low text-oxford font-sans text-xs font-semibold px-2.5 py-0.5 rounded-full border border-cyan-accent/20">
            {publication.category}
          </span>
          <span className="text-xs font-bold text-slate-400">
            Year: {publication.year}
          </span>
        </div>

        {/* Paper Title */}
        <h3 className="font-serif text-lg font-bold text-oxford leading-snug">
          {publication.title}
        </h3>

        {/* Authors */}
        <p className="text-xs font-medium text-cyan-dark">
          {publication.authors.join(', ')}
        </p>

        {/* Journal Name & Citation details */}
        <div className="text-xs text-slate-600 font-sans italic bg-slate-50 p-2.5 rounded border border-slate-200/60">
          <span className="font-semibold not-italic text-oxford">{publication.journal}</span>, {publication.volume}
        </div>

        {/* Abstract */}
        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
          {publication.abstract}
        </p>
      </div>

      {/* Footer / DOI Link & Citation Count */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <a
          href={`https://doi.org/${publication.doi}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center space-x-1 font-semibold text-cyan-accent hover:text-cyan-dark transition-colors"
        >
          <span>DOI: {publication.doi}</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        <div className="flex items-center space-x-1 text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
          <Quote className="w-3 h-3 text-cyan-accent" />
          <span className="font-semibold text-oxford">{publication.citations}</span>
          <span className="text-[10px]">Citations</span>
        </div>
      </div>
    </div>
  );
}
