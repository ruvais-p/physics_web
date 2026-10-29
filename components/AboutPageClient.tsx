import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Hero from '@/components/Hero';
import { renderMarkdownText } from '@/lib/markdown';

// Markdown Parser Helper Function
function renderMarkdown(md: string) {
  return renderMarkdownText(md, 'No About Us content available yet.', {
    paragraphClassName: 'text-base sm:text-lg lg:text-[20px] text-slate-700 leading-relaxed lg:leading-[1.75] font-sans font-normal text-justify my-5',
  });
}

export default function AboutPageClient({
  aboutData,
  heroData,
}: {
  aboutData: { content: string; image: string | null };
  heroData?: { title: string; subtitle: string; image: string };
}) {
  const bannerImage = heroData?.image || aboutData?.image || '/campus.jpg';

  return (
    <div className="pb-24 relative">
      {/* Hero Header matching main homepage design */}
      <Hero
        title={heroData?.title || 'ABOUT DEPARTMENT'}
        badge="HOME > ABOUT"
        subtitle={heroData?.subtitle || ''}
        bgImage={bannerImage}
      />

      {/* Main Content Area: Simplified, Clean, left-aligned, large text */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 py-16">
        <div className="max-w-4xl space-y-8 text-left">
          <div className="space-y-6">
            {renderMarkdown(aboutData?.content || '')}

            {/* Quick Navigation / Discover More Section */}
            <div className="pt-16 border-t border-slate-200 mt-16 space-y-8 font-sans">
              <div className="space-y-2 text-left">
                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-oxford">
                  Explore Our Department
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                {/* Research Card */}
                <Link
                  href="/research"
                  className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-cyan-500/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <h4 className="font-serif text-xl font-bold text-oxford group-hover:text-cyan-dark transition-colors">
                    Research &amp; Labs
                  </h4>
                  <div className="pt-6 flex items-center gap-2 text-xs sm:text-sm font-bold text-oxford group-hover:text-cyan-dark transition-colors">
                    <span>Explore Laboratories</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                {/* Associated Centres Card */}
                <Link
                  href="/centres"
                  className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-cyan-500/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <h4 className="font-serif text-xl font-bold text-oxford group-hover:text-cyan-dark transition-colors">
                    Associated Centres
                  </h4>
                  <div className="pt-6 flex items-center gap-2 text-xs sm:text-sm font-bold text-oxford group-hover:text-cyan-dark transition-colors">
                    <span>Explore Centres</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                {/* People Card */}
                <Link
                  href="/people"
                  className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-cyan-500/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <h4 className="font-serif text-xl font-bold text-oxford group-hover:text-cyan-dark transition-colors">
                    Faculty &amp; Scholars
                  </h4>
                  <div className="pt-6 flex items-center gap-2 text-xs sm:text-sm font-bold text-oxford group-hover:text-cyan-dark transition-colors">
                    <span>Meet Our People</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                {/* Events Card */}
                <Link
                  href="/events"
                  className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-slate-50 hover:bg-white border border-slate-200/90 hover:border-cyan-500/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <h4 className="font-serif text-xl font-bold text-oxford group-hover:text-cyan-dark transition-colors">
                    News &amp; Events
                  </h4>
                  <div className="pt-6 flex items-center gap-2 text-xs sm:text-sm font-bold text-oxford group-hover:text-cyan-dark transition-colors">
                    <span>View Upcoming Events</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
