import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ResearchLabFaculty {
  id: string;
  name: string;
  email?: string;
  designation?: string | null;
  department?: string | null;
  documents?: { image?: string | null } | null;
}

export interface ResearchLabItem {
  id: string;
  name: string;
  category?: string | null;
  shortDesc?: string | null;
  description: string;
  image?: string | null;
  faculties?: ResearchLabFaculty[];
}

interface LabCardProps {
  lab: ResearchLabItem;
  variant?: 'light' | 'dark';
}

// Helper to extract a short description snippet without markdown tags (matching FacilityCard)
function getShortDescription(text: string, shortDesc?: string | null): string {
  if (shortDesc && shortDesc.trim()) return shortDesc.trim();
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
}

export default function LabCard({ lab }: LabCardProps) {
  const shortDescription = getShortDescription(lab.description, lab.shortDesc);

  return (
    <Link
      href={`/research/${lab.id}`}
      className="render-lazy bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-cyan-accent/40 transition-all duration-300 flex flex-col justify-between group block font-sans"
    >
      <div>
        {/* Laboratory Image */}
        {lab.image && (
          <div className="relative h-52 w-full overflow-hidden bg-slate-900">
            <Image
              src={lab.image}
              alt={lab.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Laboratory Content */}
        <div className="p-6 space-y-3">
          <h3 className="font-serif text-xl font-bold text-oxford group-hover:text-cyan-accent transition-colors leading-snug">
            {lab.name}
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed font-sans line-clamp-3">
            {shortDescription}
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
