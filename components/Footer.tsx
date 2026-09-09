import Link from 'next/link';
import { 
  MapPin, 
  Mail, 
  Phone, 
  ExternalLink, 
  ChevronRight, 
  GraduationCap, 
  FlaskConical, 
  Sparkles,
  ArrowUpRight 
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-[#00152e] via-[#000f24] to-[#000a18] text-slate-300 font-sans overflow-hidden">
      {/* Top subtle glow divider */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      {/* Main Content Grid Container */}
      <div className="w-full max-w-[1536px] mx-auto px-6 sm:px-12 lg:px-16 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-14">

          {/* Column 1: Brand, Emblem & Accreditation (5 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-4">
              {/* DOP Atom Logo */}
              <Link href="/" className="inline-block group" aria-label="Department of Physics CUSAT">
                <div className="flex items-center gap-3">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="-12 -12 255 184" 
                    className="h-11 w-auto fill-current text-cyan-accent group-hover:scale-105 transition-transform duration-300 overflow-visible"
                  >
                    <text x="2" y="124" fontFamily="Georgia, 'Times New Roman', serif" fontSize="110" fontWeight="900" fill="currentColor">D</text>
                    <g transform="translate(112, 80)">
                      <ellipse cx="0" cy="0" rx="25" ry="70" stroke="currentColor" strokeWidth="3.5" fill="none" />
                      <ellipse cx="0" cy="0" rx="25" ry="70" stroke="currentColor" strokeWidth="3.5" fill="none" transform="rotate(60)" />
                      <ellipse cx="0" cy="0" rx="25" ry="70" stroke="currentColor" strokeWidth="3.5" fill="none" transform="rotate(-60)" />
                      <circle cx="0" cy="0" r="16" fill="currentColor" />
                    </g>
                    <text x="145" y="124" fontFamily="Georgia, 'Times New Roman', serif" fontSize="110" fontWeight="900" fill="currentColor">P</text>
                  </svg>
                  <div className="border-l border-white/15 pl-3">
                    <span className="font-serif font-extrabold text-white text-base tracking-tight block">Department of Physics</span>
                    <span className="text-[11px] text-cyan-accent font-semibold tracking-wider block">CUSAT • ESTD 1963</span>
                  </div>
                </div>
              </Link>

              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                A premier center for advanced physical sciences, cutting-edge materials research, photonics, and quantum technologies under Cochin University of Science and Technology.
              </p>
            </div>

            {/* Accreditation & Recognition Badges */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block">
                Accreditations &amp; Support
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-accent font-semibold flex items-center gap-1.5 shadow-xs">
                  <Sparkles className="w-3 h-3" />
                  <span>NAAC A+</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 font-medium">
                  NIRF Top 40
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 font-medium">
                  DST-FIST
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 font-medium">
                  UGC-SAP
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links (2.5 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-cyan-accent flex items-center gap-1.5">
              <span>Quick Links</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'About Department', href: '/about' },
                { label: 'Faculty & Scholars', href: '/people' },
                { label: 'Research & Labs', href: '/research' },
                { label: 'Central Facilities', href: '/facilities' },
                { label: 'Publications & Journals', href: '/journals' },
                { label: 'News & Events', href: '/events' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="group inline-flex items-center text-slate-300 hover:text-white transition-colors duration-200"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-accent/60 group-hover:text-cyan-accent group-hover:translate-x-0.5 transition-all mr-1.5 shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Academic Programs (2.5 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-cyan-accent flex items-center gap-1.5">
              <span>Academic Programs</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'M.Sc. Physics (2 Years)', href: '/courses#msc' },
                { label: 'Ph.D. Research Program', href: '/courses#phd' },
                { label: '5-Year Integrated M.Sc.', href: '/courses#integrated' },
                { label: 'Academic Curriculum & CBCS', href: '/courses' },
              ].map((prog) => (
                <li key={prog.label}>
                  <Link 
                    href={prog.href} 
                    className="group inline-flex items-center text-slate-300 hover:text-white transition-colors duration-200"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-accent/60 group-hover:text-cyan-accent group-hover:translate-x-0.5 transition-all mr-1.5 shrink-0" />
                    <span>{prog.label}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <a 
                  href="https://cusat.ac.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1 text-xs font-bold text-cyan-accent hover:text-white transition-colors py-1"
                >
                  <span>CUSAT Main Portal</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Department Reach & Contact (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-cyan-accent flex items-center gap-1.5">
              <span>Contact &amp; Location</span>
            </h4>
            <ul className="space-y-3.5 text-xs text-slate-300">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 text-cyan-accent">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="leading-relaxed text-slate-300">
                  Department of Physics, CUSAT, South Kalamassery, Kochi - 682022, Kerala, India
                </span>
              </li>

              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-cyan-accent">
                  <Phone className="w-4 h-4" />
                </div>
                <a href="tel:+914842577404" className="hover:text-cyan-accent transition-colors font-mono">
                  +91 484 2577404 / 2577401
                </a>
              </li>

              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-cyan-accent">
                  <Mail className="w-4 h-4" />
                </div>
                <a href="mailto:phys@cusat.ac.in" className="hover:text-cyan-accent transition-colors font-mono">
                  phys@cusat.ac.in
                </a>
              </li>
            </ul>

            <div className="pt-2">
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-accent hover:text-white text-xs font-bold transition-all duration-300 shadow-sm"
              >
                <span>Department Inquiry &amp; Map</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex flex-wrap items-center gap-2 text-center sm:text-left">
            <span>© {new Date().getFullYear()} Department of Physics, CUSAT.</span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="text-slate-500">All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
            <Link href="/about" className="hover:text-cyan-accent transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-cyan-accent transition-colors">
              Admissions &amp; Contact
            </Link>
            <Link href="/facilities" className="hover:text-cyan-accent transition-colors">
              Instrumentation
            </Link>
            <a 
              href="https://iqac.cusat.ac.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-cyan-accent transition-colors inline-flex items-center gap-1"
            >
              <span>IQAC</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

