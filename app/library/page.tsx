import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Library | Department of Physics, CUSAT',
  description: 'Explore library resources, reference collections, and digital access portals at the Department of Physics, CUSAT.',
};

export default function LibraryPage() {
  return (
    <div className="pb-24 relative bg-[#000a1e] text-white min-h-screen">
      
      {/* Top Banner (Campus Image Background with Dark Overlay) */}
      <div className="-mt-[116px] sm:-mt-[128px] relative w-full bg-slate-900 text-white overflow-hidden min-h-[620px] sm:min-h-[720px] lg:min-h-[780px] flex items-center justify-center border-b border-white/10">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/campus.jpg"
            alt="CUSAT Campus"
            fill
            className="object-cover opacity-35"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Top Left Breadcrumbs */}
        <div className="absolute top-36 sm:top-40 left-6 sm:left-12 lg:left-16 z-20 flex items-center space-x-2 text-xl sm:text-2xl font-sans font-semibold text-slate-300">
          <Link href="/" className="hover:text-cyan-accent transition-colors">Home</Link>
          <span>&gt;</span>
          <span className="text-white font-bold">Library</span>
        </div>

        {/* Hero Title (Centered) */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 text-center space-y-4 pt-12">
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white uppercase drop-shadow-md">
            LIBRARY
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 py-16">
        <div className="max-w-4xl space-y-8 text-left">
          {/* Color Accent line */}
          <div className="w-16 h-1 bg-cyan-accent rounded-full" />
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            Departmental Library & Reference Center
          </h2>
          
          <div className="space-y-6 text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed font-sans font-normal">
            <p>
              The Department of Physics Library serves as a vital repository of knowledge, supporting the academic and research endeavors of our M.Sc., Integrated M.Sc., and Ph.D. students. The library houses an extensive collection of specialized literature across theoretical and experimental physics.
            </p>
            
            <h3 className="text-2xl font-bold text-white pt-4">Our Resources</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base font-semibold text-slate-100">
              <li className="flex items-center space-x-2">
                <span className="text-cyan-accent">✦</span>
                <span>Over 5,000 reference textbooks</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-cyan-accent">✦</span>
                <span>Subscriptions to leading physics journals</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-cyan-accent">✦</span>
                <span>Archived M.Sc. dissertations & Ph.D. theses</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-cyan-accent">✦</span>
                <span>High-speed digital terminal workstation</span>
              </li>
            </ul>

            <h3 className="text-2xl font-bold text-white pt-4">Digital Library Subscriptions</h3>
            <p>
              Through the CUSAT campus-wide network, library users have remote and on-site access to premium online resources including:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-base text-slate-300">
              <li className="flex items-center space-x-2">
                <span className="text-cyan-accent">•</span>
                <span>American Physical Society (APS) Journals</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-cyan-accent">•</span>
                <span>Institute of Physics (IOP) Publishing</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-cyan-accent">•</span>
                <span>Elsevier ScienceDirect & SpringerLink</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-cyan-accent">•</span>
                <span>IEEE Xplore Digital Library</span>
              </li>
            </ul>

            <div className="bg-white/5 p-6 rounded-xl border border-white/10 mt-6 space-y-3">
              <h4 className="text-lg font-bold text-white">Operating Details</h4>
              <div className="text-sm text-slate-300 space-y-1">
                <p><strong>Timing:</strong> Monday to Friday, 9:00 AM – 4:30 PM (IST)</p>
                <p><strong>Closed on:</strong> Saturdays, Sundays, and public holidays</p>
                <p><strong>Access:</strong> Physics department identity cards are required for borrowing privileges.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
