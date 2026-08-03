import Link from 'next/link';
import { Atom, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-oxford-dark text-slate-300 border-t border-white/10 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Brand & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-accent flex items-center justify-center text-oxford-dark shadow">
                <Atom className="w-6 h-6" />
              </div>
              <span className="font-serif text-xl font-bold text-white tracking-tight">
                Department of Physics
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Cochin University of Science and Technology (CUSAT). Advancing fundamental physics, materials science, quantum technology, and photonics since 1963.
            </p>
            <div className="pt-2 flex items-center space-x-2 text-xs text-slate-400">
              <span className="bg-white/10 text-cyan-accent px-2 py-1 rounded font-semibold">NAAC A+</span>
              <span className="bg-white/10 text-slate-300 px-2 py-1 rounded">NIRF Top 40</span>
              <span className="bg-white/10 text-slate-300 px-2 py-1 rounded">DST-FIST Supported</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-white mb-4 border-b border-cyan-accent/30 pb-2 inline-block">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-cyan-accent transition-colors flex items-center space-x-1.5">
                  <span>›</span> <span>About Department</span>
                </Link>
              </li>
              <li>
                <Link href="/people" className="hover:text-cyan-accent transition-colors flex items-center space-x-1.5">
                  <span>›</span> <span>Faculty & Scholars</span>
                </Link>
              </li>
              <li>
                <Link href="/research-labs" className="hover:text-cyan-accent transition-colors flex items-center space-x-1.5">
                  <span>›</span> <span>Research Centers & Labs</span>
                </Link>
              </li>
              <li>
                <Link href="/facilities" className="hover:text-cyan-accent transition-colors flex items-center space-x-1.5">
                  <span>›</span> <span>Central Instrumentation</span>
                </Link>
              </li>
              <li>
                <Link href="/journals" className="hover:text-cyan-accent transition-colors flex items-center space-x-1.5">
                  <span>›</span> <span>Publications & Journals</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Academic Programs */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-white mb-4 border-b border-cyan-accent/30 pb-2 inline-block">
              Academics
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/courses#msc" className="hover:text-cyan-accent transition-colors flex items-center space-x-1.5">
                  <span>›</span> <span>M.Sc. Physics (2 Years)</span>
                </Link>
              </li>
              <li>
                <Link href="/courses#phd" className="hover:text-cyan-accent transition-colors flex items-center space-x-1.5">
                  <span>›</span> <span>Ph.D. Research Program</span>
                </Link>
              </li>
              <li>
                <Link href="/courses#integrated" className="hover:text-cyan-accent transition-colors flex items-center space-x-1.5">
                  <span>›</span> <span>Integrated M.Sc. Physics (5 Yrs)</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cyan-accent transition-colors flex items-center space-x-1.5">
                  <span>›</span> <span>Admissions & Eligibility</span>
                </Link>
              </li>
              <li>
                <a href="https://cusat.ac.in" target="_blank" rel="noreferrer" className="hover:text-cyan-accent transition-colors flex items-center space-x-1 text-slate-400">
                  <span>CUSAT Main Portal</span> <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-white mb-4 border-b border-cyan-accent/30 pb-2 inline-block">
              Department Contact
            </h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-cyan-accent shrink-0 mt-1" />
                <span>Department of Physics, CUSAT Campus, Kalamassery, Kochi - 682022, Kerala, India</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-cyan-accent shrink-0" />
                <span>+91 484 2577404 / 2577401</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-cyan-accent shrink-0" />
                <span>phys@cusat.ac.in</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 space-y-4 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} Department of Physics, CUSAT. All rights reserved.
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/about" className="hover:text-white">Privacy Policy</Link>
            <Link href="/about" className="hover:text-white">Terms of Use</Link>
            <Link href="/contact" className="hover:text-white">Reach Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
