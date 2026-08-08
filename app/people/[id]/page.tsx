'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { FACULTY_MEMBERS, SCHOLARS, FacultyMember, Scholar } from '@/lib/data';
import { Mail, Phone, MapPin, BookOpen, ArrowLeft, GraduationCap } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProfilePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  // Search for the person in faculty or scholars
  const faculty = FACULTY_MEMBERS.find((f) => f.id === id);
  const scholar = SCHOLARS.find((s) => s.id === id);
  const person = faculty || scholar;

  if (!person) {
    notFound();
  }

  const isFaculty = person.type === 'faculty';

  // Get supervised scholars if faculty
  const supervisedScholars = isFaculty
    ? SCHOLARS.filter((s) => s.supervisor === person.name)
    : [];

  // Tab State
  const [activeTab, setActiveTab] = useState<'bio' | 'publications' | 'scholars' | 'research'>('bio');

  return (
    <div className="pb-20 relative">

      {/* Top Banner (Campus Image Background with Oxford Blue Overlay) */}
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
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-300 font-sans">
            {isFaculty ? 'Our Faculty' : 'Our Research Scholars'}
          </h2>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mt-2 text-white uppercase">
            {isFaculty ? 'OUR FACULTY' : 'OUR SCHOLARS'}
          </h1>
          
          {/* Centered Breadcrumbs */}
          <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm font-sans font-medium text-slate-300">
            <Link href="/" className="hover:text-cyan-accent transition-colors">Home</Link>
            <span>&gt;</span>
            <Link href="/people" className="hover:text-cyan-accent transition-colors">Faculty</Link>
            <span>&gt;</span>
            <span className="text-white font-semibold">{person.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 py-10 space-y-12">
        
        {/* Top Details Block: Left Photo, Right Text (Flat, borderless) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          
          {/* Left Column: Photo (large, rectangular, sharp, no border) */}
          <div className="shrink-0">
            <div className="relative w-full aspect-[4/3] bg-slate-50 overflow-hidden border border-slate-100">
              <img
                src={person.image}
                alt={person.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column: Left-aligned details block */}
          <div className="flex flex-col justify-center font-sans space-y-4 text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-oxford">
              {person.name}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 font-semibold tracking-wide">
              {isFaculty ? (person as FacultyMember).designation : 'Ph.D. Research Scholar'}
            </p>

            <div className="h-px bg-slate-200 w-full my-2" />

            <div className="space-y-2.5 text-sm sm:text-base text-slate-700">
              {isFaculty && (person as FacultyMember).qualification && (
                <p>
                  <strong className="text-oxford font-bold">Qualification:</strong> {(person as FacultyMember).qualification}
                </p>
              )}
              
              <p>
                <strong className="text-oxford font-bold">Email:</strong>{' '}
                <a href={`mailto:${person.email}`} className="text-cyan-dark hover:text-cyan-accent underline font-semibold">
                  {person.email}
                </a>
              </p>

              {isFaculty && (person as FacultyMember).phone && (
                <p>
                  <strong className="text-oxford font-bold">Phone:</strong> {(person as FacultyMember).phone}
                </p>
              )}

              {isFaculty && (person as FacultyMember).room && (
                <p>
                  <strong className="text-oxford font-bold">Office Room:</strong> {(person as FacultyMember).room}
                </p>
              )}

              {!isFaculty && (
                <p>
                  <strong className="text-oxford font-bold">Supervisor:</strong> {(person as Scholar).supervisor}
                </p>
              )}

              {isFaculty && (person as FacultyMember).cvUrl && (
                <p className="pt-2">
                  <strong className="text-oxford font-bold">CV:</strong>{' '}
                  <a
                    href={(person as FacultyMember).cvUrl}
                    download={`CV_${person.name.replace(/\s+/g, '_')}.pdf`}
                    className="inline-flex items-center space-x-1.5 text-cyan-dark hover:text-cyan-accent underline font-bold"
                  >
                    <span>Download CV (PDF)</span>
                  </a>
                </p>
              )}
            </div>

            {/* Social / Research Profile Badges */}
            {isFaculty && (person as FacultyMember).socialLinks && (
              <div className="pt-4 flex flex-wrap gap-2">
                {(person as FacultyMember).socialLinks?.scholar && (
                  <a
                    href={(person as FacultyMember).socialLinks?.scholar}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-slate-50 hover:bg-cyan-accent/10 text-slate-600 hover:text-cyan-dark text-xs font-semibold px-3 py-1.5 rounded border border-slate-200 transition-colors"
                  >
                    <span>Google Scholar</span>
                  </a>
                )}
                {(person as FacultyMember).socialLinks?.researchgate && (
                  <a
                    href={(person as FacultyMember).socialLinks?.researchgate}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-slate-50 hover:bg-cyan-accent/10 text-slate-600 hover:text-cyan-dark text-xs font-semibold px-3 py-1.5 rounded border border-slate-200 transition-colors"
                  >
                    <span>ResearchGate</span>
                  </a>
                )}
                {(person as FacultyMember).socialLinks?.orcid && (
                  <a
                    href={(person as FacultyMember).socialLinks?.orcid}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-slate-50 hover:bg-cyan-accent/10 text-slate-600 hover:text-cyan-dark text-xs font-semibold px-3 py-1.5 rounded border border-slate-200 transition-colors"
                  >
                    <span>ORCID iD</span>
                  </a>
                )}
                {(person as FacultyMember).socialLinks?.linkedin && (
                  <a
                    href={(person as FacultyMember).socialLinks?.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-slate-50 hover:bg-cyan-accent/10 text-slate-600 hover:text-cyan-dark text-xs font-semibold px-3 py-1.5 rounded border border-slate-200 transition-colors"
                  >
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tabbed Navigation Component (Flat, borderless) */}
        <div className="font-sans">
          
          {/* Tabs Bar Header */}
          <div className="flex border-b border-slate-200 bg-transparent justify-start">
            <button
              onClick={() => setActiveTab('bio')}
              className={`px-6 py-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
                activeTab === 'bio'
                  ? 'border-oxford text-oxford'
                  : 'border-transparent text-slate-500 hover:text-oxford'
              }`}
            >
              Biography
            </button>

            {isFaculty ? (
              <>
                <button
                  onClick={() => setActiveTab('publications')}
                  className={`px-6 py-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
                    activeTab === 'publications'
                      ? 'border-oxford text-oxford'
                      : 'border-transparent text-slate-500 hover:text-oxford'
                  }`}
                >
                  Publications
                </button>
                <button
                  onClick={() => setActiveTab('scholars')}
                  className={`px-6 py-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
                    activeTab === 'scholars'
                      ? 'border-oxford text-oxford'
                      : 'border-transparent text-slate-500 hover:text-oxford'
                  }`}
                >
                  Supervised Scholars ({supervisedScholars.length})
                </button>
              </>
            ) : (
              <button
                onClick={() => setActiveTab('research')}
                className={`px-6 py-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
                  activeTab === 'research'
                    ? 'border-oxford text-oxford'
                    : 'border-transparent text-slate-500 hover:text-oxford'
                }`}
              >
                Research Details
              </button>
            )}
          </div>

          {/* Active Tab Panel Content */}
          <div className="py-8 min-h-[220px]">
            
            {/* Biography Tab */}
            {activeTab === 'bio' && (
              <div className="space-y-6 text-left">
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-oxford font-serif">Biography & Academic Background</h3>
                  <p className="text-slate-600 leading-relaxed text-justify text-sm sm:text-base">
                    {isFaculty ? (person as FacultyMember).bio : `PhD Research Scholar in the Physics Department. Research focuses on advanced academic discovery.`}
                  </p>
                </div>
                
                {isFaculty && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-oxford uppercase tracking-wider">Key Research Areas</h4>
                    <div className="flex flex-wrap gap-2.5">
                      {(person as FacultyMember).researchFocus.map((focus, i) => (
                        <span
                          key={i}
                          className="bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl border border-slate-200"
                        >
                          {focus}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Publications Tab (Faculty) */}
            {activeTab === 'publications' && isFaculty && (
              <div className="space-y-6 text-left">
                <h3 className="text-lg font-bold text-oxford font-serif">Publications & Citations</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Stats Block (Flat) */}
                  <div className="flex items-center justify-between py-6 border-b border-t border-slate-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-cyan-accent/10 flex items-center justify-center text-cyan-dark shrink-0">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="block font-bold text-oxford text-base sm:text-lg">
                          {(person as FacultyMember).publicationsCount} Publications
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          Peer-reviewed international journals
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block font-bold text-cyan-dark text-2xl sm:text-3xl leading-none">
                        {(person as FacultyMember).citations}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-sans">
                        Citations
                      </span>
                    </div>
                  </div>

                  {/* Context Block (Flat) */}
                  <div className="flex flex-col justify-center py-2">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Research works are published across reputed high-impact index journals including Physical Review, Nature Physics, Applied Physics Letters, and others.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Supervised Scholars Tab (Faculty) */}
            {activeTab === 'scholars' && isFaculty && (
              <div className="space-y-6 text-left">
                <h3 className="text-lg font-bold text-oxford font-serif">Supervised Ph.D. Research Scholars</h3>
                
                {supervisedScholars.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {supervisedScholars.map((sch) => (
                      <Link key={sch.id} href={`/people/${sch.id}`} className="block hover:translate-x-1 transition-transform">
                        <div className="flex items-start space-x-4 py-4 border-b border-slate-200">
                          <div className="w-12 h-12 rounded overflow-hidden shrink-0 border border-slate-200 bg-slate-100 relative">
                            <img src={sch.image} alt={sch.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="block text-sm font-bold text-oxford truncate">{sch.name}</span>
                            <span className="block text-[11px] text-slate-500 italic mt-0.5 line-clamp-2">Topic: {sch.topic}</span>
                            <div className="flex items-center space-x-4 mt-2 text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-sans">
                              <span>{sch.fellowship}</span>
                              <span>•</span>
                              <span>Joined {sch.joiningYear}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">No Ph.D. scholars currently under supervision.</p>
                )}
              </div>
            )}

            {/* Research Details Tab (Scholars) */}
            {activeTab === 'research' && !isFaculty && (
              <div className="space-y-6 text-left">
                <h3 className="text-lg font-bold text-oxford font-serif">PhD Dissertation Details</h3>
                
                <div className="space-y-6">
                  <div className="py-2 border-b border-slate-200 pb-4">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans mb-1">
                      Research Topic
                    </span>
                    <p className="text-sm sm:text-base text-slate-700 italic leading-relaxed font-semibold">
                      "{(person as Scholar).topic}"
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-2">
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                        Fellowship Scheme
                      </span>
                      <span className="block text-sm sm:text-base font-bold text-oxford mt-1">
                        {(person as Scholar).fellowship}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                        Joining Year
                      </span>
                      <span className="block text-sm sm:text-base font-bold text-oxford mt-1">
                        {(person as Scholar).joiningYear}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
