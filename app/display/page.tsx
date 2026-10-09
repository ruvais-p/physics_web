'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import {
  Calendar,
  MapPin,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
  Radio,
  Bell,
  Atom,
} from 'lucide-react';

interface DisplayEvent {
  id: number;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate?: string | null;
  venue?: string | null;
  applyLink?: string | null;
  brochure?: string | null;
  tvDuration?: number;
}

interface DisplayNotice {
  id: string;
  title: string;
  content?: string | null;
  category?: string;
  date: string;
}

export default function TvDisplayPage() {
  const [events, setEvents] = useState<DisplayEvent[]>([]);
  const [notices, setNotices] = useState<DisplayNotice[]>([]);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState({
    timeStr: '',
    dateStr: '',
  });

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wakeLockRef = useRef<any>(null);

  // 1. Live Clock & Date Tracker
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime({
        timeStr: now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }),
        dateStr: now.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      });
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Fetch Display Feed from API
  const fetchFeed = useCallback(async () => {
    try {
      const res = await fetch('/api/display/events', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.events)) {
        setEvents(data.events);
        setIsUsingFallback(Boolean(data.isUsingFallback));
      }
      if (Array.isArray(data.notices)) {
        setNotices(data.notices);
      }
    } catch (err) {
      console.error('Failed to fetch TV display events:', err);
    }
  }, []);

  // Initial load + periodic 30s background poll
  useEffect(() => {
    fetchFeed();
    const pollInterval = setInterval(fetchFeed, 30000);
    return () => clearInterval(pollInterval);
  }, [fetchFeed]);

  // Keep index within bounds if list length changes
  useEffect(() => {
    if (events.length > 0 && currentIndex >= events.length) {
      setCurrentIndex(0);
    }
  }, [events, currentIndex]);

  const currentEvent = events[currentIndex] || null;
  const slideDurationSeconds = currentEvent?.tvDuration || 12;

  // 3. Generate Offline QR Code whenever current slide changes
  useEffect(() => {
    if (!currentEvent) {
      setQrCodeDataUrl('');
      return;
    }

    const rawTarget =
      currentEvent.applyLink ||
      currentEvent.brochure ||
      `/events/${currentEvent.id}`;

    const targetUrl =
      rawTarget.startsWith('http')
        ? rawTarget
        : typeof window !== 'undefined'
        ? `${window.location.origin}${rawTarget.startsWith('/') ? '' : '/'}${rawTarget}`
        : rawTarget;

    QRCode.toDataURL(targetUrl, {
      width: 280,
      margin: 1,
      color: {
        dark: '#030712',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => {
        console.error('QR code generation error:', err);
        setQrCodeDataUrl('');
      });
  }, [currentEvent]);

  // 4. Slide Rotation Timer & Progress Bar
  useEffect(() => {
    if (isPaused || events.length <= 1) {
      setProgress(0);
      return;
    }

    setProgress(0);
    const tickIntervalMs = 100;
    const totalDurationMs = slideDurationSeconds * 1000;
    const increment = (tickIntervalMs / totalDurationMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + increment >= 100) {
          // Advance to next slide
          setCurrentIndex((curr) => (curr + 1) % events.length);
          return 0;
        }
        return prev + increment;
      });
    }, tickIntervalMs);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, events.length, slideDurationSeconds]);

  // 5. Screen Wake Lock (Prevent TV from sleeping)
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator && !wakeLockRef.current) {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        }
      } catch {
        // Wake lock can fail if browser tab is in background or device prohibits it
      }
    };

    requestWakeLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    };
  }, []);

  // 6. Fullscreen & Keyboard Handlers
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentIndex((curr) => (curr + 1) % (events.length || 1));
        setProgress(0);
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((curr) => (curr - 1 + (events.length || 1)) % (events.length || 1));
        setProgress(0);
      } else if (e.key === 'p' || e.key === 'P') {
        setIsPaused((prev) => !prev);
      }
    };

    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    window.addEventListener('keydown', handleKey);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.removeEventListener('fullscreenchange', handleFsChange);
    };
  }, [events.length]);

  // 7. Auto-hide mouse and controls after inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3500);
  };

  const nextSlide = () => {
    setCurrentIndex((curr) => (curr + 1) % (events.length || 1));
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentIndex((curr) => (curr - 1 + (events.length || 1)) % (events.length || 1));
    setProgress(0);
  };

  // Helper date formatting
  const formatEventDateTime = (startStr: string, endStr?: string | null) => {
    try {
      const s = new Date(startStr);
      const e = endStr ? new Date(endStr) : null;
      if (isNaN(s.getTime())) return { dateDisplay: 'Upcoming', timeDisplay: '' };

      const dateDisplay = s.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      const startTime = s.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      let timeDisplay = startTime;
      if (e && !isNaN(e.getTime())) {
        const endTime = e.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        timeDisplay = `${startTime} – ${endTime}`;
      }

      return { dateDisplay, timeDisplay };
    } catch {
      return { dateDisplay: 'Upcoming Event', timeDisplay: '' };
    }
  };

  const { dateDisplay, timeDisplay } = currentEvent
    ? formatEventDateTime(currentEvent.startDate, currentEvent.endDate)
    : { dateDisplay: '', timeDisplay: '' };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`relative w-screen h-screen overflow-hidden bg-[#040714] text-white select-none font-sans flex flex-col justify-between ${
        !showControls ? 'cursor-none' : ''
      }`}
      style={{ aspectRatio: '16/9' }}
    >
      {/* Background Decorative Ambient Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-indigo-900/30 via-cyan-900/20 to-transparent blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-purple-900/25 via-blue-900/20 to-transparent blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />
      </div>

      {/* ============================================================== */}
      {/* TOP HEADER BAR (Department Branding + Clock + Status)           */}
      {/* ============================================================== */}
      <header className="relative z-20 px-8 py-5 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl flex items-center justify-between shrink-0">
        {/* Left: Department Logo & Title */}
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
              <Atom className="w-8 h-8 animate-[spin_12s_linear_infinite]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl 2xl:text-2xl font-bold tracking-tight text-white font-serif">
                Department of Physics
              </h1>
              <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-mono tracking-wider">
                CUSAT
              </span>
            </div>
            <p className="text-xs 2xl:text-sm text-slate-400 tracking-wide">
              Cochin University of Science and Technology • Live Broadcast Display
            </p>
          </div>
        </div>

        {/* Center: Live Broadcast Indicator & Slide Index */}
        <div className="hidden md:flex items-center gap-4 bg-slate-900/80 border border-white/10 px-5 py-2 rounded-full shadow-inner">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-emerald-400 font-mono uppercase tracking-widest">
              {isUsingFallback ? 'Department Showcase' : 'Live Broadcast'}
            </span>
          </div>

          {events.length > 0 && (
            <>
              <div className="w-px h-3.5 bg-white/20" />
              <div className="flex items-center gap-1.5 font-mono text-xs text-slate-300">
                <span>SLIDE</span>
                <span className="font-bold text-cyan-400">{currentIndex + 1}</span>
                <span>/</span>
                <span>{events.length}</span>
              </div>
            </>
          )}
        </div>

        {/* Right: Real-time Date and Digital Clock */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-2xl 2xl:text-3xl font-extrabold font-mono text-cyan-300 tracking-wider">
              {currentTime.timeStr || '--:--:--'}
            </div>
            <div className="text-xs 2xl:text-sm text-slate-400 font-medium">
              {currentTime.dateStr || 'Loading date...'}
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* MAIN VIEWPORT (16:9 Showcase: Event Details + Poster Showcase) */}
      {/* ============================================================== */}
      <main className="relative z-10 flex-1 px-8 py-6 lg:px-12 lg:py-8 flex items-center overflow-hidden">
        {events.length === 0 ? (
          // Empty State Showcase
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-12 bg-slate-900/40 border border-white/10 rounded-3xl backdrop-blur-md">
            <div className="w-24 h-24 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
              <Atom className="w-12 h-12 animate-pulse" />
            </div>
            <h2 className="text-4xl 2xl:text-5xl font-bold font-serif text-white mb-3">
              Department of Physics Display Feed
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mb-8">
              No live broadcast events currently scheduled for TV signage. Broadcasted events and
              department announcements added by admins appear here automatically.
            </p>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-sm font-mono">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Signage mode active • Polling live server</span>
            </div>
          </div>
        ) : (
          // Active Event Slide (16:9 Landscape Layout)
          <div className="w-full h-full grid grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left 7 Columns: Event Typography, Dates, Venue, QR Code */}
            <div className="col-span-12 lg:col-span-7 flex flex-col justify-between h-full py-2 space-y-6">
              <div className="space-y-5">
                {/* Badges Bar */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md">
                    Featured Event
                  </span>
                  {currentEvent?.brochure && (
                    <span className="px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300 font-semibold text-xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Brochure Available</span>
                    </span>
                  )}
                  {isUsingFallback && (
                    <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-300 font-medium text-xs">
                      Upcoming Department Activity
                    </span>
                  )}
                </div>

                {/* Massive Event Title */}
                <h2 className="text-3xl md:text-5xl 2xl:text-6xl font-extrabold text-white tracking-tight leading-[1.15] font-serif line-clamp-3 drop-shadow-md">
                  {currentEvent?.title}
                </h2>

                {/* Date & Venue Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Date & Time */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 flex items-center justify-center shrink-0">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs uppercase font-mono tracking-wider text-slate-400">
                        Date &amp; Schedule
                      </div>
                      <div className="text-base 2xl:text-lg font-bold text-white mt-0.5">
                        {dateDisplay}
                      </div>
                      {timeDisplay && (
                        <div className="text-xs 2xl:text-sm text-cyan-300 font-mono mt-0.5">
                          {timeDisplay}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Venue */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-400/30 text-indigo-400 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs uppercase font-mono tracking-wider text-slate-400">
                        Location / Venue
                      </div>
                      <div className="text-base 2xl:text-lg font-bold text-white mt-0.5 line-clamp-2">
                        {currentEvent?.venue || 'Department of Physics, CUSAT'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Description (High Readability) */}
                <p className="text-base 2xl:text-xl text-slate-300 line-clamp-3 leading-relaxed font-sans pt-1">
                  {currentEvent?.description}
                </p>
              </div>

              {/* Bottom Callout: QR Code for Mobile Phones */}
              <div className="p-4 2xl:p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 to-slate-950/90 border border-cyan-500/30 shadow-xl flex items-center gap-5 backdrop-blur-lg">
                {qrCodeDataUrl ? (
                  <div className="w-24 h-24 2xl:w-28 28 rounded-xl bg-white p-1.5 shadow-md shrink-0 flex items-center justify-center">
                    <img
                      src={qrCodeDataUrl}
                      alt="Scan QR code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                    <Atom className="w-8 h-8 animate-spin" />
                  </div>
                )}

                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-xs 2xl:text-sm font-bold text-cyan-400 uppercase tracking-wider font-mono">
                    <Sparkles className="w-4 h-4" />
                    <span>Scan with Mobile Camera</span>
                  </div>
                  <h4 className="text-sm 2xl:text-base font-semibold text-white">
                    {currentEvent?.applyLink
                      ? 'Instant Event Registration & Link'
                      : 'View Full Event Details & Brochure'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Open your smartphone camera to access schedule, syllabus, and registration.
                  </p>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Visual Poster / Cover Display (4K Crisp 16:9 / 4:3 Showcase) */}
            <div className="col-span-12 lg:col-span-5 h-full flex items-center justify-center py-2">
              <div className="relative w-full aspect-[4/3] max-h-[70vh] rounded-3xl overflow-hidden border-2 border-white/15 shadow-2xl shadow-cyan-950/40 bg-slate-950 group">
                <img
                  key={currentEvent?.id}
                  src={currentEvent?.image || '/eventssss.jpg'}
                  alt={currentEvent?.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/eventssss.jpg';
                  }}
                />
                {/* Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                {/* Subtitle / Venue Pill over image */}
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-xs font-mono text-white/90">
                  <div className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10">
                    PHYSICS SIGNAGE
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-cyan-300">
                    ID #{currentEvent?.id}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* BOTTOM TICKER & PROGRESS BAR                                   */}
      {/* ============================================================== */}
      <footer className="relative z-20 shrink-0 border-t border-white/10 bg-slate-950/90 backdrop-blur-xl">
        {/* Slide Auto-Advance Progress Bar */}
        {events.length > 1 && !isPaused && (
          <div className="w-full h-1.5 bg-slate-900 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Live News & Announcement Marquee Ticker */}
        <div className="px-8 py-3.5 flex items-center gap-4 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs font-bold uppercase tracking-wider shrink-0">
            <Bell className="w-3.5 h-3.5 animate-bounce" />
            <span>ANNOUNCEMENTS</span>
          </div>

          <div className="flex-1 overflow-hidden relative">
            <div className="whitespace-nowrap inline-flex items-center gap-12 text-sm text-slate-300 font-medium">
              {notices.length > 0 ? (
                notices.map((n, idx) => (
                  <span key={n.id || idx} className="inline-flex items-center gap-3">
                    <span className="text-cyan-400 font-semibold">•</span>
                    <span className="text-white font-semibold">{n.title}</span>
                    {n.content && <span className="text-slate-400">— {n.content}</span>}
                  </span>
                ))
              ) : (
                <span>
                  Welcome to the Department of Physics • Regular updates and academic symposium
                  announcements are displayed live on this screen.
                </span>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* ============================================================== */}
      {/* FLOATING SIGNAGE CONTROLS (Auto-hides after 3s of mouse rest)    */}
      {/* ============================================================== */}
      <div
        className={`absolute bottom-18 right-8 z-50 flex items-center gap-2 bg-slate-900/90 border border-white/20 p-2 rounded-2xl shadow-2xl backdrop-blur-xl transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          type="button"
          onClick={prevSlide}
          className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Previous Slide (Left Arrow)"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setIsPaused((prev) => !prev)}
          className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title={isPaused ? 'Resume Rotation' : 'Pause Rotation (P)'}
        >
          {isPaused ? <Play className="w-5 h-5 text-emerald-400" /> : <Pause className="w-5 h-5" />}
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Next Slide (Right Arrow)"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="w-px h-5 bg-white/20 mx-1" />

        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter 16:9 Fullscreen (F)'}
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
