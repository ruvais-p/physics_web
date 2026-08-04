import Link from 'next/link';
import Hero from '@/components/Hero';
import LabCard from '@/components/LabCard';
import JournalCard from '@/components/JournalCard';
import {
  DEPARTMENT_STATS,
  ANNOUNCEMENTS,
  RESEARCH_LABS,
  PUBLICATIONS,
  COURSES,
} from '@/lib/data';
import {
  Bell,
  ArrowRight,
  GraduationCap,
  Microscope,
  BookOpenCheck,
  Award,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16 pb-20">

      {/* Hero Section */}
      <Hero
        title="Unraveling the Quantum Frontiers of Matter & Cosmos"
      />

      {/* Announcements Alert Ticker */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-lg p-3.5 sm:p-4 flex items-center gap-4 overflow-hidden">

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

          {/* Right Action Link */}
          <Link
            href="/about"
            className="hidden sm:inline-flex items-center space-x-1 text-xs font-bold text-cyan-accent hover:text-cyan-dark transition-colors shrink-0 bg-surface-low px-3.5 py-2 rounded-lg border border-cyan-accent/20 z-10"
          >
            <span>View All Notices</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

        </div>
      </section>

      {/* Department Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-oxford text-white rounded-2xl p-8 lg:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Sparkles className="w-96 h-96 text-cyan-accent" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center relative z-10">
            {DEPARTMENT_STATS.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-cyan-accent">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-sans font-medium text-slate-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Department Legacy & Courses Section matching user screenshot */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Content Column */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight font-normal">
              Department of Physics - <span className="text-cyan-accent font-semibold">CUSAT</span>
            </h2>

            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              Established in 1971, the Department of Physics, CUSAT has maintained the highest standards in postgraduate education and research in physics. Over the years, the Department has become the go-to place for students in Kerala who wish to pursue advanced studies in Physics. Our researchers and postgraduates are consistently placed in faculty, postdoctoral and PhD positions in world-renowned institutions and universities across the globe.
            </p>

            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              Going forward, the Department of Physics envisions continuing the mission of providing quality advanced training in Physics to students through its Masters and newly established Integrated M.Sc. programs and carrying out excellent scientific research. The Department aims to take a leading role in the revolutionary changes envisaged in the 21st century in science in general and physics in particular.
            </p>

            {/* Courses Links */}
            <div className="pt-4 space-y-3">
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                Courses
              </h3>
              <div className="space-y-2">
                <Link
                  href="/courses#msc"
                  className="flex items-center space-x-2.5 text-cyan-accent hover:text-cyan-dark font-semibold text-lg transition-colors group"
                >
                  <span className="w-6 h-6 rounded-full bg-cyan-accent text-white flex items-center justify-center text-xs font-bold shadow-sm group-hover:scale-110 transition-transform">
                    ➔
                  </span>
                  <span className="underline underline-offset-4">MSc</span>
                </Link>
                <Link
                  href="/courses#phd"
                  className="flex items-center space-x-2.5 text-cyan-accent hover:text-cyan-dark font-semibold text-lg transition-colors group"
                >
                  <span className="w-6 h-6 rounded-full bg-cyan-accent text-white flex items-center justify-center text-xs font-bold shadow-sm group-hover:scale-110 transition-transform">
                    ➔
                  </span>
                  <span className="underline underline-offset-4">PhD</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Building Photo Column with Offset Red Border Frame */}
          <div className="lg:col-span-5 relative pl-6 pt-6 sm:pl-8 sm:pt-8">
            <div className="relative w-full">
              {/* Offset Red Frame */}
              <div className="absolute -top-6 -left-6 bottom-6 right-6 border-4 border-heritage-red rounded-sm pointer-events-none" />
              {/* Department Building Photo */}
              <div className="relative z-10 shadow-2xl rounded-sm overflow-hidden bg-slate-200">
                <img
                  src="/cusat-building.png"
                  alt="Department of Physics CUSAT Building"
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Research Laboratories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-cyan-accent uppercase tracking-widest block">
              Innovation Hubs
            </span>
            <h2 className="font-serif text-3xl font-bold text-oxford">
              Featured Research Laboratories
            </h2>
          </div>
          <Link
            href="/research-labs"
            className="inline-flex items-center space-x-1 text-sm font-semibold text-oxford hover:text-cyan-accent transition-colors"
          >
            <span>View All 9 Laboratories</span>
            <ChevronRight className="w-4 h-4 text-cyan-accent" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {RESEARCH_LABS.slice(0, 3).map((lab) => (
            <LabCard key={lab.id} lab={lab} />
          ))}
        </div>
      </section>

      {/* High-Impact Research Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-cyan-accent uppercase tracking-widest block">
              Scientific Publications
            </span>
            <h2 className="font-serif text-3xl font-bold text-oxford">
              Recent High-Impact Papers
            </h2>
          </div>
          <Link
            href="/journals"
            className="inline-flex items-center space-x-1 text-sm font-semibold text-oxford hover:text-cyan-accent transition-colors"
          >
            <span>Browse All Publications</span>
            <ChevronRight className="w-4 h-4 text-cyan-accent" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PUBLICATIONS.slice(0, 4).map((pub) => (
            <JournalCard key={pub.id} publication={pub} />
          ))}
        </div>
      </section>

    </div>
  );
}
