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
    }, 4500); // 4.5 seconds for comfortable reading
    return () => clearInterval(interval);
  }, [isAutoplay, nextSlide]);

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="w-full px-6 sm:px-12 lg:px-16 py-16 sm:py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-[1536px] mx-auto space-y-12">
        
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
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
          onMouseEnter={() => setIsAutoplay(false)}
          onMouseLeave={() => setIsAutoplay(true)}
        >
          
          {/* Left Column: Tall Student Photo */}
          <div className="lg:col-span-4 relative group rounded-3xl overflow-hidden shadow-sm h-[380px] lg:h-auto min-h-[380px]">
            <img
              src={current.image}
              alt={current.name}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.03]"
            />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent" />
            
            {/* Floating Badge */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-md flex items-center gap-2 border border-slate-100/50">
              <svg className="w-3 h-3 text-cyan-accent fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span className="text-[10px] font-extrabold text-slate-800 uppercase tracking-widest font-sans">
                Testimonial
              </span>
            </div>
          </div>

          {/* Right Column: Stats & Testimonial Details */}
          <div className="lg:col-span-8 flex flex-col gap-8 justify-between">
            
            {/* Top Sub-Row: Two Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Card 1: NIRF Ranking (Blue Theme Gradient) */}
              <div className="relative overflow-hidden bg-gradient-to-br from-cyan-600 to-blue-800 text-white rounded-3xl p-8 flex flex-col justify-between h-60 shadow-sm group">
                {/* Background Wave Graphic */}
                <svg className="absolute right-0 bottom-0 w-44 h-44 text-white/5 pointer-events-none transition-transform duration-700 group-hover:scale-110" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0,100 C50,150 150,50 200,100 L200,200 L0,200 Z" fill="currentColor"/>
                  <path d="M0,130 C60,180 140,90 200,140 L200,200 L0,200 Z" fill="currentColor" opacity="0.5"/>
                </svg>
                
                <div>
                  <span className="text-[10px] font-bold text-cyan-200 uppercase tracking-widest">
                    Achievements
                  </span>
                  <h3 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mt-2 font-serif">
                    Top 40
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-cyan-100 font-sans leading-relaxed relative z-10">
                  CUSAT is consistently ranked among the top 40 universities in India in the National Institutional Ranking Framework (NIRF).
                </p>
              </div>

              {/* Card 2: Research Metric (Dark Blue Theme) */}
              <div className="relative overflow-hidden bg-oxford text-white rounded-3xl p-8 flex flex-col justify-between h-60 shadow-sm group">
                {/* Background Orbit Graphic */}
                <svg className="absolute right-0 top-0 w-44 h-44 text-white/5 pointer-events-none transition-transform duration-700 group-hover:scale-110" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="150" cy="50" r="80" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
                  <circle cx="150" cy="50" r="50" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="150" cy="50" r="20" fill="currentColor"/>
                </svg>
                
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Research Metrics
                  </span>
                  <h3 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mt-2 font-serif">
                    1,200+
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed relative z-10">
                  Peer-reviewed scientific publications authored by our faculty and scholars in leading international physics journals.
                </p>
              </div>

            </div>

            {/* Bottom Sub-Row: Big Testimonial Quote Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden flex flex-col justify-between flex-grow min-h-[260px]">
              {/* Giant Decorative Quotes */}
              <div className="absolute right-8 top-4 text-slate-100/70 font-serif text-[120px] select-none pointer-events-none leading-none">
                “
              </div>
              
              {/* Quote Text */}
              <div className="relative z-10 max-w-3xl">
                <p className="font-sans text-slate-700 text-base sm:text-lg md:text-xl font-normal leading-relaxed text-justify italic">
                  "{current.quote}"
                </p>
              </div>

              {/* Profile & Navigation Controls */}
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mt-8 border-t border-slate-100 pt-6">
                
                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-cyan-accent/20 bg-slate-100">
                    <img 
                      src={current.image} 
                      alt={current.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-sans text-base font-bold text-oxford">
                      {current.name}
                    </h4>
                    <p className="font-sans text-xs text-slate-500 mt-0.5">
                      {current.role} &bull; {current.affiliation}
                    </p>
                  </div>
                </div>

                {/* Left/Right Buttons */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <button
                    onClick={prevSlide}
                    aria-label="Previous Testimonial"
                    className="w-10 h-10 rounded-full border border-slate-200 hover:border-cyan-accent text-slate-600 hover:text-cyan-accent flex items-center justify-center transition-all bg-white hover:bg-slate-50 shadow-sm cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    aria-label="Next Testimonial"
                    className="w-10 h-10 rounded-full bg-cyan-accent hover:bg-cyan-dark text-white flex items-center justify-center transition-all shadow-md hover:scale-105 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Rectangle Dots Indicator */}
        <div className="flex justify-center items-center space-x-2 pt-4">
          {TESTIMONIALS.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to testimonial ${idx + 1}`}
              className={`h-2.5 transition-all duration-300 rounded-sm cursor-pointer ${
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
