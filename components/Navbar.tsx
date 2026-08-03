'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Atom, ChevronRight } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'People', href: '/people' },
  { name: 'Courses', href: '/courses' },
  { name: 'Research Labs', href: '/research-labs' },
  { name: 'Facilities', href: '/facilities' },
  { name: 'Journals', href: '/journals' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-oxford text-white sticky top-0 z-50 shadow-md border-b border-white/10">
      {/* Top Notification / Crest Bar */}
      <div className="bg-oxford-dark py-1.5 px-4 text-xs font-sans text-slate-300 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-2">
            <span className="bg-cyan-accent text-slate-950 font-bold px-1.5 py-0.5 rounded text-[10px] tracking-wider uppercase">CUSAT</span>
            <span className="text-slate-300">Department of Physics | Cochin University of Science and Technology</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span>NAAC Accredited A+ Grade</span>
            <span>|</span>
            <Link href="https://cusat.ac.in" target="_blank" className="hover:text-cyan-accent transition-colors">
              CUSAT Portal ↗
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Title */}
          <Link id="nav-brand-link" href="/" className="flex items-center space-x-3.5 group">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-cyan-500 to-oxford flex items-center justify-center shadow-lg border border-cyan-400/30 group-hover:scale-105 transition-transform">
              <Atom className="w-7 h-7 text-white animate-spin-slow" />
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                Department of Physics
              </span>
              <span className="block text-xs font-sans tracking-wider uppercase text-cyan-accent/90 font-medium">
                Lumen Academicus • CUSAT
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav id="desktop-navbar" className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative ${
                    isActive
                      ? 'text-cyan-accent font-semibold bg-white/10'
                      : 'text-slate-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-cyan-accent rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden">
            <button
              id="mobile-menu-toggle-btn"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-200 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-cyan-accent" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="lg:hidden bg-oxford-dark border-t border-white/10 px-4 pt-2 pb-6 space-y-1 shadow-2xl">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-cyan-accent/20 text-cyan-accent font-semibold border-l-4 border-cyan-accent'
                    : 'text-slate-200 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
