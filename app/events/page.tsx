'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  X, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  Info,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  category: 'Seminar' | 'Workshop' | 'Conference' | 'Orientation' | 'Symposium';
  date: string;
  day: string;
  month: string;
  year: string;
  time: string;
  venue: string;
  image: string;
  speaker?: string;
  speakerTitle?: string;
  desc: string;
  fullDetails?: string;
  agenda?: string[];
  isFeatured?: boolean;
}

const CURRENT_EVENTS: EventItem[] = [
  {
    id: 'e1',
    title: '15th Department Endowment & Memorial Oration Lecture',
    category: 'Seminar',
    date: '19 Jul 2026',
    day: '19',
    month: 'Jul',
    year: '2026',
    time: '10:00 AM - 01:00 PM',
    venue: 'Department Auditorium (Main Block)',
    image: '/eventssss.jpg',
    speaker: 'Prof. K. S. Rajan',
    speakerTitle: 'Senior Fellow, National Institute of Quantum Physics',
    desc: 'Distinguished national physicists will speak on breakthroughs in low-temperature magnetics and topological insulators, followed by an interactive research panel.',
    fullDetails: 'This prestigious annual memorial lecture brings together leading experimentalists and theorists in solid-state physics. The session will cover emerging magnetic phase transitions, topological quantum materials, and candidate systems for room-temperature spintronics.',
    agenda: [
      '10:00 AM - Welcome Address by Head of Department',
      '10:30 AM - Keynote Oration: Topological Insulators & Quantum Transport',
      '11:45 AM - Interactive Q&A & Research Poster Showcase',
      '12:30 PM - Felicitation & Concluding Remarks'
    ],
    isFeatured: true,
  },
  {
    id: 'e2',
    title: 'Hands-On Workshop on FE-SEM & micro-Raman Spectroscopy',
    category: 'Workshop',
    date: '06 Jul 2026',
    day: '06',
    month: 'Jul',
    year: '2026',
    time: '09:30 AM - 04:30 PM',
    venue: 'Central Instrumentation Facility (CIF), CUSAT',
    image: '/innovation-microscope.png',
    speaker: 'Dr. Anita Varghese',
    speakerTitle: 'Chief Scientist, STIC CUSAT',
    desc: 'A focused session on equipment slot bookings and instrumentation data analysis for regional researchers. Participants will receive hands-on training on sample preparation.',
    fullDetails: 'Designed for Ph.D. scholars and postgraduate students in physical and chemical sciences. Learn advanced characterization techniques using Field Emission Scanning Electron Microscopy (FE-SEM) and high-resolution micro-Raman spectroscopy.',
    agenda: [
      '09:30 AM - Fundamentals of Scanning Electron Optics',
      '11:00 AM - Live Demonstration: Sample Mounting & Vacuum Coating',
      '01:30 PM - Micro-Raman Laser Alignment & Peak Fitting Workshop',
      '03:30 PM - Slot Allocation Protocols & Data Processing Lab'
    ],
  },
  {
    id: 'e3',
    title: 'National Seminar on Cosmology & Quantum Gravity (CQG-2026)',
    category: 'Conference',
    date: '30 Jun 2026',
    day: '30',
    month: 'Jun',
    year: '2026',
    time: '09:00 AM - 05:00 PM',
    venue: 'Seminar Hall, Department of Physics',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    speaker: 'Prof. M. V. N. Murthy & Guest Panelists',
    speakerTitle: 'Theoretical Physics Division, CUSAT',
    desc: 'Presenting recent simulations and mathematical formulations on gravitational waves and cosmic expansions. Guest lectures will be delivered by eminent scientists.',
    fullDetails: 'CQG-2026 gathers theoretical physicists, astronomers, and computational astrophysicists across India. Paper presentations will highlight early-universe cosmology, black hole thermodynamics, and modified gravity theories.',
    agenda: [
      '09:00 AM - Inauguration & Keynote Address',
      '10:30 AM - Session I: Primordial Gravitational Waves',
      '01:30 PM - Session II: Dark Energy & Cosmological Tensions',
      '03:30 PM - Scholar Short Presentations & Valedictory Session'
    ],
  },
  {
    id: 'e4',
    title: 'Integrated M.Sc. Orientation & Interactive Session',
    category: 'Orientation',
    date: '12 Jul 2026',
    day: '12',
    month: 'Jul',
    year: '2026',
    time: '10:00 AM - 12:30 PM',
    venue: 'Foyer, Department Entrance',
    image: '/cusat-building.png',
    speaker: 'Department Faculty Council',
    speakerTitle: 'Academic Guidance & Mentorship Committee',
    desc: 'An orientation ceremony welcoming the newly admitted students to the Integrated M.Sc. Physics program, including a campus tour and interaction with research scholars.',
    fullDetails: 'Welcoming the incoming 5-year Integrated M.Sc. batch. Freshers will meet their faculty mentors, explore core physics laboratories, learn about academic regulations, and connect with senior scholars.',
    agenda: [
      '10:00 AM - Introductory Remarks & Department Tour',
      '11:00 AM - Mentorship Allocation & Curriculum Breakdown',
      '11:45 AM - Student Club Showcase & Open Q&A'
    ],
  },
];

const PAST_EVENTS: EventItem[] = [
  {
    id: 'e5',
    title: 'Alumni Meet 2026: Physics Department Silver Jubilee',
    category: 'Conference',
    date: '05 Aug 2025',
    day: '05',
    month: 'Aug',
    year: '2025',
    time: '11:00 AM - 04:00 PM',
    venue: 'Department Foyer & Seminar Hall',
    image: '/phy_dept.png',
    speaker: 'Alumni Executive Committee',
    speakerTitle: 'CUSAT Physics Alumni Association',
    desc: 'A grand alumni reunion celebrating the silver jubilee of the department. Alumni working in prestigious global institutions shared their journeys.',
    fullDetails: 'Reconnecting alumni from past decades! Featuring keynote sharing by distinguished alumni in academia, industry, and scientific research labs globally.',
    agenda: [
      '11:00 AM - Inaugural Lamp Lighting & Welcome Speech',
      '11:45 AM - Keynote Address: Global Opportunities in Physics',
      '01:00 PM - Networking Lunch & Memorabilia Release'
    ],
  },
  {
    id: 'e6',
    title: 'International Web-Symposium on Ultrafast Photonics',
    category: 'Symposium',
    date: '15 Mar 2026',
    day: '15',
    month: 'Mar',
    year: '2026',
    time: '02:00 PM - 06:00 PM',
    venue: 'Virtual Auditorium (Zoom Webinar)',
    image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&q=80',
    speaker: 'Prof. David Miller (Stanford)',
    speakerTitle: 'Photonics & Quantum Electronics Group',
    desc: 'An international virtual conference focusing on femtosecond laser pulses, non-linear optical materials, and silicon photonics integration.',
    fullDetails: 'Exploring non-linear optics, ultrafast laser spectroscopy, and photonic integrated circuits. Over 350 international delegates joined the online sessions.',
    agenda: [
      '02:00 PM - Opening Keynote on Femtosecond Pulse Shaping',
      '03:30 PM - Technical Talks on Non-Linear Optics',
      '05:15 PM - Virtual Panel: Future of Optical Computing'
    ],
  },
  {
    id: 'e7',
    title: 'National Workshop on Advanced Thin Film Fabrication',
    category: 'Workshop',
    date: '10 Jan 2026',
    day: '10',
    month: 'Jan',
    year: '2026',
    time: '09:00 AM - 04:00 PM',
    venue: 'Thin Film Laboratory, Main Physics Block',
    image: '/innovation-pipette.png',
    speaker: 'Dr. R. K. Nampoori',
    speakerTitle: 'Emeritus Professor, CUSAT',
    desc: 'Hands-on training session covering RF Magnetron Sputtering, Sol-Gel spin coating, and X-ray diffraction analysis for thin film solar cells.',
    fullDetails: 'Intensive single-day workshop designed for postgraduate and doctoral researchers working on thin film semiconductors and photodetectors.',
    agenda: [
      '09:00 AM - Vacuum Systems & Sputtering Physics',
      '11:30 AM - Lab Practice: Substrate Cleaning & Deposition',
      '02:30 PM - XRD Phase Analysis & Optical Bandgap Measurement'
    ],
  },
];

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [pastPageIndex, setPastPageIndex] = useState<number>(0);
  const [activeModalEvent, setActiveModalEvent] = useState<EventItem | null>(null);

  const activeCurrentEvent = CURRENT_EVENTS[activeTab] || CURRENT_EVENTS[0];

  return (
    <div className="pb-24 relative bg-surface">
      
      {/* Top Banner (Campus Image Background with Oxford Blue Overlay) */}
      <div className="-mt-[116px] sm:-mt-[128px] relative bg-slate-900 text-white overflow-hidden">
        {/* Background Image with Dark Blue Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/campus.jpg"
            alt="CUSAT Campus"
            fill
            className="object-cover opacity-45"
            priority
          />
          <div className="absolute inset-0 bg-oxford/85 mix-blend-multiply" />
        </div>

        {/* Hero Content (Centered) */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 pt-52 pb-24 sm:pt-64 sm:pb-32 text-center space-y-4">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase">
            Department Events
          </h1>

          {/* Centered Breadcrumbs */}
          <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm font-sans font-medium text-slate-300 pt-2">
            <Link href="/" className="hover:text-cyan-accent transition-colors">Home</Link>
            <span>&gt;</span>
            <span className="text-white font-semibold">Events</span>
          </div>
        </div>
      </div>

      {/* Main Page Layout */}
      <section className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 py-16 space-y-16">

        {/* ------------------------------------------------------------- */}
        {/* 1. TOP SECTION: CURRENT EVENTS HERO BANNER                    */}
        {/* ------------------------------------------------------------- */}
        {/* 1. TOP SECTION: HERO SHOWCASE BANNER                          */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-6">
          {/* Current Events Hero Showcase Container */}
          <div className="relative w-full aspect-[21/9] min-h-[380px] sm:min-h-[460px] overflow-hidden bg-slate-900 group shadow-2xl">
            {/* Main Featured Hero Image */}
            <img
              src={activeCurrentEvent.image}
              alt={activeCurrentEvent.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Gradient Overlay for Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-oxford/95 via-oxford/45 to-transparent" />

            {/* Carousel Slider Arrows */}
            <button
              type="button"
              onClick={() => setActiveTab((prev) => (prev > 0 ? prev - 1 : CURRENT_EVENTS.length - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-oxford/60 hover:bg-cyan-accent hover:text-oxford text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all z-20"
              aria-label="Previous Event"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab((prev) => (prev < CURRENT_EVENTS.length - 1 ? prev + 1 : 0))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-oxford/60 hover:bg-cyan-accent hover:text-oxford text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all z-20"
              aria-label="Next Event"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Bottom-Left Overlay Text & Button */}
            <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-12 right-12 sm:right-28 text-white space-y-3 z-10">
              {/* Event Title with LaTeX Serif Typography */}
              <h3 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white drop-shadow-md leading-tight max-w-4xl">
                {activeCurrentEvent.title}
              </h3>

              {/* Event Meta Line */}
              <p className="text-slate-200 text-xs sm:text-sm font-sans font-medium drop-shadow flex flex-wrap items-center gap-2">
                <span className="text-cyan-accent font-bold uppercase tracking-wider">{activeCurrentEvent.category}</span>
                <span>•</span>
                <span>{activeCurrentEvent.date}, {activeCurrentEvent.time}</span>
                <span>•</span>
                <span>{activeCurrentEvent.venue}</span>
              </p>

              {/* Theme Blue Action Button: Know More ↗ */}
              <div className="pt-2">
                <Link
                  href={`/events/${activeCurrentEvent.id}`}
                  className="bg-cyan-accent hover:bg-white text-oxford font-extrabold text-xs sm:text-sm px-6 py-3 rounded-none inline-flex items-center gap-2 transition-all shadow-xl uppercase tracking-wider"
                >
                  <span>Know more</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                </Link>
              </div>
            </div>

            {/* Indicator Dots at Bottom Right */}
            <div className="absolute bottom-4 right-6 flex items-center gap-2 z-20">
              {CURRENT_EVENTS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  className={`h-2 transition-all ${
                    activeTab === idx ? 'w-8 bg-cyan-accent' : 'w-2 bg-white/50 hover:bg-white'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>


        {/* ------------------------------------------------------------- */}
        {/* 2. BOTTOM SECTION: PAST EVENTS (WITH BLUE CIRCULAR ARROWS)    */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-6 pt-4">
          {/* Section Header with Blue Circular Navigation Arrows */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-oxford">
              Past Events
            </h2>

            {/* Circular Blue Navigation Arrow Buttons (Matching User Diagram) */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPastPageIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, Math.ceil(PAST_EVENTS.length / 3) - 1)))}
                className="w-10 h-10 rounded-full border border-oxford text-oxford hover:bg-oxford hover:text-white transition-all flex items-center justify-center shadow-sm"
                aria-label="Previous Past Events"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setPastPageIndex((prev) => (prev < Math.ceil(PAST_EVENTS.length / 3) - 1 ? prev + 1 : 0))}
                className="w-10 h-10 rounded-full border border-oxford text-oxford hover:bg-oxford hover:text-white transition-all flex items-center justify-center shadow-sm"
                aria-label="Next Past Events"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 3 Column Grid for Past Events */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PAST_EVENTS.map((item) => (
              <Link 
                key={item.id}
                id={item.id}
                href={`/events/${item.id}`}
                className="space-y-3 cursor-pointer group block"
              >
                {/* Pure Image Block (Sharp edges) */}
                <div className="relative aspect-[16/10] w-full rounded-none overflow-hidden bg-slate-900">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content below image */}
                <div className="space-y-1.5">
                  {/* Date below image */}
                  <div className="text-xs font-bold text-cyan-accent uppercase tracking-wider font-sans">
                    {item.date}
                  </div>

                  {/* Event Name */}
                  <h3 className="font-sans text-lg sm:text-xl font-bold text-oxford leading-snug group-hover:text-cyan-accent transition-colors">
                    {item.title}
                  </h3>

                  {/* Event description text ("event was conducted as such...") */}
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </section>

      {/* Modal for Event Details & Agenda */}
      {activeModalEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative border border-slate-100 animate-in fade-in zoom-in duration-200 my-auto">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalEvent(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header with Event Image Banner */}
            <div className="space-y-3">
              <div className="relative aspect-[16/7] w-full rounded-none overflow-hidden bg-slate-900">
                <img 
                  src={activeModalEvent.image} 
                  alt={activeModalEvent.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-oxford/90 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-accent uppercase tracking-wider bg-oxford/85 px-3 py-1 rounded-full border border-white/20">
                    {activeModalEvent.category} Event
                  </span>
                  <span className="text-xs font-semibold text-white bg-black/40 px-2.5 py-1 rounded-lg">
                    {activeModalEvent.date}
                  </span>
                </div>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-oxford pr-8 leading-snug">
                {activeModalEvent.title}
              </h3>
            </div>

            {/* Key Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-accent shrink-0" />
                <div>
                  <span className="block font-bold text-oxford">Date</span>
                  <span>{activeModalEvent.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-accent shrink-0" />
                <div>
                  <span className="block font-bold text-oxford">Time</span>
                  <span>{activeModalEvent.time}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:col-span-2">
                <MapPin className="w-4 h-4 text-cyan-accent shrink-0" />
                <div>
                  <span className="block font-bold text-oxford">Venue</span>
                  <span>{activeModalEvent.venue}</span>
                </div>
              </div>

              {activeModalEvent.speaker && (
                <div className="flex items-center gap-2 sm:col-span-2">
                  <User className="w-4 h-4 text-cyan-accent shrink-0" />
                  <div>
                    <span className="block font-bold text-oxford">Resource Person / Speaker</span>
                    <span>{activeModalEvent.speaker} {activeModalEvent.speakerTitle && `— ${activeModalEvent.speakerTitle}`}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Event Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-oxford uppercase tracking-wider">About the Session</h4>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed text-justify">
                {activeModalEvent.fullDetails || activeModalEvent.desc}
              </p>
            </div>

            {/* Event Agenda if available */}
            {activeModalEvent.agenda && activeModalEvent.agenda.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-oxford uppercase tracking-wider">Program Schedule &amp; Agenda</h4>
                <div className="space-y-2">
                  {activeModalEvent.agenda.map((ag, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-cyan-accent shrink-0 mt-0.5" />
                      <span>{ag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Info className="w-4 h-4 text-cyan-accent" />
                <span>Open for all faculty, researchers &amp; students.</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalEvent(null)}
                className="bg-oxford text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-cyan-accent hover:text-oxford transition-all"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
