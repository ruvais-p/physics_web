import React from 'react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import FacultyCard from '@/components/FacultyCard';
import {
  Wrench,
  Users,
  ArrowLeft,
  FileText,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';
import type { FacultyMember, Scholar } from '@/lib/data';
import { sanitizeWebUrl } from '@/lib/url-security';
import { prisma } from '@/lib/prisma';

export const revalidate = 300;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const facilities = await prisma.facility.findMany({ select: { id: true } });
    return facilities.map((facility) => ({ id: facility.id }));
  } catch (error) {
    console.error('Failed to generate facility routes:', error);
    return [];
  }
}

interface FacultyAssociated {
  id: string;
  name: string;
  email?: string;
  designation?: string | null;
  department?: string | null;
  qualification?: string | null;
  room?: string | null;
  image?: string | null;
  documents?: { image?: string | null } | null;
}

interface ScholarAssociated {
  uid: string;
  name: string;
  description?: string | null;
  image?: string | null;
  createdAt: Date;
  expiryDate?: Date | null;
  faculty?: {
    name: string;
  } | null;
}

interface FacilityDetailData {
  id: string;
  name: string;
  description: string;
  image?: string | null;
  faculties?: FacultyAssociated[];
  students?: ScholarAssociated[];
}

// Markdown Parser Helper Functions (Matching Research & Events Detail Pages)
function renderMarkdown(md: string) {
  if (!md || !md.trim()) {
    return <p className="text-base text-slate-500 italic">No facility description available yet.</p>;
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

export default async function FacilityDetailPage({ params }: PageProps) {
  const { id } = await params;
  let facility: FacilityDetailData | null = null;

  try {
    facility = await prisma.facility.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        faculties: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            email: true,
            designation: true,
            department: true,
            bio: true,
            documents: { select: { image: true } },
          },
        },
        students: {
          select: {
            uid: true,
            name: true,
            description: true,
            image: true,
            createdAt: true,
            expiryDate: true,
            faculty: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error('Failed to fetch facility details:', error);
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

  const faculties = facility.faculties || [];
  const now = new Date();
  const scholars: Scholar[] = (facility.students || [])
    .filter((student) => {
      if (!student.expiryDate) return true;
      const exp = new Date(student.expiryDate);
      exp.setHours(23, 59, 59, 999);
      return exp >= now;
    })
    .map((student) => ({
      id: student.uid,
      name: student.name,
      supervisor: student.faculty?.name || 'Department Faculty',
      topic: student.description || '',
      joiningYear: student.createdAt ? new Date(student.createdAt).getFullYear() : undefined,
      image: student.image || '/faculty.png',
      expiryDate: student.expiryDate ? new Date(student.expiryDate).toISOString().slice(0, 10) : null,
      type: 'scholar' as const,
    }));

  const totalMembers = faculties.length + scholars.length;
  const heroImage = facility.image || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80';

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Hero Header matching main About, Research & Events design with center-aligned text */}
      <Hero
        title={facility.name}
        badge="HOME > FACILITIES"
        subtitle=""
        bgImage={heroImage}
        align="center"
      />

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 mt-10 sm:mt-12 space-y-10">
        
        {/* 1. Facility Type Info Strip (Displayed Under the Hero Image) */}
        <div className="flex flex-wrap items-center justify-start gap-y-4 gap-x-8 sm:gap-x-12 pb-8 border-b border-slate-200 text-slate-700 font-sans">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-oxford/10 text-oxford flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5 text-oxford" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Instrumentation / Type</span>
              <span className="text-base sm:text-lg font-bold text-oxford">Central Research Facility</span>
            </div>
          </div>
        </div>

        {/* 2. Main Content Container */}
        <div className="space-y-12 max-w-5xl">
          
          {/* Description of the Facility (Structured Markdown Content) */}
          <div className="space-y-6 pb-12 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-oxford" />
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-oxford">
                About the Facility
              </h2>
            </div>

            <div className="text-slate-700 leading-relaxed font-sans">
              {renderMarkdown(facility.description || '')}
            </div>
          </div>

          {/* Members (Faculty & Scholars) */}
          {totalMembers > 0 && (
            <div className="space-y-10">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-oxford" />
                  <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-oxford">
                    Members
                  </h2>
                </div>
                <span className="text-xs font-mono font-bold text-oxford bg-oxford/10 px-3.5 py-1.5 rounded-full">
                  {totalMembers} Member{totalMembers > 1 ? 's' : ''}
                </span>
              </div>

              {/* Faculty In-Charge */}
              {faculties.length > 0 && (
                <div className="space-y-6">
                  {scholars.length > 0 && (
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg sm:text-xl font-bold font-serif text-oxford">
                        Faculty In-Charge
                      </h3>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 font-sans">
                    {faculties.map((fac) => {
                      const person: FacultyMember = {
                        id: fac.id,
                        name: fac.name,
                        designation: fac.designation || 'Faculty Member',
                        qualification: fac.qualification || 'Ph.D.',
                        email: fac.email || '',
                        phone: '',
                        room: fac.room || '',
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

              {/* Research Scholars */}
              {scholars.length > 0 && (
                <div className="space-y-6 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-bold font-serif text-oxford flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-oxford" />
                      <span>Research Scholars</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 font-sans">
                    {scholars.map((sch) => (
                      <div key={sch.id} className="block h-full">
                        <FacultyCard person={sch} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Navigation Links */}
          <div className="pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 font-sans">
            <Link
              href="/facilities"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-oxford hover:text-cyan-accent transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Explore all facilities</span>
            </Link>
            <Link
              href="/people"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-dark hover:text-cyan-accent transition-colors"
            >
              <span>View all department faculty &amp; scholars</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
