'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  affiliation: string;
  quote: string;
  initials: string;
  avatarBg: string;
  image: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'nikhil',
    name: 'Nikhil Mohan',
    role: 'International Partner',
    affiliation: 'Neutrino Group ICISE, Vietnam',
    quote:
      'CUSAT helped me build a foundation to which I could add knowledge, skills, and associations necessary to have a career in science.',
    initials: 'NM',
    avatarBg: 'from-blue-600 to-indigo-800',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80',
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
    }, 5500); // slightly longer interval for easier reading
    return () => clearInterval(interval);
  }, [isAutoplay, nextSlide]);

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="w-full px-6 sm:px-12 lg:px-16 py-16 sm:py-24 bg-surface-lowest border-t border-surface-low/60">
      <div className="max-w-[1536px] mx-auto space-y-16">
        
        {/* Section Heading */}
        <div className="space-y-2 text-left">
          <span className="text-xs font-bold text-cyan-accent uppercase tracking-widest block">
            Alumni & Scholar Stories
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-oxford">
            Testimonials
          </h2>
        </div>

        {/* Custom Testimonials Grid */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
          onMouseEnter={() => setIsAutoplay(false)}
          onMouseLeave={() => setIsAutoplay(true)}
        >
          
          {/* Left Column: Pagination & Author Profile Card */}
          <div className="lg:col-span-4 space-y-12">
            {/* Pagination Dots */}
            <div className="flex items-center space-x-2">
              {TESTIMONIALS.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to testimonial ${idx + 1}`}
                  className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                    currentIndex === idx
                      ? 'w-6 bg-cyan-accent shadow-sm'
                      : 'w-2 bg-surface-mid hover:bg-surface-high'
                  }`}
                />
              ))}
            </div>

            {/* Author Profile */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="space-y-6"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden border border-surface-mid/50 shadow-sm bg-surface-lowest">
                  <img
                    src={current.image}
                    alt={current.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-sans text-sm font-black text-oxford uppercase tracking-wider">
                    {current.name}
                  </h4>
                  <p className="font-sans text-[11px] font-bold text-cyan-accent uppercase tracking-widest leading-relaxed">
                    {current.role} <br />
                    <span className="text-slate-400 font-medium normal-case">{current.affiliation}</span>
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Navigation Controls & Big Testimonial Quote */}
          <div className="lg:col-span-8 space-y-10">
            {/* Navigation Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={prevSlide}
                aria-label="Previous Testimonial"
                className="w-10 h-10 rounded-lg bg-surface-low hover:bg-surface-mid text-oxford flex items-center justify-center transition-all cursor-pointer border border-surface-mid/30 shadow-sm"
              >
                <ChevronLeft className="w-5 h-5 text-oxford" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next Testimonial"
                className="w-10 h-10 rounded-lg bg-surface-low hover:bg-surface-mid text-oxford flex items-center justify-center transition-all cursor-pointer border border-surface-mid/30 shadow-sm"
              >
                <ChevronRight className="w-5 h-5 text-oxford" />
              </button>
            </div>

            {/* Quote Block */}
            <div className="relative min-h-[160px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="flex items-start gap-4"
                >
                  <span className="text-cyan-accent font-serif text-6xl md:text-7xl font-bold leading-none select-none -mt-4">
                    “
                  </span>
                  <p className="font-sans text-oxford text-xl sm:text-2xl lg:text-3xl font-extrabold leading-snug tracking-tight text-left">
                    {current.quote}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
