import Image from 'next/image';
import { Facility } from '@/lib/data';
import { Settings, ShieldCheck, UserCheck, Calendar } from 'lucide-react';
import Link from 'next/link';

interface FacilityCardProps {
  facility: Facility;
}

export default function FacilityCard({ facility }: FacilityCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover-lift flex flex-col justify-between">
      <div>
        {/* Instrument Image & Badge */}
        <div className="relative h-52 w-full overflow-hidden bg-slate-100">
          <Image
            src={facility.image}
            alt={facility.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3 bg-oxford/90 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded border border-white/20">
            {facility.category}
          </div>
          <div className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded shadow ${
            facility.bookingStatus === 'Available'
              ? 'bg-emerald-500 text-white'
              : facility.bookingStatus === 'High Demand'
              ? 'bg-amber-500 text-white'
              : 'bg-rose-500 text-white'
          }`}>
            {facility.bookingStatus}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-4">
          <div>
            <span className="text-xs font-semibold text-cyan-accent uppercase tracking-wider block">
              {facility.make} ({facility.model})
            </span>
            <h3 className="font-serif text-xl font-bold text-oxford leading-snug">
              {facility.name}
            </h3>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            {facility.description}
          </p>

          {/* Specifications list */}
          <div className="bg-surface-gray p-3.5 rounded-lg border border-slate-200">
            <span className="block text-xs font-bold text-oxford uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Settings className="w-3.5 h-3.5 text-cyan-accent" />
              <span>Technical Specifications</span>
            </span>
            <ul className="space-y-1 text-xs text-slate-700">
              {facility.specifications.map((spec, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <span className="text-cyan-accent font-bold">•</span>
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* In charge info */}
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <UserCheck className="w-4 h-4 text-cyan-accent shrink-0" />
            <span>Faculty In-Charge: <strong className="text-oxford">{facility.inCharge}</strong></span>
          </div>
        </div>
      </div>

      {/* Footer / User Tariff & Booking CTA */}
      <div className="p-6 pt-0 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 mt-4">
        <div className="text-xs text-slate-500">
          <span className="font-semibold text-oxford block">Sample Tariff:</span>
          <span>Internal: {facility.chargeInternal} | Ext: {facility.chargeExternal}</span>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center space-x-1.5 bg-cyan-accent hover:bg-cyan-accent/90 text-oxford-dark text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book Slot</span>
        </Link>
      </div>
    </div>
  );
}
