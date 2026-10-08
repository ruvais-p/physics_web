'use client';

import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import CourseCard, { CourseWithSchemes } from '@/components/CourseCard';
import { COURSES } from '@/lib/data';

interface CoursesPageClientProps {
  courses: CourseWithSchemes[];
  heroData?: { title: string; subtitle: string; image: string };
}

export default function CoursesPageClient({ courses, heroData }: CoursesPageClientProps) {
  const getCourseOrder = (course: CourseWithSchemes) => {
    const text = `${course.id} ${course.level} ${course.title} ${course.code}`.toLowerCase();
    if (text.includes('phd') || text.includes('ph.d') || text.includes('doctor') || course.id === 'c2') return 1;
    if (text.includes('msc') || text.includes('m.sc') || text.includes('master') || course.id === 'c1') return 2;
    if (text.includes('integrated') || text.includes('int') || course.id === 'c3') return 3;
    return 4;
  };

  const rawCourses = courses.length > 0 ? courses : COURSES;
  const dynamicCourses = [...rawCourses].sort((a, b) => getCourseOrder(a) - getCourseOrder(b));

  const [activeCourseId, setActiveCourseId] = useState<string>(dynamicCourses[0]?.id || 'c2');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (!hash) return;

      if (hash.includes('phd')) {
        const c = dynamicCourses.find(
          (item) => item.id === 'c2' || item.level?.toLowerCase().includes('phd') || item.title?.toLowerCase().includes('ph.d')
        );
        if (c) setActiveCourseId(c.id);
      } else if (hash.includes('integrated')) {
        const c = dynamicCourses.find(
          (item) => item.id === 'c3' || item.level?.toLowerCase().includes('integrated') || item.title?.toLowerCase().includes('integrated')
        );
        if (c) setActiveCourseId(c.id);
      } else if (hash.includes('msc')) {
        const c = dynamicCourses.find(
          (item) =>
            item.id === 'c1' ||
            ((item.level?.toLowerCase().includes('msc') || item.title?.toLowerCase().includes('m.sc')) &&
              !item.level?.toLowerCase().includes('integrated') &&
              !item.title?.toLowerCase().includes('integrated'))
        );
        if (c) setActiveCourseId(c.id);
      } else {
        const rawId = hash.replace('#', '');
        const matched = dynamicCourses.find((c) => c.id.toLowerCase() === rawId.toLowerCase());
        if (matched) {
          setActiveCourseId(matched.id);
        }
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
        title={heroData?.title || 'ACADEMIC PROGRAMS'}
        badge="HOME > COURSES"
        subtitle={heroData?.subtitle || ''}
        bgImage={heroData?.image || '/campus.jpg'}
      />

      {/* Course Selector Bar - Same blue tab bar as Research and other pages */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center pt-8 pb-4">
        <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-xl border border-cyan-accent/30 shadow-lg rounded-2xl sm:rounded-3xl">
          {dynamicCourses.map((course) => {
            const isActive = activeCourseId === course.id;
            const isIntegrated =
              course.id === 'c3' ||
              course.level?.toLowerCase().includes('integrated') ||
              course.title?.toLowerCase().includes('integrated');
            const isPhd =
              course.id === 'c2' ||
              course.level?.toLowerCase().includes('phd') ||
              course.title?.toLowerCase().includes('ph.d');
            const isMsc =
              !isIntegrated &&
              (course.id === 'c1' ||
                course.level?.toLowerCase().includes('msc') ||
                course.title?.toLowerCase().includes('m.sc'));

            const buttonLabel = isPhd
              ? 'Ph.D. Program'
              : isMsc
              ? 'M.Sc. Physics'
              : isIntegrated
              ? 'Integrated M.Sc.'
              : course.title;

            const hashLink = isPhd
              ? '#phd'
              : isMsc
              ? '#msc'
              : isIntegrated
              ? '#integrated'
              : `#${course.id}`;

            return (
              <button
                key={course.id}
                type="button"
                onClick={() => {
                  setActiveCourseId(course.id);
                  window.history.pushState(null, '', hashLink);
                }}
                className={`px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold tracking-wide transition-all duration-300 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-cyan-accent ${
                  isActive
                    ? 'bg-cyan-accent text-white shadow-md'
                    : 'text-oxford hover:text-cyan-accent hover:bg-slate-50'
                }`}
              >
                {buttonLabel}
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
