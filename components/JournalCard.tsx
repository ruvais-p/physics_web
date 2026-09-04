import { Publication } from '@/lib/data';
import { BookOpen, ExternalLink } from 'lucide-react';

interface JournalCardProps {
  publication: Publication;
}

export default function JournalCard({ publication }: JournalCardProps) {
  return (
    <div className="bg-white rounded-[2rem] p-7 sm:p-8 border border-slate-100/90 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between space-y-5 group">
      <div className="space-y-4">
        {/* Top Row: Dark Navy Year Pill & Golden Outline Book Icon */}
        <div className="flex items-center justify-between">
          <span className="bg-[#0B1E36] text-white text-xs font-extrabold px-3.5 py-1 rounded-md tracking-wider font-sans">
            {publication.year}
          </span>
          <BookOpen className="w-5 h-5 text-[#FDE68A] stroke-[2]" />
        </div>

        {/* Category / Journal Pill */}
        <div>
          <span className="inline-block bg-[#F0F4F8] text-slate-600 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-lg border border-slate-200/50 max-w-full truncate font-sans">
            {publication.category || publication.journal}
          </span>
        </div>

        {/* Paper Title */}
        <h3 className="font-extrabold text-lg sm:text-xl text-[#0B1E36] leading-snug tracking-tight font-sans group-hover:text-cyan-600 transition-colors">
          {publication.title}
        </h3>
      </div>

      {/* Authors Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4 text-xs sm:text-sm font-medium text-slate-400 font-sans">
        <p className="line-clamp-1">
          <span className="font-bold text-slate-500">By:</span>{' '}
          {publication.authors ? publication.authors.join(', ') : 'Department Researchers'}
        </p>
        {publication.doi && (
          <a
            href={`https://doi.org/${publication.doi}`}
            target="_blank"
            rel="noreferrer"
            className="text-cyan-600 hover:text-cyan-700 font-bold shrink-0 inline-flex items-center gap-1 transition-colors"
          >
            <span>DOI</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
