import Link from 'next/link';
import Hero from '@/components/Hero';
import FacultyCard from '@/components/FacultyCard';
import { prisma } from '@/lib/prisma';
import type { FacultyMember, Scholar } from '@/lib/data';

export const revalidate = 300;

async function getPeople(): Promise<{
  faculty: FacultyMember[];
  scholars: Scholar[];
}> {
  try {
    const records = await prisma.faculty.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        designation: true,
        bio: true,
        documents: {
          select: { image: true },
        },
        students: {
          select: {
            uid: true,
            name: true,
            description: true,
            image: true,
            createdAt: true,
          },
        },
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    const faculty: FacultyMember[] = records.map((record) => ({
      id: record.id,
      name: record.name,
      designation: record.designation || '',
      qualification: '',
      email: record.email,
      phone: record.phone || '',
      room: '',
      researchFocus: [],
      bio: record.bio || '',
      publicationsCount: 0,
      citations: 0,
      image: record.documents?.image || '/faculty.png',
      type: 'faculty',
    }));

    const scholars: Scholar[] = records.flatMap((record) =>
      record.students.map((student) => ({
        id: student.uid,
        name: student.name,
        supervisor: record.name,
        topic: student.description || '',
        joiningYear: student.createdAt.getFullYear(),
        image: student.image || '/faculty.png',
        type: 'scholar',
      })),
    );

    return { faculty, scholars };
  } catch (error) {
    console.error('Failed to fetch people from the database:', error);
    return { faculty: [], scholars: [] };
  }
}

export default async function PeoplePage() {
  const { faculty, scholars } = await getPeople();

  const hodList = faculty.filter((f) => {
    const des = (f.designation || '').toLowerCase();
    return des.includes('head') || des.includes('hod');
  });

  const otherFacultyList = faculty.filter((f) => {
    const des = (f.designation || '').toLowerCase();
    return !des.includes('head') && !des.includes('hod');
  });

  return (
    <div className="pb-20 relative">
      {/* Hero Header matching main homepage design */}
      <Hero
        title="FACULTY & SCHOLARS"
        badge="HOME > PEOPLE"
        subtitle="Meet our Head of Department, distinguished professors, principal investigators, and doctoral research scholars."
        bgImage="/faculty.png"
      />

      <div className="space-y-20 pt-10">
        {/* 1. Head of Department Section */}
        {hodList.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 space-y-8">
            <div className="text-center">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-oxford tracking-tight">
                Head of Department
              </h2>
            </div>
            <div className="flex justify-center font-sans">
              {hodList.map((person) => (
                <Link key={person.id} href={`/people/${person.id}`} className="block w-full max-w-sm">
                  <FacultyCard person={person} />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 2. Faculty Members Section */}
        {otherFacultyList.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 space-y-8">
            <div className="text-center">
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
        )}

        {/* 3. Research Scholars Section */}
        {scholars.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 space-y-8">
            <div className="text-center">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-oxford tracking-tight">
                Research Scholars
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 lg:gap-14 font-sans">
              {scholars.map((person) => (
                <div key={person.id} className="h-full">
                  <FacultyCard person={person} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
