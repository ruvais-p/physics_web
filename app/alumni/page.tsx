import React from 'react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import AlumniTestimonials from '@/components/AlumniTestimonials';
import { getPageHero } from '@/lib/page-hero';
import {
  Users,
  Award,
  ArrowRight,
  Mail,
  CheckCircle2,
} from 'lucide-react';

export const metadata = {
  title: 'Global Alumni & Endowments | Department of Physics, CUSAT',
  description:
    'Explore inspiring alumni stories, the PhyCA Alumni Executive Committee, and prestigious departmental endowments at the Department of Physics, Cochin University of Science and Technology (CUSAT).',
};

export const revalidate = 300;

// Inline DoP Atom Emblem Logo
function DopLogo({ className = 'w-9 h-7 text-[#002147]' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="-12 -12 255 184"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <text
        x="2"
        y="124"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="110"
        fontWeight="900"
        fill="currentColor"
      >
        D
      </text>
      <g transform="translate(112, 80)">
        <ellipse
          cx="0"
          cy="0"
          rx="25"
          ry="70"
          stroke="currentColor"
          strokeWidth="3.5"
          fill="none"
        />
        <ellipse
          cx="0"
          cy="0"
          rx="25"
          ry="70"
          stroke="currentColor"
          strokeWidth="3.5"
          fill="none"
          transform="rotate(60)"
        />
        <ellipse
          cx="0"
          cy="0"
          rx="25"
          ry="70"
          stroke="currentColor"
          strokeWidth="3.5"
          fill="none"
          transform="rotate(-60)"
        />
        <circle cx="0" cy="0" r="16" fill="currentColor" />
      </g>
      <text
        x="145"
        y="124"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="110"
        fontWeight="900"
        fill="currentColor"
      >
        P
      </text>
    </svg>
  );
}

// Plain array for Alumni Committee (easily swappable for API later)
export interface AlumniCommitteeMember {
  id: string;
  name: string;
  role: string;
  affiliation: string;
  batch?: string;
}

export const ALUMNI_COMMITTEE: AlumniCommitteeMember[] = [
  {
    id: 'ac1',
    name: 'Prof. (Dr.) M. R. Anantharaman',
    role: 'Patron & Advisor',
    affiliation: 'Professor Emeritus, Department of Physics, CUSAT',
    batch: 'Distinguished Faculty',
  },
  {
    id: 'ac2',
    name: 'Dr. S. Prasanth',
    role: 'President',
    affiliation: 'Senior Scientist & Material Physicist',
    batch: 'Class of 1998',
  },
  {
    id: 'ac3',
    name: 'Dr. Lakshmi K. Menon',
    role: 'Vice President',
    affiliation: 'Associate Professor of Physics',
    batch: 'Class of 2004',
  },
  {
    id: 'ac4',
    name: 'Dr. Anandhu R. Nair',
    role: 'General Secretary',
    affiliation: 'Postdoctoral Fellow, Quantum Technologies',
    batch: 'Class of 2018',
  },
  {
    id: 'ac5',
    name: 'Dr. Priya S. Warrier',
    role: 'Joint Secretary',
    affiliation: 'Senior Scientist / Space Instrumentation, ISRO',
    batch: 'Class of 2015',
  },
  {
    id: 'ac6',
    name: 'Prof. Rajesh K. Menon',
    role: 'Treasurer',
    affiliation: 'Associate Professor of Physics, IIT Madras',
    batch: 'Class of 2012',
  },
];

// Plain array for Endowments (easily swappable for API later)
export interface EndowmentItem {
  id: string;
  title: string;
  description: string;
}

export const ENDOWMENTS: EndowmentItem[] = [
  {
    id: 'e1',
    title: 'Prof. M. Sabir Endowment',
    description:
      'Award for MSc Physics student who scores the highest in Mathematical Physics course.',
  },
  {
    id: 'e2',
    title: 'Prof. Ramesh Babu Endowment',
    description:
      'Award for MSc Physics student who scores the highest in Electrodynamics and Classical Mechanics courses.',
  },
  {
    id: 'e3',
    title: 'Prof. M. R. Anantharaman Endowment',
    description:
      'Award for the best Research Paper Published in the Department.',
  },
  {
    id: 'e4',
    title: 'Prof. S. Jayalekshmi Endowment',
    description:
      'Award for MSc Physics student who scores the highest in Statistical Physics course.',
  },
  {
    id: 'e5',
    title: 'Profs. K. Vijayakumar and Sudha Kartha Endowment',
    description:
      'Award for MSc Physics student who scores the highest in [TODO].',
  },
  {
    id: 'e6',
    title: 'Best PhD Thesis Award for Experimental and Theoretical Physics',
    description: '[TODO description]',
  },
  {
    id: 'e7',
    title: 'Best Masters Thesis Award for Experimental and Theoretical Physics',
    description: '[TODO description]',
  },
];

export default async function AlumniPage() {
  const heroData = await getPageHero('alumni');

  return (
    <div className="relative min-h-screen bg-white text-slate-900 font-sans">
      {/* Hero Header */}
      <Hero
        title={heroData.title || 'GLOBAL ALUMNI NETWORK'}
        badge="HOME > ALUMNI"
        subtitle={heroData.subtitle}
        bgImage={heroData.image}
      />

      {/* SECTION 1: Testimonials by Alumni (3 featured testimonials) */}
      <AlumniTestimonials />

      {/* SECTION 2: Alumni Committee (PhyCA Executive Committee) */}
      <section
        id="alumni-committee"
        className="w-full bg-white py-16 sm:py-24 border-t border-blue-100"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-xs sm:text-sm font-bold text-[#002147] tracking-wider uppercase shadow-2xs">
              <Users className="w-4 h-4 text-cyan-600" />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#002147] font-serif tracking-tight leading-tight">
              Alumni Committee
            </h2>

            <p className="text-base sm:text-lg text-slate-600 font-sans leading-relaxed max-w-2xl mx-auto">
              Dedicated alumni representatives coordinating global networking, mentorship programs, academic endowments, and departmental colloquia.
            </p>
          </div>

          {/* Committee Members Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {ALUMNI_COMMITTEE.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl border border-blue-100/90 hover:border-blue-300 p-6 sm:p-7 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-100/80">
                      {member.role}
                    </span>
                    {member.batch && (
                      <span className="text-xs font-medium text-slate-500 font-sans">
                        {member.batch}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[#002147] group-hover:text-blue-900 transition-colors leading-snug">
                    {member.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                    {member.affiliation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Endowments Section */}
      <section
        id="alumni-endowments"
        className="w-full bg-white py-16 sm:py-24 border-t border-blue-100"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
          {/* Light bluish background card */}
          <div className="rounded-3xl bg-gradient-to-b from-[#f2f7fd] via-[#eaf2fc] to-[#f0f6fc] border border-blue-200/90 p-8 sm:p-12 lg:p-14 shadow-sm space-y-10">
            {/* Centered title & subtitle */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#002147] font-serif tracking-tight leading-tight">
                Endowments
              </h2>
              <p className="text-base sm:text-lg text-slate-600 font-sans leading-relaxed">
                Endowments donated by the members of PhyCA
              </p>
            </div>

            {/* 4-column responsive grid (logo on top, title, short description, all centered) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {ENDOWMENTS.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-blue-100/90 hover:border-blue-300 p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group justify-between"
                >
                  <div className="w-full flex flex-col items-center">
                    {/* DoP Logo on top */}
                    <div className="w-14 h-14 rounded-2xl bg-blue-50/90 border border-blue-100 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-[#002147] transition-all duration-300 shadow-2xs">
                      <DopLogo className="w-9 h-7 text-[#002147] group-hover:text-white transition-colors" />
                    </div>

                    {/* Title */}
                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#002147] leading-snug mb-2.5 group-hover:text-blue-900 transition-colors">
                      {item.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}

              {/* The last grid cell is a blue "View All" button */}
              <div className="bg-[#002147] hover:bg-blue-900 rounded-2xl border border-transparent p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center text-white group cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Award className="w-7 h-7 text-cyan-300" />
                </div>

                <h3 className="font-serif font-bold text-lg sm:text-xl text-white mb-2 leading-snug">
                  All Endowments &amp; Honors
                </h3>

                <p className="text-xs text-blue-200/90 leading-relaxed mb-6 font-sans">
                  Explore complete list of student awards, fellowships, and PhyCA endowments.
                </p>

                <Link
                  href="/contact?subject=Endowments%20Inquiry"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-cyan-accent text-[#002147] hover:text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all duration-200"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Reconnect Callout Box */}
      <section className="w-full bg-white pb-20 pt-4 border-t border-blue-100/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
          <div className="rounded-3xl bg-gradient-to-r from-blue-50/90 via-sky-50/50 to-blue-50/90 border-2 border-blue-200 p-8 sm:p-12 space-y-6 shadow-sm">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-[#002147]">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Join the Directory</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#002147] font-serif">
                Stay Connected with Your Alma Mater
              </h3>

              <p className="text-base sm:text-lg text-blue-950 leading-relaxed max-w-3xl">
                We encourage all alumni of the Department of Physics, CUSAT to stay connected, mentor the next generation of students, and collaborate on groundbreaking scientific initiatives.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                id="contact-dept-office-btn"
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-[#002147] hover:bg-blue-900 text-white font-bold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <span>Contact Department Office</span>
                <ArrowRight className="w-4 h-4 text-cyan-300" />
              </Link>

              <Link
                id="update-alumni-details-btn"
                href="/contact?subject=Alumni%20Network%20Update"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-blue-50 border-2 border-[#002147] text-[#002147] font-bold text-sm sm:text-base px-7 py-3 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <Mail className="w-4 h-4 text-blue-700" />
                <span>Update Contact Details</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
