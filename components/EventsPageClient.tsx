'use client';

import { useState } from 'react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  X, 
  CheckCircle2, 
  Info,
  FileText,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

export interface EventItem {
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
  applyLink?: string;
  brochure?: string | null;
  agenda?: string[];
  isFeatured?: boolean;
  timestamp?: number;
}

const EVENTS_PER_PAGE = 3;



function EventGridCard({ item }: { item: EventItem }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const description = item.desc.trim();
  const hasLongDescription = description.length > 200;
  const displayedDescription = hasLongDescription && !isExpanded
    ? `${description.slice(0, 200).trimEnd()}…`
    : description;

  return (
    <article className="render-lazy space-y-3 group">
      <Link href={`/events/${item.id}`} className="block">
        <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-900 shadow-sm border border-slate-100">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="space-y-1.5">
        <div className="text-xs font-bold text-cyan-accent uppercase tracking-wider font-sans">
          {item.date}
        </div>
        <Link href={`/events/${item.id}`} className="block">
          <h3 className="font-sans text-lg sm:text-xl font-bold text-oxford leading-snug group-hover:text-cyan-accent transition-colors">
            {item.title}
          </h3>
        </Link>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans">
          {displayedDescription}
        </p>

        {hasLongDescription && (
          <button
            type="button"
            onClick={() => setIsExpanded((current) => !current)}
            className="inline-flex items-center gap-1 text-xs font-bold text-cyan-accent hover:text-cyan-dark uppercase tracking-wider transition-colors pt-1 cursor-pointer"
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? 'Show Less' : 'Read More'}</span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        )}

        {/* Action Row: Details & Brochure (only if present) */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <Link
            href={`/events/${item.id}`}
            className="text-xs font-bold text-oxford hover:text-cyan-accent uppercase tracking-wider transition-colors inline-flex items-center gap-1"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          {item.brochure && (
            <a
              href={item.brochure}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-cyan-accent hover:text-cyan-dark uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 bg-cyan-50/80 hover:bg-cyan-100/80 px-2.5 py-1.5 rounded-lg border border-cyan-200/60"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Brochure</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function EventsPageClient({
  events,
  heroData,
}: {
  events: EventItem[];
  heroData?: { title: string; subtitle: string; image: string };
}) {
  const dbEvents = events;
  const [activeTab, setActiveTab] = useState<number>(0);
  const [upcomingPageIndex, setUpcomingPageIndex] = useState<number>(0);
  const [pastPageIndex, setPastPageIndex] = useState<number>(0);
  const [activeModalEvent, setActiveModalEvent] = useState<EventItem | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const displayUpcomingEvents = dbEvents
    .filter((event) => (event.timestamp ?? 0) >= today.getTime())
    .sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0));
  const displayPastEvents = dbEvents
    .filter((event) => (event.timestamp ?? 0) < today.getTime())
    .sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
  const displayCurrentEvents = displayUpcomingEvents.length > 0
    ? displayUpcomingEvents
    : displayPastEvents;

  const upcomingPageCount = Math.ceil(displayUpcomingEvents.length / EVENTS_PER_PAGE);
  const pastPageCount = Math.ceil(displayPastEvents.length / EVENTS_PER_PAGE);
  const visibleUpcomingEvents = displayUpcomingEvents.slice(
    upcomingPageIndex * EVENTS_PER_PAGE,
    (upcomingPageIndex + 1) * EVENTS_PER_PAGE
  );
  const visiblePastEvents = displayPastEvents.slice(
    pastPageIndex * EVENTS_PER_PAGE,
    (pastPageIndex + 1) * EVENTS_PER_PAGE
  );

  const activeCurrentEvent = displayCurrentEvents.length > 0
    ? (displayCurrentEvents[activeTab] || displayCurrentEvents[0])
    : null;

  return (
    <div className="pb-24 relative bg-surface">
      
      {/* Hero Header matching main homepage design */}
      <Hero
        title={heroData?.title || 'DEPARTMENT EVENTS'}
        badge="HOME > EVENTS"
        subtitle={heroData?.subtitle || ''}
        bgImage={heroData?.image || '/campus.jpg'}
      />

      {/* Main Page Layout */}
      <section className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-12 py-16 space-y-16">

        {/* ------------------------------------------------------------- */}
        {/* 1. TOP SECTION: HERO SHOWCASE BANNER                          */}
        {/* ------------------------------------------------------------- */}
        {activeCurrentEvent && (
          <div className="space-y-6">
            {/* Current Events Hero Showcase Container */}
            <div className="relative w-full aspect-[21/9] min-h-[380px] sm:min-h-[460px] overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900 group shadow-2xl">
              {/* Main Featured Hero Image */}
              <img
                src={activeCurrentEvent.image}
                alt={activeCurrentEvent.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Dark Gradient Overlay for Text Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Carousel Slider Arrows */}
              <button
                type="button"
                onClick={() => setActiveTab((prev) => (prev > 0 ? prev - 1 : displayCurrentEvents.length - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-cyan-accent hover:text-oxford text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all z-20"
                aria-label="Previous Event"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab((prev) => (prev < displayCurrentEvents.length - 1 ? prev + 1 : 0))}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-cyan-accent hover:text-oxford text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all z-20"
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

                {/* Action Buttons: Know More ↗ & Brochure */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/events/${activeCurrentEvent.id}`}
                    className="bg-cyan-accent hover:bg-white text-oxford font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl inline-flex items-center gap-2 transition-all shadow-xl uppercase tracking-wider"
                  >
                    <span>Know more</span>
                    <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                  </Link>
                  {activeCurrentEvent.brochure && (
                    <a
                      href={activeCurrentEvent.brochure}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/20 hover:bg-white text-white hover:text-oxford backdrop-blur-md border border-white/30 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl inline-flex items-center gap-2 transition-all shadow-md uppercase tracking-wider"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Brochure</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Indicator Dots at Bottom Right */}
              <div className="absolute bottom-4 right-6 flex items-center gap-2 z-20">
                {displayCurrentEvents.map((_, idx) => (
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
        )}

        {dbEvents.length === 0 && (
          <div className="py-20 text-center space-y-3 text-slate-500 font-sans bg-white rounded-2xl border border-slate-200">
            <Calendar className="w-10 h-10 mx-auto text-slate-400" />
            <p className="text-base font-semibold text-slate-800">
              No events scheduled at the moment.
            </p>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 2. UPCOMING EVENTS                                             */}
        {/* ------------------------------------------------------------- */}
        {displayUpcomingEvents.length > 0 && (
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-oxford">
                Upcoming Events
              </h2>

              {upcomingPageCount > 1 && (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setUpcomingPageIndex((prev) => (
                      prev > 0 ? prev - 1 : upcomingPageCount - 1
                    ))}
                    className="w-10 h-10 rounded-full border border-oxford text-oxford hover:bg-oxford hover:text-white transition-all flex items-center justify-center shadow-sm"
                    aria-label="Previous Upcoming Events"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpcomingPageIndex((prev) => (
                      prev < upcomingPageCount - 1 ? prev + 1 : 0
                    ))}
                    className="w-10 h-10 rounded-full border border-oxford text-oxford hover:bg-oxford hover:text-white transition-all flex items-center justify-center shadow-sm"
                    aria-label="Next Upcoming Events"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {visibleUpcomingEvents.map((item) => (
                <EventGridCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}


        {/* ------------------------------------------------------------- */}
        {/* 3. BOTTOM SECTION: PAST EVENTS (WITH BLUE CIRCULAR ARROWS)    */}
        {/* ------------------------------------------------------------- */}
        {displayPastEvents.length > 0 && (
          <div className="space-y-6 pt-4">
            {/* Section Header with Blue Circular Navigation Arrows */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-oxford">
                Past Events
              </h2>

              {pastPageCount > 1 && (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPastPageIndex((prev) => (prev > 0 ? prev - 1 : pastPageCount - 1))}
                    className="w-10 h-10 rounded-full border border-oxford text-oxford hover:bg-oxford hover:text-white transition-all flex items-center justify-center shadow-sm"
                    aria-label="Previous Past Events"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPastPageIndex((prev) => (prev < pastPageCount - 1 ? prev + 1 : 0))}
                    className="w-10 h-10 rounded-full border border-oxford text-oxford hover:bg-oxford hover:text-white transition-all flex items-center justify-center shadow-sm"
                    aria-label="Next Past Events"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* 3 Column Grid for Past Events */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {visiblePastEvents.map((item) => (
                <EventGridCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

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
              <div className="relative aspect-[16/7] w-full rounded-2xl overflow-hidden bg-slate-900">
                <img
                  src={activeModalEvent.image} 
                  alt={activeModalEvent.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
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
