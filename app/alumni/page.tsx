import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Alumni | Department of Physics, CUSAT',
  description: 'Connect with the global alumni community of the Department of Physics, CUSAT.',
};

export default function AlumniPage() {
  return (
    <div className="pb-24 relative bg-[#000a1e] text-white min-h-screen">
      
      {/* Top Banner (Campus Image Background with Oxford Blue Overlay) */}
      <div className="-mt-[116px] sm:-mt-[128px] relative bg-[#000a1e] text-white overflow-hidden border-b border-white/10">
        {/* Background Image with Dark Blue Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/campus.jpg"
            alt="CUSAT Campus"
            fill
            className="object-cover opacity-35"
            priority
          />
          <div className="absolute inset-0 bg-[#002147]/75 mix-blend-multiply" />
        </div>

        {/* Content (Centered) */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 pt-40 pb-16 sm:pb-20 text-center space-y-3">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase">
            ALUMNI
          </h1>
          
          {/* Centered Breadcrumbs */}
          <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm font-sans font-medium text-slate-300">
            <Link href="/" className="hover:text-cyan-accent transition-colors">Home</Link>
            <span>&gt;</span>
            <span className="text-white font-semibold">Alumni</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 py-16">
        <div className="max-w-4xl space-y-8 text-left">
          {/* Color Accent line */}
          <div className="w-16 h-1 bg-cyan-accent rounded-full" />
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            Our Global Alumni Network
          </h2>
          
          <div className="space-y-6 text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed font-sans font-normal">
            <p>
              Since its inception in 1971, the Department of Physics at CUSAT has nurtured exceptional minds who have gone on to make significant contributions to scientific research, academia, and industry worldwide. Our alumni constitute a vibrant global community of researchers, educators, and technology leaders.
            </p>
            <p>
              Our postgraduates and doctoral researchers have successfully secured faculty positions, postdoctoral fellowships, and research roles at prestigious institutions globally, including:
            </p>
            
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-base font-semibold text-slate-100">
              <li className="flex items-center space-x-2">
                <span className="text-cyan-accent">•</span>
                <span>Max Planck Institutes, Germany</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-cyan-accent">•</span>
                <span>Indian Institute of Science (IISc), Bangalore</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-cyan-accent">•</span>
                <span>Indian Institutes of Technology (IITs)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-cyan-accent">•</span>
                <span>CERN, Switzerland</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-cyan-accent">•</span>
                <span>Raman Research Institute (RRI), Bangalore</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-cyan-accent">•</span>
                <span>TIFR, Mumbai</span>
              </li>
            </ul>

            <p className="pt-6">
              We encourage our alumni to stay connected, mentor current students, and collaborate on cutting-edge research initiatives. If you are a graduate of the department, please reach out to update your contact details and share your professional achievements.
            </p>
          </div>

          <div className="pt-6">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-cyan-accent hover:bg-cyan-dark text-white font-semibold text-sm px-8 py-3.5 rounded-lg shadow-md transition-colors"
            >
              Contact Department Office
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
