import { Publication } from '@/lib/data';
import { ExternalLink, BookOpen, Quote } from 'lucide-react';

interface JournalCardProps {
  publication: Publication;
}

export default function JournalCard({ publication }: JournalCardProps) {
  return (
    <div className="render-lazy bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 hover:border-cyan-accent/50 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 group">
      <div className="space-y-3.5">
        {/* Top Meta: Journal Name & Year Tag */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="p-1 rounded-md bg-slate-100 text-slate-600 shrink-0">
              <BookOpen className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold text-slate-700 truncate tracking-wide">
              {publication.journal}
            </span>
            {publication.volume && (
              <span className="text-xs text-slate-400 hidden sm:inline truncate">
                • {publication.volume}
              </span>
            )}
          </div>

          <span className="text-xs font-bold text-oxford bg-slate-100 px-2.5 py-0.5 rounded-md shrink-0">
            {publication.year}
          </span>
        </div>

        {/* Paper Title */}
        <h3 className="font-serif text-base sm:text-lg font-bold text-oxford leading-snug group-hover:text-cyan-accent transition-colors">
          {publication.title}
        </h3>

        {/* Abstract snippet if present */}
        {publication.abstract && (
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2 font-normal font-sans">
            {publication.abstract}
          </p>
        )}
      </div>

      {/* Footer: Authors, Category, & DOI link */}
      <div className="pt-3.5 border-t border-slate-100 space-y-2">
        {/* Authors */}
        <div className="text-xs text-slate-500 font-medium">
          <span className="font-bold text-slate-700">Authors:</span>{' '}
          <span className="text-slate-600">
            {publication.authors && publication.authors.length > 0
              ? publication.authors.join(', ')
              : 'Department Researchers'}
          </span>
        </div>

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between pt-1 text-xs">
          {/* Category / Citations */}
          <div className="flex items-center gap-2">
            {publication.category && (
              <span className="inline-block bg-slate-100 text-slate-600 text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
                {publication.category}
              </span>
            )}
            {typeof publication.citations === 'number' && publication.citations > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                <Quote className="w-3 h-3 text-slate-400" />
                <span>{publication.citations} citations</span>
              </span>
            )}
          </div>

          {/* DOI External Link */}
          {publication.doi && (
            <a
              href={`https://doi.org/${publication.doi}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-oxford hover:text-cyan-accent transition-colors"
              title={`DOI: ${publication.doi}`}
            >
              <span>View Article</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-accent" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
