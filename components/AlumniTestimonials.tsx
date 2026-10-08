import React from 'react';

export interface Testimonial {
  id: string;
  name: string;
  degree: string;
  category: 'academia' | 'space' | 'industry' | 'optics';
  currentRole: string;
  institution: string;
  location: string;
  specialization: string;
  quote: string;
  year: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Dr. Anandhu R. Nair',
    degree: 'M.Sc. Physics & Ph.D.',
    year: 'Class of 2018',
    category: 'academia',
    currentRole: 'Postdoctoral Research Fellow',
    institution: 'Max Planck Institute of Quantum Optics',
    location: 'Munich, Germany',
    specialization: 'Quantum Optics & Laser Spectroscopy',
    quote:
      'The rigorous theoretical foundation and hands-on laboratory culture at the CUSAT Department of Physics laid the foundation for my international research. Mentorship from our professors went far beyond textbooks—they nurtured the intellectual courage to formulate bold, fundamental questions.',
  },
  {
    id: 't2',
    name: 'Dr. Priya S. Warrier',
    degree: 'M.Sc. Physics',
    year: 'Class of 2015',
    category: 'space',
    currentRole: 'Senior Scientist / Engineer',
    institution: 'ISRO Satellite Centre (URSC)',
    location: 'Bengaluru, India',
    specialization: 'Space Instrumentation & Thin Films',
    quote:
      'My formative postgraduate years at CUSAT instilled a profound reverence for experimental physics. Working with high-vacuum deposition and material characterization systems in the department directly enabled me to contribute to optical payload sensors for interplanetary missions.',
  },
  {
    id: 't3',
    name: 'Prof. Rajesh K. Menon',
    degree: 'Ph.D. in Condensed Matter',
    year: 'Class of 2012',
    category: 'academia',
    currentRole: 'Associate Professor of Physics',
    institution: 'Indian Institute of Technology (IIT) Madras',
    location: 'Chennai, India',
    specialization: 'Magnetism & Spintronics',
    quote:
      'CUSAT Physics is an exceptional incubator of intellectual curiosity. The department’s colloquia, research conferences, and open-door faculty culture provided me with the academic rigor and resilience required to build an independent research lab today.',
  },
  {
    id: 't4',
    name: 'Meghna V. Pillai',
    degree: 'Integrated M.Sc. Physics',
    year: 'Class of 2020',
    category: 'optics',
    currentRole: 'Staff Optical Systems Engineer',
    institution: 'ASML Semiconductor',
    location: 'Veldhoven, Netherlands',
    specialization: 'EUV Lithography & Laser Metrology',
    quote:
      'Bridging electromagnetic theory with laser physics at CUSAT gave me an immediate competitive advantage in next-generation extreme ultraviolet semiconductor manufacturing. The analytical mindset cultivated in Kochi is universally respected across global tech leaders.',
  },
  {
    id: 't5',
    name: 'Dr. Thomas George',
    degree: 'M.Sc. Physics',
    year: 'Class of 2017',
    category: 'academia',
    currentRole: 'Research Physicist',
    institution: 'CERN (Large Hadron Collider)',
    location: 'Geneva, Switzerland',
    specialization: 'High Energy Particle Physics',
    quote:
      'From advanced quantum mechanics to statistical modeling of particle detectors, the preparation I received at CUSAT was world-class. The department continuously inspired us to transcend boundaries and compete on the foremost global scientific platforms.',
  },
  {
    id: 't6',
    name: 'Dr. Lakshmi Jayakumar',
    degree: 'Ph.D. in Nanotechnology',
    year: 'Class of 2017',
    category: 'industry',
    currentRole: 'Lead Material Scientist',
    institution: 'Applied Materials Inc.',
    location: 'Santa Clara, USA',
    specialization: 'Nanostructured Energy Materials',
    quote:
      'Direct access to cutting-edge analytical tools like FE-SEM, XRD, and micro-Raman at CUSAT prepared me seamlessly for advanced industrial R&D. The work ethic, precision, and collaboration learned in our laboratories guide my work every single day.',
  },
];

export default function AlumniTestimonials() {
  return (
    <section id="alumni-testimonials" className="w-full py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#002147] font-serif">
            A Legacy of Excellence          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1.5 max-w-2xl">
            Firsthand reflections from department graduates advancing research, technology, and education across the globe.
          </p>
        </div>

        {/* 3 cards in a row (1 column on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {TESTIMONIALS.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow flex flex-col justify-between text-left"
            >
              <div>
                <blockquote className="border-l-2 border-gray-300 pl-3.5 text-sm text-gray-700 leading-relaxed font-sans">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 text-sm leading-snug">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-600 mt-0.5 font-medium">
                  {item.currentRole}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {item.institution}, {item.location}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {item.degree} &middot; {item.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
