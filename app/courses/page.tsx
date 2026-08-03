'use client';

import { useState } from 'react';
import Hero from '@/components/Hero';
import CourseCard from '@/components/CourseCard';
import { COURSES } from '@/lib/data';
import { BookOpen, GraduationCap, Award, Check } from 'lucide-react';

export default function CoursesPage() {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'MSc' | 'PhD' | 'Integrated MSc'>('ALL');

  const filteredCourses =
    selectedFilter === 'ALL'
      ? COURSES
      : COURSES.filter((c) => c.level === selectedFilter);

  return (
    <div className="space-y-12 pb-20">
      
      {/* Hero */}
      <Hero
        badge="ACADEMIC PROGRAMS & ADMISSIONS"
        title="Postgraduate & Doctoral Degree Programs"
        subtitle="Explore our comprehensive physics curricula across M.Sc. Physics, Ph.D. Research, and 5-Year Integrated M.Sc. programs."
        bgImage="https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=1600&q=80"
      />

      {/* Program Selection Buttons (3 Options + All) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-wrap items-center justify-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
          
          <button
            id="filter-all-btn"
            onClick={() => setSelectedFilter('ALL')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              selectedFilter === 'ALL'
                ? 'bg-oxford text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Programs ({COURSES.length})
          </button>

          <button
            id="filter-msc-btn"
            onClick={() => setSelectedFilter('MSc')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              selectedFilter === 'MSc'
                ? 'bg-oxford text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Option 1: M.Sc. Physics
          </button>

          <button
            id="filter-phd-btn"
            onClick={() => setSelectedFilter('PhD')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              selectedFilter === 'PhD'
                ? 'bg-oxford text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Option 2: Ph.D. Program
          </button>

          <button
            id="filter-integrated-btn"
            onClick={() => setSelectedFilter('Integrated MSc')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              selectedFilter === 'Integrated MSc'
                ? 'bg-oxford text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Option 3: Integrated M.Sc.
          </button>

        </div>

        {/* Courses List */}
        <div className="space-y-10">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {/* Admission Procedure Banner */}
        <div className="bg-surface-low border border-cyan-accent/30 rounded-2xl p-8 lg:p-10 shadow-sm mt-12 space-y-4">
          <div className="flex items-center space-x-2 text-oxford">
            <Award className="w-6 h-6 text-cyan-accent" />
            <h2 className="font-serif text-2xl font-bold">Admission & Entrance Information</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Admissions to M.Sc. and Integrated M.Sc. programs are conducted through the CUSAT Common Admission Test (CAT). Ph.D. admissions require a valid score in GATE / NET-JRF / DAT followed by a Departmental Interview.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs font-semibold text-oxford">
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              ✓ CUSAT CAT Entrance Exam
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              ✓ CSIR-UGC NET / GATE Qualified
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              ✓ Institutional Fellowships Available
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}
