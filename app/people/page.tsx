import Image from 'next/image';
import Link from 'next/link';
import FacultyCard from '@/components/FacultyCard';
import { FACULTY_MEMBERS, SCHOLARS } from '@/lib/data';

export default function PeoplePage() {
  return (
    <div className="space-y-10 pb-20 relative">

      {/* Page Header (Campus image background) */}
      <div className="-mt-[116px] sm:-mt-[128px] relative bg-slate-900 text-white overflow-hidden">
        {/* Background Image with Dark Blue Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/faculty.png"
            alt="Faculty Banner"
            fill
            className="object-cover opacity-45"
            priority
          />
          <div className="absolute inset-0 bg-oxford/75 mix-blend-multiply" />
        </div>

        {/* Content (Centered) */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 pt-36 pb-16 sm:pb-20 text-center space-y-3">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase">
            Faculty Members
          </h1>
          
          {/* Centered Breadcrumbs */}
          <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm font-sans font-medium text-slate-300">
            <Link href="/" className="hover:text-cyan-accent transition-colors">Home</Link>
            <span>&gt;</span>
            <span className="text-white font-semibold">Faculty Members</span>
          </div>
        </div>
      </div>

      {/* Faculty Members Section */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 space-y-6">
        <div>

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
