import React from 'react';
import { RESEARCH_DOMAINS, ResearchDomain } from '@/lib/data';

interface ResearchDomainsSectionProps {
  domains?: ResearchDomain[];
  title?: string;
  subtitle?: string;
  showTitle?: boolean;
}

export default function ResearchDomainsSection({
  domains = RESEARCH_DOMAINS,
  title = "Research Domains",
  subtitle = "Exploring fundamental physics and developing innovative nanomaterial solutions for global challenges.",
  showTitle = true,
}: ResearchDomainsSectionProps) {
  return (
    <section className="w-full py-16 sm:py-24 bg-[#FAFBFD] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Header Section matching reference image */}
        {showTitle && (
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="flex flex-col items-center justify-center font-extrabold tracking-tight leading-none text-center">
              <span className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-[#0B1E36] font-extrabold block">
                Research
              </span>
              <span className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-[#839763] font-extrabold block -mt-1 sm:-mt-2">
                Domains
              </span>
            </h2>
            <p className="text-slate-600 text-base sm:text-lg lg:text-xl font-normal leading-relaxed pt-2 max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
        )}

        {/* Cards Grid matching reference image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {domains.map((domain) => (
            <div
              key={domain.id}
              className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-7 sm:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-slate-100/90 hover:shadow-[0_20px_45px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Number & Title Row */}
                <div className="flex items-center gap-4 sm:gap-5">
                  <span className="font-extrabold text-4xl sm:text-5xl text-[#FDE68A] tracking-tighter shrink-0 select-none">
                    {domain.number}
                  </span>
                  <h3 className="font-bold text-xl sm:text-2xl text-[#0B1E36] leading-snug flex-1">
                    {domain.title}
                  </h3>
                </div>

                {/* Content with vertical accent line on left */}
                <div className="flex items-start gap-4 pt-1">
                  <div className="w-[3px] self-stretch min-h-[3rem] bg-[#FDE68A] rounded-full shrink-0 mt-1 opacity-80" />
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                    {domain.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
