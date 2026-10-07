import Link from 'next/link';
import Hero from '@/components/Hero';
import FacultyCard from '@/components/FacultyCard';
import StaffCard from '@/components/StaffCard';
import { prisma } from '@/lib/prisma';
import { getPageHero } from '@/lib/page-hero';
import type { FacultyMember, Scholar, StaffMember } from '@/lib/data';

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
        qualification: true,
        room: true,
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
            expiryDate: true,
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
      qualification: record.qualification || '',
      email: record.email,
      phone: record.phone || '',
      room: record.room || '',
      researchFocus: [],
      bio: record.bio || '',
      publicationsCount: 0,
      citations: 0,
      image: record.documents?.image || '/faculty.png',
      type: 'faculty',
    }));

    const now = new Date();
    const scholars: Scholar[] = records.flatMap((record) =>
      record.students
        .filter((student) => {
          if (!student.expiryDate) return true;
          const exp = new Date(student.expiryDate);
          exp.setHours(23, 59, 59, 999);
          return exp >= now;
        })
        .map((student) => ({
          id: student.uid,
          name: student.name,
          supervisor: record.name,
          topic: student.description || '',
          joiningYear: student.createdAt.getFullYear(),
          image: student.image || '/faculty.png',
          expiryDate: student.expiryDate ? student.expiryDate.toISOString().slice(0, 10) : null,
          type: 'scholar',
        })),
    );

    return { faculty, scholars };
  } catch (error) {
    console.error('Failed to fetch people from the database:', error);
    return { faculty: [], scholars: [] };
  }
}

async function getOfficeStaff(): Promise<StaffMember[]> {
  try {
    const records = await prisma.staff.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        designation: true,
        email: true,
        phone: true,
        room: true,
        image: true,
        sortOrder: true,
        isActive: true,
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    return records.map((record) => ({
      id: record.id,
      name: record.name,
      designation: record.designation,
      email: record.email || undefined,
      phone: record.phone || undefined,
      room: record.room || undefined,
      image: record.image || '/faculty.png',
      sortOrder: record.sortOrder,
      isActive: record.isActive,
      type: 'staff',
    }));
  } catch (error) {
    console.error('Failed to fetch office staff from the database:', error);
    return [];
  }
}

export default async function PeoplePage() {
  const [{ faculty, scholars }, staffList, heroData] = await Promise.all([
    getPeople(),
    getOfficeStaff(),
    getPageHero('people'),
  ]);

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
        title={heroData.title}
        badge="HOME > PEOPLE"
        subtitle={heroData.subtitle}
        bgImage={heroData.image}
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

        {/* 4. Administrative & Office Staff Section */}
        {staffList.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 space-y-8">
            <div className="text-center">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-oxford tracking-tight">
                Administrative &amp; Office Staff
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 lg:gap-14 font-sans">
              {staffList.map((person) => (
                <div key={person.id} className="h-full">
                  <StaffCard person={person} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

