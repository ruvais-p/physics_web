'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface EndowmentItem {
  id: string;
  title: string;
  description: string;
}

// Inline DoP Atom Emblem Logo
function DopLogo({ className = 'w-10 h-8 text-[#002147]' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="-12 -12 255 184"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <text
        x="2"
        y="124"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="110"
        fontWeight="900"
        fill="currentColor"
      >
        D
      </text>
      <g transform="translate(112, 80)">
        <ellipse
          cx="0"
          cy="0"
          rx="25"
          ry="70"
          stroke="currentColor"
          strokeWidth="3.5"
          fill="none"
        />
        <ellipse
          cx="0"
          cy="0"
          rx="25"
          ry="70"
          stroke="currentColor"
          strokeWidth="3.5"
          fill="none"
          transform="rotate(60)"
        />
        <ellipse
          cx="0"
          cy="0"
          rx="25"
          ry="70"
          stroke="currentColor"
          strokeWidth="3.5"
          fill="none"
          transform="rotate(-60)"
        />
        <circle cx="0" cy="0" r="16" fill="currentColor" />
      </g>
      <text
        x="145"
        y="124"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="110"
        fontWeight="900"
        fill="currentColor"
      >
        P
      </text>
    </svg>
  );
}

interface EndowmentsCarouselProps {
  items: EndowmentItem[];
}

export default function EndowmentsCarousel({ items }: EndowmentsCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
  }, []);

  useEffect(() => {
    updateScrollState();
    const handleResize = () => updateScrollState();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateScrollState]);

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const firstCard = container.querySelector<HTMLElement>('[data-endowment-card]');
    const gap = 24; // 1.5rem
    const step = firstCard ? firstCard.offsetWidth + gap : container.clientWidth / 2;

    container.scrollBy({
      left: direction === 'left' ? -step : step,
      behavior: 'smooth',
    });

    setTimeout(updateScrollState, 350);
  };

  return (
    <div className="relative w-full px-11 sm:px-14 lg:px-16">
      {/* Left Chevron Arrow - Vertically centered on outer edge */}
      <button
        type="button"
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        className={`absolute left-0 sm:left-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
          !canScrollLeft
            ? 'opacity-25 cursor-not-allowed pointer-events-none bg-slate-100 text-slate-400 border border-slate-200'
            : 'bg-white hover:bg-[#002147] text-[#002147] hover:text-white border border-blue-200 shadow-md hover:shadow-xl cursor-pointer hover:scale-105 active:scale-95'
        }`}
        aria-label="Previous endowments"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Horizontal Carousel Track */}
      <div
        ref={containerRef}
        onScroll={updateScrollState}
        className="flex items-stretch gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-1 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            data-endowment-card
            className="shrink-0 snap-start flex flex-col w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4.5rem)/4)]"
          >
            <div className="bg-white rounded-2xl border border-blue-100/90 hover:border-blue-300 p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all duration-300 h-full flex flex-col items-center text-center justify-between group">
              <div className="w-full flex flex-col items-center">
                {/* DoP Logo on top (centered in image area) */}
                <div className="w-16 h-16 rounded-2xl bg-blue-50/80 border border-blue-100/90 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-[#002147] transition-all duration-300 shadow-2xs">
                  <DopLogo className="w-10 h-8 text-[#002147] group-hover:text-white transition-colors" />
                </div>

                {/* Endowment Title in bold */}
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#002147] leading-snug mb-3 group-hover:text-blue-900 transition-colors">
                  {item.title}
                </h3>

                {/* Short description in smaller grey text */}
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Chevron Arrow - Vertically centered on outer edge */}
      <button
        type="button"
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        className={`absolute right-0 sm:right-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
          !canScrollRight
            ? 'opacity-25 cursor-not-allowed pointer-events-none bg-slate-100 text-slate-400 border border-slate-200'
            : 'bg-white hover:bg-[#002147] text-[#002147] hover:text-white border border-blue-200 shadow-md hover:shadow-xl cursor-pointer hover:scale-105 active:scale-95'
        }`}
        aria-label="Next endowments"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  );
}
