'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import TextReveal from '@/components/TextReveal';

// Helper function to resolve breadcrumb route
function getBreadcrumbHref(segment: string): string {
  const clean = segment.trim().toLowerCase();
  if (clean === 'home') return '/';
  if (clean === 'about' || clean === 'about us') return '/about';
  if (clean === 'people' || clean === 'faculty' || clean === 'scholars') return '/people';
  if (clean === 'courses' || clean === 'academics' || clean === 'programs') return '/courses';
  if (clean === 'research' || clean === 'research & innovation') return '/research';
  if (clean === 'facilities' || clean === 'central facilities' || clean === 'instrumentation') return '/facilities';
  if (clean === 'journals' || clean === 'publications') return '/journals';
  if (clean === 'events' || clean === 'news & events') return '/events';
  if (clean === 'news') return '/news';
  if (clean === 'alumni') return '/alumni';
  if (clean === 'library') return '/library';
  if (clean === 'contact' || clean === 'contact us') return '/contact';
  if (clean === 'dashboard') return '/dashboard';
  return `/${clean.replace(/\s+/g, '-')}`;
}

export type Slide = {
  id: string;
  tab: string;
  badge?: string;
  title: string[];
  subtitle: string;
  image: string;
  overlay: string;
  titleColor: string;
  ctaText?: string;
  ctaLink?: string;
};

const SLIDE_DURATION_MS = 6000;

interface HeroProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  bgImage?: string;
  slides?: Slide[];
  align?: 'left' | 'center';
}

export default function Hero({
  badge,
  title,
  subtitle,
  primaryCtaText,
  primaryCtaLink,
  secondaryCtaText,
  secondaryCtaLink,
  bgImage,
  slides = DEFAULT_SLIDES,
  align = 'left',
}: HeroProps) {
  const [dynamicSlides, setDynamicSlides] = useState<Slide[] | null>(null);

  useEffect(() => {
    // Fetch live visible hero records from database
    fetch('/api/public/hero')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: Slide[] = data.map((item, idx) => ({
            id: String(item.id),
            tab: `Slide ${idx + 1}`,
            badge: item.badge,
            title: [item.title],
            subtitle: item.description,
            image: item.image,
            overlay: 'rgba(0, 0, 0, 0.25)',
            titleColor: '#ffffff',
          }));
          setDynamicSlides(mapped);
        } else {
          setDynamicSlides([]);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch public hero slides:', err);
        setDynamicSlides([]);
      });
  }, []);

  // Determine active slides array
  const baseSlides = dynamicSlides && dynamicSlides.length > 0 ? dynamicSlides : (slides || []);

  // If custom title is provided without custom slides array, render single header slide mode
  const effectiveSlides: Slide[] = title
    ? [
      {
        id: 'custom',
        tab: 'Overview',
        badge: badge,
        title: [title],
        subtitle: subtitle || '',
        image: bgImage || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1920&auto=format&fit=crop',
        overlay: 'rgba(0, 0, 0, 0.55)',
        titleColor: '#ffffff',
        ctaText: primaryCtaText,
        ctaLink: primaryCtaLink,
      },
    ]
    : baseSlides;

  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = effectiveSlides.length;
  const currentSlide = effectiveSlides[index] || effectiveSlides[0];

  const goTo = useCallback(
    (nextIdx: number) => {
      if (total === 0) return;
      setIndex(((nextIdx % total) + total) % total);
    },
    [total]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  // Autoplay handler
  useEffect(() => {
    if (!isPlaying || total <= 1) return;
    timeoutRef.current = setTimeout(next, SLIDE_DURATION_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index, isPlaying, next, total]);

  if (total === 0 || !currentSlide) {
    return (
      <section className="-mt-[140px] sm:-mt-[165px] lg:-mt-[180px] relative w-full bg-black text-white overflow-hidden min-h-[675px] sm:min-h-[775px] lg:min-h-[865px] xl:min-h-[900px] 2xl:min-h-[970px]" />
    );
  }

  return (
    <section className="-mt-[140px] sm:-mt-[165px] lg:-mt-[180px] relative w-full bg-black text-white overflow-hidden min-h-[675px] sm:min-h-[775px] lg:min-h-[865px] xl:min-h-[900px] 2xl:min-h-[970px]">

      {/* Background Image Slides */}
      <div className="absolute inset-0 z-0">
        {effectiveSlides.map((s, i) => (
          <div
            key={s.id}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: i === index ? 1 : 0,
              zIndex: i === index ? 1 : 0,
            }}
            aria-hidden={i !== index}
          >
            <Image
              src={s.image}
              alt={s.tab}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
            {/* Color Overlay */}
            <div
              className="absolute inset-0 transition-colors duration-700"
              style={{ background: s.overlay }}
            />
          </div>
        ))}
      </div>

      {/* Top Floating Gradient for Header legibility */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />

      {/* Main Slide Content Layer */}
      <div className={`relative z-20 w-full max-w-[1536px] mx-auto px-6 sm:px-12 lg:px-16 pt-40 sm:pt-48 lg:pt-56 pb-6 sm:pb-8 lg:pb-10 flex flex-col justify-end min-h-[630px] sm:min-h-[720px] lg:min-h-[810px] xl:min-h-[850px] ${
        align === 'center' ? 'items-center text-center' : 'items-start text-left'
      }`}>
        <div className={`max-w-4xl space-y-5 ${
          align === 'center' ? 'text-center flex flex-col items-center justify-center mx-auto' : 'text-left'
        }`}>

          {/* Optional Badge / Breadcrumbs (Clean Interactive Links) */}
          {currentSlide.badge && (
            <div className={`text-xs sm:text-sm font-bold tracking-widest text-cyan-accent uppercase drop-shadow-md flex flex-wrap items-center gap-2 ${
              align === 'center' ? 'justify-center' : 'justify-start'
            }`}>
              {currentSlide.badge.includes('>') ? (
                currentSlide.badge.split('>').map((part, pIdx, arr) => {
                  const label = part.trim();
                  const isLast = pIdx === arr.length - 1;
                  const href = getBreadcrumbHref(label);

                  return (
                    <span key={pIdx} className="inline-flex items-center gap-2">
                      {isLast ? (
                        <span className="text-white font-extrabold">{label}</span>
                      ) : (
                        <Link
                          href={href}
                          className="hover:text-white transition-colors cursor-pointer hover:underline"
                        >
                          {label}
                        </Link>
                      )}
                      {!isLast && <span className="text-cyan-accent/70">&gt;</span>}
                    </span>
                  );
                })
              ) : (
                <span>{currentSlide.badge}</span>
              )}
            </div>
          )}

          {/* Headline */}
          <h1
            className={`font-serif text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.08] drop-shadow-2xl w-full ${
              align === 'center' ? 'text-center flex flex-col items-center justify-center' : 'text-left'
            }`}
            style={{ color: currentSlide.titleColor || '#0284c7' }}
          >
            {currentSlide.title.map((line, idx) => (
              <span key={idx} className={`block w-full ${align === 'center' ? 'text-center flex justify-center' : ''}`}>
                <TextReveal
                  text={line}
                  animKey={`${index}-${idx}`}
                  delay={idx * 0.15}
                  className={align === 'center' ? 'justify-center text-center' : ''}
                />
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          {currentSlide.subtitle && (
            <p className={`font-sans text-base sm:text-xl text-slate-200 leading-relaxed max-w-3xl font-normal drop-shadow-md w-full ${
              align === 'center' ? 'text-center mx-auto' : 'text-left'
            }`}>
              {currentSlide.subtitle}
            </p>
          )}

        </div>
      </div>


      {/* Bottom Right Slide Controls (Prev/Next Arrows, Dots, Play/Pause Toggle) */}
      {total > 1 && (
        <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-12 z-20 flex items-center space-x-3 sm:space-x-4">
          {/* Previous Arrow */}
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            className="w-8 h-8 rounded-full border border-white/40 hover:border-white bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>

          {/* Dots */}
          <div className="flex items-center space-x-2.5" role="tablist" aria-label="Slides">
            {effectiveSlides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={`w-3 h-3 rounded-full transition-all cursor-pointer ${i === index
                  ? 'bg-white scale-110 shadow-md'
                  : 'bg-white/40 hover:bg-white/70'
                  }`}
              />
            ))}
          </div>

          {/* Next Arrow */}
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className="w-8 h-8 rounded-full border border-white/40 hover:border-white bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>

          {/* Play/Pause Toggle */}
          <button
            type="button"
            onClick={() => setIsPlaying((prev) => !prev)}
            className="w-8 h-8 rounded-full border border-white/60 hover:border-white bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-white text-white" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-white text-white translate-x-0.5" />
            )}
          </button>
        </div>
      )}

      {/* Tailwind Keyframe Animation for Progress Bar */}
      <style jsx global>{`
          @keyframes heroProgress {
            from {
              transform: scaleX(0);
            }
            to {
              transform: scaleX(1);
            }
          }
          .animate-hero-progress {
            animation: heroProgress linear forwards;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
    </section>
  );
}
