'use client';

import Link from 'next/link';
import FacultyCard from '@/components/FacultyCard';
import { FACULTY_MEMBERS, SCHOLARS } from '@/lib/data';

export default function PeoplePage() {
  return (
    <div className="space-y-10 pb-20 relative">

      {/* Page Header (No Hero image, clean text block, centered, reduced space) */}
      <div className="-mt-[84px] sm:-mt-[96px] bg-slate-50 pt-28 sm:pt-32 pb-4">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 text-center space-y-3 pt-4">
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-oxford tracking-tight">
            Faculty Members
          </h1>
          
          {/* Breadcrumb: Home > Faculty Members */}
          <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm font-sans font-medium text-slate-500">
            <Link href="/" className="hover:text-cyan-accent transition-colors">Home</Link>
            <span className="text-slate-400">&gt;</span>
            <span className="text-slate-800">Faculty Members</span>
          </div>
        </div>
      </div>

      {/* Faculty Members Section */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 space-y-6">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-oxford tracking-tight">
            Faculty Members
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 font-sans">
          {FACULTY_MEMBERS.map((person) => (
            <Link key={person.id} href={`/people/${person.id}`} className="block h-full">
              <FacultyCard person={person} />
            </Link>
          ))}
        </div>
      </section>

      {/* Research Scholars Section */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 space-y-6">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-oxford tracking-tight">
            Research Scholars
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 font-sans">
          {SCHOLARS.map((person) => (
            <Link key={person.id} href={`/people/${person.id}`} className="block h-full">
              <FacultyCard person={person} />
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
