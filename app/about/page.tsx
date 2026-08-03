import Hero from '@/components/Hero';
import Image from 'next/image';
import { ShieldCheck, Award, Target, Eye, Landmark, Compass } from 'lucide-react';

export const metadata = {
  title: 'About Department',
  description: 'History, Vision, Mission, and Head of Department message - Department of Physics, CUSAT.',
};

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero */}
      <Hero
        badge="ABOUT OUR DEPARTMENT"
        title="Six Decades of Scientific Pursuit & Pedagogical Mastery"
        subtitle="Established in 1963, the Department of Physics at CUSAT has pioneered research in magnetic nanocomposites, quantum optics, thin film photovoltaics, and theoretical cosmology."
        bgImage="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1600&q=80"
      />

      {/* Vision & Mission Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Vision */}
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover-lift space-y-4">
            <div className="w-12 h-12 rounded-lg bg-surface-low text-oxford flex items-center justify-center">
              <Eye className="w-6 h-6 text-cyan-accent" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-oxford">Department Vision</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              To emerge as a globally recognized center of excellence in physics education and fundamental & applied research, fostering innovative scientific thinking, social responsibility, and interdisciplinary technological breakthroughs.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover-lift space-y-4">
            <div className="w-12 h-12 rounded-lg bg-surface-low text-oxford flex items-center justify-center">
              <Target className="w-6 h-6 text-cyan-accent" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-oxford">Department Mission</h2>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start space-x-2">
                <span className="text-cyan-accent font-bold">•</span>
                <span>Impart world-class postgraduate physics education rooted in deep analytical intuition.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-cyan-accent font-bold">•</span>
                <span>Conduct cutting-edge research in emerging frontiers of condensed matter, photonics, and cosmology.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-cyan-accent font-bold">•</span>
                <span>Collaborate with premier national and international laboratories for technological innovation.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Head of Department Message */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface-low rounded-2xl p-8 lg:p-12 border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center gap-10">
          <div className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-xl overflow-hidden shrink-0 shadow-lg border-2 border-white">
            <Image
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80"
              alt="Dr. B. Pradeep, Head of Department"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-4">
            <span className="text-xs font-bold text-cyan-accent uppercase tracking-widest block">
              MESSAGE FROM THE HEAD OF DEPARTMENT
            </span>
            <h2 className="font-serif text-3xl font-bold text-oxford">
              Welcome to the Department of Physics, CUSAT
            </h2>
            <blockquote className="text-sm sm:text-base text-slate-700 italic leading-relaxed font-serif">
              "Physics is not merely a subject; it is the fundamental language of nature. For over 60 years, our department has nurtured generations of scholars, researchers, and scientific leaders who continue to shape academia and industry worldwide."
            </blockquote>
            <div className="pt-2">
              <span className="font-bold text-oxford block text-base">Dr. B. Pradeep</span>
              <span className="text-xs text-slate-500 font-sans">Professor & Head of Department</span>
            </div>
          </div>
        </div>
      </section>

      {/* History & Genesis */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="font-serif text-3xl font-bold text-oxford text-center">
            Departmental History & Evolution
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            The Department of Physics was founded in 1963 as part of the university center of the University of Kerala at Ernakulam, and later integrated into the Cochin University of Science and Technology upon its establishment in 1971.
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Over the decades, the department has grown into a major hub for physical science research in South India, securing DST-FIST, UGC-SAP, and DAE-BRNS assistance. Today, our research laboratories house sophisticated analytical tools such as FE-SEM, XRD, micro-Raman, and low-temperature VSM systems.
          </p>
        </div>
      </section>

      {/* Accreditations & Recognitions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-oxford text-white rounded-xl p-8 lg:p-10 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <Award className="w-10 h-10 text-cyan-accent mx-auto" />
              <h3 className="font-serif text-xl font-bold">NAAC A+ Grade</h3>
              <p className="text-xs text-slate-300">
                Accredited with highest academic grade by National Assessment and Accreditation Council.
              </p>
            </div>
            <div className="space-y-2">
              <Landmark className="w-10 h-10 text-cyan-accent mx-auto" />
              <h3 className="font-serif text-xl font-bold">DST-FIST Level II</h3>
              <p className="text-xs text-slate-300">
                Supported by Department of Science & Technology for advanced research infrastructure.
              </p>
            </div>
            <div className="space-y-2">
              <Compass className="w-10 h-10 text-cyan-accent mx-auto" />
              <h3 className="font-serif text-xl font-bold">Global Alumni Network</h3>
              <p className="text-xs text-slate-300">
                Alumni holding faculty and research scientist positions in Ivy League, Max Planck, and ISRO.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
