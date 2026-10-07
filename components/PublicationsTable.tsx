'use client';

import React, { useMemo } from 'react';
import { Publication } from '@/lib/data';
import { ExternalLink, BookOpen } from 'lucide-react';

interface PublicationsTableProps {
  publications: Publication[];
  emptyMessage?: string;
}

// Category grouping configuration in prioritized order matching faculty profile standard
export interface PublicationCategoryDef {
  id: string;
  title: string;
  match: (c: string) => boolean;
}

export const PUBLICATION_CATEGORY_CONFIG: readonly PublicationCategoryDef[] = [
  { id: 'patents', title: 'Patents', match: (c) => c.includes('patent') },
  { id: 'books', title: 'Books and Book Chapter', match: (c) => c.includes('book') },
  { id: 'journals', title: 'Journal Article', match: (c) => c.includes('journal') || (c.includes('article') && !c.includes('popular')) },
  { id: 'conferences', title: 'Conference Publication', match: (c) => c.includes('conference') || c.includes('proceeding') },
  { id: 'popular', title: 'Popular Articles', match: (c) => c.includes('popular') },
  { id: 'preprints', title: 'Preprints', match: (c) => c.includes('preprint') },
  { id: 'other', title: 'Other Publications', match: () => true },
];

export function groupPublicationsByCategory<T extends { id: string; category?: string | null }>(
  publications: T[]
): { id: string; title: string; items: T[] }[] {
  if (!publications || publications.length === 0) return [];
  const groups: { id: string; title: string; items: T[] }[] = [];
  const assignedIds = new Set<string>();

  for (const def of PUBLICATION_CATEGORY_CONFIG) {
    const items = publications.filter((pub) => {
      if (assignedIds.has(pub.id)) return false;
      const c = (pub.category || 'Journal Article').toLowerCase().trim();
      if (def.match(c)) {
        assignedIds.add(pub.id);
        return true;
      }
      return false;
    });

    if (items.length > 0) {
      groups.push({ id: def.id, title: def.title, items });
    }
  }

  return groups;
}

export default function PublicationsTable({
  publications,
  emptyMessage = 'No publications found.',
}: PublicationsTableProps) {
  const groupedPublications = useMemo(() => {
    return groupPublicationsByCategory(publications);
  }, [publications]);

  if (!publications || publications.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500 font-sans shadow-xs">
        <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <p className="font-semibold text-slate-700">{emptyMessage}</p>
        <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 text-left font-sans">
      {groupedPublications.map((group) => {
        const isPatent = group.id === 'patents';

        return (
          <div key={group.id} className="space-y-4">
            {/* Category Heading with Item Count Pill */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-xl sm:text-2xl font-bold text-oxford font-serif flex items-center gap-2.5">
                <span>{group.title}</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-sans border border-slate-200">
                  {group.items.length}
                </span>
              </h3>
            </div>

            {/* Table of Publications for this Category */}
            <div className="overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-xs">
              {/* Mobile View */}
              <div className="divide-y divide-slate-100 md:hidden">
                {group.items.map((pub, idx) => {
                  const linkUrl =
                    pub.externalLink ||
                    (pub.doi
                      ? pub.doi.startsWith('http')
                        ? pub.doi
                        : `https://doi.org/${pub.doi}`
                      : null);
                  const authorsText = pub.authors?.join(', ') || '';
                  const dateDisplay = pub.date
                    ? new Date(pub.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : pub.year
                    ? String(pub.year)
                    : null;

                  return (
                    <div
                      key={pub.id || idx}
                      className="p-4 sm:p-5 space-y-3 hover:bg-slate-50/60 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        {dateDisplay && (
                          <span className="bg-slate-100 text-slate-700 font-semibold text-xs px-2.5 py-0.5 rounded-md">
                            {dateDisplay}
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="font-bold text-oxford leading-snug text-sm sm:text-base break-words [overflow-wrap:anywhere]">
                          {pub.title}
                        </h4>
                        {authorsText && (
                          <p className="text-xs text-slate-500 font-medium mt-1 break-words [overflow-wrap:anywhere]">
                            {authorsText}
                          </p>
                        )}
                      </div>

                      <div className="flex items-start justify-between gap-3 pt-2 border-t border-slate-100">
                        <div className="text-xs min-w-0 flex-1 space-y-0.5">
                          {pub.journal && (
                            <p className="font-semibold text-oxford italic font-serif break-words [overflow-wrap:anywhere]">
                              {pub.journal}
                            </p>
                          )}
                          {pub.volume && (
                            <p className="text-[11px] text-slate-500 break-words [overflow-wrap:anywhere]">
                              {pub.volume}
                            </p>
                          )}
                          {pub.doi && (
                            <p className="text-[10px] font-mono text-slate-500 break-all leading-tight pt-1">
                              {isPatent ? `Patent: ${pub.doi}` : `DOI: ${pub.doi}`}
                            </p>
                          )}
                        </div>

                        {linkUrl && (
                          <a
                            href={linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shadow-xs whitespace-nowrap"
                          >
                            <span>{isPatent ? 'View Patent' : 'View Paper'}</span>
                            <ExternalLink className="w-3 h-3 opacity-80" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View (table-fixed, zero horizontal scrolling) */}
              <div className="hidden md:block">
                <table className="w-full text-left border-collapse table-fixed">
                  <thead>
                    <tr className="bg-oxford text-white text-xs uppercase tracking-wider font-bold">
                      <th className="py-4 px-3 sm:px-4 text-center w-10 sm:w-12">#</th>
                      <th className="py-4 px-4 sm:px-5 w-auto">
                        {isPatent ? 'Patent Details' : 'Publication Details'}
                      </th>
                      <th className="py-4 px-3 sm:px-4 w-44 sm:w-56 md:w-64">
                        {isPatent ? 'Patent / Filing Date' : 'Journal / Date'}
                      </th>
                      <th className="py-4 px-3 sm:px-4 text-right w-28 sm:w-36 md:w-44">
                        {isPatent ? 'Link / Number' : 'Link / DOI'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {group.items.map((pub, idx: number) => {
                      const linkUrl =
                        pub.externalLink ||
                        (pub.doi
                          ? pub.doi.startsWith('http')
                            ? pub.doi
                            : `https://doi.org/${pub.doi}`
                          : null);
                      const authorsText = pub.authors?.join(', ') || '';
                      const dateDisplay = pub.date
                        ? new Date(pub.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : pub.year
                        ? String(pub.year)
                        : null;

                      return (
                        <tr
                          key={pub.id || idx}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          {/* Index */}
                          <td className="py-4 px-3 sm:px-4 align-top text-center text-xs font-bold text-slate-400">
                            {idx + 1}
                          </td>

                          {/* Details: Title & Authors */}
                          <td className="py-4 px-4 sm:px-5 align-top">
                            <div className="font-bold text-oxford text-sm sm:text-base leading-snug break-words [overflow-wrap:anywhere]">
                              {pub.title}
                            </div>
                            {authorsText && (
                              <p className="text-xs text-slate-500 font-medium break-words [overflow-wrap:anywhere] mt-1">
                                {authorsText}
                              </p>
                            )}
                          </td>

                          {/* Journal / Date */}
                          <td className="py-4 px-3 sm:px-4 align-top space-y-1">
                            {pub.journal && (
                              <p className="text-xs font-semibold text-oxford italic font-serif leading-snug break-words [overflow-wrap:anywhere]">
                                {pub.journal}
                              </p>
                            )}
                            {pub.volume && (
                              <p className="text-[11px] text-slate-500 break-words [overflow-wrap:anywhere]">
                                {pub.volume}
                              </p>
                            )}
                            {dateDisplay && (
                              <p className="text-[11px] sm:text-xs text-slate-500 whitespace-nowrap">
                                {dateDisplay}
                              </p>
                            )}
                          </td>

                          {/* Link / DOI */}
                          <td className="py-4 px-3 sm:px-4 align-top text-right space-y-1.5">
                            {linkUrl && (
                              <div>
                                <a
                                  href={linkUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 sm:gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] sm:text-xs font-semibold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg transition-all shadow-xs whitespace-nowrap"
                                >
                                  <span>{isPatent ? 'View Patent' : 'View Paper'}</span>
                                  <ExternalLink className="w-3 h-3 opacity-80" />
                                </a>
                              </div>
                            )}
                            {pub.doi && (
                              <p className="text-[10px] sm:text-[11px] font-mono text-slate-500 break-all leading-tight">
                                {isPatent ? `Patent: ${pub.doi}` : `DOI: ${pub.doi}`}
                              </p>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
