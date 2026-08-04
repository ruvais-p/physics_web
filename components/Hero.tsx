'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles, Pause, Play } from 'lucide-react';

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

const DEFAULT_SLIDES: Slide[] = [
  {
    id: 'rnd',
    tab: 'R & D',
    title: ['Quantum Frontiers &', 'Nanomaterials'],
    subtitle: 'Pioneering research in magnetic nanocomposites, quantum transport, and 2D topological insulator heterostructures.',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1920&auto=format&fit=crop',
    overlay: 'rgba(0, 10, 30, 0.65)',
    titleColor: '#ffffff',
    ctaText: 'Explore Laboratories',
    ctaLink: '/research-labs',
  },
  {
    id: 'academics',
    tab: 'Academics',
    title: ['Advanced Degree', 'Programs'],
    subtitle: 'Choice-Based Credit System (CBCS) offering M.Sc., Ph.D., and 5-Year Integrated M.Sc. degree programs.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920&auto=format&fit=crop',
    overlay: 'rgba(0, 33, 71, 0.65)',
    titleColor: '#ffffff',
    ctaText: 'View Degree Programs',
    ctaLink: '/courses',
  },
  {
    id: 'instrumentation',
    tab: 'Instrumentation',
    title: ['World-Class', 'Central Facilities'],
    subtitle: 'Equipped with FE-SEM, XRD Diffractometer, Confocal Raman Spectrometer, and VSM Magnetometers.',
    image: '/phy_dept.png',
    overlay: 'rgba(0, 20, 45, 0.65)',
    titleColor: '#ffffff',
    ctaText: 'Book Central Facilities',
    ctaLink: '/facilities',
  },
  {
    id: 'photonics',
    tab: 'Photonics & Lasers',
    title: ['Optoelectronics &', 'Nonlinear Optics'],
    subtitle: 'Laser-matter interactions, Z-scan optical limiting, and rare-earth doped photothermal sensors.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1920&auto=format&fit=crop',
    overlay: 'rgba(10, 15, 35, 0.65)',
    titleColor: '#00A3C1',
    ctaText: 'Read Publications',
    ctaLink: '/journals',
  },
  {
    id: 'cosmology',
    tab: 'Cosmology',
    title: ['Theoretical Physics &', 'Cosmology'],
    subtitle: 'Modeling dark energy dynamics, entropic gravity, black hole thermodynamics, and FLRW expanding spacetimes.',
    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1920&auto=format&fit=crop',
    overlay: 'rgba(12, 10, 30, 0.65)',
    titleColor: '#facc15',
    ctaText: 'Meet Our Faculty',
    ctaLink: '/people',
  },
];

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
}: HeroProps) {
  // If custom title is provided without custom slides array, render single header slide mode
  const effectiveSlides: Slide[] = title
    ? [
      {
        id: 'custom',
        tab: 'Overview',
        badge: badge || 'DEPARTMENT OF PHYSICS • CUSAT',
        title: [title],
        subtitle: subtitle || '',
        image: bgImage || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1920&auto=format&fit=crop',
        overlay: 'rgba(0, 10, 30, 0.7)',
        titleColor: '#ffffff',
        ctaText: primaryCtaText,
        ctaLink: primaryCtaLink,
      },
    ]
    : slides;

  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = effectiveSlides.length;
  const currentSlide = effectiveSlides[index] || effectiveSlides[0];

  const goTo = useCallback(
    (nextIdx: number) => {
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

  return (
    <section className="-mt-[84px] sm:-mt-[96px] relative w-full bg-black text-white overflow-hidden min-h-[620px] sm:min-h-[720px] lg:min-h-[780px]">

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
      <div className="relative z-20 w-full max-w-[1536px] mx-auto px-6 sm:px-12 lg:px-16 pt-36 sm:pt-44 lg:pt-48 pb-32 sm:pb-36 flex flex-col justify-end min-h-[560px] sm:min-h-[660px]">
        <div className="max-w-3xl space-y-6">

          {/* Badge */}
          {currentSlide.badge && (
            <div className="inline-flex items-center space-x-2 bg-cyan-accent/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-cyan-accent/50 text-cyan-accent text-xs font-bold tracking-wider uppercase shadow-xl">
              <Sparkles className="w-3.5 h-3.5 text-cyan-accent animate-pulse" />
              <span>{currentSlide.badge}</span>
            </div>
          )}

          {/* Headline */}
          <h1
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] drop-shadow-xl"
            style={{ color: currentSlide.titleColor }}
          >
            {currentSlide.title.map((line, idx) => (
              <span key={idx} className="block">
                {line}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          {currentSlide.subtitle && (
            <p className="font-sans text-base sm:text-xl text-slate-200 leading-relaxed max-w-2xl font-normal drop-shadow-md">
              {currentSlide.subtitle}
            </p>
          )}

          {/* CTA Buttons */}
          {(currentSlide.ctaText || primaryCtaText || secondaryCtaText) && (
            <div className="pt-2 flex flex-wrap items-center gap-4">
              {(currentSlide.ctaText || primaryCtaText) && (
                <Link
                  href={currentSlide.ctaLink || primaryCtaLink || '/courses'}
                  className="inline-flex items-center space-x-2 bg-cyan-accent hover:bg-cyan-400 text-slate-950 font-sans font-bold px-7 py-3.5 rounded-xl shadow-xl shadow-cyan-500/25 transition-all duration-200 text-base group hover:scale-105"
                >
                  <span>{currentSlide.ctaText || primaryCtaText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              {secondaryCtaText && secondaryCtaLink && (
                <Link
                  href={secondaryCtaLink}
                  className="inline-flex items-center space-x-2 bg-white/15 hover:bg-white/25 text-white border border-white/30 font-sans font-medium px-6 py-3.5 rounded-xl backdrop-blur-md transition-all text-base"
                >
                  <span>{secondaryCtaText}</span>
                </Link>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Bottom Tabs & Controls Bar */}
      {total > 1 && (
        <div className="absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-8 pb-4 px-6 sm:px-12 lg:px-16 flex flex-col md:flex-row items-stretch md:items-end justify-between gap-4">

          {/* Tabs with Animated Progress Line */}
          <div className="flex items-center space-x-6 sm:space-x-8 overflow-x-auto no-scrollbar py-2 flex-1 border-b md:border-b-0 border-white/10">
            {effectiveSlides.map((s, i) => {
              const isActive = i === index;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(i)}
                  className={`flex flex-col items-start space-y-2 text-left transition-all shrink-0 cursor-pointer group ${isActive ? 'text-white font-bold' : 'text-white/60 hover:text-white font-medium'
                    }`}
                >
                  <span className="text-xs sm:text-sm tracking-wide">
                    {s.tab}
                  </span>
                  {/* Progress Line Track */}
                  <div className="w-20 sm:w-28 h-1 bg-white/20 rounded-full overflow-hidden relative">
                    {isActive && (
                      <div
                        key={`${s.id}-${isPlaying}`}
                        className="absolute inset-0 bg-cyan-accent origin-left animate-hero-progress"
                        style={{
                          animationDuration: `${SLIDE_DURATION_MS}ms`,
                          animationPlayState: isPlaying ? 'running' : 'paused',
                        }}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dot Pagination & Play/Pause Button */}
          <div className="flex items-center justify-between md:justify-end space-x-4 shrink-0 pt-2 md:pt-0">
            {/* Dots */}
            <div className="flex items-center space-x-2" role="tablist" aria-label="Slides">
              {effectiveSlides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${i === index ? 'bg-cyan-accent w-6' : 'bg-white/40 hover:bg-white'
                    }`}
                />
              ))}
            </div>

            {/* Play/Pause Toggle */}
            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              className="p-2 rounded-full border border-white/40 bg-black/40 hover:bg-white/20 text-white transition-all cursor-pointer"
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
          </div>

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
