'use client';

import { useState } from 'react';
import { BookOpen, Search } from 'lucide-react';
import PublicationsTable from '@/components/PublicationsTable';
import type { Publication } from '@/lib/data';

interface JournalsContentProps {
  publications: Publication[];
}

export default function JournalsContent({ publications }: JournalsContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const effectiveQuery = searchQuery.trim().toLowerCase();

  const filteredPublications = publications.filter((publication) => {
    if (!effectiveQuery) return true;

    return (
      publication.title.toLowerCase().includes(effectiveQuery) ||
      publication.journal.toLowerCase().includes(effectiveQuery) ||
      publication.authors.some((author) => author.toLowerCase().includes(effectiveQuery)) ||
      publication.category.toLowerCase().includes(effectiveQuery) ||
      publication.year.toString().includes(effectiveQuery)
    );
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {publications.length > 0 && (
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-sm focus-within:border-cyan-accent focus-within:ring-2 focus-within:ring-cyan-accent/20 transition-all">
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="journals-search-input"
                type="search"
                placeholder="Search by title, author, journal, or year..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full pl-11 pr-4 py-2 text-sm sm:text-base bg-transparent border-none focus:outline-none text-slate-800 placeholder:text-slate-400 font-sans"
              />
            </div>

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-2 py-1 cursor-pointer transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-oxford">
            Department Publications
          </h2>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {filteredPublications.length} Papers
          </span>
        </div>

        {publications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500 font-sans">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No publications are available.</p>
          </div>
        ) : (
          <PublicationsTable
            publications={filteredPublications}
            emptyMessage="No research papers found matching your query."
          />
        )}
      </div>
    </section>
  );
}
