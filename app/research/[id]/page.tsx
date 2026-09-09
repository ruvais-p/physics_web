'use client';

import React, { use, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Hero from '@/components/Hero';
import FacultyCard from '@/components/FacultyCard';
import {
  FlaskConical,
  Users,
  MapPin,
  Building2,
  User,
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import type { FacultyMember } from '@/lib/data';
import { sanitizeWebUrl } from '@/lib/url-security';

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

interface LabDetailData {
  id: string;
  name: string;
  category?: string | null;
  description: string;
  image?: string | null;
  faculties?: FacultyAssociated[];
}

// Markdown Parser Helper Functions (Matching Events Detail Page)
function renderMarkdown(md: string) {
  if (!md || !md.trim()) {
    return <p className="text-base text-slate-500 italic">No laboratory description available yet.</p>;
  }

  const lines = md.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = () => {
    if (currentList) {
      if (currentList.type === 'ul') {
        elements.push(
          <ul key={`ul_${elements.length}`} className="list-disc ml-6 space-y-2.5 my-4 text-base sm:text-lg lg:text-[20px] leading-relaxed text-slate-700 font-sans">
            {currentList.items.map((item, idx) => (
              <li key={idx}>{parseInlineMarkdown(item)}</li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`ol_${elements.length}`} className="list-decimal ml-6 space-y-2.5 my-4 text-base sm:text-lg lg:text-[20px] leading-relaxed text-slate-700 font-sans">
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
      return;
    }

    if (trimmed.startsWith('# ')) {
      elements.push(
        <h2 key={index} className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-oxford font-serif mt-8 mb-4">
          {parseInlineMarkdown(trimmed.slice(2))}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      elements.push(
        <h3 key={index} className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 font-serif mt-6 mb-3">
          {parseInlineMarkdown(trimmed.slice(3))}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h4 key={index} className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 font-serif mt-5 mb-2">
          {parseInlineMarkdown(trimmed.slice(4))}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote key={index} className="border-l-4 border-cyan-accent pl-5 py-3 my-5 italic text-slate-700 font-sans text-base sm:text-lg lg:text-[20px] leading-relaxed bg-slate-50/70 rounded-r-xl">
          {parseInlineMarkdown(trimmed.slice(2))}
        </blockquote>
      );
      return;
    }

    elements.push(
      <p key={index} className="text-base sm:text-lg lg:text-[20px] text-slate-700 leading-relaxed lg:leading-[1.75] font-sans font-normal my-4">
        {parseInlineMarkdown(trimmed)}
      </p>
    );
  });

  flushList();
  return <div className="space-y-3 font-sans">{elements}</div>;
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
        <a key={keyIdx++} href={sanitizeWebUrl(url) || '#'} target="_blank" rel="noopener noreferrer" className="text-cyan-accent hover:underline font-semibold inline-flex items-center gap-0.5">
          <span>{label}</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
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
      elements.push(<strong key={`${keyPrefix}_b_${match.index}`} className="font-bold text-slate-900">{match[2]}</strong>);
    } else if (match[3]) {
      elements.push(<em key={`${keyPrefix}_i_${match.index}`} className="italic text-slate-800">{match[4]}</em>);
    } else if (match[5]) {
      elements.push(<code key={`${keyPrefix}_c_${match.index}`} className="bg-slate-100 text-oxford px-1.5 py-0.5 rounded font-mono text-sm">{match[6]}</code>);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements.length === 1 ? elements[0] : <React.Fragment key={keyPrefix}>{elements}</React.Fragment>;
}

export default function ResearchLabDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [lab, setLab] = useState<LabDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLabDetail() {
      setLoading(true);
      try {
        const res = await fetch(`/api/research/${id}`);
        if (res.ok) {
          const data = await res.json();
          setLab(data);
          return;
        }
      } catch (err) {
        console.error('Failed to fetch research lab details:', err);
      }

      setLoading(false);
    }

    fetchLabDetail().finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 font-sans text-slate-800">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-oxford border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold">Loading Laboratory Details...</p>
        </div>
      </div>
    );
  }

  if (!lab) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center space-y-4 font-sans">
        <FlaskConical className="w-16 h-16 text-slate-400 mx-auto" />
        <h1 className="text-3xl font-bold font-serif text-oxford">Laboratory Not Found</h1>
        <p className="text-slate-600 text-sm">The research laboratory you requested could not be found.</p>
        <Link
          href="/research"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-oxford text-white font-semibold text-xs uppercase tracking-wider hover:bg-cyan-900 transition-colors shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Research Laboratories
        </Link>
      </div>
    );
  }

  const heroImage = lab.image || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80';

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Hero Header matching main About & Events design with center-aligned text */}
      <Hero
        title={lab.name}
        badge="HOME > RESEARCH"
        subtitle=""
        bgImage={heroImage}
        align="center"
      />

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 mt-10 sm:mt-12 space-y-10">
        
        {/* 1. Category, Faculty Lead, Location Info Strip (Displayed Under the Hero Image) */}
        <div className="flex flex-wrap items-center justify-start gap-y-4 gap-x-8 sm:gap-x-12 pb-8 border-b border-slate-200 text-slate-700 font-sans">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-oxford/10 text-oxford flex items-center justify-center shrink-0">
              <FlaskConical className="w-5 h-5 text-oxford" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Domain / Field</span>
              <span className="text-base sm:text-lg font-bold text-oxford">{lab.category || 'Advanced Physics Research'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-accent/10 text-cyan-accent flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-cyan-accent" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Faculty Members</span>
              <span className="text-base sm:text-lg font-bold text-oxford">
                {lab.faculties && lab.faculties.length > 0
                  ? `${lab.faculties.length} Associated Researcher${lab.faculties.length > 1 ? 's' : ''}`
                  : 'Faculty Lead'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-oxford/10 text-oxford flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-oxford" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Location / Department</span>
              <span className="text-base sm:text-lg font-bold text-oxford">Department of Physics, CUSAT</span>
            </div>
          </div>
        </div>

        {/* 2. Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 sm:gap-16">
          
          {/* Left Column (2/3): Description & Associated Faculty */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Description of the Laboratory (Structured Markdown Content) */}
            <div className="space-y-6 pb-12 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-oxford" />
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-oxford">
                  About the Laboratory
                </h2>
              </div>

              <div className="text-slate-700 leading-relaxed font-sans">
                {renderMarkdown(lab.description || '')}
              </div>
            </div>

            {/* Associated Faculty / Researchers (Under About the Laboratory with FacultyCard) */}
            {lab.faculties && lab.faculties.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-oxford" />
                    <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-oxford">
                      Associated Faculty / Researchers
                    </h2>
                  </div>
                  <span className="text-xs font-mono font-bold text-oxford bg-oxford/10 px-3.5 py-1.5 rounded-full">
                    {lab.faculties.length} Researcher{lab.faculties.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 font-sans">
                  {lab.faculties.map((fac) => {
                    const person: FacultyMember = {
                      id: fac.id,
                      name: fac.name,
                      designation: fac.designation || 'Faculty Member',
                      qualification: 'Ph.D.',
                      email: fac.email || '',
                      phone: '',
                      room: '',
                      researchFocus: [],
                      bio: '',
                      publicationsCount: 0,
                      citations: 0,
                      image: fac.documents?.image || fac.image || '/faculty.png',
                      type: 'faculty',
                    };

                    return (
                      <Link key={fac.id} href={`/people/${fac.id}`} className="block h-full">
                        <FacultyCard person={person} />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Right Column (1/3 Sidebar): Laboratory Info & Department Contact */}
          <div className="space-y-10 lg:pl-4">

            {/* Quick Overview */}
            <div className="space-y-3 pb-8 border-b border-slate-200 font-sans">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Research Facility
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-oxford font-bold text-sm">
                  <FlaskConical className="w-4 h-4 text-cyan-accent" />
                  <span>{lab.name}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {lab.category || 'Specialized Research Facility'} • Advanced Physics Division
                </p>
              </div>
            </div>

            {/* Department Venue & Contact */}
            <div className="space-y-4 font-sans">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-oxford" />
                <span>Host Department</span>
              </div>

              <div className="space-y-1.5 text-sm sm:text-base text-slate-600 leading-relaxed">
                <p className="font-bold text-oxford">Department of Physics</p>
                <p>Cochin University of Science and Technology (CUSAT)</p>
                <p>Kochi - 682022, Kerala, India</p>
              </div>

              <div className="pt-4 space-y-3">
                <Link
                  href="/research"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-oxford hover:text-cyan-dark transition-colors"
                >
                  <span>Explore all research laboratories</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
                <div>
                  <Link
                    href="/people"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-dark hover:text-cyan-accent transition-colors"
                  >
                    <span>View all department faculty & scholars</span>
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
