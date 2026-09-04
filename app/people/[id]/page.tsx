'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FACULTY_MEMBERS, SCHOLARS, FacultyMember, Scholar } from '@/lib/data';
import FacultyCard from '@/components/FacultyCard';
import { Mail, Phone, MapPin, BookOpen, ExternalLink, Download, User } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Markdown Parser Helper for Public Profile Biography
function renderMarkdown(md: string) {
  if (!md || !md.trim()) {
    return <p className="text-slate-600 leading-relaxed text-base">Faculty member in the Department of Physics.</p>;
  }

  const lines = md.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = () => {
    if (currentList) {
      if (currentList.type === 'ul') {
        elements.push(
          <ul key={`ul_${elements.length}`} className="list-disc ml-5 space-y-1.5 my-2 text-base text-slate-700 font-sans">
            {currentList.items.map((item, idx) => (
              <li key={idx}>{parseInlineMarkdown(item)}</li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`ol_${elements.length}`} className="list-decimal ml-5 space-y-1.5 my-2 text-base text-slate-700 font-sans">
            {currentList.items.map((item, idx) => (
              <li key={idx}>{parseInlineMarkdown(item)}</li>
            ))}
          </ol>
        );
      }
      currentList = null;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const itemText = trimmed.slice(2);
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      return;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      const itemText = trimmed.replace(/^\d+\.\s/, '');
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      return;
    }

    flushList();

    if (!trimmed) {
      elements.push(<div key={`br_${index}`} className="h-2" />);
      return;
    }

    if (trimmed.startsWith('# ')) {
      elements.push(
        <h2 key={index} className="text-2xl font-bold font-serif text-oxford mt-4 mb-2 border-b border-slate-200 pb-1">
          {parseInlineMarkdown(trimmed.slice(2))}
        </h2>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h3 key={index} className="text-xl font-bold font-serif text-cyan-dark mt-3 mb-1.5">
          {parseInlineMarkdown(trimmed.slice(3))}
        </h3>
      );
    } else if (trimmed.startsWith('### ')) {
      elements.push(
        <h4 key={index} className="text-base font-semibold uppercase tracking-wider text-slate-800 mt-2.5 mb-1 font-sans">
          {parseInlineMarkdown(trimmed.slice(4))}
        </h4>
      );
    } else if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote key={index} className="border-l-3 border-oxford pl-3 py-1.5 text-slate-600 italic text-base my-2 bg-slate-50 rounded-r">
          {parseInlineMarkdown(trimmed.slice(2))}
        </blockquote>
      );
    } else {
      elements.push(
        <p key={index} className="text-base text-slate-700 leading-relaxed my-1 font-sans">
          {parseInlineMarkdown(trimmed)}
        </p>
      );
    }
  });

  flushList();
  return <div className="space-y-1">{elements}</div>;
}

function parseInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining) {
    const linkMatch = remaining.match(/^([\s\S]*?)\[([^\]]+)\]\(([^)]+)\)([\s\S]*)$/);
    if (linkMatch) {
      const [, before, label, url, after] = linkMatch;
      if (before) parts.push(parseFormatting(before, keyIdx++));
      parts.push(
        <a key={keyIdx++} href={url} target="_blank" rel="noopener noreferrer" className="text-cyan-dark hover:underline font-medium inline-flex items-center gap-0.5 text-base">
          <span>{label}</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        </a>
      );
      remaining = after;
      continue;
    }

    parts.push(parseFormatting(remaining, keyIdx++));
    break;
  }

  return parts;
}

function parseFormatting(text: string, keyPrefix: number): React.ReactNode {
  const elements: React.ReactNode[] = [];
  const regex = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3|(`)(.*?)\5/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index));
    }

    if (match[1]) {
      elements.push(<strong key={`${keyPrefix}_b_${match.index}`} className="font-bold text-oxford">{match[2]}</strong>);
    } else if (match[3]) {
      elements.push(<em key={`${keyPrefix}_i_${match.index}`} className="italic text-slate-800">{match[4]}</em>);
    } else if (match[5]) {
      elements.push(<code key={`${keyPrefix}_c_${match.index}`} className="bg-slate-100 text-oxford px-1.5 py-0.5 rounded font-mono text-[13px]">{match[6]}</code>);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements.length === 1 ? elements[0] : <React.Fragment key={keyPrefix}>{elements}</React.Fragment>;
}

export default function ProfilePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [person, setPerson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<'bio' | 'scholars' | 'projects' | 'publications'>('bio');

  useEffect(() => {
    async function loadPersonData() {
      try {
        const res = await fetch(`/api/public/faculty/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.type === 'scholar') {
            setNotFoundState(true);
          } else {
            setPerson(data);
          }
        } else {
          // Fallback to static data (faculty only)
          const fStatic = FACULTY_MEMBERS.find((f) => f.id === id);

          if (fStatic) {
            setPerson(fStatic);
          } else {
            setNotFoundState(true);
          }
        }
      } catch (err) {
        console.error('Failed to load profile details:', err);
        const fStatic = FACULTY_MEMBERS.find((f) => f.id === id);

        if (fStatic) {
          setPerson(fStatic);
        } else {
          setNotFoundState(true);
        }
      } finally {
        setLoading(false);
      }
    }

    loadPersonData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3 font-sans">
        <div className="w-10 h-10 border-3 border-oxford border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium text-slate-500">Loading Profile Details...</span>
      </div>
    );
  }

  if (notFoundState || !person) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-6 text-center space-y-4 font-sans">
        <h2 className="text-2xl font-bold text-oxford">Faculty Member Not Found</h2>
        <p className="text-slate-500 text-sm">The requested faculty profile could not be found.</p>
        <Link href="/people" className="inline-block px-4 py-2 bg-oxford text-white font-semibold text-xs rounded shadow">
          Back to Faculty Directory
        </Link>
      </div>
    );
  }

  const isFaculty = person.type === 'faculty';
  const supervisedScholars = isFaculty ? person.students || [] : [];
  const facultyProjects = isFaculty ? person.projects || [
    {
      id: 'p1',
      title: 'Development of Advanced Functional Materials for Energy Harvesting & Optoelectronics',
      agency: 'DST-SERB',
      role: 'Principal Investigator',
      duration: '2023 – 2026',
      amount: '₹48.50 Lakhs',
      status: 'Ongoing',
      description: 'Design and synthesis of novel oxide nanocomposites and 2D materials for high-efficiency solar cells and thermoelectric devices.',
    },
    {
      id: 'p2',
      title: 'Spectroscopic and Quantum Transport Investigation of Metamaterial Systems',
      agency: 'CSIR',
      role: 'Principal Investigator',
      duration: '2021 – 2024',
      amount: '₹32.00 Lakhs',
      status: 'Ongoing',
      description: 'Experimental study of nonlinear optical phenomena and electronic transport anomalies in topological insulators.',
    },
    {
      id: 'p3',
      title: 'Synthesis and Characterization of Conducting Polymer Multiferroic Hybrids',
      agency: 'UGC-DAE CSR',
      role: 'Co-Principal Investigator',
      duration: '2019 – 2022',
      amount: '₹24.00 Lakhs',
      status: 'Completed',
      description: 'Investigation of magnetoelectric coupling in flexible polymer-ceramic composite thin films.',
    },
  ] : [];
  const facultyPublications = isFaculty ? person.publications || [] : [];

  return (
    <div className="pb-20 relative font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pt-6 sm:pt-10 space-y-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-base sm:text-lg font-sans font-semibold text-slate-500 pb-2 border-b border-slate-100">
          <Link href="/" className="hover:text-cyan-dark transition-colors">Home</Link>
          <span>&gt;</span>
          <Link href="/people" className="hover:text-cyan-dark transition-colors">Faculty</Link>
          <span>&gt;</span>
          <span className="text-oxford font-bold">{person.name}</span>
        </div>
        
        {/* Top Details Block: Left Photo, Right Text (Flat, borderless) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
          
          {/* Left Column: Photo (large, rectangular, sharp, no border) */}
          <div className="md:col-span-7 shrink-0 md:-ml-8">
            <div className="relative w-full aspect-[4/3] bg-slate-50 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
              <img
                src={person.image || '/faculty.png'}
                alt={person.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column: Left-aligned details block */}
          <div className="md:col-span-5 flex flex-col justify-center font-sans space-y-5 text-left">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-oxford leading-tight">
              {person.name}
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 font-semibold tracking-wide">
              {isFaculty ? (person.designation || 'Faculty Member') : 'Ph.D. Research Scholar'}
            </p>

            <div className="h-px bg-slate-200 w-full my-2" />

            <div className="space-y-3.5 text-base sm:text-lg text-slate-700">
              {isFaculty && (
                <p>
                  <strong className="text-oxford font-bold">Department:</strong> {person.department || 'Department of Physics, CUSAT'}
                </p>
              )}

              {isFaculty && person.qualification && (
                <p>
                  <strong className="text-oxford font-bold">Qualification:</strong> {person.qualification}
                </p>
              )}

              <p>
                <strong className="text-oxford font-bold">Email:</strong>{' '}
                <a href={`mailto:${person.email}`} className="text-cyan-dark hover:text-cyan-accent underline font-semibold">
                  {person.email}
                </a>
              </p>

              {isFaculty && person.phone && (
                <p>
                  <strong className="text-oxford font-bold">Phone:</strong> {person.phone}
                </p>
              )}

              {isFaculty && person.room && (
                <p>
                  <strong className="text-oxford font-bold">Office Room:</strong> {person.room}
                </p>
              )}

              {!isFaculty && person.supervisor && (
                <p>
                  <strong className="text-oxford font-bold">Supervisor:</strong> {person.supervisor}
                </p>
              )}

              {isFaculty && person.cvUrl && (
                <p className="pt-2">
                  <strong className="text-oxford font-bold">Curriculum Vitae:</strong>{' '}
                  <a
                    href={person.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-cyan-dark hover:text-cyan-accent underline font-bold"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download CV (PDF)</span>
                  </a>
                </p>
              )}
            </div>

            {/* Social & Academic Profile Badges (Blue Theme) */}
            {isFaculty && (person.socialLinks || person.customProfiles) && (
              <div className="pt-4 flex flex-wrap gap-2.5">
                {person.socialLinks?.scholar && (
                  <a
                    href={person.socialLinks.scholar}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold px-4 py-2 rounded-xl border border-blue-600 transition-all shadow-sm"
                  >
                    <span>Google Scholar</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                )}
                {person.socialLinks?.scopus && (
                  <a
                    href={person.socialLinks.scopus}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold px-4 py-2 rounded-xl border border-blue-600 transition-all shadow-sm"
                  >
                    <span>Scopus</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                )}
                {person.socialLinks?.orcid && (
                  <a
                    href={person.socialLinks.orcid}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold px-4 py-2 rounded-xl border border-blue-600 transition-all shadow-sm"
                  >
                    <span>ORCID iD</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                )}
                {person.socialLinks?.linkedin && (
                  <a
                    href={person.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold px-4 py-2 rounded-xl border border-blue-600 transition-all shadow-sm"
                  >
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                )}
                {person.socialLinks?.website && (
                  <a
                    href={person.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold px-4 py-2 rounded-xl border border-blue-600 transition-all shadow-sm"
                  >
                    <span>Personal Website</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                )}
                {Array.isArray(person.customProfiles) &&
                  person.customProfiles.map((cp: any, idx: number) => (
                    <a
                      key={idx}
                      href={cp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold px-4 py-2 rounded-xl border border-blue-600 transition-all shadow-sm"
                    >
                      <span>{cp.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabbed Navigation Component */}
        <div>
          <div className="flex border-b border-slate-200 justify-start overflow-x-auto">
            <button
              onClick={() => setActiveTab('bio')}
              className={`px-6 sm:px-8 py-5 font-bold text-base sm:text-lg border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'bio'
                  ? 'border-oxford text-oxford'
                  : 'border-transparent text-slate-500 hover:text-oxford'
              }`}
            >
              Biography
            </button>

            {isFaculty && (
              <button
                onClick={() => setActiveTab('scholars')}
                className={`px-6 sm:px-8 py-5 font-bold text-base sm:text-lg border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'scholars'
                    ? 'border-oxford text-oxford'
                    : 'border-transparent text-slate-500 hover:text-oxford'
                }`}
              >
                Guided Scholars ({supervisedScholars.length})
              </button>
            )}

            {isFaculty && (
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-6 sm:px-8 py-5 font-bold text-base sm:text-lg border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'projects'
                    ? 'border-oxford text-oxford'
                    : 'border-transparent text-slate-500 hover:text-oxford'
                }`}
              >
                Research Projects ({facultyProjects.length})
              </button>
            )}

            {isFaculty && (
              <button
                onClick={() => setActiveTab('publications')}
                className={`px-6 sm:px-8 py-5 font-bold text-base sm:text-lg border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'publications'
                    ? 'border-oxford text-oxford'
                    : 'border-transparent text-slate-500 hover:text-oxford'
                }`}
              >
                Publications ({facultyPublications.length})
              </button>
            )}
          </div>

          <div className="py-8 min-h-[220px]">
            {/* Biography Tab */}
            {activeTab === 'bio' && (
              <div className="space-y-4 text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-oxford font-serif">Biography & Academic Background</h3>
                <div className="prose max-w-none text-slate-700 text-base sm:text-lg">
                  {renderMarkdown(person.bio)}
                </div>
              </div>
            )}

            {/* Supervised Scholars Tab */}
            {activeTab === 'scholars' && isFaculty && (
              <div className="space-y-8 text-left font-sans">
                <h3 className="text-xl sm:text-2xl font-bold text-oxford font-serif">Guided Students &amp; Ph.D. Scholars</h3>

                {supervisedScholars.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {supervisedScholars.map((sch: any) => {
                      const scholarPerson: Scholar = {
                        id: String(sch.id || sch.name),
                        name: sch.name,
                        type: 'scholar',
                        supervisor: person.name,
                        topic: sch.description || sch.topic || '',
                        image: sch.image || '/faculty.png',
                      };
                      return (
                        <div key={sch.id || sch.name} className="h-full">
                          <FacultyCard person={scholarPerson} />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-base text-slate-400 italic">No guided students or Ph.D. scholars currently listed.</p>
                )}
              </div>
            )}

            {/* Research Projects Tab */}
            {activeTab === 'projects' && isFaculty && (
              <div className="space-y-6 text-left font-sans">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-bold text-oxford font-serif">
                    Funded &amp; Sponsored Research Projects
                  </h3>
                  <span className="text-xs sm:text-sm font-semibold text-oxford bg-slate-100 border border-slate-200 px-3.5 py-1 rounded-full">
                    {facultyProjects.length} Projects
                  </span>
                </div>

                {facultyProjects.length > 0 ? (
                  <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-oxford text-white text-xs uppercase tracking-wider font-bold">
                          <th className="py-4 px-5">Project Title &amp; Details</th>
                          <th className="py-4 px-4 whitespace-nowrap">Agency &amp; Status</th>
                          <th className="py-4 px-4 whitespace-nowrap">Role</th>
                          <th className="py-4 px-4 whitespace-nowrap">Duration</th>
                          <th className="py-4 px-4 whitespace-nowrap">Grant Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                        {facultyProjects.map((proj: any, idx: number) => (
                          <tr key={proj.id || idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-4 px-5 space-y-1.5 align-top min-w-[280px]">
                              <div className="font-bold text-oxford text-base leading-snug">
                                {proj.title}
                              </div>
                              {proj.description && (
                                <p className="text-xs text-slate-600 leading-relaxed">
                                  {proj.description}
                                </p>
                              )}
                              {proj.otherFaculty && (
                                <div className="text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded border border-slate-200 inline-block">
                                  <span className="font-semibold text-oxford">Co-Faculty:</span> {proj.otherFaculty}
                                </div>
                              )}
                              {proj.externalLink && (
                                <div>
                                  <a
                                    href={proj.externalLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                                  >
                                    <span>Project Link</span>
                                    <ExternalLink className="w-3 h-3 opacity-80" />
                                  </a>
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-4 align-top whitespace-nowrap space-y-1.5">
                              {proj.agency && (
                                <div className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded inline-block border border-slate-200">
                                  {proj.agency}
                                </div>
                              )}
                              <div>
                                <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider ${
                                  proj.status === 'Ongoing'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                                }`}>
                                  {proj.status || 'Ongoing'}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4 align-top whitespace-nowrap text-xs font-semibold text-slate-800">
                              {proj.role || 'Principal Investigator'}
                            </td>
                            <td className="py-4 px-4 align-top whitespace-nowrap text-xs text-slate-600">
                              {proj.duration || 'N/A'}
                            </td>
                            <td className="py-4 px-4 align-top whitespace-nowrap text-xs font-bold text-oxford">
                              {proj.amount || 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-base text-slate-400 italic">No research projects currently listed.</p>
                )}
              </div>
            )}

            {/* Publications Tab */}
            {activeTab === 'publications' && isFaculty && (
              <div className="space-y-6 text-left font-sans">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-bold text-oxford font-serif">
                    Peer-Reviewed Publications &amp; Research Papers
                  </h3>
                  <span className="text-xs sm:text-sm font-semibold text-oxford bg-slate-100 border border-slate-200 px-3.5 py-1 rounded-full">
                    {facultyPublications.length} Publications
                  </span>
                </div>

                {facultyPublications.length > 0 ? (
                  <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-oxford text-white text-xs uppercase tracking-wider font-bold">
                          <th className="py-4 px-4 text-center w-12">#</th>
                          <th className="py-4 px-5">Paper Title &amp; Details</th>
                          <th className="py-4 px-4 whitespace-nowrap">Category</th>
                          <th className="py-4 px-4 whitespace-nowrap">Journal / Date</th>
                          <th className="py-4 px-4 text-right whitespace-nowrap">Link / DOI</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                        {facultyPublications.map((pub: any, idx: number) => (
                          <tr key={pub.id || idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-4 px-4 align-top text-center text-xs font-bold text-slate-400">
                              {idx + 1}
                            </td>
                            <td className="py-4 px-5 space-y-1.5 align-top min-w-[300px]">
                              <div className="font-bold text-oxford text-base leading-snug">
                                {pub.title}
                              </div>
                              {pub.authors && (
                                <p className="text-xs text-slate-700 font-medium">
                                  <span className="font-bold text-oxford">Authors:</span> {pub.authors}
                                </p>
                              )}
                              {pub.description && (
                                <p className="text-xs text-slate-600 leading-relaxed">
                                  {pub.description}
                                </p>
                              )}
                            </td>
                            <td className="py-4 px-4 align-top whitespace-nowrap">
                              <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider bg-indigo-100 text-indigo-900 border border-indigo-200">
                                {pub.category || 'Journal Article'}
                              </span>
                            </td>
                            <td className="py-4 px-4 align-top whitespace-nowrap space-y-1">
                              {pub.journal && (
                                <p className="text-xs font-semibold text-oxford italic font-serif">
                                  {pub.journal}
                                </p>
                              )}
                              {pub.publicationDate && (
                                <p className="text-xs text-slate-500">
                                  {new Date(pub.publicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </p>
                              )}
                            </td>
                            <td className="py-4 px-4 align-top text-right whitespace-nowrap space-y-1.5">
                              {pub.externalLink && (
                                <div>
                                  <a
                                    href={pub.externalLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shadow-xs"
                                  >
                                    <span>View Paper</span>
                                    <ExternalLink className="w-3 h-3 opacity-80" />
                                  </a>
                                </div>
                              )}
                              {pub.doi && (
                                <p className="text-[11px] font-mono text-slate-500">
                                  DOI: {pub.doi}
                                </p>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-base text-slate-400 italic">No publications listed for this faculty member yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
