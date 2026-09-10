import Image from 'next/image';
import Link from 'next/link';
import { Trophy, Award, Sparkles, Medal, Building2, Calendar, Star, ArrowUpRight } from 'lucide-react';
import Hero from '@/components/Hero';

export const metadata = {
  title: 'Department News & Awards',
  description: 'Latest news, scientific breakthroughs, and prestigious awards & honors from the Department of Physics, CUSAT.',
};

interface NewsItem {
  id: string;
  title: string;
  date: string;
  day: string;
  month: string;
  year: string;
  image: string;
  desc: string;
}

interface AwardItem {
  id: string;
  title: string;
  recipient: string;
  role: string;
  year: string;
  organization: string;
  category: 'National' | 'International' | 'State' | 'University';
  description: string;
}

const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Department of Physics to Co-Develop Advanced Astro-payloads with National Space Agencies',
    date: '16 Jul 2026',
    day: '16',
    month: 'Jul',
    year: '2026',
    image: '/cusat-building.png',
    desc: 'A pioneering agreement has been reached to design and build lightweight cosmic-ray detectors and semiconductor payloads. The project will run out of our thin film and electronics laboratories, providing doctoral students and M.Sc. researchers with hands-on development experience.',
  },
  {
    id: 'news-2',
    title: 'Department of Physics Welcomes Incoming 2026 Batch of Postgraduates & Scholars',
    date: '12 Jul 2026',
    day: '12',
    month: 'Jul',
    year: '2026',
    image: '/eventssss.jpg',
    desc: 'An orientation ceremony was held at the department foyer to welcome the incoming batch of M.Sc., Integrated M.Sc., and Ph.D. scholars. The faculty introduced the research verticals and advanced instrumentation facilities available for academic endeavors.',
  },
  {
    id: 'news-3',
    title: 'Dr. Alex Thomas Awarded Prestigious National Research Fellowship',
    date: '25 Jun 2026',
    day: '25',
    month: 'Jun',
    year: '2026',
    image: '/faculty.png',
    desc: "The Department of Physics is proud to announce that Dr. Alex Thomas has been awarded the National Research Fellowship in Material Physics. This prestigious award supports the department's pioneering research on hybrid polyaniline-graphene nanostructures for next-generation supercapacitors.",
  },
  {
    id: 'news-4',
    title: 'Advanced Instrumentation Lab Receives FE-SEM Upgrades',
    date: '15 May 2026',
    day: '15',
    month: 'May',
    year: '2026',
    image: '/innovation-microscope.png',
    desc: 'The Central Instrumentation Facility has successfully installed advanced software upgrades to the Field Emission Scanning Electron Microscope (FE-SEM). The upgrade will allow high-resolution surface characterization down to 1nm, accelerating thin film photovoltaic research.',
  },
];

const AWARDS_ITEMS: AwardItem[] = [
  {
    id: 'award-1',
    title: 'National Material Scientist Fellowship 2026',
    recipient: 'Dr. Alex Thomas',
    role: 'Associate Professor',
    year: '2026',
    organization: 'Department of Science & Technology (DST), Govt. of India',
    category: 'National',
    description: 'Recognized for pioneering advancements in hybrid polyaniline-graphene nanostructures for high-energy density supercapacitors and flexible energy storage.',
  },
  {
    id: 'award-2',
    title: 'INSA Young Scientist Medal in Physical Sciences',
    recipient: 'Dr. Priya V. Nair',
    role: 'Assistant Professor',
    year: '2025',
    organization: 'Indian National Science Academy (INSA)',
    category: 'National',
    description: 'Conferred for groundbreaking theoretical and computational investigations into topological phase transitions and non-Hermitian photonics.',
  },
  {
    id: 'award-3',
    title: 'Best International Research Paper Award',
    recipient: 'K. Rahul & Research Team',
    role: 'Ph.D. Research Scholar',
    year: '2025',
    organization: 'International Conference on Advanced Materials (ICMAT)',
    category: 'International',
    description: 'Conferred for the high-impact publication on room-temperature multiferroic perovskite thin films grown via pulsed laser deposition.',
  },
  {
    id: 'award-4',
    title: 'State Young Scientist Award (Physical Sciences)',
    recipient: 'Dr. Ramesh Kumar S.',
    role: 'Assistant Professor',
    year: '2024',
    organization: 'Kerala State Council for Science, Technology and Environment (KSCSTE)',
    category: 'State',
    description: 'Honored for outstanding contributions to magnetic nanocomposite fabrication and low-temperature magneto-transport characterization.',
  },
];

export default function NewsPage() {
  return (
    <div className="pb-24 relative bg-slate-50/50">
      
      {/* Hero Header */}
      <Hero
        title="DEPARTMENT NEWS & AWARDS"
        badge="HOME > NEWS"
        subtitle="Latest updates on scientific breakthroughs, prestigious faculty accolades, research awards, and press releases."
        bgImage="/campus.jpg"
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-16 space-y-20">

        {/* ------------------------------------------------------------- */}
        {/* SECTION 1: AWARDS & HONORS                                    */}
        {/* ------------------------------------------------------------- */}
        <section className="space-y-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
            <div className="space-y-3">
              <div className="w-14 h-1 bg-amber-500 rounded-full" />
              <div className="flex items-center gap-2.5">
                <Trophy className="w-7 h-7 text-amber-500" />
                <h2 className="text-3xl sm:text-4xl font-extrabold text-oxford tracking-tight">
                  Awards &amp; Accolades
                </h2>
              </div>
              <p className="text-slate-600 max-w-2xl text-base sm:text-lg font-sans">
                Recognizing distinguished honors, national research fellowships, and academic accolades earned by our faculty and scholars.
              </p>
            </div>

            {/* Total Count Badge */}
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 px-4 py-2.5 rounded-xl shadow-xs self-start md:self-auto">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{AWARDS_ITEMS.length} Major Accolades</span>
            </div>
          </div>

          {/* Awards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-8">
            {AWARDS_ITEMS.map((award) => (
              <div
                key={award.id}
                className="bg-white border border-slate-200/90 hover:border-amber-400/80 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-6 group relative overflow-hidden"
              >
                {/* Decorative Amber Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />

                <div className="space-y-4 relative z-10">
                  {/* Category and Year Pills */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider">
                      <Medal className="w-3.5 h-3.5 text-amber-600" />
                      <span>{award.category} Award</span>
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 font-mono bg-slate-100 px-2.5 py-1 rounded-lg">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{award.year}</span>
                    </span>
                  </div>

                  {/* Award Title */}
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-oxford group-hover:text-amber-700 transition-colors leading-snug">
                    {award.title}
                  </h3>

                  {/* Recipient & Role */}
                  <div className="space-y-0.5">
                    <p className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span>{award.recipient}</span>
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-slate-500">
                      {award.role} • Department of Physics
                    </p>
                  </div>

                  {/* Awarding Organization */}
                  <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span className="font-medium">{award.organization}</span>
                  </div>

                  {/* Description Citation */}
                  <p className="text-slate-600 text-sm leading-relaxed text-justify">
                    {award.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
                  <span>Conferred Distinction</span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ------------------------------------------------------------- */}
        {/* SECTION 2: NEWS & MEDIA HIGHLIGHTS                            */}
        {/* ------------------------------------------------------------- */}
        <section className="space-y-10">
          {/* Section Header */}
          <div className="space-y-3 pb-6 border-b border-slate-200">
            <div className="w-14 h-1 bg-cyan-accent rounded-full" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-oxford tracking-tight">
              News &amp; Media Highlights
            </h2>
            <p className="text-slate-600 max-w-2xl text-base sm:text-lg font-sans">
              Discover stories, breakthrough announcements, research milestones, and institutional news from the department.
            </p>
          </div>

          {/* News Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {NEWS_ITEMS.map((news) => (
              <div 
                key={news.id}
                className="bg-white border border-slate-200/85 rounded-3xl shadow-xs overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-0">
                  {/* Image and Date container */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                    {/* Date Badge */}
                    <div className="absolute top-4 left-4 z-10 bg-oxford/90 backdrop-blur-md text-white font-sans font-bold text-xs px-3.5 py-2 rounded-xl flex flex-col items-center justify-center text-center shadow-lg border border-white/15">
                      <span className="text-base leading-none text-cyan-accent">{news.day}</span>
                      <span className="text-[10px] uppercase tracking-wider leading-none mt-0.5">{news.month}</span>
                      <span className="text-[9px] font-medium leading-none mt-0.5 text-slate-300">{news.year}</span>
                    </div>
                    
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  
                  {/* Text Container */}
                  <div className="p-6 sm:p-8 space-y-3">
                    <h3 className="font-sans text-lg sm:text-xl font-bold text-oxford leading-snug group-hover:text-cyan-accent transition-colors line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed text-justify font-sans">
                      {news.desc}
                    </p>
                  </div>
                </div>

                {/* Footer link */}
                <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0">
                  <div className="w-full h-px bg-slate-100 mb-4" />
                  <span className="text-xs sm:text-sm font-bold text-cyan-accent group-hover:text-cyan-dark uppercase tracking-wider transition-colors inline-flex items-center gap-1">
                    <span>Read Full Article</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

    </div>
  );
}
