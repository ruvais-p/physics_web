'use client';

import { Course } from '@/lib/data';
import { Clock, Users } from 'lucide-react';

export interface CourseSchemeItem {
  id?: string;
  year: string;
  scheme: string;
  pdfUrl: string;
  sortOrder?: number;
}

export interface CourseWithSchemes extends Omit<Course, 'syllabus'> {
  schemes?: CourseSchemeItem[];
  syllabus?: { semester: string; subjects: string[] }[];
}

interface CourseCardProps {
  course: CourseWithSchemes;
}

const DEFAULT_COURSE_SCHEMES: Record<string, CourseSchemeItem[]> = {
  c1: [
    { year: 'First Year (Semesters 1 & 2)', scheme: '2024 CBCS Scheme', pdfUrl: '/cvs/cv_placeholder.pdf' },
    { year: 'Second Year (Semesters 3 & 4)', scheme: '2024 CBCS Scheme', pdfUrl: '/cvs/cv_placeholder.pdf' }
  ],
  c2: [
    { year: 'Year 1 (Coursework)', scheme: '2024 PhD Regulations', pdfUrl: '/cvs/cv_placeholder.pdf' },
    { year: 'Years 2 - 5 (Research)', scheme: '2024 PhD Regulations', pdfUrl: '/cvs/cv_placeholder.pdf' }
  ],
  c3: [
    { year: 'Years 1 & 2 (Foundational)', scheme: '2024 Integrated Scheme', pdfUrl: '/cvs/cv_placeholder.pdf' },
    { year: 'Year 3 (B.Sc. Honours Exit Option)', scheme: '2024 Integrated Scheme', pdfUrl: '/cvs/cv_placeholder.pdf' },
    { year: 'Years 4 & 5 (M.Sc. Advanced)', scheme: '2024 Integrated Scheme', pdfUrl: '/cvs/cv_placeholder.pdf' }
  ]
};

export default function CourseCard({ course }: CourseCardProps) {
  const schemes = (course.schemes && course.schemes.length > 0)
    ? course.schemes
    : DEFAULT_COURSE_SCHEMES[course.id] || [];

  // Format title (e.g., "MSc in Physics")
  const cleanTitle = course.level === 'MSc' 
    ? 'MSc in Physics' 
    : course.level === 'PhD' 
      ? 'PhD in Physics' 
      : 'Integrated MSc in Physics';

  return (
    <div id={course.id} className="scroll-mt-36 max-w-5xl mx-auto space-y-8 font-sans py-6">
      
      {/* Course Title & Quick Facts Bar */}
      <div className="space-y-4">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-oxford tracking-tight">
          {cleanTitle}
        </h1>
        
        {/* Quick Facts Bar */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-slate-600">
          <div className="flex items-center space-x-1.5">
            <Clock className="w-4.5 h-4.5 text-cyan-accent" />
            <span>Duration: {course.duration}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Users className="w-4.5 h-4.5 text-cyan-accent" />
            <span>Annual Intake: {course.intake} Seats</span>
          </div>
        </div>
      </div>

      {/* Prominent & Enlarged Curriculum Scheme Table */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-oxford border-b border-slate-100 pb-2">
            Curriculum Scheme & Regulation
          </h2>
          <p className="text-slate-600 text-base leading-relaxed font-sans pt-1">
            Click on any row or action button to view/download the official syllabus curriculum PDF.
          </p>
        </div>
        
        <div className="overflow-hidden border border-slate-200/90 rounded-2xl shadow-md bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-left font-sans text-base">
            <thead className="bg-slate-50 text-oxford font-bold uppercase tracking-wider text-xs sm:text-sm">
              <tr>
                <th scope="col" className="px-8 py-5">Year / Level</th>
                <th scope="col" className="px-8 py-5">Curriculum Scheme</th>
                <th scope="col" className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schemes.map((item, idx) => (
                <tr 
                  key={idx} 
                  onClick={() => window.open(item.pdfUrl, '_blank')}
                  className="hover:bg-cyan-50/40 cursor-pointer transition-colors duration-150 group"
                >
                  <td className="px-8 py-6 text-slate-800 font-bold text-base sm:text-lg">
                    {item.year}
                  </td>
                  <td className="px-8 py-6 text-slate-600">
                    <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold bg-sky-50 text-sky-850 border border-sky-200">
                      {item.scheme}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(item.pdfUrl, '_blank');
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-slate-100 group-hover:bg-cyan-accent group-hover:text-white text-slate-800 transition-all duration-200 cursor-pointer shadow-sm"
                    >
                      Open PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
