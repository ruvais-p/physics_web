import Link from 'next/link';
import Hero from '@/components/Hero';
import NotificationsTicker from '@/components/NotificationsTicker';
import HomeEvents from '@/components/HomeEvents';
import { RESEARCH_LABS } from '@/lib/data';
import { ChevronRight } from 'lucide-react';

function LabCard({ lab, className = "h-64" }: { lab: typeof RESEARCH_LABS[0]; className?: string }) {
  const isLogo = lab.image === '/dop-logo.svg';

  return (
    <div className={`flip-card w-full cursor-pointer group ${className}`}>
      <div className="flip-card-inner w-full h-full">
        
        {/* Front Side: Only the Image / Logo */}
        <div className="flip-card-front w-full h-full bg-white rounded-2xl shadow-sm relative overflow-hidden flex items-center justify-center">
          {isLogo ? (
            <div className="w-full h-full flex items-center justify-center bg-slate-50/50 rounded-xl p-6 border border-slate-100/80">
              <div className="relative w-32 h-24 flex items-center justify-center">
                <svg
                  className="w-full h-full text-blue-600"
                  viewBox="0 0 220 160"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <text x="5" y="120" fontFamily="Georgia, 'Times New Roman', serif" fontSize="110" fontWeight="900" fill="currentColor">D</text>
                  <g transform="translate(110, 80)">
                    <ellipse cx="0" cy="0" rx="26" ry="74" stroke="currentColor" strokeWidth="2.5" fill="none"/>
                    <ellipse cx="0" cy="0" rx="26" ry="74" stroke="currentColor" strokeWidth="2.5" fill="none" transform="rotate(60)"/>
                    <ellipse cx="0" cy="0" rx="26" ry="74" stroke="currentColor" strokeWidth="2.5" fill="none" transform="rotate(-60)"/>
                    <circle cx="0" cy="0" r="15" fill="currentColor"/>
                  </g>
                  <text x="150" y="120" fontFamily="Georgia, 'Times New Roman', serif" fontSize="110" fontWeight="900" fill="currentColor">P</text>
                </svg>
              </div>
            </div>
          ) : (
            <img
              src={lab.image}
              alt={lab.name}
              className="w-full h-full object-cover rounded-2xl"
            />
          )}
        </div>

        {/* Back Side: Laboratory Details */}
        <Link
          href={`/research/${lab.id}`}
          className="flip-card-back w-full h-full bg-[#000a1e] text-white border border-slate-800 rounded-2xl flex flex-col justify-between items-center text-center p-5 shadow-lg"
        >
          <div className="space-y-2 my-auto">
            <span className="text-[9px] font-bold text-cyan-accent uppercase tracking-widest block">
              {lab.category}
            </span>
            <h4 className="font-sans text-xs sm:text-sm font-bold text-white leading-tight">
              {lab.name}
            </h4>
            <p className="text-[10px] text-slate-400 font-sans mt-2">
              Director: <span className="font-semibold text-slate-300">{lab.director}</span>
            </p>
            <p className="text-[9px] text-slate-400 font-sans line-clamp-3">
              {lab.shortDesc}
            </p>
          </div>
          <div className="w-full flex items-center justify-center text-[10px] font-bold text-cyan-accent font-sans mt-1">
            <span>Explore Lab →</span>
          </div>
        </Link>

      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-0 pb-0">

      {/* Hero Section */}
      <Hero />

      {/* Announcements Alert Ticker (Fetched Live from PostgreSQL DB) */}
      <NotificationsTicker />

      {/* Department Legacy & Academics Section */}
      <section className="w-full px-6 sm:px-12 lg:px-16 py-12 sm:py-16 bg-gradient-to-b from-surface-lowest via-surface-low/30 to-surface-lowest">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Arched Window Image Column */}
          <div className="lg:col-span-5 flex justify-center items-center mx-auto">
            <div className="relative w-full max-w-[380px] sm:max-w-[440px]">
              {/* Outer Decorative Arch Halo */}
              <div className="absolute -inset-3 rounded-t-[180px] sm:rounded-t-[240px] rounded-b-3xl border-2 border-cyan-accent/40 bg-cyan-accent/5 -z-10 transform -rotate-1" />

              {/* Main Arched Window Frame */}
              <div className="relative w-full aspect-[4/5] rounded-t-[160px] sm:rounded-t-[220px] rounded-b-3xl border-4 border-heritage-red/80 overflow-hidden shadow-2xl bg-oxford-dark group">
                <img
                  src="/campus.jpg"
                  alt="Department of Physics CUSAT Campus"
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
          </div>
        </div>
      </section>      {/* News & Events Section */}
      <section className="w-full px-6 sm:px-12 lg:px-16 py-16 sm:py-24 bg-surface-low/20 border-b border-surface-mid/30">
        <div className="max-w-[1536px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left: News */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className="space-y-6">
                <h3 className="font-serif text-3xl font-extrabold text-oxford border-b border-slate-200 pb-3">
                  News
                </h3>
                
                {/* News Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* News Card 1 */}
                  <div className="bg-white border border-slate-200/85 rounded-2xl shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                        {/* Date Badge */}
                        <div className="absolute top-3 left-3 z-10 bg-cyan-accent text-white font-sans font-bold text-[10px] px-2.5 py-1.5 rounded-lg flex flex-col items-center justify-center text-center shadow-md">
                          <span className="text-sm leading-none font-bold">16</span>
                          <span className="text-[9px] uppercase tracking-wider leading-none mt-0.5">Jul</span>
                        </div>
                        
                        <img
                          src="/cusat-building.png"
                          alt="CUSAT Department of Physics"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      </div>
                      
                      <div className="p-5 space-y-2">
                        <h4 className="font-sans text-sm sm:text-base font-bold text-oxford leading-snug group-hover:text-cyan-accent transition-colors line-clamp-2">
                          Department of Physics to Co-Develop Advanced Astro-payloads with National Space Agencies
                        </h4>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                          A pioneering agreement has been reached to design and build lightweight cosmic-ray detectors and semiconductor payloads. The project will run out of our thin film and electronics laboratories.
                        </p>
                      </div>
                    </div>
                    <div className="px-5 pb-5">
                      <Link href="/news" className="text-xs font-bold text-cyan-accent group-hover:text-cyan-dark uppercase tracking-wider inline-flex items-center gap-0.5">
                        Read Article &rarr;
                      </Link>
                    </div>
                  </div>

                  {/* News Card 2 */}
                  <div className="bg-white border border-slate-200/85 rounded-2xl shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                        {/* Date Badge */}
                        <div className="absolute top-3 left-3 z-10 bg-cyan-accent text-white font-sans font-bold text-[10px] px-2.5 py-1.5 rounded-lg flex flex-col items-center justify-center text-center shadow-md">
                          <span className="text-sm leading-none font-bold">12</span>
                          <span className="text-[9px] uppercase tracking-wider leading-none mt-0.5">Jul</span>
                        </div>
                        
                        <img
                          src="/eventssss.jpg"
                          alt="Incoming Batch orientation foyer"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      </div>
                      
                      <div className="p-5 space-y-2">
                        <h4 className="font-sans text-sm sm:text-base font-bold text-oxford leading-snug group-hover:text-cyan-accent transition-colors line-clamp-2">
                          Department of Physics Welcomes Incoming 2026 Batch of Postgraduates &amp; Scholars
                        </h4>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                          An orientation ceremony was held at the department foyer to welcome the incoming batch of M.Sc., Integrated M.Sc., and Ph.D. scholars, showcasing the heritage and advanced lab facilities.
                        </p>
                      </div>
                    </div>
                    <div className="px-5 pb-5">
                      <Link href="/news" className="text-xs font-bold text-cyan-accent group-hover:text-cyan-dark uppercase tracking-wider inline-flex items-center gap-0.5">
                        Read Article &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href="/news"
                  className="inline-flex items-center text-xs sm:text-sm font-bold text-cyan-accent hover:text-cyan-dark uppercase tracking-wider transition-colors duration-200"
                >
                  View More News &gt;
                </Link>
              </div>
            </div>

            {/* Right: Events */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div className="space-y-6">
                <h3 className="font-serif text-3xl font-extrabold text-oxford border-b border-slate-200 pb-3">
                  Events
                </h3>
                
                {/* Dynamic Events Stack Fetched Live from PostgreSQL DB */}
                <HomeEvents />
              </div>

              <div className="pt-6">
                <Link
                  href="/events"
                  className="inline-flex items-center text-xs sm:text-sm font-bold text-cyan-accent hover:text-cyan-dark uppercase tracking-wider transition-colors duration-200"
                >
                  View More Events &gt;
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Research Laboratories */}
      <section className="w-full px-6 sm:px-12 lg:px-16 py-16 sm:py-24 bg-surface-lowest border-y border-surface-low/60">
        <div className="max-w-[1536px] mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left side: Innovation Description */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-oxford leading-tight">
                Research Labs & Facilities
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans font-normal text-justify">
                The Department of Physics at CUSAT has partnered with nearly 50 funded projects, 25 in-house initiatives, and over 150 student research projects. We have broken barriers in materials science, lasers, and quantum cosmology to attain global recognition.
              </p>
              
              <div className="pt-4">
                <Link
                  href="/research"
                  className="inline-flex items-center text-base font-bold text-cyan-accent hover:text-cyan-dark transition-colors duration-200"
                >
                  <span className="font-sans">→ Know More</span>
                </Link>
              </div>
            </div>

            {/* Right side: Asymmetric Flippable Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-6 h-full items-stretch">
              
              {/* Stacked Left Column (2 Small Cards) */}
              <div className="md:col-span-7 flex flex-col gap-6 justify-between">
                {/* Lab 1 */}
                <LabCard lab={RESEARCH_LABS[2]} className="h-[220px]" />
                
                {/* Lab 2 */}
                <LabCard lab={RESEARCH_LABS[5]} className="h-[220px]" />
              </div>

              {/* Tall Right Column (1 Tall Card) */}
              <div className="md:col-span-5 grid grid-cols-1 items-stretch">
                <LabCard lab={RESEARCH_LABS[1]} className="h-full min-h-[320px]" />
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Spotlight Projects Section */}
      <section className="w-full px-6 sm:px-12 lg:px-16 py-16 sm:py-24 bg-surface-low/40 border-y border-surface-mid/40">
        <div className="max-w-[1536px] mx-auto space-y-10">
          
          {/* Section Title */}
          <div className="border-b border-slate-200 pb-4">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-oxford">
              Spotlight Projects
            </h2>
          </div>

          {/* Infinite Auto-Scrolling Row */}
          <div className="overflow-hidden relative -mx-4 px-4 sm:mx-0 sm:px-0">
            {/* Soft edge gradients */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-surface-low/50 via-surface-low/30 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-surface-low/50 via-surface-low/30 to-transparent z-10 pointer-events-none" />

            <div className="flex gap-8 animate-marquee-labs hover:[animation-play-state:paused] py-4">
              {[
                {
                  id: 'p1',
                  title: 'Development of Quantum Cryptography & Key Distribution for Secure Communication',
                  desc: 'This project focuses on building quantum key distribution links over existing optical fiber channels, achieving absolute information-theoretic security using entangled photons.',
                  image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&q=80',
                },
                {
                  id: 'p2',
                  title: 'Polyaniline-Graphene Hybrid Nanostructures for Next-Generation Supercapacitors',
                  desc: 'An interdisciplinary project aimed at fabricating lightweight, flexible supercapacitors with high energy density and cycle life for micro-mobility energy storage.',
                  image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80',
                },
                {
                  id: 'p3',
                  title: 'Holographic Dark Energy & Gravitational Wave Signature Modeling',
                  desc: 'Developing large-scale cosmological simulation pipelines to trace the thermodynamic constraints on dark energy and predict signature anomalies in future gravitational wave detectors.',
                  image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
                },
              ].map((proj) => (
                <div key={`orig-${proj.id}`} className="w-[300px] sm:w-[380px] flex-shrink-0 space-y-4">
                  <div className="aspect-[4/3] w-full relative rounded-2xl overflow-hidden shadow-sm bg-slate-100">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-sans text-base sm:text-lg font-bold text-oxford leading-tight">
                    {proj.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed text-justify font-sans">
                    {proj.desc}
                  </p>
                </div>
              ))}
              {/* Duplicate array for seamless infinite looping */}
              {[
                {
                  id: 'p1',
                  title: 'Development of Quantum Cryptography & Key Distribution for Secure Communication',
                  desc: 'This project focuses on building quantum key distribution links over existing optical fiber channels, achieving absolute information-theoretic security using entangled photons.',
                  image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&q=80',
                },
                {
                  id: 'p2',
                  title: 'Polyaniline-Graphene Hybrid Nanostructures for Next-Generation Supercapacitors',
                  desc: 'An interdisciplinary project aimed at fabricating lightweight, flexible supercapacitors with high energy density and cycle life for micro-mobility energy storage.',
                  image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80',
                },
                {
                  id: 'p3',
                  title: 'Holographic Dark Energy & Gravitational Wave Signature Modeling',
                  desc: 'Developing large-scale cosmological simulation pipelines to trace the thermodynamic constraints on dark energy and predict signature anomalies in future gravitational wave detectors.',
                  image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
                },
              ].map((proj) => (
                <div key={`dup-${proj.id}`} className="w-[300px] sm:w-[380px] flex-shrink-0 space-y-4">
                  <div className="aspect-[4/3] w-full relative rounded-2xl overflow-hidden shadow-sm bg-slate-100">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-sans text-base sm:text-lg font-bold text-oxford leading-tight">
                    {proj.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed text-justify font-sans">
                    {proj.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
