import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PixelSnow from './PixelSnow';

interface HeroProps {
  badge?: string;
  title: string;
  subtitle?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  bgImage?: string;
}

export default function Hero({
  title,
  subtitle,
  primaryCtaText,
  primaryCtaLink,
  secondaryCtaText,
  secondaryCtaLink,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  bgImage,
}: HeroProps) {
  return (
    <section className="-mt-[84px] sm:-mt-[96px] w-full relative bg-oxford-dark text-white overflow-hidden pt-32 sm:pt-40 lg:pt-44 pb-20 sm:pb-28 lg:pb-32 min-h-[680px] flex items-center">

      {/* Right Side: PixelSnow Background Animation with Circle Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#000A1E]">
          <PixelSnow
            color="#0284C7"
            flakeSize={0.015}
            minFlakeSize={1.5}
            pixelResolution={200}
            speed={1.2}
            density={0.35}
            direction={125}
            brightness={1.4}
            variant="round"
          />
        </div>
      </div>

      {/* Left Side: Opaque Blue Slanted Polygon Overlay (No accent line, seamless tilt) */}
      <div
        className="absolute inset-0 z-10 bg-gradient-to-br from-[#000A1E] via-[#001B3A] to-[#002855] hidden lg:block"
        style={{
          clipPath: 'polygon(0 0, 58% 0, 42% 100%, 0 100%)'
        }}
      />

      {/* Mobile/Tablet Fallback Opaque Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#000A1E] via-[#001B3A]/95 to-transparent lg:hidden" />

      {/* Hero Content Layer - Full Width Edge to Edge */}
      <div className="relative z-30 w-full max-w-[1536px] mx-auto px-6 sm:px-12 lg:px-16">
        <div className="max-w-2xl lg:max-w-[48%] space-y-6">

          {/* Title */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12] drop-shadow-md">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-lg sm:text-xl text-slate-200 leading-relaxed font-normal">
            {subtitle}
          </p>

          {/* CTA Buttons */}
          {(primaryCtaText || secondaryCtaText) && (
            <div className="pt-4 flex flex-wrap items-center gap-4">
              {primaryCtaText && primaryCtaLink && (
                <Link
                  href={primaryCtaLink}
                  className="inline-flex items-center space-x-2 bg-cyan-accent hover:bg-sky-600 text-white font-sans font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-sky-600/20 transition-all text-base group"
                >
                  <span>{primaryCtaText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              {secondaryCtaText && secondaryCtaLink && (
                <Link
                  href={secondaryCtaLink}
                  className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-sans font-medium px-6 py-3.5 rounded-xl backdrop-blur-sm transition-all text-base"
                >
                  <span>{secondaryCtaText}</span>
                </Link>
              )}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
