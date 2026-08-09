'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Sparkles, Pause, Play } from 'lucide-react';
import TextReveal from '@/components/TextReveal';

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
    titleColor: '#0284c7',
    ctaText: 'Explore Laboratories',
    ctaLink: '/research-labs',
  },
  {
    id: 'academics',
    tab: 'Academics',
    title: ['Advanced Degree', 'Programs'],
    subtitle: 'Choice-Based Credit System (CBCS) offering M.Sc., Ph.D., and 5-Year Integrated M.Sc. degree programs.',
    image: '/faculty.png',
    overlay: 'rgba(0, 33, 71, 0.65)',
    titleColor: '#0284c7',
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
    titleColor: '#0284c7',
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
    titleColor: '#0284c7',
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
    titleColor: '#0284c7',
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
  subtitle = 'Bridging academic tradition with pioneering research.',
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
    <section className="-mt-[112px] lg:-mt-[132px] relative w-full bg-black text-white overflow-hidden min-h-[620px] sm:min-h-[720px] lg:min-h-[780px]">

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
      <div className="relative z-20 w-full max-w-[1536px] mx-auto px-6 sm:px-12 lg:px-16 pt-40 sm:pt-48 lg:pt-52 pb-32 sm:pb-36 flex flex-col justify-end min-h-[560px] sm:min-h-[660px]">
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
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-cyan-accent drop-shadow-2xl"
            style={{ color: currentSlide.titleColor || '#0284c7' }}
          >
            {currentSlide.title.map((line, idx) => (
              <span key={idx} className="block">
                <TextReveal text={line} animKey={`${index}-${idx}`} delay={idx * 0.15} />
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          {currentSlide.subtitle && (
            <p className="font-sans text-base sm:text-xl text-slate-200 leading-relaxed max-w-2xl font-normal drop-shadow-md">
              {currentSlide.subtitle}
            </p>
          )}



        </div>
      </div>

      {/* Bottom Right Slide Controls (5 Dots & Animation Play/Pause Toggle) */}
      {total > 1 && (
        <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-12 z-20 flex items-center space-x-4">
          {/* Dots */}
          <div className="flex items-center space-x-3" role="tablist" aria-label="Slides">
            {effectiveSlides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                  i === index
                    ? 'bg-white scale-110 shadow-md'
                    : 'bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

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
