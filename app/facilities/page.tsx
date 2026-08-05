import FacilityCard from '@/components/FacilityCard';
import { FACILITIES } from '@/lib/data';
import { FileText, Clock } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Central Facilities',
  description: 'Advanced Analytical Equipment & Instrumentation Facilities at Department of Physics, CUSAT.',
};

export default function FacilitiesPage() {
  return (
    <div className="space-y-12 pb-20">
      
      {/* Page Header (No Hero image, clean text block) */}
      <div className="-mt-[84px] sm:-mt-[96px] bg-slate-50 border-b border-slate-200/80 pt-36 sm:pt-44 pb-12 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 pt-4">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-cyan-accent">
            OUR FACILITIES
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-oxford">
            Explore our state-of-the-art research instrumentation.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed font-sans">
            Providing advanced analytical characterization services for internal researchers, academic institutes, and industrial R&D laboratories.
          </p>
        </div>
      </div>

      {/* Facilities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FACILITIES.map((facility) => (
            <FacilityCard key={facility.id} facility={facility} />
          ))}
        </div>

        {/* Requisition & Booking Rules */}
        <div className="bg-surface-low border border-slate-200 rounded-2xl p-8 lg:p-10 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold text-cyan-accent uppercase tracking-widest block">
              USAGE GUIDELINES
            </span>
            <h2 className="font-serif text-2xl font-bold text-oxford">
              Sample Submission & Booking Procedures
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700 font-sans">
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-accent/10 text-cyan-dark flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-bold text-oxford text-sm">Online Requisition</h3>
              <p className="text-slate-600 leading-relaxed">
                Download the official sample analysis form and submit requisition details online or at the instrument lab.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-accent/10 text-cyan-dark flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-bold text-oxford text-sm">Sample Preparation</h3>
              <p className="text-slate-600 leading-relaxed">
                Samples must be non-hazardous, dry, and properly packed according to specific instrument requirements.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-accent/10 text-cyan-dark flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-bold text-oxford text-sm">Payment & Result Collection</h3>
              <p className="text-slate-600 leading-relaxed">
                Fees payable via online CUSAT portal. Data reports emailed within 3-5 working days upon analysis completion.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 font-sans">
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <Clock className="w-4 h-4 text-cyan-accent" />
              <span>Facility Working Hours: Monday – Friday (9:30 AM – 4:30 PM)</span>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 bg-oxford text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow hover:bg-oxford-dark transition-colors"
            >
              <FileText className="w-4 h-4 text-cyan-accent" />
              <span>Download Requisition Form</span>
            </Link>
          </div>
        </div>

      </section>

    </div>
  );
}
