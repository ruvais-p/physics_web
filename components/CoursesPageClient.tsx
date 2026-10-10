'use client';

import { useState, useEffect, useMemo } from 'react';
import Hero from '@/components/Hero';
import CourseCard, { CourseWithSchemes } from '@/components/CourseCard';
import { COURSES } from '@/lib/data';
import { getCourseNavInfo, getCourseOrderFallback } from '@/lib/nav-programmes';

interface CoursesPageClientProps {
  courses: CourseWithSchemes[];
  heroData?: { title: string; subtitle: string; image: string };
}

export default function CoursesPageClient({ courses, heroData }: CoursesPageClientProps) {
  const rawCourses = courses.length > 0 ? courses : COURSES;
  const dynamicCourses = useMemo(() => {
    return [...rawCourses].sort((a, b) => {
      if ((a.sortOrder ?? 0) !== (b.sortOrder ?? 0)) {
        return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      }
      return getCourseOrderFallback(a) - getCourseOrderFallback(b);
    });
  }, [rawCourses]);

  const [activeCourseId, setActiveCourseId] = useState<string>(dynamicCourses[0]?.id || 'c2');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!hash) return;

      const cleanHash = decodeURIComponent(hash.replace(/^#/, '')).trim().toLowerCase();
      if (!cleanHash) return;

      // 1. Prioritize exact match by course ID, nav hash, or course code
      let matched = dynamicCourses.find((c) => {
        const info = getCourseNavInfo(c);
        return (
          c.id.toLowerCase() === cleanHash ||
          info.hash.toLowerCase() === cleanHash ||
          (c.code && c.code.toLowerCase() === cleanHash)
        );
      });

      // 2. Fallback to title substring match only if cleanHash is > 2 characters
      if (!matched && cleanHash.length > 2) {
        matched = dynamicCourses.find((c) =>
          c.title.toLowerCase().includes(cleanHash)
        );
      }

      if (matched) {
        setActiveCourseId(matched.id);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [dynamicCourses]);

  const selectedCourse =
    dynamicCourses.find((c) => c.id === activeCourseId) || dynamicCourses[0] || COURSES[0];

  return (
    <div className="relative font-sans bg-[#F8F9FB] min-h-screen pb-20">
      {/* Standard Hero header matching other pages */}
      <Hero
        title={heroData?.title || 'ACADEMIC PROGRAMMES'}
        badge="HOME > PROGRAMMES"
        subtitle={heroData?.subtitle || ''}
        bgImage={heroData?.image || '/campus.jpg'}
      />

      {/* Course Selector Bar - Same blue tab bar as Research and other pages */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center pt-8 pb-4">
        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-xl border border-cyan-accent/30 shadow-lg rounded-2xl sm:rounded-3xl">
          {dynamicCourses.map((course) => {
            const isActive = activeCourseId === course.id;
            const navInfo = getCourseNavInfo(course);

            return (
              <button
                key={course.id}
                type="button"
                onClick={() => {
                  setActiveCourseId(course.id);
                  window.history.pushState(null, '', `#${navInfo.hash}`);
                }}
                className={`px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold tracking-wide transition-all duration-300 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-cyan-accent ${
                  isActive
                    ? 'bg-cyan-accent text-white shadow-md'
                    : 'text-oxford hover:text-cyan-accent hover:bg-slate-50'
                }`}
              >
                {navInfo.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Program Details Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {selectedCourse && (
          <CourseCard course={selectedCourse} heroImage={heroData?.image} />
        )}
      </div>
    </div>
  );
}
