'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { ExternalLink, FlaskConical, Users, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import Hero from '@/components/Hero';
import { sanitizeWebUrl } from '@/lib/url-security';

// Markdown Parser Helper Function
function renderMarkdown(md: string) {
  if (!md || !md.trim()) {
    return <p className="text-base text-slate-500 italic">No About Us content available yet.</p>;
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
      <p key={index} className="text-base sm:text-lg lg:text-[20px] text-slate-700 leading-relaxed lg:leading-[1.75] font-sans font-normal text-justify my-5">
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

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<{ content: string; image: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/about')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setAboutData(data);
        }
      })
      .catch((err) => console.error('Failed to fetch about us details:', err))
      .finally(() => setLoading(false));
  }, []);

  const bannerImage = aboutData?.image || '/campus.jpg';

  return (
    <div className="pb-24 relative">
      {/* Hero Header matching main homepage design */}
      <Hero
        title="ABOUT DEPARTMENT"
        badge="HOME > ABOUT"
        subtitle="Advancing fundamental physics, materials science, quantum technology, and photonics since 1963."
        bgImage={bannerImage}
      />

      {/* Main Content Area: Simplified, Clean, left-aligned, large text */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 py-16">
        <div className="max-w-4xl space-y-8 text-left">
          {/* Section Heading */}


          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-500 font-sans">
              <div className="w-8 h-8 border-3 border-oxford border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">Loading About Us content...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {renderMarkdown(aboutData?.content || '')}

              {/* Quick Navigation / Discover More Section */}
              <div className="pt-16 border-t border-slate-200 mt-16 space-y-8 font-sans">
                <div className="space-y-2 text-left">
                  <div className="text-xs font-bold uppercase tracking-widest text-cyan-dark flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-accent" />
                    <span>Explore Department</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-oxford">
                    Discover More at Physics CUSAT
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                    Explore our research frontiers, meet our academic community, and stay updated with upcoming scientific lectures and workshops.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  {/* Research Card */}
                  <Link
                    href="/research"
                    className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-cyan-500/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-oxford/10 text-oxford group-hover:bg-oxford group-hover:text-cyan-accent flex items-center justify-center transition-colors duration-300 shadow-xs">
                        <FlaskConical className="w-6 h-6" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="font-serif text-xl font-bold text-oxford group-hover:text-cyan-dark transition-colors">
                          Research &amp; Labs
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          Pioneering breakthroughs in quantum materials, photonics, and condensed matter physics.
                        </p>
                      </div>
                    </div>
                    <div className="pt-6 flex items-center gap-2 text-xs sm:text-sm font-bold text-oxford group-hover:text-cyan-dark transition-colors">
                      <span>Explore Laboratories</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>

                  {/* People Card */}
                  <Link
                    href="/people"
                    className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-cyan-500/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-accent/15 text-cyan-dark group-hover:bg-oxford group-hover:text-cyan-accent flex items-center justify-center transition-colors duration-300 shadow-xs">
                        <Users className="w-6 h-6" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="font-serif text-xl font-bold text-oxford group-hover:text-cyan-dark transition-colors">
                          Faculty &amp; Scholars
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          Distinguished faculty, principal investigators, and passionate Ph.D. research scholars.
                        </p>
                      </div>
                    </div>
                    <div className="pt-6 flex items-center gap-2 text-xs sm:text-sm font-bold text-oxford group-hover:text-cyan-dark transition-colors">
                      <span>Meet Our People</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>

                  {/* Events Card */}
                  <Link
                    href="/events"
                    className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-cyan-500/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-oxford/10 text-oxford group-hover:bg-oxford group-hover:text-cyan-accent flex items-center justify-center transition-colors duration-300 shadow-xs">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="font-serif text-xl font-bold text-oxford group-hover:text-cyan-dark transition-colors">
                          News &amp; Events
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          Memorial lectures, conferences, hands-on workshops, and national symposiums.
                        </p>
                      </div>
                    </div>
                    <div className="pt-6 flex items-center gap-2 text-xs sm:text-sm font-bold text-oxford group-hover:text-cyan-dark transition-colors">
                      <span>View Upcoming Events</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
