import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Hero from '@/components/Hero';
import AlumniTestimonials from '@/components/AlumniTestimonials';
import { getPageHero } from '@/lib/page-hero';

export const metadata = {
  title: 'Global Alumni & Endowments | Department of Physics, CUSAT',
  description:
    'Explore inspiring alumni stories, the PhyCA Alumni Executive Committee, and departmental endowments at the Department of Physics, Cochin University of Science and Technology (CUSAT).',
};

export const revalidate = 300;

// Committee Members
export interface AlumniCommitteeMember {
  id: string;
  name: string;
  role: string;
  affiliation: string;
  batch?: string;
}

const ALUMNI_COMMITTEE: AlumniCommitteeMember[] = [
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

// Department Endowments
export interface EndowmentItem {
  id: string;
  title: string;
  description: string;
}

const ENDOWMENTS: EndowmentItem[] = [
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
      'Academic merit award for MSc Physics students excelling in departmental coursework.',
  },
  {
    id: 'e6',
    title: 'Best PhD Thesis Award',
    description:
      'Annual departmental recognition for outstanding doctoral dissertation in theoretical and experimental physics.',
  },
  {
    id: 'e7',
    title: 'Best Masters Thesis Award',
    description:
      'Annual departmental recognition for outstanding postgraduate dissertation in theoretical and experimental physics.',
  },
];

export default async function AlumniPage() {
  const heroData = await getPageHero('alumni');

  return (
    <div id="alumni-page" className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Full-bleed Hero Header */}
      <Hero
        title={heroData.title || 'GLOBAL ALUMNI NETWORK'}
        badge="HOME > ALUMNI"
        subtitle={heroData.subtitle}
        bgImage={heroData.image}
      />

      {/* Editorial Overview: Two columns (left: label + title + intro, right: 4:3 department photo) */}



      {/* Testimonials: 3 cards in a row */}
      <AlumniTestimonials />

      {/* Section Divider */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-t border-gray-200" />
      </div>

      {/* Alumni Committee: Clean grid of simple cards */}
      <section id="alumni-committee" className="w-full py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#002147] font-serif">
              Alumni Executive Committee
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1.5 max-w-2xl">
              PhyCA executive committee members coordinating alumni networking, student mentorship, departmental endowments, and scientific colloquia.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {ALUMNI_COMMITTEE.map((member) => (
              <div
                key={member.id}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow flex flex-col justify-between text-left"
              >
                <div>
                  <h3 className="font-semibold text-gray-900 text-base leading-snug">
                    {member.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {member.role}
                    {member.batch ? ` · ${member.batch}` : ''}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed">
                  {member.affiliation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-t border-gray-200" />
      </div>

      {/* Endowments: 2 or 4 column grid of plain bordered cards */}
      <section id="alumni-endowments" className="w-full py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#002147] font-serif">
              Departmental Endowments &amp; Awards
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1.5 max-w-2xl">
              Academic endowments and student merit awards instituted through the Physics Department Alumni Association (PhyCA).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ENDOWMENTS.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow flex flex-col justify-between text-left"
              >
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500">
            <span>
              To institute an endowment or inquire about student awards, contact the department office.
            </span>
            <Link
              href="/contact?subject=Endowments%20Inquiry"
              className="font-semibold text-[#002147] hover:underline focus:outline-none focus:ring-2 focus:ring-[#002147] rounded"
            >
              Inquire about Endowments &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <hr className="border-t border-gray-200" />
      </div>

      {/* Stay Connected: Clean editorial academic callout */}
      <section id="alumni-reconnect" className="w-full py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F8F9FB] border border-gray-200 rounded-lg p-6 sm:p-8 text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-[#002147] font-serif mb-2">
              Stay Connected with Your Alma Mater
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl leading-relaxed mb-6 font-sans">
              We encourage all alumni of the Department of Physics, CUSAT to stay connected, mentor current students, and collaborate on groundbreaking scientific initiatives.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                id="contact-dept-office-btn"
                href="/contact"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[#002147] hover:bg-[#001733] text-white text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#002147] focus:ring-offset-2"
              >
                Contact Department Office
              </Link>

              <Link
                id="update-alumni-details-btn"
                href="/contact?subject=Alumni%20Network%20Update"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-gray-300 hover:border-gray-400 bg-white text-gray-800 hover:text-gray-900 text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#002147] focus:ring-offset-2"
              >
                Update Contact Details
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
