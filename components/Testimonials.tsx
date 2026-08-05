'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  affiliation: string;
  quote: string;
  initials: string;
  avatarBg: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'nikhil',
    name: 'Nikhil Mohan',
    role: 'International partner',
    affiliation: 'Neutrino Group ICISE, Vietnam',
    quote:
      'CUSAT helped me build a foundation to which I could add knowledge, skills, and associations necessary to have a career in science.',
    initials: 'NM',
    avatarBg: 'from-blue-600 to-indigo-800',
  },
  {
    id: 'ananya',
    name: 'Dr. Ananya Nair',
    role: 'Postdoctoral Fellow',
    affiliation: 'Max Planck Institute for Quantum Optics, Germany',
    quote:
      'The rigorous academic foundations and hands-on access to state-of-the-art central instrumentation at CUSAT Department of Physics gave me the technical edge to lead quantum optics research internationally.',
    initials: 'AN',
    avatarBg: 'from-cyan-500 to-blue-700',
  },
  {
    id: 'rahul',
    name: 'Dr. Rahul V. Menon',
    role: 'Senior Research Scientist',
    affiliation: 'ISRO Space Applications Centre',
    quote:
      'Mentorship from distinguished faculty members and advanced optoelectronics labs laid the cornerstone of my career in satellite space payload development. CUSAT Physics is a benchmark of excellence.',
    initials: 'RM',
    avatarBg: 'from-amber-500 to-red-600',
  },
  {
    id: 'mathew',
    name: 'Dr. Mathew Thomas',
    role: 'Assistant Professor',
    affiliation: 'Indian Institute of Technology (IIT) Madras',
    quote:
      'The Department instills deep conceptual clarity coupled with modern computational physics tools. My training here prepared me seamlessly for academic leadership at top institutes.',
    initials: 'MT',
    avatarBg: 'from-indigo-500 to-purple-700',
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  const total = TESTIMONIALS.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (!isAutoplay) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 2000);
    return () => clearInterval(interval);
  }, [isAutoplay, nextSlide]);

  const leftIndex = (currentIndex - 1 + total) % total;
  const rightIndex = (currentIndex + 1) % total;

  const current = TESTIMONIALS[currentIndex];
  const leftItem = TESTIMONIALS[leftIndex];
  const rightItem = TESTIMONIALS[rightIndex];

  return (
    <section className="w-full px-4 sm:px-8 lg:px-12 py-12 sm:py-16 bg-[#f8fafc] bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] relative overflow-hidden">
      <div className="w-full max-w-[1536px] mx-auto space-y-12">
        
        {/* Section Heading */}
        <div className="text-center">
          <h2 className="font-serif text-4xl sm:text-5xl font-extrabold text-oxford tracking-tight">
            Testimonials
          </h2>
        </div>

        {/* 3D 3-Card Carousel Container (Matching Wireframe Layout) */}
        <div
          className="relative flex items-center justify-center gap-4 sm:gap-6 min-h-[320px] sm:min-h-[360px]"
          onMouseEnter={() => setIsAutoplay(false)}
          onMouseLeave={() => setIsAutoplay(true)}
        >
          
          {/* Left Peeked Card */}
          <div
            onClick={prevSlide}
            className="hidden md:flex flex-col justify-between items-center text-center w-64 lg:w-80 h-[260px] rounded-3xl bg-[#001a3a] hover:bg-[#002147] text-white p-6 shadow-lg transition-all duration-500 scale-90 opacity-60 hover:opacity-90 cursor-pointer shrink-0 border border-cyan-accent/20"
          >
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${leftItem.avatarBg} text-white font-bold flex items-center justify-center shadow-md border border-cyan-accent/30 shrink-0`}>
              {leftItem.initials}
            </div>
            <div className="flex-1 flex items-center justify-center my-2">
              <p className="font-sans text-xs line-clamp-3 text-slate-200 italic">
                "{leftItem.quote}"
              </p>
            </div>
            <h4 className="font-sans font-bold text-sm text-cyan-accent shrink-0">
              {leftItem.name}
            </h4>
          </div>

          {/* Center Main Active Card (Constant Fixed Box Size) */}
          <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-3xl h-[340px] sm:h-[360px] md:h-[380px] rounded-3xl bg-[#002147] text-white p-6 sm:p-10 shadow-2xl border-2 border-cyan-accent/40 transform transition-all duration-500 scale-100 z-20 flex flex-col justify-between items-center text-center shadow-cyan-900/30 shrink-0">
            
            {/* Avatar Circle */}
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${current.avatarBg} text-white font-serif text-xl sm:text-2xl font-bold flex items-center justify-center shadow-xl border-4 border-cyan-accent/50 shrink-0`}>
              {current.initials}
            </div>

            {/* Quote Body (Flex Centered inside constant box height) */}
            <div className="flex-1 flex items-center justify-center my-2 px-2 sm:px-6">
              <p className="font-sans text-base sm:text-lg md:text-xl text-slate-100 font-normal leading-relaxed text-center max-w-2xl drop-shadow-sm line-clamp-4">
                "{current.quote}"
              </p>
            </div>

            {/* Author Info */}
            <div className="space-y-0.5 shrink-0">
              <h3 className="font-sans text-lg sm:text-xl font-bold text-white tracking-wide">
                {current.name}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-cyan-accent font-light italic">
                {current.role}, {current.affiliation}
              </p>
            </div>

          </div>

          {/* Right Peeked Card */}
          <div
            onClick={nextSlide}
            className="hidden md:flex flex-col justify-between items-center text-center w-64 lg:w-80 h-[260px] rounded-3xl bg-[#001a3a] hover:bg-[#002147] text-white p-6 shadow-lg transition-all duration-500 scale-90 opacity-60 hover:opacity-90 cursor-pointer shrink-0 border border-cyan-accent/20"
          >
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${rightItem.avatarBg} text-white font-bold flex items-center justify-center shadow-md border border-cyan-accent/30 shrink-0`}>
              {rightItem.initials}
            </div>
            <div className="flex-1 flex items-center justify-center my-2">
              <p className="font-sans text-xs line-clamp-3 text-slate-200 italic">
                "{rightItem.quote}"
              </p>
            </div>
            <h4 className="font-sans font-bold text-sm text-cyan-accent shrink-0">
              {rightItem.name}
            </h4>
          </div>

          {/* Navigation Arrows for Mobile */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Testimonial"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-[#002147] border border-cyan-accent/30 shadow-lg text-white hover:text-cyan-accent hover:scale-110 transition-all flex md:hidden"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Testimonial"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-[#002147] border border-cyan-accent/30 shadow-lg text-white hover:text-cyan-accent hover:scale-110 transition-all flex md:hidden"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>

        {/* Rectangle Indicator Dots */}
        <div className="flex justify-center items-center space-x-2 pt-4">
          {TESTIMONIALS.map((t, idx) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to testimonial ${idx + 1}`}
              className={`h-2.5 transition-all duration-300 rounded-sm ${
                currentIndex === idx
                  ? 'w-7 bg-cyan-accent shadow-sm'
                  : 'w-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
