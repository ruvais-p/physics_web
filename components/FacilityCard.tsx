import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface FacilityItem {
  id: string;
  name: string;
  description: string;
  image?: string | null;
  category?: string | null;
  bookingStatus?: string | null;
  make?: string | null;
  model?: string | null;
  specifications?: string[] | null;
  inCharge?: string | null;
  chargeInternal?: string | null;
  chargeExternal?: string | null;
}

interface FacilityCardProps {
  facility: FacilityItem;
}

export default function FacilityCard({ facility }: FacilityCardProps) {
  const imageSrc = facility.image || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80';

  // Helper to extract a short description snippet without markdown tags
  const getShortDescription = (text: string) => {
    if (!text) return '';
    const cleanText = text
      .replace(/^#+\s+/gm, '') // Remove Markdown headers
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
      .replace(/\*([^*]+)\*/g, '$1') // Remove italics
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
      .replace(/>\s+/g, '') // Remove blockquotes
      .trim();

    const firstPara = cleanText.split('\n\n')[0] || cleanText;
    if (firstPara.length > 150) {
      return firstPara.substring(0, 150) + '...';
    }
    return firstPara;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Facility Hero Image */}
        <div className="relative h-56 w-full overflow-hidden bg-slate-900">
          <Image
            src={imageSrc}
            alt={facility.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />
          
          {facility.category && (
            <div className="absolute top-3 left-3 bg-oxford/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20 shadow-xs">
              {facility.category}
            </div>
          )}

          {facility.bookingStatus && (
            <div
              className={`absolute top-3 right-3 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow ${
                facility.bookingStatus === 'Available'
                  ? 'bg-emerald-500 text-white'
                  : facility.bookingStatus === 'High Demand'
                  ? 'bg-amber-500 text-white'
                  : 'bg-rose-500 text-white'
              }`}
            >
              {facility.bookingStatus}
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-3">
          {facility.make && (
            <span className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider block font-sans">
              {facility.make} {facility.model ? `(${facility.model})` : ''}
            </span>
          )}

          <h3 className="font-serif text-xl font-bold text-oxford group-hover:text-cyan-800 transition-colors leading-snug line-clamp-2">
            {facility.name}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans line-clamp-3">
            {getShortDescription(facility.description)}
          </p>

          {facility.specifications && facility.specifications.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <span className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-sans">
                Technical Highlights:
              </span>
              <ul className="space-y-1 text-xs text-slate-600 font-sans">
                {facility.specifications.slice(0, 2).map((spec, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5 truncate">
                    <span className="text-cyan-600 font-bold">•</span>
                    <span className="truncate">{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer with View Details */}
      <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
        <Link
          href={`/facilities/${facility.id}`}
          className="w-full inline-flex items-center justify-center gap-2 bg-oxford hover:bg-cyan-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm group-hover:shadow-md cursor-pointer"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
