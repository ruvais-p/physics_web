'use client';

import React, { use, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Wrench,
  Users,
  ArrowLeft,
  User,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { FACILITIES, FACULTY_MEMBERS } from '@/lib/data';

interface PageProps {
  params: Promise<{ id: string }>;
}

interface FacultyAssociated {
  id: string;
  name: string;
  email?: string;
  designation?: string | null;
  department?: string | null;
  image?: string | null;
  documents?: { image?: string | null } | null;
}

interface FacilityDetailData {
  id: string;
  name: string;
  description: string;
  image?: string | null;
  faculties?: FacultyAssociated[];
}

// Markdown Parser Helper Function
function renderMarkdown(md: string) {
  if (!md || !md.trim()) {
    return <p className="text-slate-600 leading-relaxed text-base font-sans italic">No facility description added yet.</p>;
  }

  const lines = md.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = () => {
    if (currentList) {
      if (currentList.type === 'ul') {
        elements.push(
          <ul key={`ul_${elements.length}`} className="list-disc ml-6 space-y-2 my-4 text-base text-slate-700 font-sans leading-relaxed">
            {currentList.items.map((item, idx) => (
              <li key={idx}>{parseInlineMarkdown(item)}</li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`ol_${elements.length}`} className="list-decimal ml-6 space-y-2 my-4 text-base text-slate-700 font-sans leading-relaxed">
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
      elements.push(<div key={`br_${index}`} className="h-3" />);
      return;
    }

    if (trimmed.startsWith('# ')) {
      elements.push(
        <h2 key={index} className="text-2xl sm:text-3xl font-serif font-bold text-oxford mt-8 mb-3 border-b border-slate-200 pb-2">
          {parseInlineMarkdown(trimmed.slice(2))}
        </h2>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h3 key={index} className="text-xl sm:text-2xl font-serif font-bold text-oxford mt-6 mb-2 text-cyan-900">
          {parseInlineMarkdown(trimmed.slice(3))}
        </h3>
      );
    } else if (trimmed.startsWith('### ')) {
      elements.push(
        <h4 key={index} className="text-base sm:text-lg font-bold font-sans uppercase tracking-wider text-cyan-600 mt-5 mb-1.5">
          {parseInlineMarkdown(trimmed.slice(4))}
        </h4>
      );
    } else if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote key={index} className="border-l-4 border-cyan-500 pl-4 py-2.5 my-4 bg-cyan-50/60 rounded-r-xl text-slate-700 italic text-sm sm:text-base font-serif">
          {parseInlineMarkdown(trimmed.slice(2))}
        </blockquote>
      );
    } else {
      elements.push(
        <p key={index} className="text-base text-slate-700 font-sans leading-relaxed my-2">
          {parseInlineMarkdown(trimmed)}
        </p>
      );
    }
  });

  flushList();
  return <div className="space-y-1">{elements}</div>;
}

function parseInlineMarkdown(text: string): React.ReactNode {
  const regex = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3|(`)(.*?)\5/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index));
    }

    if (match[1]) {
      elements.push(<strong key={`b_${keyIndex++}`} className="font-bold text-slate-900">{match[2]}</strong>);
    } else if (match[3]) {
      elements.push(<em key={`i_${keyIndex++}`} className="italic text-slate-800">{match[4]}</em>);
    } else if (match[5]) {
      elements.push(<code key={`c_${keyIndex++}`} className="bg-slate-100 text-cyan-800 px-1.5 py-0.5 rounded font-mono text-xs border border-slate-200">{match[6]}</code>);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements.length === 1 ? elements[0] : <React.Fragment key={`frag_${keyIndex}`}>{elements}</React.Fragment>;
}

export default function FacilityDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [facility, setFacility] = useState<FacilityDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFacilityDetail() {
      setLoading(true);
      try {
        const res = await fetch(`/api/facilities/${id}`);
        if (res.ok) {
          const data = await res.json();
          setFacility(data);
          return;
        }
      } catch (err) {
        console.error('Failed to fetch facility details:', err);
      }

      // Static fallback
      const staticFac = FACILITIES.find((f) => f.id === id);
      if (staticFac) {
        setFacility({
          id: staticFac.id,
          name: staticFac.name,
          description: staticFac.description,
          image: staticFac.image,
          faculties: FACULTY_MEMBERS.slice(0, 2).map((f) => ({
            id: f.id,
            name: f.name,
            email: f.email,
            designation: f.designation,
            image: f.image,
          })),
        });
      }
      setLoading(false);
    }

    fetchFacilityDetail().finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 font-serif text-slate-800">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-oxford border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold">Loading Facility Details...</p>
        </div>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center space-y-4 font-sans">
        <Wrench className="w-16 h-16 text-slate-400 mx-auto" />
        <h1 className="text-3xl font-bold font-serif text-oxford">Facility Not Found</h1>
        <p className="text-slate-600 text-sm">The department facility you requested could not be found.</p>
        <Link
          href="/facilities"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-oxford text-white font-semibold text-xs uppercase tracking-wider hover:bg-cyan-900 transition-colors shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Facilities
        </Link>
      </div>
    );
  }

  const heroImage = facility.image || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80';

  return (
    <div className="space-y-12 pb-24 relative font-sans">
      {/* Facility Hero Image Banner - Matches Homepage Hero Height */}
      <div className="-mt-[140px] sm:-mt-[165px] lg:-mt-[180px] relative w-full bg-slate-900 text-white overflow-hidden min-h-[620px] sm:min-h-[720px] lg:min-h-[780px] flex items-center justify-center">
        {/* Background Image with Top Blue Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt={facility.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#002147]/80 via-[#002147]/30 to-transparent" />
        </div>

        {/* Hero Content (Centered Text) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 text-center space-y-4 pt-16 sm:pt-20 lg:pt-24">
          {/* Breadcrumbs Above Title - Enlarged */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xl sm:text-2xl lg:text-3xl font-sans font-bold text-slate-100 drop-shadow-md">
            <Link href="/" className="hover:text-cyan-accent transition-colors">Home</Link>
            <span>&gt;</span>
            <Link href="/facilities" className="hover:text-cyan-accent transition-colors">Facilities</Link>
            <span>&gt;</span>
            <span className="text-white font-extrabold truncate max-w-[200px] sm:max-w-none">{facility.name}</span>
          </div>

          <span className="inline-block bg-white/20 backdrop-blur-md text-cyan-200 border border-white/30 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
            Central Department Facility
          </span>
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight leading-tight drop-shadow-lg">
            {facility.name}
          </h1>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">
        {/* Left 2 Columns: Full Markdown Facility Description */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-800 flex items-center justify-center border border-cyan-200">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-serif text-oxford">About the Facility</h2>
                <p className="text-xs text-slate-500 font-sans">Specifications, capabilities, and usage instructions</p>
              </div>
            </div>

            {/* Markdown Rendered Content */}
            <div className="prose max-w-none">
              {renderMarkdown(facility.description)}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Associated Faculty Members */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 sticky top-28">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif text-oxford">Associated Faculty</h3>
                <p className="text-xs text-slate-500 font-sans">Faculty In-Charge & Advisors</p>
              </div>
            </div>

            {!facility.faculties || facility.faculties.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No faculty members linked to this facility yet.</p>
            ) : (
              <div className="space-y-3">
                {facility.faculties.map((fac) => {
                  const facImg = fac.documents?.image || fac.image || '/cvs/cv_placeholder.pdf';
                  const isDefaultImg = facImg.endsWith('.pdf');

                  return (
                    <Link
                      key={fac.id}
                      href={`/people/${fac.id}`}
                      className="group block p-3.5 rounded-2xl border border-slate-100 hover:border-cyan-500/40 bg-slate-50/60 hover:bg-cyan-50/40 transition-all duration-200 shadow-xs"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-oxford/10 overflow-hidden shrink-0 border border-slate-200 relative">
                          {!isDefaultImg ? (
                            <Image
                              src={facImg}
                              alt={fac.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-oxford bg-slate-100">
                              <User className="w-6 h-6" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-oxford group-hover:text-cyan-700 transition-colors font-serif truncate">
                            {fac.name}
                          </h4>
                          <p className="text-xs text-slate-500 font-sans truncate">
                            {fac.designation || 'Faculty Member'}
                          </p>
                          {fac.email && (
                            <p className="text-[11px] text-slate-400 font-mono truncate">
                              {fac.email}
                            </p>
                          )}
                        </div>

                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            <div className="pt-2">
              <Link
                href="/facilities"
                className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Research Facilities</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
