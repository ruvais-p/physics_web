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
    if (firstPara.length > 160) {
      return firstPara.substring(0, 160) + '...';
    }
    return firstPara;
  };

  return (
    <Link
      href={`/facilities/${facility.id}`}
      className="render-lazy bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-cyan-accent/40 transition-all duration-300 flex flex-col justify-between group block"
    >
      <div>
        {/* Facility Image (No badges) */}
        {facility.image && (
          <div className="relative h-52 w-full overflow-hidden bg-slate-900">
            <Image
              src={facility.image}
              alt={facility.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Facility Content */}
        <div className="p-6 space-y-3">
          <h3 className="font-serif text-xl font-bold text-oxford group-hover:text-cyan-accent transition-colors leading-snug">
            {facility.name}
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed font-sans line-clamp-3">
            {getShortDescription(facility.description)}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-0 flex items-center gap-1.5 text-xs font-bold text-cyan-accent group-hover:text-cyan-700 transition-colors">
        <span>View Details</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
