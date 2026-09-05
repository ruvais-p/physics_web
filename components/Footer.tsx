import Link from 'next/link';
import { MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-oxford-dark text-slate-300 border-t border-white/10 pt-16 pb-12 font-sans">
      <div className="w-full px-6 sm:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Column 1: Brand & Philosophy */}
          <div className="space-y-4">
            <div>
              {/* DOP Atom Logo (Unboxed) */}
              <Link href="/" className="inline-block text-cyan-accent hover:opacity-90 transition-opacity" aria-label="DOP Home">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 160" className="h-12 w-auto fill-current text-cyan-accent">
                  <text x="5" y="120" fontFamily="Georgia, 'Times New Roman', serif" fontSize="110" fontWeight="900" fill="currentColor">D</text>
                  <g transform="translate(110, 80)">
                    <ellipse cx="0" cy="0" rx="26" ry="74" stroke="currentColor" strokeWidth="3" fill="none" />
                    <ellipse cx="0" cy="0" rx="26" ry="74" stroke="currentColor" strokeWidth="3" fill="none" transform="rotate(60)" />
                    <ellipse cx="0" cy="0" rx="26" ry="74" stroke="currentColor" strokeWidth="3" fill="none" transform="rotate(-60)" />
                    <circle cx="0" cy="0" r="16" fill="currentColor" />
                  </g>
                  <text x="150" y="120" fontFamily="Georgia, 'Times New Roman', serif" fontSize="110" fontWeight="900" fill="currentColor">P</text>
                </svg>
              </Link>
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-white tracking-tight">
                Department of Physics
              </h3>
              <p className="text-xs text-cyan-accent font-semibold">Cochin University of Science and Technology</p>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed text-justify">
              Advancing fundamental physics, materials science, quantum technology, and photonics since 1963.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs text-slate-400">
              <span className="bg-white/10 text-cyan-accent px-2 py-1 rounded font-semibold">NAAC A+</span>
              <span className="bg-white/10 text-slate-300 px-2 py-1 rounded">NIRF Top 40</span>
              <span className="bg-white/10 text-slate-300 px-2 py-1 rounded">DST-FIST</span>
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
                <Link href="/research" className="hover:text-cyan-accent transition-colors flex items-center space-x-1.5">
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

          {/* Column 4: Contact & Google Map Location */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-semibold text-white mb-2 border-b border-cyan-accent/30 pb-2 inline-block">
              Campus Location & Contact
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-cyan-accent shrink-0 mt-0.5" />
                <span>Department of Physics, CUSAT, Kalamassery, Kochi - 682022, Kerala, India</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-cyan-accent shrink-0" />
                <span>+91 484 2577404 / 2577401</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-cyan-accent shrink-0" />
                <span>phys@cusat.ac.in</span>
              </li>
            </ul>

            {/* Interactive Embedded Google Map */}
            <div className="pt-2">
              <div className="w-full h-36 rounded-xl overflow-hidden border border-white/20 shadow-lg relative group">
                <iframe
                  title="Department of Physics CUSAT Google Map Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.6534591461974!2d76.32483837494498!3d10.04543949006198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080c361eb00001%3A0xe54e60e81c00fdfb!2sDepartment%20of%20Physics%2C%20CUSAT!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'contrast(1.05) brightness(0.95)' }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                href="https://www.google.com/maps/place/Department+of+Applied+Chemistry+and+Department+of+Physics+,+CUSAT/@10.0459694,76.3265267,17.8z/data=!4m6!3m5!1s0x3b080c370e2c0b3b:0x83497fa6cb0e123a!8m2!3d10.044099!4d76.327021!16s%2Fg%2F1vjdnhd_?hl=en&entry=ttu&g_ep=EgoyMDI2MDcyOS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center space-x-1 text-[11px] font-semibold text-cyan-accent hover:underline"
              >
                <MapPin className="w-3 h-3" />
                <span>Open in Google Maps</span>
              </a>
            </div>
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
