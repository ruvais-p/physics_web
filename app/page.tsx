import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Hero, { type Slide } from '@/components/Hero';
import NotificationsTicker, { type NotificationItem } from '@/components/NotificationsTicker';
import HomeEvents, { type HomeEventItem } from '@/components/HomeEvents';
import JournalCard from '@/components/JournalCard';
import { RESEARCH_LABS, type Publication } from '@/lib/data';
import { prisma } from '@/lib/prisma';
import { sanitizeWebUrl } from '@/lib/url-security';
import { ChevronRight, ArrowRight } from 'lucide-react';

export const revalidate = 300;

async function getHomeHeroSlides(): Promise<Slide[]> {
  try {
    const slides = await prisma.hero.findMany({
      where: { is_visible: true },
      select: { id: true, title: true, description: true, image: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });

    return slides.map((slide, index) => ({
      id: String(slide.id),
      tab: `Slide ${index + 1}`,
      title: [slide.title],
      subtitle: slide.description,
      image: slide.image,
      overlay: 'rgba(0, 0, 0, 0.25)',
      titleColor: '#ffffff',
    }));
  } catch (error) {
    console.error('Failed to fetch home page hero slides:', error);
    return [];
  }
}

async function getHomeNotifications(): Promise<NotificationItem[]> {
  try {
    const notifications = await prisma.notification.findMany({
      where: { isActive: true },
      select: { id: true, title: true, category: true, link: true, date: true },
      orderBy: { date: 'desc' },
    });

    return notifications.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      link: sanitizeWebUrl(item.link) || '#',
      date: item.date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
    }));
  } catch (error) {
    console.error('Failed to fetch home page notifications:', error);
    return [];
  }
}

async function getHomeEvents(): Promise<HomeEventItem[]> {
  try {
    const events = await prisma.$queryRaw<any[]>`
      SELECT id, title, description, image, start_date AS "startDate", end_date AS "endDate", venue, apply_link
      FROM events
      ORDER BY start_date DESC
      LIMIT 3
    `;

    return events.map((event: any) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      image: event.image,
      startDate: event.startDate ? new Date(event.startDate).toISOString() : '',
      endDate: event.endDate ? new Date(event.endDate).toISOString() : null,
      date: event.startDate ? new Date(event.startDate).toISOString() : '',
      venue: event.venue,
      apply_link: event.apply_link,
    }));
  } catch (error) {
    console.error('Failed to fetch home page events from the database:', error);
    return [];
  }
}

async function getHomePublications(): Promise<Publication[]> {
  try {
    const publications = await prisma.facultyPublication.findMany({
      orderBy: [
        { publicationDate: { sort: 'desc', nulls: 'last' } },
        { createdAt: 'desc' },
      ],
      take: 4,
    });

    return publications.map((publication) => ({
      id: publication.id,
      title: publication.title,
      authors: publication.authors
        ? publication.authors.split(',').map((author) => author.trim()).filter(Boolean)
        : [],
      journal: publication.journal || '',
      year: publication.publicationDate?.getFullYear() ?? publication.createdAt.getFullYear(),
      volume: '',
      doi: publication.doi || '',
      citations: 0,
      category: publication.category || '',
      abstract: publication.description || '',
    }));
  } catch (error) {
    console.error('Failed to fetch home page publications from the database:', error);
    return [];
  }
}

const DEFAULT_ABOUT_CONTENT = `Established in 1971, the Department of Physics, CUSAT has maintained the highest standards in postgraduate education and scientific research. Over the years, the Department has become the premier destination for students in Kerala and across India seeking advanced studies in Physics. Our postgraduates and researchers are consistently placed in top faculty, postdoctoral, and Ph.D. positions at world-renowned research centers across the globe.

Going forward, the Department envisions continuing its mission of providing quality advanced training in Physics through its M.Sc., Integrated M.Sc., and Ph.D. research programs, driving fundamental scientific breakthroughs in materials science, quantum technology, and photonics.`;

async function getHomeAboutData(): Promise<{ content: string; image: string | null }> {
  try {
    const record = await prisma.aboutUs.findFirst({
      select: { content: true, image: true },
      orderBy: { id: 'asc' },
    });

    if (record && record.content && record.content.trim().length > 0) {
      return {
        content: record.content,
        image: record.image || null,
      };
    }
  } catch (error) {
    console.error('Failed to fetch About Us data for home page:', error);
  }

  return {
    content: DEFAULT_ABOUT_CONTENT,
    image: '/building-black-and-white.webp',
  };
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

function parseMarkdownText(text: string): React.ReactNode[] {
  let remaining = text;
  let keyIdx = 0;
  const parts: React.ReactNode[] = [];

  while (remaining) {
    const linkMatch = remaining.match(/^([\s\S]*?)\[([^\]]+)\]\(([^)]+)\)([\s\S]*)$/);
    if (linkMatch) {
      const [, before, label, url, after] = linkMatch;
      if (before) parts.push(parseFormatting(before, keyIdx++));
      parts.push(
        <a key={keyIdx++} href={sanitizeWebUrl(url) || '#'} target="_blank" rel="noopener noreferrer" className="text-cyan-accent hover:underline font-semibold inline-flex items-center gap-0.5">
          <span>{label}</span>
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

function LabCard({ lab, className = "h-64" }: { lab: typeof RESEARCH_LABS[0]; className?: string }) {
  const isLogo = lab.image === '/dop-logo.svg';

  return (
    <Link
      href={`/research/${lab.id}`}
      className={`group relative rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex items-center justify-center cursor-pointer ${className}`}
    >
      {isLogo ? (
        <div className="w-full h-full flex items-center justify-center bg-slate-50 p-6">
          <svg
            className="w-32 h-24 text-blue-600"
            viewBox="0 0 220 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text x="5" y="120" fontFamily="Georgia, 'Times New Roman', serif" fontSize="110" fontWeight="900" fill="currentColor">D</text>
            <g transform="translate(110, 80)">
              <ellipse cx="0" cy="0" rx="26" ry="74" stroke="currentColor" strokeWidth="2.5" fill="none" />
              <ellipse cx="0" cy="0" rx="26" ry="74" stroke="currentColor" strokeWidth="2.5" fill="none" transform="rotate(60)" />
              <ellipse cx="0" cy="0" rx="26" ry="74" stroke="currentColor" strokeWidth="2.5" fill="none" transform="rotate(-60)" />
              <circle cx="0" cy="0" r="15" fill="currentColor" />
            </g>
            <text x="150" y="120" fontFamily="Georgia, 'Times New Roman', serif" fontSize="110" fontWeight="900" fill="currentColor">P</text>
          </svg>
        </div>
      ) : (
        <Image
          src={lab.image}
          alt={lab.name}
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-2xl"
        />
      )}
    </Link>
  );
}

export default async function HomePage() {
  const [heroSlides, notifications, homeEvents, homePublications, aboutData] = await Promise.all([
    getHomeHeroSlides(),
    getHomeNotifications(),
    getHomeEvents(),
    getHomePublications(),
    getHomeAboutData(),
  ]);

  return (
    <div className="space-y-0 pb-0">

      {/* Hero Section */}
      <Hero slides={heroSlides} />

      {/* Announcements Alert Ticker (Fetched Live from PostgreSQL DB) */}
      <NotificationsTicker notifications={notifications} />

      {/* Department Legacy & Academics Section */}
      <section className="w-full px-6 sm:px-12 lg:px-16 py-12 sm:py-16 bg-gradient-to-b from-surface-lowest via-surface-low/30 to-surface-lowest">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Department Building Image Column */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-900 group">
              <Image
                src={aboutData.image || '/building-black-and-white.webp'}
                alt="Department of Physics Building"
                width={850}
                height={610}
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Content Column */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="space-y-1.5">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-oxford tracking-tight leading-tight">
                Academics done <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-oxford tracking-tight leading-tight">differently.</span>
              </h2>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              Dive into world-class programs &amp; research
            </h3>

            <div className="space-y-4">
              {aboutData.content
                .split(/\n\s*\n/)
                .filter((p) => p.trim().length > 0)
                .map((para, idx) => (
                  <p key={idx} className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal text-justify">
                    {parseMarkdownText(para)}
                  </p>
                ))}
            </div>
          </div>

        </div>
      </section>


      {/* Events Section */}
      {homeEvents.length > 0 && (
        <section className="w-full px-6 sm:px-12 lg:px-16 py-16 sm:py-24 bg-surface-low/30 border-b border-surface-mid/30">
          <div className="max-w-[1536px] mx-auto space-y-12">

            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-slate-200 pb-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-cyan-accent uppercase tracking-widest block">
                  Department Activities
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-oxford tracking-tight">
                  UPCOMING &amp; FEATURED EVENTS
                </h2>
              </div>

              <Link
                href="/events"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-cyan-accent hover:text-cyan-dark uppercase tracking-wider transition-colors self-start sm:self-auto shrink-0"
              >
                <span>View All Events</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Dynamic Events Cards Grid Fetched Live from PostgreSQL DB */}
            <HomeEvents events={homeEvents} />

          </div>
        </section>
      )}

      {/* Featured Research Laboratories */}
      <section className="w-full px-6 sm:px-12 lg:px-16 py-16 sm:py-24 bg-surface-lowest border-y border-surface-low/60">
        <div className="max-w-[1536px] mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left side: Innovation Description */}
            <div className="lg:col-span-5 space-y-6 text-center">
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-oxford leading-tight text-center">
                Research Labs & Facilities
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans font-normal text-center">
                The Department of Physics at CUSAT has partnered with nearly 50 funded projects, 25 in-house initiatives, and over 150 student research projects. We have broken barriers in materials science, lasers, and quantum cosmology to attain global recognition.
              </p>

              <div className="pt-2 flex justify-center">
                <Link
                  href="/research"
                  className="inline-flex items-center text-base font-bold text-cyan-accent hover:text-cyan-dark transition-colors duration-200"
                >
                  <span className="font-sans">→ Know More</span>
                </Link>
              </div>
            </div>

            {/* Right side: Asymmetric Flippable Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-6 h-full items-stretch">

              {/* Stacked Left Column (2 Small Cards) */}
              <div className="md:col-span-7 flex flex-col gap-6 justify-between">
                {/* Lab 1 */}
                <LabCard lab={RESEARCH_LABS[2]} className="h-[220px]" />

                {/* Lab 2 */}
                <LabCard lab={RESEARCH_LABS[5]} className="h-[220px]" />
              </div>

              {/* Tall Right Column (1 Tall Card) */}
              <div className="md:col-span-5 grid grid-cols-1 items-stretch">
                <LabCard lab={RESEARCH_LABS[1]} className="h-full min-h-[320px]" />
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Spotlight Projects Section - Redesigned with Rich Texture & Call-to-Action */}
      <section className="relative w-full overflow-hidden px-6 sm:px-12 lg:px-16 py-20 sm:py-28 bg-[#001738] text-white">
        {/* Subtle Textured Grid Background Overlay */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="projects-dot-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#ffffff" />
              </pattern>
              <pattern id="projects-grid-lines" width="64" height="64" patternUnits="userSpaceOnUse">
                <path d="M 64 0 L 0 0 0 64" fill="none" stroke="#ffffff" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#projects-dot-grid)" />
            <rect width="100%" height="100%" fill="url(#projects-grid-lines)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center space-y-10 sm:space-y-12">
          {/* Section Headings */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Driving Breakthroughs with Prestigious National Grants
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans font-normal max-w-2xl mx-auto">
              Our faculty lead cutting-edge research funded by leading national and international agencies—tackling frontier challenges in quantum technology, nanostructured energy materials, photonics, and cosmology.
            </p>
          </div>

          {/* Research Metrics / Highlights Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.04] border border-white/10 text-center hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 group">
              <div className="font-serif text-2xl sm:text-4xl font-extrabold text-cyan-400 group-hover:scale-105 transition-transform">
                ₹15+ Cr
              </div>
              <div className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">Extramural Funding</div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.04] border border-white/10 text-center hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 group">
              <div className="font-serif text-2xl sm:text-4xl font-extrabold text-cyan-400 group-hover:scale-105 transition-transform">
                50+
              </div>
              <div className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">Sponsored Projects</div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.04] border border-white/10 text-center hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 group">
              <div className="font-serif text-2xl sm:text-4xl font-extrabold text-cyan-400 group-hover:scale-105 transition-transform">
                8+
              </div>
              <div className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">Funding Agencies</div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.04] border border-white/10 text-center hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300 group">
              <div className="font-serif text-2xl sm:text-4xl font-extrabold text-cyan-400 group-hover:scale-105 transition-transform">
                100%
              </div>
              <div className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">Peer-Reviewed</div>
            </div>
          </div>

          {/* Sponsoring Agencies Pill Badges */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Major Sponsoring Bodies &amp; Collaborators
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-3xl mx-auto">
              {['DST-SERB', 'ISRO RESPOND', 'BRNS / DAE', 'CSIR', 'UGC-DAE CSR', 'KSCSTE', 'DRDO', 'DST-INSPIRE'].map((agency) => (
                <span
                  key={agency}
                  className="px-3.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs sm:text-sm font-semibold text-slate-200"
                >
                  {agency}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Buttons to Projects Page */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              id="home-explore-projects-cta"
              href="/projects"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-cyan-accent hover:bg-sky-400 text-white font-bold text-base sm:text-lg rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer"
            >
              <span>Explore All Research Projects</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>

            <Link
              href="/research"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-white/20 hover:border-white/40 text-slate-200 hover:text-white hover:bg-white/5 font-semibold text-sm sm:text-base transition-all duration-300 cursor-pointer"
            >
              <span>Research Laboratories</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Publications Section */}
      {homePublications.length > 0 && (
      <section className="w-full px-6 sm:px-12 lg:px-16 py-16 sm:py-24 bg-surface-lowest border-t border-slate-200">
        <div className="max-w-[1536px] mx-auto space-y-10 sm:space-y-12">

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-slate-200 pb-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-cyan-accent uppercase tracking-widest block font-sans">
                Scholarly Research Output
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-oxford tracking-tight">
                Recent Publications
              </h2>
            </div>

            <Link
              href="/journals"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-cyan-accent hover:text-cyan-dark uppercase tracking-wider transition-colors self-start sm:self-auto shrink-0 group"
            >
              <span>View All Publications</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Publications Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
            {homePublications.slice(0, 4).map((pub) => (
              <JournalCard key={pub.id} publication={pub} />
            ))}
          </div>

          {/* Bottom Callout Bar */}
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 text-sm">
            <div className="text-slate-600 font-medium text-center sm:text-left">
              Looking for our complete catalog of indexed journals, faculty papers, and metrics?
            </div>
            <Link
              href="/journals"
              className="px-5 py-2.5 bg-oxford hover:bg-cyan-900 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm shrink-0"
            >
              Browse Full Publications Archive &rarr;
            </Link>
          </div>
        </div>
      </section>
      )}



    </div>
  );
}
