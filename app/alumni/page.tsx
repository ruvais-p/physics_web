import React from 'react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import AlumniTestimonials from '@/components/AlumniTestimonials';
import { getPageHero } from '@/lib/page-hero';
import {
  Building2,
  Atom,
  GraduationCap,
  Globe2,
  Users,
  FlaskConical,
  Presentation,
  Award,
  ArrowRight,
  Mail,
  CheckCircle2,
} from 'lucide-react';

export const metadata = {
  title: 'Global Alumni & Testimonials | Department of Physics, CUSAT',
  description:
    'Explore inspiring alumni stories, global achievements, and connect with the international alumni community of the Department of Physics, Cochin University of Science and Technology (CUSAT).',
};

export const revalidate = 300;

const PRESTIGIOUS_INSTITUTIONS = [
  {
    name: 'Max Planck Institutes',
    location: 'Munich & Göttingen, Germany',
    icon: Atom,
    highlight: 'Quantum Optics & Biophysics',
  },
  {
    name: 'Indian Institute of Science (IISc)',
    location: 'Bengaluru, India',
    icon: Building2,
    highlight: 'Condensed Matter & Materials',
  },
  {
    name: 'Indian Institutes of Technology (IITs)',
    location: 'Madras, Bombay, Delhi, Kanpur',
    icon: GraduationCap,
    highlight: 'Faculty & Postdoctoral Chairs',
  },
  {
    name: 'CERN (Large Hadron Collider)',
    location: 'Geneva, Switzerland',
    icon: Globe2,
    highlight: 'High Energy Particle Physics',
  },
  {
    name: 'Raman Research Institute (RRI)',
    location: 'Bengaluru, India',
    icon: Atom,
    highlight: 'Liquid Crystals & Astronomy',
  },
  {
    name: 'Tata Institute of Fundamental Research (TIFR)',
    location: 'Mumbai, India',
    icon: Building2,
    highlight: 'Theoretical & Nuclear Physics',
  },
  {
    name: 'ISRO & VSSC Space Research Centres',
    location: 'Thiruvananthapuram & Bengaluru',
    icon: Globe2,
    highlight: 'Space Payloads & Sensor Tech',
  },
  {
    name: 'Inter-University Centre for Astronomy (IUCAA)',
    location: 'Pune, India',
    icon: GraduationCap,
    highlight: 'Astrophysics & Gravitational Waves',
  },
];

const ENGAGEMENT_PILLARS = [
  {
    title: 'Student Mentorship',
    icon: Users,
    desc: 'Guide current M.Sc. and Ph.D. scholars on career paths, competitive examinations (NET, GATE, GRE), and global admissions.',
  },
  {
    title: 'Collaborative Research',
    icon: FlaskConical,
    desc: 'Foster cross-institutional research initiatives, co-author scientific publications, and leverage shared laboratory capabilities.',
  },
  {
    title: 'Alumni Colloquia & Talks',
    icon: Presentation,
    desc: 'Share specialized industry breakthroughs, frontier research discoveries, and professional experiences through departmental seminars.',
  },
  {
    title: 'Endowments & Travel Grants',
    icon: Award,
    desc: 'Support aspiring student researchers with conference travel sponsorships, merit fellowships, and specialized laboratory equipment.',
  },
];

export default async function AlumniPage() {
  const heroData = await getPageHero('alumni');

  return (
    <div className="relative min-h-screen bg-white text-slate-900 font-sans">
      {/* Hero Header matching main website aesthetic */}
      <Hero
        title={heroData.title || 'GLOBAL ALUMNI NETWORK'}
        badge="HOME > ALUMNI"
        subtitle={heroData.subtitle}
        bgImage={heroData.image}
      />

      {/* Testimonial Section — Positioned above the Alumni Section */}
      <AlumniTestimonials />

      {/* Alumni Section — Clean White Background with Blue Lettering */}
      <section
        id="alumni-network"
        className="w-full bg-white text-[#002147] py-16 sm:py-24 border-t border-blue-100"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
          <div className="max-w-4xl space-y-8 text-left">
            {/* Color Accent line in Oxford Blue */}
            <div className="w-20 h-1.5 bg-[#002147] rounded-full" />

            {/* Eyebrow Label in Blue */}
            <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-blue-700">
              Department Community &amp; Global Footprint
            </div>

            {/* Main Section Heading in Bold Blue */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#002147] font-serif tracking-tight leading-tight">
              Our Global Alumni Network
            </h2>

            {/* Core Narrative in Blue Lettering */}
            <div className="space-y-6 text-base sm:text-lg lg:text-xl text-blue-950 font-sans font-normal leading-relaxed">
              <p className="text-blue-950">
                Since its inception in 1971, the Department of Physics at CUSAT has nurtured exceptional minds who have gone on to make profound contributions to scientific research, academia, and industry worldwide. Our alumni constitute a vibrant global community of researchers, educators, and technology leaders.
              </p>

              <p className="text-blue-900 font-medium">
                Our postgraduates and doctoral researchers have successfully secured faculty positions, postdoctoral fellowships, and lead scientific roles at premier institutions across the globe:
              </p>
            </div>

            {/* Prestigious Institutions Grid — White Cards with Blue Border & Blue Lettering */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 pt-4">
              {PRESTIGIOUS_INSTITUTIONS.map((inst) => {
                const IconComponent = inst.icon;
                return (
                  <div
                    key={inst.name}
                    className="p-5 rounded-2xl bg-blue-50/50 hover:bg-blue-50 border border-blue-200/80 hover:border-blue-400 transition-all duration-300 shadow-2xs group flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#002147] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#002147] group-hover:text-white transition-all">
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-base sm:text-lg text-[#002147] leading-snug group-hover:text-blue-900 transition-colors">
                        {inst.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-blue-800 font-semibold mt-0.5">
                        {inst.location}
                      </p>
                      <p className="text-xs text-blue-700/80 mt-1 font-medium">
                        {inst.highlight}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Four Pillars of Alumni Engagement — Styled in Blue */}
            <div className="pt-8 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#002147] font-serif">
                Ways Our Alumni Stay Connected &amp; Give Back
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {ENGAGEMENT_PILLARS.map((pillar) => {
                  const PillarIcon = pillar.icon;
                  return (
                    <div
                      key={pillar.title}
                      className="p-6 rounded-2xl bg-white border border-blue-200 shadow-xs hover:shadow-md hover:border-blue-400 transition-all duration-300 space-y-2.5"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-[#002147] flex items-center justify-center">
                        <PillarIcon className="w-5 h-5 text-[#002147]" />
                      </div>
                      <h4 className="font-bold text-lg text-[#002147]">{pillar.title}</h4>
                      <p className="text-sm text-blue-900 leading-relaxed font-normal">
                        {pillar.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reconnect Callout Box — Clean Blue-Tinted White Surface with Blue Lettering */}
            <div className="pt-8">
              <div className="rounded-3xl bg-gradient-to-r from-blue-50/90 via-sky-50/50 to-blue-50/90 border-2 border-blue-200 p-8 sm:p-10 space-y-6 shadow-sm">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-[#002147]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Join the Directory</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#002147] font-serif">
                    Stay Connected with Your Alma Mater
                  </h3>

                  <p className="text-base sm:text-lg text-blue-950 leading-relaxed">
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
          </div>
        </div>
      </section>
    </div>
  );
}
