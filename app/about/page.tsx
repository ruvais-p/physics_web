import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'About Department',
  description: 'History and overview of the Department of Physics, CUSAT.',
};

export default function AboutPage() {
  return (
    <div className="pb-24 relative">
      
      {/* Top Banner (Campus Image Background with Oxford Blue Overlay) */}
      <div className="-mt-[116px] sm:-mt-[128px] relative bg-slate-900 text-white overflow-hidden">
        {/* Background Image with Dark Blue Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/campus.jpg"
            alt="CUSAT Campus"
            fill
            className="object-cover opacity-45"
            priority
          />
          <div className="absolute inset-0 bg-oxford/75 mix-blend-multiply" />
        </div>

        {/* Content (Centered) */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 pt-36 pb-16 sm:pb-20 text-center space-y-3">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase">
            ABOUT
          </h1>
          
          {/* Centered Breadcrumbs */}
          <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm font-sans font-medium text-slate-300">
            <Link href="/" className="hover:text-cyan-accent transition-colors">Home</Link>
            <span>&gt;</span>
            <span className="text-white font-semibold">About</span>
          </div>
        </div>
      </div>

      {/* Main Content Area: Simplified, Clean, left-aligned, large text */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 py-16">
        <div className="max-w-4xl space-y-6 text-left">
          {/* Color Accent line */}
          <div className="w-16 h-1 bg-cyan-accent rounded-full" />
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-oxford">
            About us
          </h2>
          
          <div className="space-y-6 text-base sm:text-lg lg:text-xl text-slate-700 leading-relaxed font-sans font-normal">
            <p>
              The Department of Physics was founded in 1963 as a department of the University of Kerala at Ernakulam, and later became a constituent department of Cochin University of Science and Technology (CUSAT) upon its establishment in 1971.
            </p>
            <p>
              Over the last six decades, the department has grown into a major hub for physical science research in South India, securing DST-FIST, UGC-SAP, and DAE-BRNS assistance. Today, our research laboratories house sophisticated analytical tools such as FE-SEM, XRD, micro-Raman, and low-temperature VSM systems.
            </p>
            <p>
              The department has pioneered research in magnetic nanocomposites, quantum optics, thin film photovoltaics, and theoretical cosmology. We have successfully completed numerous research projects sponsored by national agencies including DST, UGC, DAE, CSIR, and ISRO.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
