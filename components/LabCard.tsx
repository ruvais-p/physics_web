import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Cpu, User } from 'lucide-react';
import { ResearchLab } from '@/lib/data';

interface LabCardProps {
  lab: ResearchLab;
}

export default function LabCard({ lab }: LabCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover-lift flex flex-col justify-between">
      <div>
        {/* Lab Thumbnail Image */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          <Image
            src={lab.image}
            alt={lab.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 right-3 bg-oxford/90 backdrop-blur-md text-cyan-accent text-xs font-semibold px-2.5 py-1 rounded-md border border-cyan-accent/30 shadow">
            {lab.category}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-4">
          <h3 className="font-serif text-xl font-bold text-oxford leading-snug">
            {lab.name}
          </h3>

          <div className="flex items-center space-x-2 text-xs font-medium text-slate-500 bg-surface-low p-2 rounded-lg border border-slate-200/60">
            <User className="w-4 h-4 text-cyan-accent" />
            <span>Director: <strong className="text-oxford">{lab.director}</strong></span>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
            {lab.shortDesc}
          </p>

          {/* Focus Areas */}
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Key Research Focus</span>
            <div className="flex flex-wrap gap-1.5">
              {lab.focusAreas.map((area, idx) => (
                <span
                  key={idx}
                  className="bg-surface-gray text-slate-700 text-xs px-2.5 py-0.5 rounded border border-slate-200"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
        <div className="flex items-center space-x-1.5 text-xs text-slate-500">
          <Cpu className="w-3.5 h-3.5 text-cyan-accent" />
          <span>{lab.activeProjects} Active DST/CSIR Projects</span>
        </div>
        <Link
          href={`/research-labs#${lab.id}`}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-cyan-accent hover:text-cyan-dark transition-colors"
        >
          <span>Explore Lab</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
