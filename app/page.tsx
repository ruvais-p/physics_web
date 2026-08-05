import Link from 'next/link';
import Hero from '@/components/Hero';
import LabCard from '@/components/LabCard';
import Testimonials from '@/components/Testimonials';
import {
  ANNOUNCEMENTS,
  RESEARCH_LABS,
} from '@/lib/data';
import {
  Bell,
  ChevronRight,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-0 pb-0">

      {/* Hero Section */}
      <Hero />

      {/* Announcements Alert Ticker (100% Full Bleed Screen-Wide Bar) */}
      <section className="w-full relative z-20">
        <div className="w-full bg-white border-y border-slate-200/80 shadow-lg px-6 sm:px-12 lg:px-16 py-3.5 sm:py-4 flex items-center gap-4 overflow-hidden">
          
          {/* Badge */}
          <div className="flex items-center space-x-2 shrink-0 bg-heritage-red/10 border border-heritage-red/20 px-3 py-1.5 rounded-lg text-heritage-red z-10">
            <Bell className="w-4 h-4 animate-bounce" />
            <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap">
              Announcements
            </span>
          </div>

          {/* Running Continuous Marquee Ticker */}
          <div className="overflow-hidden whitespace-nowrap flex-1 py-1 relative">
            <div className="animate-marquee inline-flex space-x-10 items-center text-slate-800 font-medium text-sm">
              {ANNOUNCEMENTS.map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  className="hover:text-cyan-accent transition-colors flex items-center space-x-2 group"
                >
                  <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded border border-sky-300">
                    {item.date}
                  </span>
                  <span className="group-hover:underline">{item.title}</span>
                  <span className="text-slate-300 font-bold ml-4">✦</span>
                </Link>
              ))}
              {/* Duplicate array for seamless infinite looping */}
              {ANNOUNCEMENTS.map((item) => (
                <Link
                  key={`dup-${item.id}`}
                  href={item.link}
                  className="hover:text-cyan-accent transition-colors flex items-center space-x-2 group"
                >
                  <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded border border-sky-300">
                    {item.date}
                  </span>
                  <span className="group-hover:underline">{item.title}</span>
                  <span className="text-slate-300 font-bold ml-4">✦</span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Department Legacy & Academics Section */}
      <section className="w-full px-6 sm:px-12 lg:px-16 py-12 sm:py-16 bg-gradient-to-b from-white via-slate-50/50 to-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Arched Window Image Column */}
          <div className="lg:col-span-5 flex justify-center items-center mx-auto">
            <div className="relative w-full max-w-[380px] sm:max-w-[440px]">
              {/* Outer Decorative Arch Halo */}
              <div className="absolute -inset-3 rounded-t-[180px] sm:rounded-t-[240px] rounded-b-3xl border-2 border-cyan-accent/40 bg-cyan-accent/5 -z-10 transform -rotate-1" />
              
              {/* Main Arched Window Frame */}
              <div className="relative w-full aspect-[4/5] rounded-t-[160px] sm:rounded-t-[220px] rounded-b-3xl border-4 border-heritage-red/80 overflow-hidden shadow-2xl bg-oxford-dark group">
                <img
                  src="/cusat-building.png"
                  alt="Department of Physics CUSAT Building"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-oxford-dark/80 via-transparent to-transparent" />
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-oxford tracking-tight leading-tight">
                Academics done <span className="text-cyan-accent italic font-light">differently.</span>
              </h2>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 font-sans">
              Dive into world-class programs &amp; research
            </h3>

            <p className="text-slate-700 text-sm sm:text-base leading-relaxed text-justify">
              Established in 1971, the Department of Physics, CUSAT has maintained the highest standards in postgraduate education and scientific research. Over the years, the Department has become the premier destination for students in Kerala and across India seeking advanced studies in Physics. Our postgraduates and researchers are consistently placed in top faculty, postdoctoral, and Ph.D. positions at world-renowned research centers across the globe.
            </p>

            <p className="text-slate-700 text-sm sm:text-base leading-relaxed text-justify">
              Going forward, the Department envisions continuing its mission of providing quality advanced training in Physics through its M.Sc., Integrated M.Sc., and Ph.D. research programs, driving fundamental scientific breakthroughs in materials science, quantum technology, and photonics.
            </p>

            {/* Action CTA Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Link
                href="/courses"
                className="inline-flex items-center space-x-2 bg-heritage-red hover:bg-red-800 text-white font-sans font-bold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 text-sm hover:scale-105"
              >
                <span>Search Degrees &amp; Programs</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/people"
                className="inline-flex items-center space-x-2 bg-oxford hover:bg-oxford-dark text-white font-sans font-bold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 text-sm hover:scale-105"
              >
                <span>Meet the Faculty</span>
                <ChevronRight className="w-4 h-4 text-cyan-accent" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Research Laboratories */}
      <section className="relative w-full bg-oxford-dark text-white overflow-hidden py-12 sm:py-16 border-y border-white/5 shadow-[inset_0_0_80px_rgba(0,0,0,0.9)]">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div
            className="absolute left-0 top-0 bottom-0 w-full lg:w-1/2 bg-cover bg-left opacity-50 sm:opacity-65"
            style={{
              backgroundImage: "url('/physics.png')",
              maskImage: "linear-gradient(to right, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
              WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#000A1E]/30 via-[#000A1E]/85 to-[#000A1E]" />
        </div>

        {/* Content Container (Matching Testimonials Size & Padding) */}
        <div className="relative z-10 w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 space-y-12">
          
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Featured Research Laboratories
              </h2>
            </div>
            <Link
              href="/research-labs"
              className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold bg-cyan-accent hover:bg-cyan-dark text-white px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(2,132,199,0.3)] hover:shadow-[0_0_25px_rgba(2,132,199,0.5)] border border-cyan-accent"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4 text-white" />
            </Link>
          </div>

          {/* Grid Layout: Text on Left (lg), Scroll on Right (lg) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left side: Description */}
            <div className="lg:col-span-4 space-y-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <p className="text-slate-100 text-lg sm:text-xl font-medium leading-relaxed text-justify">
                The Department of Physics features specialized research facilities driving scientific breakthroughs in materials science, laser spectroscopy, thin-film photovoltaics, and theoretical cosmology.
              </p>
            </div>

            {/* Right side: Horizontal Scroll of Lab Cards */}
            <div className="lg:col-span-8 overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-6 overflow-hidden group/marquee">
                <div className="flex gap-6 shrink-0 animate-marquee-labs group-hover/marquee:[animation-play-state:paused]">
                  {RESEARCH_LABS.map((lab) => (
                    <div key={lab.id} className="w-[280px] sm:w-[320px] flex-shrink-0">
                      <LabCard lab={lab} variant="dark" />
                    </div>
                  ))}
                </div>
                <div className="flex gap-6 shrink-0 animate-marquee-labs group-hover/marquee:[animation-play-state:paused]">
                  {RESEARCH_LABS.map((lab) => (
                    <div key={`dup-${lab.id}`} className="w-[280px] sm:w-[320px] flex-shrink-0">
                      <LabCard lab={lab} variant="dark" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Alumni & Scholar Testimonials Section */}
      <Testimonials />

    </div>
  );
}
