import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Building2 } from 'lucide-react';

export interface CentreItem {
  id: string;
  name: string;
  description: string;
  image?: string | null;
  website?: string | null;
}

interface CentreCardProps {
  centre: CentreItem;
}

export default function CentreCard({ centre }: CentreCardProps) {
  // Extract a clean description snippet without markdown formatting tags
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
      href={`/centres/${centre.id}`}
      className="render-lazy bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-cyan-accent/40 transition-all duration-300 flex flex-col justify-between group block"
    >
      <div>
        {/* Centre Image */}
        {centre.image ? (
          <div className="relative h-52 w-full overflow-hidden bg-slate-900">
            <Image
              src={centre.image}
              alt={centre.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="relative h-52 w-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 border-b border-slate-200">
            <Building2 className="w-12 h-12 text-slate-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
        )}

        {/* Centre Content */}
        <div className="p-6 space-y-3">
          <h3 className="font-serif text-xl font-bold text-oxford group-hover:text-cyan-accent transition-colors leading-snug">
            {centre.name}
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed font-sans line-clamp-3">
            {getShortDescription(centre.description)}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-0 flex items-center gap-1.5 text-xs font-bold text-cyan-accent group-hover:text-cyan-700 transition-colors">
        <span>Explore Centre</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
