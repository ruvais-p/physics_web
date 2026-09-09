import Image from 'next/image';
import Link from 'next/link';
import Hero from '@/components/Hero';

export const metadata = {
  title: 'Department News',
  description: 'Latest updates, announcements, and news from the Department of Physics, CUSAT.',
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

export default function NewsPage() {
  return (
    <div className="pb-24 relative">
      
      {/* Hero Header matching main homepage design */}
      <Hero
        title="NEWS & ANNOUNCEMENTS"
        badge="HOME > NEWS"
        subtitle="Latest updates on academic breakthroughs, infrastructure upgrades, student achievements, and scientific research."
        bgImage="/campus.jpg"
      />

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-16">
        <div className="space-y-12">
          {/* Color Accent line & Header */}
          <div className="space-y-4">
            <div className="w-16 h-1 bg-cyan-accent rounded-full" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-oxford">
              Latest from the Department
            </h2>
            <p className="text-slate-600 max-w-2xl text-base sm:text-lg font-sans">
              Stay updated with academic breakthroughs, infrastructure upgrades, student achievements, and scientific research initiatives at the CUSAT Physics Department.
            </p>
          </div>

          {/* News Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {NEWS_ITEMS.map((news) => (
              <div 
                key={news.id}
                className="bg-white border border-slate-200/85 rounded-2xl shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-0">
                  {/* Image and Date container */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                    {/* Date Badge */}
                    <div className="absolute top-4 left-4 z-10 bg-cyan-accent text-white font-sans font-bold text-xs px-3.5 py-2 rounded-lg flex flex-col items-center justify-center text-center shadow-md">
                      <span className="text-base leading-none">{news.day}</span>
                      <span className="text-[10px] uppercase tracking-wider leading-none mt-0.5">{news.month}</span>
                      <span className="text-[9px] font-medium leading-none mt-0.5">{news.year}</span>
                    </div>
                    
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
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

                {/* Footer link for standard visual anchor */}
                <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0">
                  <div className="w-full h-px bg-slate-100 mb-4" />
                  <span className="text-xs sm:text-sm font-bold text-cyan-accent group-hover:text-cyan-dark uppercase tracking-wider transition-colors inline-flex items-center gap-1">
                    Read Full Article &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
