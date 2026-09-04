import Link from 'next/link';
import Hero from '@/components/Hero';
import NotificationsTicker from '@/components/NotificationsTicker';
import HomeEvents from '@/components/HomeEvents';
import JournalCard from '@/components/JournalCard';
import ProjectCard from '@/components/ProjectCard';
import { RESEARCH_LABS, PUBLICATIONS } from '@/lib/data';
import { ChevronRight, ExternalLink, BookOpen } from 'lucide-react';

function LabCard({ lab, className = "h-64" }: { lab: typeof RESEARCH_LABS[0]; className?: string }) {
  const isLogo = lab.image === '/dop-logo.svg';

  return (
    <Link
      href={`/research/${lab.id}`}
      className={`group relative rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex items-center justify-center cursor-pointer ${className}`}
    >
      {isLogo ? (
        <div className="w-full h-full flex items-center justify-center bg-slate-50 p-6">
          <svg
            className="w-32 h-24 text-blue-600"
            viewBox="0 0 220 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text x="5" y="120" fontFamily="Georgia, 'Times New Roman', serif" fontSize="110" fontWeight="900" fill="currentColor">D</text>
            <g transform="translate(110, 80)">
              <ellipse cx="0" cy="0" rx="26" ry="74" stroke="currentColor" strokeWidth="2.5" fill="none" />
              <ellipse cx="0" cy="0" rx="26" ry="74" stroke="currentColor" strokeWidth="2.5" fill="none" transform="rotate(60)" />
              <ellipse cx="0" cy="0" rx="26" ry="74" stroke="currentColor" strokeWidth="2.5" fill="none" transform="rotate(-60)" />
              <circle cx="0" cy="0" r="15" fill="currentColor" />
            </g>
            <text x="150" y="120" fontFamily="Georgia, 'Times New Roman', serif" fontSize="110" fontWeight="900" fill="currentColor">P</text>
          </svg>
        </div>
      ) : (
        <img
          src={lab.image}
          alt={lab.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-2xl"
        />
      )}
    </Link>
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
          <div className="lg:col-span-7 space-y-6 text-center">
            <div className="space-y-2">
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-oxford tracking-tight leading-tight text-center">
                Academics done <span className="text-cyan-accent italic font-light">differently.</span>
              </h2>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 font-sans text-center">
              Dive into world-class programs &amp; research
            </h3>

            <p className="text-slate-700 text-sm sm:text-base leading-relaxed text-center">
              Established in 1971, the Department of Physics, CUSAT has maintained the highest standards in postgraduate education and scientific research. Over the years, the Department has become the premier destination for students in Kerala and across India seeking advanced studies in Physics. Our postgraduates and researchers are consistently placed in top faculty, postdoctoral, and Ph.D. positions at world-renowned research centers across the globe.
            </p>

            <p className="text-slate-700 text-sm sm:text-base leading-relaxed text-center">
              Going forward, the Department envisions continuing its mission of providing quality advanced training in Physics through its M.Sc., Integrated M.Sc., and Ph.D. research programs, driving fundamental scientific breakthroughs in materials science, quantum technology, and photonics.
            </p>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="w-full px-6 sm:px-12 lg:px-16 py-16 sm:py-24 bg-surface-low/20 border-b border-surface-mid/30">
        <div className="max-w-[1536px] mx-auto space-y-10">

          {/* Section Header */}
          <div className="text-center space-y-3 border-b border-slate-200 pb-6">
            <span className="text-xs font-bold text-cyan-accent uppercase tracking-widest font-sans block text-center">
              Department Activities
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-oxford tracking-tight text-center">
              Upcoming &amp; Featured Events
            </h2>
            <div className="pt-1 flex justify-center">
              <Link
                href="/events"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-cyan-accent hover:text-cyan-dark uppercase tracking-wider transition-colors duration-200"
              >
                <span>View All Events</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Dynamic Events Cards Grid Fetched Live from PostgreSQL DB */}
          <HomeEvents />

        </div>
      </section>

      {/* Featured Research Laboratories */}
      <section className="w-full px-6 sm:px-12 lg:px-16 py-16 sm:py-24 bg-surface-lowest border-y border-surface-low/60">
        <div className="max-w-[1536px] mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left side: Innovation Description */}
            <div className="lg:col-span-5 space-y-6 text-center">
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-oxford leading-tight text-center">
                Research Labs & Facilities
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans font-normal text-center">
                The Department of Physics at CUSAT has partnered with nearly 50 funded projects, 25 in-house initiatives, and over 150 student research projects. We have broken barriers in materials science, lasers, and quantum cosmology to attain global recognition.
              </p>

              <div className="pt-2 flex justify-center">
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
          <div className="text-center space-y-3 border-b border-slate-200 pb-6">
            <span className="text-xs font-extrabold text-cyan-accent uppercase tracking-widest block font-sans">
              Funded Research Initiatives
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-oxford text-center">
              Spotlight Projects
            </h2>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {[
              {
                id: 'p1',
                title: 'Development of Quantum Cryptography & Key Distribution for Secure Communication',
                desc: 'This project focuses on building quantum key distribution links over existing optical fiber channels, achieving absolute information-theoretic security using entangled photons.',
                image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&q=80',
                agency: 'DST-SERB',
                category: 'QUANTUM CRYPTOGRAPHY',
                investigator: 'Dr. Ramesh Babu T.',
                funding: '₹45 Lakhs',
              },
              {
                id: 'p2',
                title: 'Polyaniline-Graphene Hybrid Nanostructures for Next-Generation Supercapacitors',
                desc: 'An interdisciplinary project aimed at fabricating lightweight, flexible supercapacitors with high energy density and cycle life for micro-mobility energy storage.',
                image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80',
                agency: 'KSCSTE',
                category: 'ENERGY MATERIALS',
                investigator: 'Dr. S. Jayalekshmi',
                funding: '₹32 Lakhs',
              },
              {
                id: 'p3',
                title: 'Holographic Dark Energy & Gravitational Wave Signature Modeling',
                desc: 'Developing large-scale cosmological simulation pipelines to trace thermodynamic constraints on dark energy and predict signature anomalies in future gravitational wave detectors.',
                image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
                agency: 'DST-INSPIRE',
                category: 'COSMOLOGY & GRAVITY',
                investigator: 'Dr. Titus K. Mathew',
                funding: '₹28 Lakhs',
              },
            ].map((proj) => (
              <ProjectCard key={proj.id} project={proj} />
            ))}
          </div>

        </div>
      </section>

      {/* Featured Publications Section */}
      <section className="w-full px-6 sm:px-12 lg:px-16 py-16 sm:py-24 bg-surface-lowest border-t border-surface-low/60">
        <div className="max-w-[1536px] mx-auto space-y-10">

          {/* Header */}
          <div className="text-center space-y-3 border-b border-slate-200 pb-6">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-oxford text-center">
              Recent Publications
            </h2>
            <div className="flex justify-center">
              <Link
                href="/journals"
                className="inline-flex items-center gap-1 text-sm font-bold text-cyan-accent hover:text-cyan-dark transition-colors"
              >
                <span>View All Publications &rarr;</span>
              </Link>
            </div>
          </div>

          {/* Publications Cards Grid (Matching requested design) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {PUBLICATIONS.slice(0, 4).map((pub) => (
              <JournalCard key={pub.id} publication={pub} />
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
