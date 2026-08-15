'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FACULTY_MEMBERS, SCHOLARS, FacultyMember, Scholar } from '@/lib/data';
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
  const [activeTab, setActiveTab] = useState<'bio' | 'scholars'>('bio');

  useEffect(() => {
    async function loadPersonData() {
      try {
        const res = await fetch(`/api/public/faculty/${id}`);
        if (res.ok) {
          const data = await res.json();
          setPerson(data);
        } else {
          // Fallback to static data
          const fStatic = FACULTY_MEMBERS.find((f) => f.id === id);
          const sStatic = SCHOLARS.find((s) => s.id === id);
          const pStatic = fStatic || sStatic;

          if (pStatic) {
            setPerson(pStatic);
          } else {
            setNotFoundState(true);
          }
        }
      } catch (err) {
        console.error('Failed to load profile details:', err);
        const fStatic = FACULTY_MEMBERS.find((f) => f.id === id);
        const sStatic = SCHOLARS.find((s) => s.id === id);
        const pStatic = fStatic || sStatic;

        if (pStatic) {
          setPerson(pStatic);
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

  return (
    <div className="pb-20 relative font-sans">
      {/* Top Banner */}
      <div className="-mt-[116px] sm:-mt-[128px] relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/faculty.png"
            alt="Faculty Banner"
            fill
            className="object-cover opacity-45"
            priority
          />
          <div className="absolute inset-0 bg-oxford/75 mix-blend-multiply" />
        </div>

        {/* Content (Centered) */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pt-36 pb-16 sm:pb-20 text-center space-y-3">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-widest text-slate-300 font-sans">
            {isFaculty ? 'Our Faculty' : 'Our Research Scholars'}
          </h2>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mt-2 text-white uppercase">
            {isFaculty ? 'OUR FACULTY' : 'OUR SCHOLARS'}
          </h1>
          
          {/* Centered Breadcrumbs */}
          <div className="flex items-center justify-center space-x-2 text-sm sm:text-base font-sans font-medium text-slate-300">
            <Link href="/" className="hover:text-cyan-accent transition-colors">Home</Link>
            <span>&gt;</span>
            <Link href="/people" className="hover:text-cyan-accent transition-colors">Faculty</Link>
            <span>&gt;</span>
            <span className="text-white font-semibold">{person.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-10 space-y-12">
        
        {/* Top Details Block: Left Photo, Right Text (Flat, borderless) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
          
          {/* Left Column: Photo (large, rectangular, sharp, no border) */}
          <div className="md:col-span-7 shrink-0 md:-ml-8">
            <div className="relative w-full aspect-[4/3] bg-slate-50 overflow-hidden border border-slate-100">
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

            {/* Social & Academic Profile Badges */}
            {isFaculty && (person.socialLinks || person.customProfiles) && (
              <div className="pt-4 flex flex-wrap gap-2.5">
                {person.socialLinks?.scholar && (
                  <a
                    href={person.socialLinks.scholar}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-semibold px-4 py-2 rounded border border-blue-200 transition-colors"
                  >
                    <span>Google Scholar</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>
                )}
                {person.socialLinks?.scopus && (
                  <a
                    href={person.socialLinks.scopus}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 hover:bg-orange-100 text-sm font-semibold px-4 py-2 rounded border border-orange-200 transition-colors"
                  >
                    <span>Scopus</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>
                )}
                {person.socialLinks?.orcid && (
                  <a
                    href={person.socialLinks.orcid}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-lime-50 text-lime-700 hover:bg-lime-100 text-sm font-semibold px-4 py-2 rounded border border-lime-200 transition-colors"
                  >
                    <span>ORCID iD</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>
                )}
                {person.socialLinks?.linkedin && (
                  <a
                    href={person.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 text-sm font-semibold px-4 py-2 rounded border border-sky-200 transition-colors"
                  >
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>
                )}
                {person.socialLinks?.website && (
                  <a
                    href={person.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-cyan-50 text-cyan-800 hover:bg-cyan-100 text-sm font-semibold px-4 py-2 rounded border border-cyan-200 transition-colors"
                  >
                    <span>Personal Website</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>
                )}
                {Array.isArray(person.customProfiles) &&
                  person.customProfiles.map((cp: any, idx: number) => (
                    <a
                      key={idx}
                      href={cp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 text-sm font-semibold px-4 py-2 rounded border border-purple-200 transition-colors"
                    >
                      <span>{cp.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </a>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabbed Navigation Component */}
        <div>
          <div className="flex border-b border-slate-200 justify-start">
            <button
              onClick={() => setActiveTab('bio')}
              className={`px-8 py-5 font-bold text-base sm:text-lg border-b-2 transition-all cursor-pointer ${
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
                className={`px-8 py-5 font-bold text-base sm:text-lg border-b-2 transition-all cursor-pointer ${
                  activeTab === 'scholars'
                    ? 'border-oxford text-oxford'
                    : 'border-transparent text-slate-500 hover:text-oxford'
                }`}
              >
                Guided Scholars ({supervisedScholars.length})
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
              <div className="space-y-8 text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-oxford font-serif">Guided Students & Ph.D. Scholars</h3>

                {supervisedScholars.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {supervisedScholars.map((sch: any) => (
                      <div key={sch.id} className="flex items-start space-x-4 p-4 border border-slate-200 rounded-xl bg-slate-50">
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-white relative">
                          {sch.image ? (
                            <img src={sch.image} alt={sch.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-10 h-10 m-auto text-slate-400 mt-3" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block text-base sm:text-lg font-bold text-oxford">{sch.name}</span>
                          {sch.description && (
                            <p className="text-sm text-slate-600 mt-1 leading-relaxed line-clamp-3">
                              {sch.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-base text-slate-400 italic">No guided students or Ph.D. scholars currently listed.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
