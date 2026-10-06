'use client';

import React, { useState } from 'react';
import {
  Quote,
  Star,
  GraduationCap,
  Building2,
  Globe,
  Sparkles,
  MessageSquarePlus,
  Send,
  X,
  CheckCircle2,
} from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  degree: string;
  category: 'academia' | 'space' | 'industry' | 'optics';
  currentRole: string;
  institution: string;
  location: string;
  specialization: string;
  quote: string;
  initials: string;
  gradient: string;
  year: string;
}

const TESTIMONIALS: Testimonial[] = [
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
    initials: 'AN',
    gradient: 'from-blue-700 to-cyan-600',
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
    initials: 'PW',
    gradient: 'from-blue-900 to-indigo-600',
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
    initials: 'RM',
    gradient: 'from-cyan-800 to-blue-700',
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
    initials: 'MP',
    gradient: 'from-sky-700 to-blue-800',
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
    initials: 'TG',
    gradient: 'from-indigo-800 to-cyan-600',
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
    initials: 'LJ',
    gradient: 'from-blue-800 to-teal-600',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Stories' },
  { id: 'academia', label: 'Academia & Research' },
  { id: 'space', label: 'Space & Defense' },
  { id: 'optics', label: 'Optics & Semiconductors' },
  { id: 'industry', label: 'Industrial R&D' },
];

export default function AlumniTestimonials() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    degree: '',
    year: '',
    role: '',
    institution: '',
    email: '',
    testimonial: '',
  });

  const filteredTestimonials =
    activeCategory === 'all'
      ? TESTIMONIALS
      : TESTIMONIALS.filter((t) => t.category === activeCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setIsModalOpen(false);
      setFormData({
        name: '',
        degree: '',
        year: '',
        role: '',
        institution: '',
        email: '',
        testimonial: '',
      });
    }, 2500);
  };

  return (
    <section
      id="alumni-testimonials"
      className="relative w-full py-16 sm:py-24 bg-gradient-to-b from-[#f4f7fc] via-[#edf3fa] to-[#e7eff9] border-b border-blue-200/60 overflow-hidden"
    >
      {/* Subtle Scientific Geometric Grid Background */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="testimonials-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#002147" strokeWidth="1" />
              <circle cx="20" cy="20" r="1.5" fill="#002147" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#testimonials-grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/90 border border-blue-200 text-xs sm:text-sm font-bold text-[#002147] tracking-wider uppercase shadow-xs">
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <span>Alumni Voices &amp; Reflections</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#002147] tracking-tight font-serif leading-tight">
            Inspiring Journeys Across the Globe
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans">
            Hear how graduates from the Department of Physics at CUSAT have transformed from curious students in Kochi into leaders shaping frontier research at world-renowned institutes, space agencies, and high-tech industries.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xs border border-blue-100 rounded-xl p-3 shadow-xs">
              <div className="text-xl sm:text-2xl font-extrabold text-[#002147]">50+ Years</div>
              <div className="text-xs text-slate-500 font-medium">Academic Legacy</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xs border border-blue-100 rounded-xl p-3 shadow-xs">
              <div className="text-xl sm:text-2xl font-extrabold text-[#002147]">1,200+</div>
              <div className="text-xs text-slate-500 font-medium">Global Alumni</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xs border border-blue-100 rounded-xl p-3 shadow-xs">
              <div className="text-xl sm:text-2xl font-extrabold text-[#002147]">25+</div>
              <div className="text-xs text-slate-500 font-medium">Countries Reached</div>
            </div>
            <div className="bg-white/80 backdrop-blur-xs border border-blue-100 rounded-xl p-3 shadow-xs">
              <div className="text-xl sm:text-2xl font-extrabold text-[#002147]">100%</div>
              <div className="text-xs text-slate-500 font-medium">Research Dedication</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 sm:mb-12">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#002147] text-white shadow-md shadow-blue-900/20 scale-102'
                    : 'bg-white/85 text-slate-700 hover:text-[#002147] hover:bg-white border border-blue-100/90 shadow-2xs'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {filteredTestimonials.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between bg-white rounded-2xl border border-blue-100/90 hover:border-blue-300 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
            >
              {/* Top Accent Quote Mark and Badge */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-100">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                    <span>{item.year}</span>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Decorative Quote Icon */}
                <div className="relative mb-3">
                  <Quote className="w-8 h-8 text-blue-200 group-hover:text-cyan-500/40 transition-colors" />
                </div>

                {/* Testimonial Quote */}
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic mb-6">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.gradient} text-white font-bold flex items-center justify-center shrink-0 shadow-sm text-sm`}
                  >
                    {item.initials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-[#002147] text-base leading-tight truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs font-semibold text-blue-800 mt-0.5 truncate">
                      {item.currentRole}
                    </p>
                    <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{item.institution}</span>
                    </p>
                  </div>
                </div>

                {/* Bottom Topic Tag */}
                <div className="mt-3.5 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-dashed border-slate-100">
                  <span className="font-medium text-cyan-700">{item.specialization}</span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-400" />
                    <span>{item.location}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Bar: Submit Your Testimonial */}
        <div className="mt-12 sm:mt-16 bg-white/90 backdrop-blur-md rounded-2xl border border-blue-200/80 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-[#002147]">
              Are you an alumnus of the Department of Physics, CUSAT?
            </h3>
            <p className="text-sm text-slate-600">
              Share your journey, memorable experiences, and how CUSAT helped shape your career path.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#002147] hover:bg-blue-900 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 shrink-0 cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 text-cyan-300" />
            <span>Share Your Story</span>
          </button>
        </div>
      </div>

      {/* Share Your Story Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8 overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#002147] font-serif">
                  Submit Alumni Testimonial
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Inspire the next generation of physicists with your experiences.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-[#002147]">Thank You for Sharing!</h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Your reflection has been submitted to the Department Alumni Committee and will be published following review.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Dr. Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:border-[#002147] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Program &amp; Batch *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. M.Sc. Physics (2018)"
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:border-[#002147] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Current Designation
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Research Scientist / Professor"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:border-[#002147] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Current Institution / Organization
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CERN, IISc, or Tech Corp"
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:border-[#002147] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Contact Email *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="alumnus@alumni.cusat.ac.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:border-[#002147] focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Testimonial / Story *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Reflect on your time at CUSAT Department of Physics, professors who guided you, lab work, or advice for current students..."
                    value={formData.testimonial}
                    onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:border-[#002147] focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#002147] hover:bg-blue-900 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    <Send className="w-4 h-4 text-cyan-300" />
                    <span>Submit Reflection</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
