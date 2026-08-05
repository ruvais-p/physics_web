'use client';

import { useState, useEffect } from 'react';
import FacultyCard from '@/components/FacultyCard';
import { FACULTY_MEMBERS, SCHOLARS, FacultyMember, Scholar } from '@/lib/data';
import { Mail, Phone, MapPin, BookOpen, X, GraduationCap } from 'lucide-react';

export default function PeoplePage() {
  const [selectedPerson, setSelectedPerson] = useState<FacultyMember | Scholar | null>(null);

  // Lock background scrolling when sidebar details are open
  useEffect(() => {
    if (selectedPerson) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedPerson]);

  return (
    <div className="space-y-10 pb-20 relative">

      {/* Page Header (No Hero image, clean text block) */}
      <div className="-mt-[84px] sm:-mt-[96px] bg-slate-50 pt-32 sm:pt-40 pb-6 sm:pb-8">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 space-y-4 pt-4">

          <h1 className="font-serif text-5xl sm:text-6xl font-extrabold text-oxford tracking-tight">
            Faculty & Research Scholars
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed font-sans">
            Meet the distinguished professors, scientists, and PhD scholars driving scientific research across experimental and theoretical physics.
          </p>
        </div>
      </div>

      {/* Faculty Members Section */}
      <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 space-y-6">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-oxford tracking-tight">
            Faculty Members
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 font-sans">
          {FACULTY_MEMBERS.map((person) => (
            <FacultyCard
              key={person.id}
              person={person}
              onClick={() => setSelectedPerson(person)}
            />
          ))}
        </div>
      </section>

      {/* Research Scholars Section */}
      <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 space-y-6">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-oxford tracking-tight">
            Research Scholars
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 font-sans">
          {SCHOLARS.map((person) => (
            <FacultyCard
              key={person.id}
              person={person}
              onClick={() => setSelectedPerson(person)}
            />
          ))}
        </div>
      </section>

      {/* Slide-out Sidebar details view */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${selectedPerson ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        {/* Backdrop (Darkened and blurred background) */}
        <div
          onClick={() => setSelectedPerson(null)}
          className="absolute inset-0 bg-oxford-dark/60 backdrop-blur-sm transition-all duration-300"
        />

        {/* Sidebar Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform ${selectedPerson ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          {selectedPerson && (
            <>
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
                <h2 className="font-serif text-2xl font-bold text-oxford">
                  Profile Details
                </h2>
                <button
                  onClick={() => setSelectedPerson(null)}
                  className="p-2 rounded-lg text-slate-400 hover:text-oxford hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Close details"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Photo & Name block */}
                <div className="text-center space-y-4">
                  <div className="relative w-36 h-36 mx-auto rounded-2xl overflow-hidden border-2 border-cyan-accent/25 shadow-md bg-slate-100">
                    <img
                      src={selectedPerson.image}
                      alt={selectedPerson.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-oxford leading-snug">
                      {selectedPerson.name}
                    </h3>
                    <p className="text-sm font-bold text-cyan-accent uppercase tracking-wider mt-1 font-sans">
                      {selectedPerson.type === 'faculty'
                        ? (selectedPerson as FacultyMember).designation
                        : `Ph.D. Research Scholar`}
                    </p>
                    {selectedPerson.type === 'faculty' && (
                      <p className="text-xs text-slate-500 font-sans mt-0.5 font-medium">
                        {(selectedPerson as FacultyMember).qualification}
                      </p>
                    )}
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Contact and Directory Details */}
                <div className="space-y-4 font-sans">
                  <h4 className="text-xs font-bold text-oxford uppercase tracking-wider">
                    Contact & Location Info
                  </h4>

                  <div className="space-y-3 text-sm text-slate-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-accent/10 flex items-center justify-center text-cyan-dark shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <a href={`mailto:${selectedPerson.email}`} className="hover:underline hover:text-cyan-accent truncate font-semibold">
                        {selectedPerson.email}
                      </a>
                    </div>

                    {selectedPerson.type === 'faculty' && (selectedPerson as FacultyMember).phone && (
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-accent/10 flex items-center justify-center text-cyan-dark shrink-0">
                          <Phone className="w-4 h-4" />
                        </div>
                        <span className="font-medium">{(selectedPerson as FacultyMember).phone}</span>
                      </div>
                    )}

                    {selectedPerson.type === 'faculty' && (selectedPerson as FacultyMember).room && (
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-accent/10 flex items-center justify-center text-cyan-dark shrink-0">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Office: {(selectedPerson as FacultyMember).room}</span>
                      </div>
                    )}

                    {selectedPerson.type === 'scholar' && (
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-accent/10 flex items-center justify-center text-cyan-dark shrink-0">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Supervisor: {(selectedPerson as Scholar).supervisor}</span>
                      </div>
                    )}
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Additional Details based on Faculty vs Scholar */}
                {selectedPerson.type === 'faculty' ? (
                  <div className="space-y-6">
                    {/* Bio */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-oxford uppercase tracking-wider font-sans">
                        Biography & Background
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed text-justify">
                        {(selectedPerson as FacultyMember).bio}
                      </p>
                    </div>

                    {/* Research Focus Focus */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-oxford uppercase tracking-wider font-sans">
                        Key Research Focus
                      </h4>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {(selectedPerson as FacultyMember).researchFocus.map((focus, i) => (
                          <span
                            key={i}
                            className="bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200"
                          >
                            {focus}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Publications Stats */}
                    <div className="bg-surface-low border border-cyan-accent/15 rounded-xl p-4 flex justify-between items-center font-sans">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-cyan-accent/10 flex items-center justify-center text-cyan-dark">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="block font-bold text-oxford text-sm">
                            {(selectedPerson as FacultyMember).publicationsCount} Publications
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            Peer-reviewed journals
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block font-bold text-cyan-dark text-lg">
                          {(selectedPerson as FacultyMember).citations}
                        </span>
                        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">
                          Citations
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Research details for scholars */}
                    <div className="space-y-3 font-sans">
                      <h4 className="text-xs font-bold text-oxford uppercase tracking-wider">
                        Research Profile
                      </h4>

                      <div className="space-y-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Research Topic
                          </span>
                          <p className="text-sm text-slate-700 italic leading-relaxed">
                            {(selectedPerson as Scholar).topic}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                              Fellowship Scheme
                            </span>
                            <span className="block text-xs sm:text-sm font-bold text-oxford mt-0.5">
                              {(selectedPerson as Scholar).fellowship}
                            </span>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                              Joining Year
                            </span>
                            <span className="block text-xs sm:text-sm font-bold text-oxford mt-0.5">
                              {(selectedPerson as Scholar).joiningYear}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
