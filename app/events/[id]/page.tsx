'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Hero from '@/components/Hero';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  Share2,
  Bookmark,
  Info,
  Building2,
  FileText,
  Images,
  Eye,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  category: 'Seminar' | 'Workshop' | 'Conference' | 'Orientation' | 'Symposium';
  date: string;
  time: string;
  venue: string;
  image: string;
  speaker?: string;
  speakerTitle?: string;
  desc: string;
  fullDetails?: string;
  agenda?: string[];
  applyLink?: string;
  isFeatured?: boolean;
  galleryImages?: { id: number; imagePath: string; sortOrder: number }[];
}

// Markdown Parser Helper Functions
function renderMarkdown(md: string) {
  if (!md || !md.trim()) {
    return <p className="text-base text-slate-500 italic">No event description available yet.</p>;
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
        <a key={keyIdx++} href={url} target="_blank" rel="noopener noreferrer" className="text-cyan-accent hover:underline font-semibold inline-flex items-center gap-0.5">
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

// Mock Events dataset matching app/events/page.tsx
const DUMMY_EVENTS: Record<string, EventItem> = {
  'e1': {
    id: 'e1',
    title: '15th Department Endowment & Memorial Oration Lecture',
    category: 'Seminar',
    date: '19 Jul 2026',
    time: '10:00 AM - 01:00 PM',
    venue: 'Department Auditorium (Main Block), CUSAT',
    image: '/eventssss.jpg',
    speaker: 'Prof. K. S. Rajan',
    speakerTitle: 'Senior Fellow, National Institute of Quantum Physics',
    desc: 'Distinguished national physicists will speak on breakthroughs in low-temperature magnetics and topological insulators, followed by an interactive research panel.',
    fullDetails: `The Annual Department Endowment & Memorial Oration Lecture is one of the flagship scientific gatherings organized by the Department of Physics, CUSAT. 

### Session Overview
This 15th edition brings together leading experimentalists and theorists in solid-state physics to discuss emerging frontiers in quantum transport, topological insulators, and candidate materials for room-temperature spintronics.

### Key Topics Covered:
- **Low-Temperature Magnetism**: Quantum phase transitions and non-equilibrium magnetic states.
- **Topological Insulators**: Surface states, Berry curvature phenomena, and spin-orbit coupling.
- **Spintronics & Quantum Devices**: Prospects of 2D van der Waals heterostructures in modern computing.

The lecture will culminate with an open interactive research session where postgraduate students and research scholars can discuss active projects with the guest speakers.`,
    agenda: [
      '10:00 AM - Welcome Address by Head of Department',
      '10:30 AM - Keynote Oration: Topological Insulators & Quantum Transport',
      '11:45 AM - Interactive Q&A & Research Poster Showcase',
      '12:30 PM - Felicitation & Concluding Remarks'
    ],
    applyLink: 'https://forms.gle/sample-event-registration-e1',
    isFeatured: true,
  },
  'e2': {
    id: 'e2',
    title: 'Hands-On Workshop on FE-SEM & micro-Raman Spectroscopy',
    category: 'Workshop',
    date: '06 Jul 2026',
    time: '09:30 AM - 04:30 PM',
    venue: 'Central Instrumentation Facility (CIF), CUSAT',
    image: '/innovation-microscope.png',
    speaker: 'Dr. Anita Varghese',
    speakerTitle: 'Chief Scientist, STIC CUSAT',
    desc: 'A focused session on equipment slot bookings and instrumentation data analysis for regional researchers. Participants will receive hands-on training on sample preparation.',
    fullDetails: `Designed specifically for Ph.D. scholars, faculty members, and M.Sc. dissertation students in physical, chemical, and materials sciences. 

This intensive 1-day technical workshop covers advanced characterization techniques using **Field Emission Scanning Electron Microscopy (FE-SEM)** and high-resolution **micro-Raman spectroscopy**.

### Learning Outcomes:
- Hands-on sample preparation protocols for conductive and non-conductive specimens.
- Secondary Electron (SE) vs Backscattered Electron (BSE) imaging optimization.
- Laser wavelength selection and deconvoluting complex vibrational peaks in micro-Raman spectra.
- Understanding slot booking protocols and STIC/CIF usage policies.`,
    agenda: [
      '09:30 AM - Fundamentals of Scanning Electron Optics',
      '11:00 AM - Live Demonstration: Sample Mounting & Vacuum Coating',
      '01:30 PM - Micro-Raman Laser Alignment & Peak Fitting Workshop',
      '03:30 PM - Slot Allocation Protocols & Data Processing Lab'
    ],
    applyLink: 'https://forms.gle/sample-event-registration-e2',
  },
  'e3': {
    id: 'e3',
    title: 'National Seminar on Cosmology & Quantum Gravity (CQG-2026)',
    category: 'Conference',
    date: '30 Jun 2026',
    time: '09:00 AM - 05:00 PM',
    venue: 'Seminar Hall, Department of Physics',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    speaker: 'Prof. M. V. N. Murthy & Guest Panelists',
    speakerTitle: 'Theoretical Physics Division, CUSAT',
    desc: 'Presenting recent simulations and mathematical formulations on gravitational waves and cosmic expansions. Guest lectures will be delivered by eminent scientists.',
    fullDetails: `CQG-2026 gathers theoretical physicists, astronomers, and computational astrophysicists across India to discuss the latest theoretical developments in cosmic expansion, primordial gravitational waves, and black hole thermodynamics.

### Conference Highlights:
- **Invited Talks**: Keynote addresses by leading theoretical physicists.
- **Oral Presentations**: Selected peer-reviewed paper presentations by young scholars.
- **Panel Discussion**: Resolving the Hubble tension and non-standard cosmological models.`,
    agenda: [
      '09:00 AM - Inauguration & Keynote Address',
      '10:30 AM - Session I: Primordial Gravitational Waves',
      '01:30 PM - Session II: Dark Energy & Cosmological Tensions',
      '03:30 PM - Scholar Short Presentations & Valedictory Session'
    ],
    applyLink: 'https://forms.gle/sample-event-registration-e3',
  },
  'e4': {
    id: 'e4',
    title: 'Integrated M.Sc. Orientation & Interactive Session',
    category: 'Orientation',
    date: '12 Jul 2026',
    time: '10:00 AM - 12:30 PM',
    venue: 'Foyer & Main Auditorium, Department of Physics',
    image: '/cusat-building.png',
    speaker: 'Department Faculty Council',
    speakerTitle: 'Academic Guidance & Mentorship Committee',
    desc: 'An orientation ceremony welcoming the newly admitted students to the Integrated M.Sc. Physics program, including a campus tour and interaction with research scholars.',
    fullDetails: `Welcoming the incoming batch of 5-Year Integrated M.Sc. Physics students for the academic year 2026-2027. 

This orientation program provides freshers and their parents with comprehensive guidance on academic curricula, credit rules, laboratory facilities, library access, and campus safety protocols.`,
    agenda: [
      '10:00 AM - Introductory Remarks & Department Tour',
      '11:00 AM - Mentorship Allocation & Curriculum Breakdown',
      '11:45 AM - Student Club Showcase & Open Q&A'
    ],
    applyLink: 'https://forms.gle/sample-event-registration-e4',
  },
  'e5': {
    id: 'e5',
    title: 'Alumni Meet 2026: Physics Department Silver Jubilee',
    category: 'Conference',
    date: '05 Aug 2025',
    time: '11:00 AM - 04:00 PM',
    venue: 'Department Foyer & Seminar Hall',
    image: '/phy_dept.png',
    speaker: 'Alumni Executive Committee',
    speakerTitle: 'CUSAT Physics Alumni Association',
    desc: 'A grand alumni reunion celebrating the silver jubilee of the department. Alumni working in prestigious global institutions shared their journeys.',
    fullDetails: `Reconnecting alumni from past decades! Featuring keynote sharing by distinguished alumni in academia, industry, and scientific research labs globally.`,
    agenda: [
      '11:00 AM - Inaugural Lamp Lighting & Welcome Speech',
      '12:00 PM - Panel Discussion: Industry & Global Academia Trends',
      '02:00 PM - Campus Walk & Department Reminiscence Session'
    ],
  }
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EventDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;

  const [liveEvent, setLiveEvent] = useState<EventItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadLiveEvent() {
      try {
        const res = await fetch(`/api/events/${eventId}`);
        if (res.ok) {
          const item = await res.json();
          const d = new Date(item.date);
          const dateStr = !isNaN(d.getTime()) 
            ? d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
            : 'Upcoming Date';
          const timeStr = !isNaN(d.getTime()) 
            ? d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            : '10:00 AM - 01:00 PM';

          setLiveEvent({
            id: String(item.id),
            title: item.title,
            category: 'Seminar',
            date: dateStr,
            time: timeStr,
            venue: item.venue || 'Department of Physics, CUSAT',
            image: item.image || '/eventssss.jpg',
            desc: item.description,
            fullDetails: item.description,
            applyLink: item.apply_link || undefined,
            galleryImages: Array.isArray(item.images) ? item.images : [],
          });
        }
      } catch (err) {
        console.error('Error loading live event details:', err);
      }
    }
    loadLiveEvent();
  }, [eventId]);

  // Retrieve event from dummy dataset or create fallback
  const fallbackEvent = DUMMY_EVENTS[eventId] || {
    id: eventId,
    title: `Department Event (${eventId})`,
    category: 'Seminar' as const,
    date: 'Upcoming Date',
    time: '10:00 AM - 01:00 PM',
    venue: 'Department of Physics, CUSAT',
    image: '/eventssss.jpg',
    speaker: 'Guest Resource Person',
    speakerTitle: 'Department of Physics, CUSAT',
    desc: 'Detailed information regarding this specific event program, schedule, and registration details will be published here.',
    fullDetails: `Welcome to the official event page for event **${eventId}**. 

### About This Program
This event is organized by the Department of Physics, Cochin University of Science and Technology (CUSAT). It brings together faculty, researchers, and students to explore key developments in physical sciences.

For further information regarding schedule or venue arrangements, please contact the department office.`,
    agenda: [
      '10:00 AM - Program Commencement',
      '11:30 AM - Key Session & Technical Presentation',
      '12:30 PM - Interactive Q&A Session'
    ],
    applyLink: 'https://cusat.ac.in',
  };

  const event = liveEvent || fallbackEvent;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null || !event.galleryImages || event.galleryImages.length === 0) return;
      if (e.key === 'ArrowLeft' && lightboxIndex > 0) {
        setLightboxIndex(lightboxIndex - 1);
      } else if (e.key === 'ArrowRight' && lightboxIndex < event.galleryImages.length - 1) {
        setLightboxIndex(lightboxIndex + 1);
      } else if (e.key === 'Escape') {
        setLightboxIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, event.galleryImages]);

  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">

      {/* Hero Header matching main About page design with center-aligned text */}
      <Hero
        title={event.title}
        badge="HOME > EVENTS"
        subtitle=""
        bgImage={event.image || '/eventssss.jpg'}
        align="center"
      />

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 mt-10 sm:mt-12 space-y-10">
        
        {/* 1. Date, Time, Place (Displayed Under the Hero Image) */}
        <div className="flex flex-wrap items-center justify-start gap-y-4 gap-x-8 sm:gap-x-12 pb-8 border-b border-slate-200 text-slate-700 font-sans">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-oxford/10 text-oxford flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-oxford" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Date</span>
              <span className="text-base sm:text-lg font-bold text-oxford">{event.date}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-accent/10 text-cyan-accent flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-cyan-accent" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Time</span>
              <span className="text-base sm:text-lg font-bold text-oxford">{event.time}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-oxford/10 text-oxford flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-oxford" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Venue / Place</span>
              <span className="text-base sm:text-lg font-bold text-oxford">{event.venue}</span>
            </div>
          </div>
        </div>

        {/* 2. Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 sm:gap-16">
          
          {/* Left Column (2/3): Description, Gallery & Agenda */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Description of the Event (Structured Markdown Content) */}
            <div className="space-y-6 pb-12 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-oxford" />
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-oxford">
                  About the Event
                </h2>
              </div>

              <div className="text-slate-700 leading-relaxed font-sans">
                {renderMarkdown(event.fullDetails || event.desc || '')}
              </div>
            </div>


            {/* Event Photo Gallery Section */}
            {event.galleryImages && event.galleryImages.length > 0 && (
              <div className="space-y-6 pb-12 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Images className="w-6 h-6 text-oxford" />
                    <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-oxford">
                      Event Photo Gallery
                    </h2>
                  </div>
                  <span className="text-xs font-mono font-bold text-oxford bg-oxford/10 px-3.5 py-1.5 rounded-full">
                    {event.galleryImages.length} Photos
                  </span>
                </div>

                {/* Gallery Thumbnail Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {event.galleryImages.map((img, idx) => (
                    <div
                      key={img.id}
                      onClick={() => setLightboxIndex(idx)}
                      className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 cursor-pointer relative group shadow-sm hover:shadow-md transition-all"
                    >
                      <img
                        src={img.imagePath}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-sans text-xs font-bold gap-1.5">
                        <Eye className="w-5 h-5" />
                        <span>View Photo</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Program Schedule & Agenda */}
            {event.agenda && event.agenda.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-oxford" />
                  <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-oxford">
                    Program Schedule &amp; Agenda
                  </h2>
                </div>

                <div className="space-y-4 font-sans">
                  {event.agenda.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-4 py-3.5 border-b border-slate-100 last:border-0"
                    >
                      <CheckCircle2 className="w-5 h-5 text-cyan-dark shrink-0 mt-0.5" />
                      <span className="text-base font-medium text-slate-800">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column (1/3 Sidebar): Speaker Info & Department Contact */}
          <div className="space-y-10 lg:pl-4">

            {/* Event Registration / Apply Link (Placed Above Resource Person) */}
            {event.applyLink && (
              <div className="space-y-3 pb-8 border-b border-slate-200 font-sans">
                <div className="text-xs font-bold text-cyan-accent uppercase tracking-widest">
                  Event Registration
                </div>
                <a
                  href={event.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-oxford hover:bg-cyan-900 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer"
                >
                  <span>Register for Event</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
                <p className="text-xs text-slate-500 text-center">
                  Registration open for students, scholars, and faculty.
                </p>
              </div>
            )}

            {/* Resource Person / Speaker */}
            {event.speaker && (
              <div className="space-y-4 pb-8 border-b border-slate-200">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest font-sans">
                  Resource Person / Keynote Speaker
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-oxford text-white flex items-center justify-center shrink-0 shadow-sm">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 font-sans">
                    <h4 className="font-bold text-oxford text-lg sm:text-xl">
                      {event.speaker}
                    </h4>
                    {event.speakerTitle && (
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {event.speakerTitle}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}


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

              <div className="pt-4">
                <Link
                  href="/events"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-oxford hover:text-cyan-dark transition-colors"
                >
                  <span>Explore more department events</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Fullscreen Lightbox Overlay Modal */}
      {lightboxIndex !== null && event.galleryImages && event.galleryImages[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fadeIn font-sans">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white max-w-7xl w-full mx-auto">
            <div className="flex items-center gap-2">
              <Images className="w-5 h-5 text-cyan-accent" />
              <span className="text-sm font-bold truncate max-w-xs sm:max-w-md">{event.title}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-slate-400">
                {lightboxIndex + 1} / {event.galleryImages.length}
              </span>
              <button
                onClick={() => setLightboxIndex(null)}
                className="p-2 text-slate-400 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
                title="Close Lightbox (Esc)"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Main Image Stage */}
          <div className="relative flex-1 flex items-center justify-center my-4 max-w-7xl w-full mx-auto">
            {/* Left Nav Button */}
            {lightboxIndex > 0 && (
              <button
                onClick={() => setLightboxIndex(lightboxIndex - 1)}
                className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-md transition-all cursor-pointer"
                title="Previous Image (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            )}

            <div className="max-w-full max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <img
                src={event.galleryImages[lightboxIndex].imagePath}
                alt={`Photo ${lightboxIndex + 1}`}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl"
              />
            </div>

            {/* Right Nav Button */}
            {lightboxIndex < event.galleryImages.length - 1 && (
              <button
                onClick={() => setLightboxIndex(lightboxIndex + 1)}
                className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-md transition-all cursor-pointer"
                title="Next Image (Right Arrow)"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnail Strip */}
          <div className="max-w-4xl w-full mx-auto overflow-x-auto py-2">
            <div className="flex justify-center gap-2 shrink-0">
              {event.galleryImages.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setLightboxIndex(i)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    i === lightboxIndex ? 'border-cyan-accent scale-105 shadow-lg' : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.imagePath} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
