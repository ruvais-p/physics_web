'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, FolderGit2, Building2, User, Calendar, ChevronDown, ChevronUp, DollarSign } from 'lucide-react';

export interface ProjectData {
  id: string;
  title: string;
  description?: string | null;
  agency?: string | null;
  role?: string | null;
  funding?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  externalLink?: string | null;
  otherFaculty?: string | null;
  status?: string | null;
  createdAt: string;
  updatedAt: string;
  faculty?: {
    id: string;
    name: string;
    designation?: string | null;
    department?: string | null;
  } | null;
}

interface ProjectsTableProps {
  projects: ProjectData[];
  emptyMessage?: string;
}

export default function ProjectsTable({
  projects,
  emptyMessage = 'No research projects found matching your criteria.',
}: ProjectsTableProps) {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500 font-sans shadow-xs">
        <FolderGit2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <p className="font-semibold text-slate-700 text-base">{emptyMessage}</p>
        <p className="text-xs text-slate-400 mt-1">Try clearing or adjusting your search query or status filter.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[750px] lg:min-w-[1000px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-oxford uppercase tracking-wider">
              <th className="py-4 px-4 sm:px-6 w-12 text-center">#</th>
              <th className="py-4 px-4 sm:px-6 min-w-[300px]">Project Title &amp; Details</th>
              <th className="py-4 px-4 sm:px-6 w-56">Investigators</th>
              <th className="py-4 px-4 sm:px-6 w-48">Funding Agency &amp; Outlay</th>
              <th className="py-4 px-4 sm:px-6 w-32 text-center">Duration</th>
              <th className="py-4 px-4 sm:px-6 w-28 text-center">Status</th>
              <th className="py-4 px-4 sm:px-6 w-20 text-center">Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {projects.map((proj, index) => {
              const isExpanded = !!expandedIds[proj.id];
              const isOngoing = !proj.status || proj.status.toLowerCase() === 'ongoing' || proj.status.toLowerCase() === 'active';
              
              // Format duration
              const startYear = proj.startDate ? new Date(proj.startDate).getFullYear() : null;
              const endYear = proj.endDate ? new Date(proj.endDate).getFullYear() : null;
              const durationStr = startYear && endYear ? `${startYear} – ${endYear}` : startYear ? `${startYear} – Present` : '—';

              return (
                <tr
                  key={proj.id || index}
                  className="hover:bg-slate-50/80 transition-colors group align-top"
                >
                  {/* Serial Number */}
                  <td className="py-4 px-4 sm:px-6 text-center text-xs font-bold text-slate-400">
                    {index + 1}
                  </td>

                  {/* Title & Description */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="space-y-2">
                      <h3 className="font-bold text-oxford leading-snug text-base group-hover:text-cyan-accent transition-colors">
                        {proj.title}
                      </h3>

                      {proj.description && (
                        <div className="space-y-1">
                          <p className={`text-xs text-slate-600 leading-relaxed font-sans ${isExpanded ? '' : 'line-clamp-2'}`}>
                            {proj.description}
                          </p>
                          {proj.description.length > 120 && (
                            <button
                              type="button"
                              onClick={() => toggleExpand(proj.id)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-accent hover:text-cyan-800 transition-colors cursor-pointer"
                            >
                              <span>{isExpanded ? 'Show less' : 'Read full abstract'}</span>
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Investigators */}
                  <td className="py-4 px-4 sm:px-6 text-xs text-slate-700">
                    <div className="space-y-1">
                      {proj.faculty?.name ? (
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Lead PI:</span>
                          <Link
                            href={`/people?search=${encodeURIComponent(proj.faculty.name)}`}
                            className="font-bold text-oxford hover:text-cyan-accent hover:underline transition-colors block"
                          >
                            {proj.faculty.name}
                          </Link>
                          {proj.faculty.designation && (
                            <span className="text-[11px] text-slate-500 block">{proj.faculty.designation}</span>
                          )}
                        </div>
                      ) : (
                        <span className="font-semibold text-oxford block">Department Researchers</span>
                      )}

                      {proj.otherFaculty && (
                        <div className="pt-1 border-t border-slate-100">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Co-PI(s):</span>
                          <span className="text-[11px] text-slate-600 font-medium block leading-tight">{proj.otherFaculty}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Funding Agency & Amount */}
                  <td className="py-4 px-4 sm:px-6 text-xs">
                    <div className="space-y-1.5">
                      <span className="font-semibold text-oxford block leading-snug">
                        {proj.agency || 'Government of India / Extramural Grant'}
                      </span>
                      {proj.funding && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200/80 px-2.5 py-0.5 rounded-md">
                          <span>{proj.funding}</span>
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Year / Duration */}
                  <td className="py-4 px-4 sm:px-6 text-center">
                    <span className="inline-block bg-slate-100 text-slate-800 font-bold text-xs px-2.5 py-1 rounded-md whitespace-nowrap">
                      {durationStr}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 sm:px-6 text-center">
                    {isOngoing ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full whitespace-nowrap shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Ongoing</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                        <span>Completed</span>
                      </span>
                    )}
                  </td>

                  {/* Link / Action */}
                  <td className="py-4 px-4 sm:px-6 text-center">
                    {proj.externalLink ? (
                      <a
                        href={proj.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-cyan-accent hover:bg-slate-100 transition-all"
                        title="External Project Portal"
                        aria-label="View Project Website"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <span className="text-slate-300 text-xs">—</span>
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
