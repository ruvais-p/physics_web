'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Hero from '@/components/Hero';
import CourseCard, { CourseWithSchemes } from '@/components/CourseCard';
import { COURSES } from '@/lib/data';

export default function CoursesPage() {
  const [activeCourseId, setActiveCourseId] = useState<string>('c1');
  const [dynamicCourses, setDynamicCourses] = useState<CourseWithSchemes[]>(COURSES);

  useEffect(() => {
    async function fetchDynamicCourses() {
      try {
        const res = await fetch('/api/courses/schemes');
        if (res.ok) {
          const data = await res.json();
          if (data.courses && data.courses.length > 0) {
            // Merge static course info with dynamic schemes
            const merged = COURSES.map((staticCourse) => {
              const matched = data.courses.find((dc: any) => dc.id === staticCourse.id);
              return {
                ...staticCourse,
                schemes: matched?.schemes && matched.schemes.length > 0 ? matched.schemes : undefined,
              };
            });
            setDynamicCourses(merged);
          }
        }
      } catch (err) {
        console.error('Error loading dynamic course schemes:', err);
      }
    }
    fetchDynamicCourses();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('phd')) {
        setActiveCourseId('c2');
      } else if (hash.includes('integrated')) {
        setActiveCourseId('c3');
      } else {
        setActiveCourseId('c1');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    
    // Periodic check to capture Next.js client-side routing hash updates
    const interval = setInterval(handleHashChange, 150);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      clearInterval(interval);
    };
  }, []);

  const selectedCourse = dynamicCourses.find(c => c.id === activeCourseId) || dynamicCourses[0];


  return (
    <div className="space-y-12 pb-20 relative">
      
      {/* Hero Header matching main homepage design */}
      <Hero
        title="ACADEMIC PROGRAMS"
        badge="HOME > COURSES"
        subtitle="Choice-Based Credit System (CBCS) offering M.Sc., Ph.D., and 5-Year Integrated M.Sc. degree programs."
        bgImage="/campus.jpg"
      />

      {/* Course Selector Bar - Styled like the glassmorphic navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center pt-6">
        <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-xl border border-cyan-accent/30 shadow-lg rounded-2xl sm:rounded-3xl">
          {COURSES.map((course) => {
            const isActive = activeCourseId === course.id;
            return (
              <button
                key={course.id}
                onClick={() => {
                  setActiveCourseId(course.id);
                  const hashLink = course.id === 'c1' ? '#msc' : course.id === 'c2' ? '#phd' : '#integrated';
                  window.history.pushState(null, '', hashLink);
                }}
                className={`px-5 py-2.5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold tracking-wide transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-cyan-accent text-white shadow-md'
                    : 'text-oxford hover:text-cyan-accent hover:bg-slate-50'
                }`}
              >
                {course.level === 'MSc' 
                  ? 'M.Sc. Physics' 
                  : course.level === 'PhD' 
                    ? 'Ph.D. Program' 
                    : 'Integrated M.Sc.'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <CourseCard course={selectedCourse} />
        </div>
      </section>

    </div>
  );
}
