'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FacultyCard from '@/components/FacultyCard';
import { FACULTY_MEMBERS, SCHOLARS, FacultyMember, Scholar } from '@/lib/data';

export default function PeoplePage() {
  const [facultyList, setFacultyList] = useState<FacultyMember[]>([]);
  const [scholarsList, setScholarsList] = useState<Scholar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPublicPeople() {
      try {
        const res = await fetch('/api/public/faculty');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setFacultyList(data);

            // Collect guided scholars across all DB faculty
            const dbScholars: Scholar[] = [];
            data.forEach((f: any) => {
              if (Array.isArray(f.students)) {
                dbScholars.push(...f.students);
              }
            });

            if (dbScholars.length > 0) {
              setScholarsList(dbScholars);
            } else {
              setScholarsList(SCHOLARS);
            }
          } else {
            // Fallback to static data if no DB records exist
            setFacultyList(FACULTY_MEMBERS);
            setScholarsList(SCHOLARS);
          }
        } else {
          setFacultyList(FACULTY_MEMBERS);
          setScholarsList(SCHOLARS);
        }
      } catch (err) {
        console.error('Failed to fetch public faculty from database:', err);
        setFacultyList(FACULTY_MEMBERS);
        setScholarsList(SCHOLARS);
      } finally {
        setLoading(false);
      }
    }

    loadPublicPeople();
  }, []);

  return (
    <div className="pb-20 relative">
      {/* Page Header (Campus image background) */}
      <div className="-mt-[116px] sm:-mt-[128px] relative w-full bg-slate-900 text-white overflow-hidden min-h-[620px] sm:min-h-[720px] lg:min-h-[780px] flex items-center justify-center">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/faculty.png"
            alt="Faculty Banner"
            fill
            className="object-cover opacity-45"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Top Left Breadcrumbs */}
        <div className="absolute top-36 sm:top-40 left-6 sm:left-12 lg:left-16 z-20 flex items-center space-x-2 text-xl sm:text-2xl font-sans font-semibold text-slate-300">
          <Link href="/" className="hover:text-cyan-accent transition-colors">Home</Link>
          <span>&gt;</span>
          <span className="text-white font-bold">Faculty Members</span>
        </div>

        {/* Hero Title (Centered) */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 text-center space-y-4 pt-12">
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white uppercase drop-shadow-md">
            Faculty Members
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-3 border-oxford border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-500 font-sans">Loading Faculty Members...</span>
        </div>
      ) : (
        <div className="space-y-16 pt-10">
          {/* Faculty Members Section */}
          <section className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 space-y-6">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-oxford tracking-tight">
                Our Faculty
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 font-sans">
              {facultyList.map((person) => (
                <Link key={person.id} href={`/people/${person.id}`} className="block h-full">
                  <FacultyCard person={person} />
                </Link>
              ))}
            </div>
          </section>

          {/* Research Scholars Section */}
          <section className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 space-y-6">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-oxford tracking-tight">
                Research Scholars
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 font-sans">
              {scholarsList.map((person) => (
                <div key={person.id} className="h-full">
                  <FacultyCard person={person} />
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
