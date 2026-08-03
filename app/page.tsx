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
        badge="DEPARTMENT OF PHYSICS • CUSAT KOCHI"
        title="Unraveling the Quantum Frontiers of Matter & Cosmos"
        subtitle="Bridging academic tradition with pioneering research in materials physics, photonics, theoretical cosmology, and energy storage."
        primaryCtaText="Explore Degree Programs"
        primaryCtaLink="/courses"
        secondaryCtaText="Research Laboratories"
        secondaryCtaLink="/research-labs"
      />

      {/* Announcements Alert Ticker */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-oxford">
            <span className="bg-heritage-red/10 text-heritage-red p-2 rounded-lg shrink-0">
              <Bell className="w-5 h-5 animate-bounce" />
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-heritage-red block">
                Latest Announcements
              </span>
              <p className="text-sm font-medium text-slate-800 line-clamp-1">
                {ANNOUNCEMENTS[0].title} ({ANNOUNCEMENTS[0].date})
              </p>
            </div>
          </div>
          <Link
            href={ANNOUNCEMENTS[0].link}
            className="inline-flex items-center space-x-1 text-xs font-bold text-cyan-accent hover:text-cyan-dark transition-colors shrink-0 bg-surface-low px-4 py-2 rounded-lg border border-cyan-accent/20"
          >
            <span>View All Notices</span>
            <ArrowRight className="w-4 h-4" />
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

      {/* Overview Pillars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-cyan-accent uppercase tracking-widest block">
            Pillars of Scientific Distinction
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-oxford">
            A Legacy of Physical Science Excellence
          </h2>
          <p className="text-slate-600 text-base">
            Since its inception, the Department of Physics at CUSAT has established itself as one of India’s premier centers for postgraduate instruction and advanced research.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover-lift space-y-3">
            <div className="w-12 h-12 rounded-lg bg-surface-low flex items-center justify-center text-oxford">
              <GraduationCap className="w-6 h-6 text-cyan-accent" />
            </div>
            <h3 className="font-serif text-xl font-bold text-oxford">Rigorous Academics</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Offering M.Sc., Ph.D., and Integrated M.Sc. programs designed under CBCS with advanced computational physics and quantum mechanics modules.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover-lift space-y-3">
            <div className="w-12 h-12 rounded-lg bg-surface-low flex items-center justify-center text-oxford">
              <Microscope className="w-6 h-6 text-cyan-accent" />
            </div>
            <h3 className="font-serif text-xl font-bold text-oxford">Advanced Instrumentation</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Equipped with high-resolution FE-SEM, XRD diffractometer, micro-Raman spectrometer, VSM magnetometers, and thin-film RF sputtering systems.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover-lift space-y-3">
            <div className="w-12 h-12 rounded-lg bg-surface-low flex items-center justify-center text-oxford">
              <BookOpenCheck className="w-6 h-6 text-cyan-accent" />
            </div>
            <h3 className="font-serif text-xl font-bold text-oxford">Global Impact Research</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Over 1,200 research publications in top-tier peer-reviewed international journals like Physical Review B, ACS Materials, and Nature Physics.
            </p>
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

      {/* Degree Programs Summary */}
      <section className="bg-surface-low py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-cyan-accent uppercase tracking-widest block">
              Academic Offerings
            </span>
            <h2 className="font-serif text-3xl font-bold text-oxford">
              Degree Programs at Physics Department
            </h2>
            <p className="text-sm text-slate-600">
              Transforming students into world-class physicists through immersive classroom & lab training.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {COURSES.map((course) => (
              <div key={course.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover-lift flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="inline-block bg-oxford text-white text-[11px] font-bold px-2.5 py-0.5 rounded">
                    {course.level}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-oxford">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3">
                    {course.description}
                  </p>
                  <div className="text-xs text-slate-500 font-medium">
                    Duration: <strong className="text-oxford">{course.duration}</strong>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 mt-6">
                  <Link
                    href={`/courses#${course.id}`}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-cyan-accent hover:text-cyan-dark"
                  >
                    <span>View Curriculum & Eligibility</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
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
