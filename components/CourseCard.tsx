'use client';

import Image from 'next/image';
import { Course } from '@/lib/data';
import { FileText } from 'lucide-react';

export interface CourseSchemeItem {
  id?: string;
  year: string;
  scheme: string;
  pdfUrl: string;
  sortOrder?: number;
}

export interface CourseWithSchemes extends Omit<Course, 'syllabus' | 'intake' | 'fees'> {
  intake?: number;
  fees?: string;
  schemes?: CourseSchemeItem[];
  syllabus?: { semester: string; subjects: string[] }[];
}

interface CourseCardProps {
  course: CourseWithSchemes;
  heroImage?: string;
}

function getStageDescription(yearTitle: string, index: number, courseLevel?: string): string | null {
  const normalized = `${yearTitle} ${courseLevel || ''}`.toLowerCase();
  if (normalized.includes('phd') || normalized.includes('doctor')) {
    if (index === 0 || normalized.includes('coursework') || normalized.includes('year 1')) {
      return 'Foundational coursework in research methodology, advanced experimental techniques, and domain literature review.';
    }
    return 'Independent doctoral research, quarterly progress seminars before the Departmental Research Committee, and thesis submission.';
  }
  if (normalized.includes('msc') || normalized.includes('master')) {
    if (index === 0 || normalized.includes('first')) {
      return 'Core theoretical foundation covering classical mechanics, quantum theory, electrodynamics, and hands-on laboratory sessions.';
    }
    return 'Advanced domain electives, computational physics training, and mandatory master research dissertation project.';
  }
  if (normalized.includes('integrated')) {
    if (index === 0 || normalized.includes('foundational')) {
      return 'Foundational curricula across physics, calculus, chemistry, and scientific computing.';
    }
    if (index === 1 || normalized.includes('exit')) {
      return 'Core undergraduate physics courses with an optional B.Sc. (Honours) degree exit path.';
    }
    return 'Master-level theoretical physics modules, specialized electives, and capstone research dissertation.';
  }
  return null;
}

export default function CourseCard({ course, heroImage }: CourseCardProps) {
  const schemes = course.schemes || [];
  const displayTitle = course.title || 'Academic Programme';
  const programLevelLabel = course.level || 'Academic Programme';
  const photoSrc = heroImage || '/campus.jpg';

  return (
    <article id={course.id} className="w-full space-y-12 sm:space-y-14 font-sans text-left">
      {/* 1. Header: Two-column layout */}
      <header className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left: Title, Description, Duration / Level */}
        <div className="md:col-span-7 flex flex-col justify-center space-y-4">
          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-4xl text-gray-900 font-normal tracking-tight leading-tight">
            {displayTitle}
          </h1>

          {/* Short Description */}
          {course.description && (
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed pt-1">
              {course.description}
            </p>
          )}

          {/* Duration & Program Level as plain small text separated by a thin divider (not pills) */}
          <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 pt-3 border-t border-gray-200">
            {course.duration && (
              <span>
                Duration: <span className="text-gray-900 font-medium">{course.duration}</span>
              </span>
            )}
            {course.duration && course.level && (
              <span className="text-gray-300 select-none" aria-hidden="true">|</span>
            )}
            {course.level && (
              <span>
                Program Level: <span className="text-gray-900 font-medium">{programLevelLabel}</span>
              </span>
            )}
          </div>
        </div>

        {/* Right: Single Real Photo (rounded-lg corners, 4:3 crop, stacks below text on mobile) */}
        <div className="md:col-span-5 w-full">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
            <Image
              src={photoSrc}
              alt="Department of Physics academic facilities and campus at CUSAT"
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </header>

      {/* 2. Curriculum: Two side-by-side cards */}
      <section className="space-y-6 pt-2">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-gray-900 font-normal tracking-tight">
            Curriculum Structure
          </h2>
        </div>

        {schemes.length > 0 ? (
          <div
            className={`grid grid-cols-1 ${
              schemes.length === 2 ? 'md:grid-cols-2' : schemes.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
            } gap-6`}
          >
            {schemes.map((item, idx) => {
              const displayYear = item.year.replace('Years 2 - 5', 'Years 2-5');
              const description = getStageDescription(item.year, idx, `${course.level || ''} ${course.title || ''} ${course.id || ''}`);

              return (
                <div
                  key={item.id || idx}
                  className="bg-white border border-gray-200 rounded-lg p-6 sm:p-7 flex flex-col justify-between space-y-6 hover:shadow-xs transition-shadow duration-200"
                >
                  <div className="space-y-2">
                    {/* Small gray label at the top */}
                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500 block">
                      Stage {idx + 1}
                    </span>

                    {/* Title */}
                    <h3 className="font-serif text-lg sm:text-xl text-gray-900 font-normal">
                      {displayYear}
                    </h3>

                    {/* One line of description if available */}
                    {description && (
                      <p className="text-sm text-gray-600 leading-relaxed pt-1">
                        {description}
                      </p>
                    )}
                  </div>

                  {/* Regulation Link as simple outlined button */}
                  <div className="pt-2">
                    <a
                      href={item.pdfUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium text-[#002147] border border-[#002147] rounded-lg hover:bg-[#002147] hover:text-white transition-colors duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#002147] focus-visible:ring-offset-2"
                    >
                      <FileText className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{item.scheme || 'View Syllabus'}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-gray-500 text-sm">
            Curriculum structure details will be published soon.
          </div>
        )}
      </section>
    </article>
  );
}
