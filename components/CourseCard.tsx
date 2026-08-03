import { Course } from '@/lib/data';
import { GraduationCap, Clock, Users, CheckCircle2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div id={course.id} className="bg-white rounded-xl border border-slate-200 p-6 lg:p-8 shadow-sm hover-lift flex flex-col justify-between">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="inline-block bg-cyan-accent/10 text-cyan-dark font-sans text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-1">
              {course.level} • Code: {course.code}
            </span>
            <h3 className="font-serif text-2xl font-bold text-oxford">
              {course.title}
            </h3>
          </div>
          <div className="flex items-center space-x-4 text-xs font-medium text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-cyan-accent" />
              <span>{course.duration}</span>
            </div>
            <span>|</span>
            <div className="flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-cyan-accent" />
              <span>{course.intake} Seats</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed">
          {course.description}
        </p>

        {/* Eligibility Box */}
        <div className="bg-surface-low border border-cyan-accent/20 p-4 rounded-lg">
          <span className="block text-xs font-bold text-oxford uppercase tracking-wider mb-1 flex items-center space-x-1.5">
            <GraduationCap className="w-4 h-4 text-cyan-accent" />
            <span>Eligibility Criteria</span>
          </span>
          <p className="text-xs text-slate-700 leading-normal">
            {course.eligibility}
          </p>
        </div>

        {/* Highlights List */}
        <div>
          <h4 className="font-sans text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Key Program Highlights
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
            {course.highlights.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-accent shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Syllabus Semester Highlights */}
        <div>
          <h4 className="font-sans text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Curriculum Structure Overview
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {course.syllabus.map((sem, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 text-xs">
                <span className="font-bold text-oxford block mb-1.5 border-b border-slate-200 pb-1">
                  {sem.semester}
                </span>
                <ul className="space-y-1 text-slate-600 text-[11px]">
                  {sem.subjects.map((sub, sIdx) => (
                    <li key={sIdx}>• {sub}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / Fee & CTA */}
      <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 mt-6">
        <div className="text-xs text-slate-500">
          <span className="font-semibold text-oxford block">Fee Structure:</span>
          <span>{course.fees}</span>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center space-x-2 bg-oxford hover:bg-oxford-dark text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors shadow"
        >
          <span>Admission Enquiry</span>
          <ChevronRight className="w-4 h-4 text-cyan-accent" />
        </Link>
      </div>
    </div>
  );
}
