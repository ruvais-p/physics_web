import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  badge?: string;
  title: string;
  subtitle: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  bgImage?: string;
}

export default function Hero({
  badge = 'DEPARTMENT OF PHYSICS • CUSAT',
  title,
  subtitle,
  primaryCtaText,
  primaryCtaLink,
  secondaryCtaText,
  secondaryCtaLink,
  bgImage = 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=1600&q=80',
}: HeroProps) {
  return (
    <section className="relative bg-oxford text-white overflow-hidden py-20 lg:py-28">
      {/* Background Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-25 transform scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-oxford-dark via-oxford/95 to-oxford/80" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          
          {/* Badge */}
          {badge && (
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-cyan-accent/30 text-cyan-accent text-xs font-semibold tracking-wider uppercase shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-cyan-accent animate-pulse" />
              <span>{badge}</span>
            </div>
          )}

          {/* Title in Source Serif 4 */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
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
                  className="inline-flex items-center space-x-2 bg-cyan-accent hover:bg-cyan-accent/90 text-oxford-dark font-sans font-semibold px-6 py-3.5 rounded-lg shadow-lg hover:shadow-cyan-accent/20 transition-all text-base group"
                >
                  <span>{primaryCtaText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              {secondaryCtaText && secondaryCtaLink && (
                <Link
                  href={secondaryCtaLink}
                  className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-sans font-medium px-6 py-3.5 rounded-lg backdrop-blur-sm transition-all text-base"
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
