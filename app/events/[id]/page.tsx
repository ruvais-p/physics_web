'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  FileText
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

  // Retrieve event from dummy dataset or create fallback
  const event = DUMMY_EVENTS[eventId] || {
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
      
      {/* Top Header / Back Navigation Bar */}
      <div className="bg-oxford text-white border-b border-white/10 sticky top-0 z-40 backdrop-blur-md bg-oxford/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link 
            href="/events"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-cyan-accent transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Events</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white font-medium transition-colors"
              title="Share event link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>

            {event.applyLink && (
              <a
                href={event.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-accent text-oxford hover:bg-cyan-accent/90 text-xs font-bold transition-all shadow-md"
              >
                <span>Register Now</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Hero Banner Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover opacity-35 filter blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl space-y-5">
            
            {/* Event Category & Status Badge */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-accent uppercase tracking-wider bg-oxford/90 border border-cyan-accent/30 px-3 py-1 rounded-full shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                {event.category} Event
              </span>
              <span className="text-xs font-medium text-slate-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                Event ID: {event.id}
              </span>
            </div>

            {/* Event Title */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              {event.title}
            </h1>

            {/* Event Summary */}
            <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl">
              {event.desc}
            </p>

            {/* Quick Meta Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center gap-2.5 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                <Calendar className="w-5 h-5 text-cyan-accent shrink-0" />
                <div>
                  <span className="block font-bold text-white text-xs uppercase tracking-wider opacity-80">Date</span>
                  <span>{event.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                <Clock className="w-5 h-5 text-cyan-accent shrink-0" />
                <div>
                  <span className="block font-bold text-white text-xs uppercase tracking-wider opacity-80">Time</span>
                  <span>{event.time}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                <MapPin className="w-5 h-5 text-cyan-accent shrink-0" />
                <div>
                  <span className="block font-bold text-white text-xs uppercase tracking-wider opacity-80">Venue</span>
                  <span className="truncate block">{event.venue}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (2/3): Event Cover Image, Details & Agenda */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Primary Cover Image Banner */}
            <div className="bg-white p-3 rounded-3xl border border-slate-200/80 shadow-md overflow-hidden">
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* About the Event */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <FileText className="w-6 h-6 text-oxford" />
                <h2 className="font-serif text-2xl font-bold text-oxford">
                  About the Event
                </h2>
              </div>

              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4 text-sm sm:text-base">
                {(event.fullDetails || event.desc).split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Program Schedule & Agenda */}
            {event.agenda && event.agenda.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <Clock className="w-6 h-6 text-oxford" />
                  <h2 className="font-serif text-2xl font-bold text-oxford">
                    Program Schedule &amp; Agenda
                  </h2>
                </div>

                <div className="space-y-3">
                  {event.agenda.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-100/80 hover:bg-slate-100/70 transition-colors"
                    >
                      <CheckCircle2 className="w-5 h-5 text-cyan-accent shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-medium text-slate-800">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column (1/3 Sidebar): Speaker Info, Registration Box & Info */}
          <div className="space-y-6">
            
            {/* Registration Box */}
            <div className="bg-oxford text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-5 border border-slate-800">
              <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-cyan-accent" />
                <span>Event Registration</span>
              </h3>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Open for faculty members, research scholars, and students. Register to reserve your seat or access the online streaming link.
              </p>

              {event.applyLink ? (
                <a
                  href={event.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-accent text-oxford font-bold text-sm hover:bg-white hover:text-oxford transition-all shadow-lg"
                >
                  <span>Apply / Register Now</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <div className="w-full p-3 rounded-xl bg-white/10 text-center text-xs text-slate-300 font-medium">
                  Registration open at the venue
                </div>
              )}

              <div className="pt-3 border-t border-white/10 text-xs text-slate-400 flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-accent shrink-0" />
                <span>Certificates of participation will be issued to registered attendees.</span>
              </div>
            </div>

            {/* Resource Person / Speaker Card */}
            {event.speaker && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Resource Person / Keynote Speaker
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-oxford shrink-0 border border-slate-200">
                    <User className="w-6 h-6 text-oxford" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-oxford text-base sm:text-lg">
                      {event.speaker}
                    </h4>
                    {event.speakerTitle && (
                      <p className="text-xs text-slate-600 leading-snug">
                        {event.speakerTitle}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Department Venue & Contact Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-oxford" />
                <span>Host Department</span>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <p className="font-semibold text-oxford text-sm">Department of Physics</p>
                <p>Cochin University of Science and Technology (CUSAT)</p>
                <p>Kochi - 682022, Kerala, India</p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <Link
                  href="/events"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-oxford hover:text-cyan-accent transition-colors"
                >
                  <span>Explore more department events</span>
                  <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
