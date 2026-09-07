import React from 'react';
import { Publication } from '@/lib/data';
import { ExternalLink, BookOpen } from 'lucide-react';

interface PublicationsTableProps {
  publications: Publication[];
  emptyMessage?: string;
  showCategory?: boolean;
}

export default function PublicationsTable({
  publications,
  emptyMessage = 'No publications found.',
  showCategory = true,
}: PublicationsTableProps) {
  if (!publications || publications.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500 font-sans">
        <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <p className="font-semibold text-slate-700">{emptyMessage}</p>
        <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or filters.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px] sm:min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-oxford uppercase tracking-wider">
              <th className="py-4 px-4 sm:px-6 w-12 text-center">#</th>
              <th className="py-4 px-4 sm:px-6">Publication Title &amp; Authors</th>
              <th className="py-4 px-4 sm:px-6 w-48">Journal / Venue</th>
              {showCategory && <th className="py-4 px-4 sm:px-6 w-36">Field</th>}
              <th className="py-4 px-4 sm:px-6 w-24 text-center">Year</th>
              <th className="py-4 px-4 sm:px-6 w-28 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {publications.map((pub, index) => {
              const authorsText = pub.authors ? pub.authors.join(', ') : 'Department Researchers';
              const doiUrl = pub.doi
                ? pub.doi.startsWith('http')
                  ? pub.doi
                  : `https://doi.org/${pub.doi}`
                : null;

              return (
                <tr
                  key={pub.id || index}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Serial Number */}
                  <td className="py-4 px-4 sm:px-6 text-center text-xs font-bold text-slate-400">
                    {index + 1}
                  </td>

                  {/* Title & Authors */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="space-y-1">
                      {doiUrl ? (
                        <a
                          href={doiUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-oxford hover:text-cyan-accent leading-snug transition-colors line-clamp-2"
                        >
                          {pub.title}
                        </a>
                      ) : (
                        <span className="font-bold text-oxford leading-snug line-clamp-2">
                          {pub.title}
                        </span>
                      )}
                      <p className="text-xs text-slate-500 font-medium line-clamp-1">
                        {authorsText}
                      </p>
                    </div>
                  </td>

                  {/* Journal & Volume */}
                  <td className="py-4 px-4 sm:px-6 text-xs text-slate-700">
                    <span className="font-semibold text-oxford block">
                      {pub.journal}
                    </span>
                    {pub.volume && (
                      <span className="text-slate-500 block text-[11px] mt-0.5">
                        {pub.volume}
                      </span>
                    )}
                  </td>

                  {/* Field / Category */}
                  {showCategory && (
                    <td className="py-4 px-4 sm:px-6 text-xs">
                      {pub.category ? (
                        <span className="inline-block bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-md text-[11px]">
                          {pub.category}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  )}

                  {/* Year */}
                  <td className="py-4 px-4 sm:px-6 text-center">
                    <span className="inline-block bg-oxford/10 text-oxford font-bold text-xs px-2.5 py-1 rounded-md">
                      {pub.year}
                    </span>
                  </td>

                  {/* Link / DOI */}
                  <td className="py-4 px-4 sm:px-6 text-center">
                    {doiUrl ? (
                      <a
                        href={doiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-cyan-accent hover:text-cyan-700 transition-colors px-2.5 py-1 rounded-lg hover:bg-cyan-50"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
