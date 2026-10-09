/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import {
  Calendar,
  Clock,
  MapPin,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState({
    timeStr: '',
    dateStr: '',
  });

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

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

  // 4. Slide Rotation Timer
  useEffect(() => {
    if (isPaused || events.length <= 1) {
      return;
    }

    const timer = setTimeout(() => {
      setCurrentIndex((curr) => (curr + 1) % events.length);
    }, slideDurationSeconds * 1000);

    return () => clearTimeout(timer);
  }, [currentIndex, isPaused, events.length, slideDurationSeconds]);

  // 5. Screen Wake Lock (Prevent TV from sleeping)
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator && !wakeLockRef.current) {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
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
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((curr) => (curr - 1 + (events.length || 1)) % (events.length || 1));
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
  };

  const prevSlide = () => {
    setCurrentIndex((curr) => (curr - 1 + (events.length || 1)) % (events.length || 1));
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
      className={`relative w-screen h-screen overflow-hidden bg-[#030914] text-white select-none font-sans flex flex-col justify-between ${
        !showControls ? 'cursor-none' : ''
      }`}
      style={{ aspectRatio: '16/9' }}
    >
      {/* ============================================================== */}
      {/* 1. HEADER: Department Branding + Event Counter + Live Clock   */}
      {/* ============================================================== */}
      <header className="relative z-20 px-8 lg:px-14 py-5 border-b border-white/10 flex items-center justify-between shrink-0">
        {/* Left: Department Emblem & Institution */}
        <div className="flex items-center gap-4">
          <div className="h-10 w-auto text-sky-400 shrink-0 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-12 -12 255 184"
              className="h-10 w-auto fill-current text-sky-400 overflow-visible"
              aria-label="Department of Physics Emblem"
            >
              <text x="2" y="124" fontFamily="Georgia, 'Times New Roman', serif" fontSize="110" fontWeight="900" fill="currentColor">D</text>
              <g transform="translate(112, 80)">
                <ellipse cx="0" cy="0" rx="25" ry="70" stroke="currentColor" strokeWidth="3.5" fill="none" />
                <ellipse cx="0" cy="0" rx="25" ry="70" stroke="currentColor" strokeWidth="3.5" fill="none" transform="rotate(60)" />
                <ellipse cx="0" cy="0" rx="25" ry="70" stroke="currentColor" strokeWidth="3.5" fill="none" transform="rotate(-60)" />
                <circle cx="0" cy="0" r="16" fill="currentColor" />
              </g>
              <text x="145" y="124" fontFamily="Georgia, 'Times New Roman', serif" fontSize="110" fontWeight="900" fill="currentColor">P</text>
            </svg>
          </div>

          <div className="border-l border-white/15 pl-4">
            <h1 className="text-xl 2xl:text-2xl font-serif font-bold tracking-tight text-white leading-tight">
              Department of Physics
            </h1>
            <p className="text-xs 2xl:text-sm text-slate-400 font-sans tracking-wide">
              Cochin University of Science and Technology
            </p>
          </div>
        </div>

        {/* Right: Digital Clock & Date */}
        <div className="text-right">
          <div className="text-xl 2xl:text-2xl font-mono font-medium text-white tracking-wide">
            {currentTime.timeStr || '--:--:--'}
          </div>
          <div className="text-xs 2xl:text-sm text-slate-400">
            {currentTime.dateStr || 'Loading date...'}
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. MAIN VIEWPORT: Clean Editorial Layout (Text Left / Image Right) */}
      {/* ============================================================== */}
      <main className="relative z-10 flex-1 px-8 lg:px-14 py-8 2xl:py-10 flex items-center overflow-hidden">
        {events.length === 0 ? (
          // Empty State
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-12 max-w-2xl mx-auto">
            <div className="h-14 w-auto text-slate-600 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 255 184" className="h-14 w-auto fill-current overflow-visible">
                <text x="2" y="124" fontFamily="Georgia, 'Times New Roman', serif" fontSize="110" fontWeight="900" fill="currentColor">D</text>
                <g transform="translate(112, 80)">
                  <ellipse cx="0" cy="0" rx="25" ry="70" stroke="currentColor" strokeWidth="3.5" fill="none" />
                  <ellipse cx="0" cy="0" rx="25" ry="70" stroke="currentColor" strokeWidth="3.5" fill="none" transform="rotate(60)" />
                  <ellipse cx="0" cy="0" rx="25" ry="70" stroke="currentColor" strokeWidth="3.5" fill="none" transform="rotate(-60)" />
                  <circle cx="0" cy="0" r="16" fill="currentColor" />
                </g>
                <text x="145" y="124" fontFamily="Georgia, 'Times New Roman', serif" fontSize="110" fontWeight="900" fill="currentColor">P</text>
              </svg>
            </div>
            <h2 className="text-3xl 2xl:text-4xl font-serif font-bold text-white mb-3">
              Department of Physics Live Display
            </h2>
            <p className="text-base text-slate-400 leading-relaxed">
              No live broadcast events currently scheduled for rotation. Upcoming lectures, seminars,
              and announcements will appear here automatically.
            </p>
          </div>
        ) : (
          // Editorial Layout: Left (Details) + Right (Image)
          <div className="w-full h-full grid grid-cols-12 gap-10 lg:gap-14 2xl:gap-16 items-center">
            {/* Left 7 Columns: Event Title, Details, and QR Code */}
            <div className="col-span-12 lg:col-span-7 flex flex-col justify-between h-full py-1">
              {/* Top: Title and Description */}
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl 2xl:text-6xl font-serif font-bold text-white tracking-tight leading-[1.18] line-clamp-3">
                  {currentEvent?.title}
                </h2>

                <p className="text-base md:text-lg 2xl:text-xl text-slate-300 leading-relaxed font-sans line-clamp-3 2xl:line-clamp-4 pt-1">
                  {currentEvent?.description}
                </p>
              </div>

              {/* Middle: Date, Time & Venue (Simple text with minimal icons, unboxed) */}
              <div className="pt-6 border-t border-white/10 space-y-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-base 2xl:text-lg text-slate-200">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-sky-400 shrink-0" />
                    <span className="font-medium text-white">{dateDisplay}</span>
                  </div>
                  {timeDisplay && (
                    <>
                      <span className="text-slate-600 hidden sm:inline">•</span>
                      <div className="flex items-center gap-2.5">
                        <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                        <span className="text-slate-300 font-mono text-sm 2xl:text-base">
                          {timeDisplay}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {currentEvent?.venue && (
                  <div className="flex items-center gap-2.5 text-base 2xl:text-lg text-slate-300">
                    <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                    <span className="line-clamp-1">{currentEvent.venue}</span>
                  </div>
                )}
              </div>

              {/* Bottom: QR Code & Registration Instructions (Unboxed, clean alignment) */}
              <div className="pt-6 border-t border-white/10 flex items-center gap-5">
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="Event QR Code"
                    className="w-20 h-20 2xl:w-24 2xl:h-24 rounded-lg bg-white p-1.5 shrink-0"
                  />
                ) : null}

                <div className="space-y-0.5">
                  <p className="text-xs font-mono font-semibold tracking-wider uppercase text-sky-400">
                    {currentEvent?.applyLink
                      ? 'Registration & Details'
                      : currentEvent?.brochure
                      ? 'Event Brochure'
                      : 'Event Information'}
                  </p>
                  <p className="text-sm 2xl:text-base font-medium text-white">
                    Scan with mobile camera to register or view schedule
                  </p>
                  <p className="text-xs text-slate-400 font-sans">
                    physics.cusat.ac.in
                  </p>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Event Poster Artwork */}
            <div className="col-span-12 lg:col-span-5 h-full flex items-center justify-center py-1">
              <div className="relative w-full aspect-[4/3] max-h-[72vh] rounded-2xl overflow-hidden border border-white/10 bg-slate-950 shadow-2xl">
                <img
                  key={currentEvent?.id}
                  src={currentEvent?.image || '/eventssss.jpg'}
                  alt={currentEvent?.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/eventssss.jpg';
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* 3. BOTTOM FOOTER: Announcements Ticker                        */}
      {/* ============================================================== */}
      <footer className="relative z-20 shrink-0 border-t border-white/10 bg-slate-950/80">
        {/* Announcements Marquee Ticker */}
        <div className="px-8 lg:px-14 py-3 flex items-center gap-6 overflow-hidden text-sm">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-sky-400 uppercase tracking-widest shrink-0">
            <span>NOTICES</span>
          </div>

          <span className="text-slate-600 shrink-0">|</span>

          <div className="flex-1 overflow-hidden relative">
            <div className="whitespace-nowrap animate-marquee flex items-center gap-12 text-slate-300">
              {notices.length > 0 ? (
                <>
                  {notices.map((n, idx) => (
                    <span key={`a-${n.id || idx}`} className="inline-flex items-center gap-3">
                      <span className="text-sky-400 font-semibold">•</span>
                      <span className="text-white font-medium">{n.title}</span>
                      {n.content && <span className="text-slate-400">— {n.content}</span>}
                    </span>
                  ))}
                  {notices.map((n, idx) => (
                    <span key={`b-${n.id || idx}`} className="inline-flex items-center gap-3">
                      <span className="text-sky-400 font-semibold">•</span>
                      <span className="text-white font-medium">{n.title}</span>
                      {n.content && <span className="text-slate-400">— {n.content}</span>}
                    </span>
                  ))}
                </>
              ) : (
                <span>
                  Welcome to the Department of Physics • Regular academic notices and announcements rotate live on this display.
                </span>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* ============================================================== */}
      {/* 4. MINIMAL FLOATING CONTROLS (Auto-hides on inactivity)        */}
      {/* ============================================================== */}
      <div
        className={`absolute bottom-16 right-8 z-50 flex items-center gap-1.5 bg-slate-950/90 border border-white/10 p-1.5 rounded-xl shadow-xl backdrop-blur-md transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          type="button"
          onClick={prevSlide}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setIsPaused((prev) => !prev)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title={isPaused ? 'Resume Rotation' : 'Pause Rotation'}
        >
          {isPaused ? <Play className="w-4 h-4 text-sky-400" /> : <Pause className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Next Slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-white/15 mx-0.5" />

        <button
          type="button"
          onClick={toggleFullscreen}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
