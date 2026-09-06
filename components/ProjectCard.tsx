import Image from 'next/image';
import { FolderGit2, ArrowUpRight } from 'lucide-react';

export interface ProjectItem {
  id: string;
  title: string;
  desc: string;
  image?: string;
  agency?: string;
  category?: string;
  investigator?: string;
  funding?: string;
}

interface ProjectCardProps {
  project: ProjectItem;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-white rounded-[2rem] p-7 sm:p-8 border border-slate-100/90 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col justify-between space-y-5 group h-full">
      <div className="space-y-4">
        {/* Top Row: Dark Navy Agency/Year Pill & Golden Folder/Lab Icon */}
        <div className="flex items-center justify-between">
          <span className="bg-[#0B1E36] text-white text-xs font-extrabold px-3.5 py-1 rounded-md tracking-wider font-sans">
            {project.agency || 'DST-SERB'}
          </span>
          <FolderGit2 className="w-5 h-5 text-[#FDE68A] stroke-[2]" />
        </div>

        {/* Category Pill */}
        <div>
          <span className="inline-block bg-[#F0F4F8] text-slate-600 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-lg border border-slate-200/50 max-w-full truncate font-sans">
            {project.category || 'RESEARCH PROJECT'}
          </span>
        </div>

        {/* Project Image */}
        {project.image && (
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        {/* Project Title */}
        <h3 className="font-extrabold text-lg sm:text-xl text-[#0B1E36] leading-snug tracking-tight font-sans group-hover:text-cyan-600 transition-colors">
          {project.title}
        </h3>

        {/* Project Description */}
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans line-clamp-3">
          {project.desc}
        </p>
      </div>

      {/* Footer / Principal Investigator */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4 text-xs sm:text-sm font-medium text-slate-400 font-sans">
        <p className="line-clamp-1">
          <span className="font-bold text-slate-500">Lead:</span>{' '}
          {project.investigator || 'Department Research Group'}
        </p>
        {project.funding && (
          <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-md shrink-0">
            {project.funding}
          </span>
        )}
      </div>
    </div>
  );
}
