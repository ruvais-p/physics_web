'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Hero from '@/components/Hero';
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

  // Filter HOD vs standard Faculty members
  const hodList = facultyList.filter((f) => {
    const des = (f.designation || '').toLowerCase();
    return des.includes('head') || des.includes('hod');
  });

  let actualHodList = hodList;
  let otherFacultyList = facultyList.filter((f) => {
    const des = (f.designation || '').toLowerCase();
    return !des.includes('head') && !des.includes('hod');
  });

  // Fallback if no explicit HOD title was matched
  if (actualHodList.length === 0 && facultyList.length > 0) {
    const pradeep = facultyList.find((f) => f.name.toLowerCase().includes('pradeep'));
    if (pradeep) {
      actualHodList = [pradeep];
      otherFacultyList = facultyList.filter((f) => f.id !== pradeep.id);
    } else {
      actualHodList = [facultyList[0]];
      otherFacultyList = facultyList.slice(1);
    }
  }

  return (
    <div className="pb-20 relative">
      {/* Hero Header matching main homepage design */}
      <Hero
        title="FACULTY & SCHOLARS"
        badge="HOME > PEOPLE"
        subtitle="Meet our Head of Department, distinguished professors, principal investigators, and doctoral research scholars."
        bgImage="/faculty.png"
      />

      {loading ? (
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-3 border-oxford border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-500 font-sans">Loading Department People...</span>
        </div>
      ) : (
        <div className="space-y-20 pt-10">
          {/* 1. Head of Department Section */}
          {actualHodList.length > 0 && (
            <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 space-y-8">
              <div className="text-center">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-dark bg-cyan-50 px-3.5 py-1.5 rounded-full border border-cyan-200/60 inline-block mb-3">
                  Department Leadership
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-oxford tracking-tight">
                  Head of Department
                </h2>
              </div>
              <div className="flex justify-center font-sans">
                <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
                  {actualHodList.map((person) => (
                    <Link key={person.id} href={`/people/${person.id}`} className="block h-full">
                      <FacultyCard person={person} />
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 2. Faculty Members Section */}
          <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 space-y-8">
            <div className="text-center">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-dark bg-cyan-50 px-3.5 py-1.5 rounded-full border border-cyan-200/60 inline-block mb-3">
                Academic Staff
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-oxford tracking-tight">
                Faculty Members
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 lg:gap-14 font-sans">
              {otherFacultyList.map((person) => (
                <Link key={person.id} href={`/people/${person.id}`} className="block h-full">
                  <FacultyCard person={person} />
                </Link>
              ))}
            </div>
          </section>

          {/* 3. Research Scholars Section */}
          <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 space-y-8">
            <div className="text-center">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-dark bg-cyan-50 px-3.5 py-1.5 rounded-full border border-cyan-200/60 inline-block mb-3">
                Doctoral Candidates
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-oxford tracking-tight">
                Research Scholars
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 lg:gap-14 font-sans">
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
