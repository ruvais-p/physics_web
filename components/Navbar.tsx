'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronRight, ChevronDown } from 'lucide-react';

interface SubItem {
  name: string;
  href: string;
}

interface NavItem {
  name: string;
  href: string;
  iconType: 'chevron' | 'dropdown';
  dropdown?: SubItem[];
}

const NAV_ITEMS: NavItem[] = [
  {
    name: 'Home',
    href: '/',
    iconType: 'chevron',
  },
  {
    name: 'About',
    href: '/about',
    iconType: 'chevron',
  },
  {
    name: 'People',
    href: '/people',
    iconType: 'chevron',
  },
  {
    name: 'Courses',
    href: '/courses',
    iconType: 'chevron',
    dropdown: [
      { name: 'M.Sc. Physics', href: '/courses#msc' },
      { name: 'Integrated M.Sc.', href: '/courses#integrated' },
      { name: 'Ph.D. Program', href: '/courses#phd' },
    ],
  },
  {
    name: 'Research',
    href: '/research-labs',
    iconType: 'dropdown',
    dropdown: [
      { name: 'Research Laboratories', href: '/research-labs' },
      { name: 'Journals & Publications', href: '/journals' },
      { name: 'Central Facilities', href: '/facilities' },
    ],
  },
  {
    name: 'Contact',
    href: '/contact',
    iconType: 'chevron',
  },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === '/';
  const forceBlue = !isHome;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const shouldBeBlue = isScrolled || forceBlue;

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Dynamic Top-Attached Navbar Container */}
      <div
        className={`w-full px-6 sm:px-10 py-4 transition-all duration-300 border-b ${shouldBeBlue
          ? 'bg-white/95 backdrop-blur-xl border-cyan-accent/20 shadow-md shadow-oxford-dark/5'
          : 'bg-[#000a1e]/40 backdrop-blur-md border-white/10'
          }`}
      >
        <div className="max-w-[1536px] mx-auto flex items-center justify-between">

          {/* Brand Title with DOP Logo */}
          <Link id="nav-brand-link" href="/" className="flex items-center space-x-3 group">
            <div className="h-9 sm:h-11 w-auto text-cyan-accent group-hover:scale-105 transition-transform duration-300 drop-shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 160" className="h-full w-auto fill-current text-cyan-accent">
                <text x="5" y="120" fontFamily="Georgia, 'Times New Roman', serif" fontSize="110" fontWeight="900" fill="currentColor">D</text>
                <g transform="translate(110, 80)">
                  <ellipse cx="0" cy="0" rx="26" ry="74" stroke="currentColor" strokeWidth="3" fill="none" />
                  <ellipse cx="0" cy="0" rx="26" ry="74" stroke="currentColor" strokeWidth="3" fill="none" transform="rotate(60)" />
                  <ellipse cx="0" cy="0" rx="26" ry="74" stroke="currentColor" strokeWidth="3" fill="none" transform="rotate(-60)" />
                  <circle cx="0" cy="0" r="16" fill="currentColor" />
                </g>
                <text x="150" y="120" fontFamily="Georgia, 'Times New Roman', serif" fontSize="110" fontWeight="900" fill="currentColor">P</text>
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className={`block font-sans text-sm sm:text-base font-bold uppercase tracking-wider leading-tight transition-colors ${shouldBeBlue ? 'text-oxford' : 'text-cyan-accent'
                }`}>
                DEPARTMENT OF PHYSICS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav id="desktop-navbar" className="hidden lg:flex items-center space-x-6 xl:space-x-10">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href.split('#')[0]));
              const hasDropdown = item.dropdown && item.dropdown.length > 0;

              return (
                <div
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() => hasDropdown && setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    id={`nav-link-${item.name.toLowerCase()}`}
                    href={item.href}
                    className={`flex items-center space-x-1 text-base sm:text-lg font-medium transition-colors ${shouldBeBlue
                      ? isActive ? 'text-cyan-accent font-bold' : 'text-oxford hover:text-cyan-accent'
                      : isActive ? 'text-white font-bold drop-shadow' : 'text-white/90 hover:text-cyan-accent'
                      }`}
                  >
                    <span>{item.name}</span>
                    {item.iconType === 'dropdown' ? (
                      <ChevronDown className={`w-4 h-4 transition-transform group-hover:translate-y-0.5 ${shouldBeBlue ? 'text-oxford' : 'text-white/80'
                        }`} />
                    ) : (
                      <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${shouldBeBlue ? 'text-oxford' : 'text-white/80'
                        }`} />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {hasDropdown && activeDropdown === item.name && (
                    <div className="absolute top-full left-0 pt-3 z-50">
                      <div className={`w-64 border rounded-xl shadow-2xl p-2 transition-colors ${shouldBeBlue
                        ? 'bg-white/95 border-slate-200 shadow-xl'
                        : 'bg-slate-900/95 backdrop-blur-2xl border-white/20'
                        }`}>
                        {item.dropdown?.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className={`block px-4 py-2.5 rounded-lg text-sm transition-colors ${shouldBeBlue
                              ? 'text-slate-800 hover:bg-slate-100 hover:text-cyan-accent font-medium'
                              : 'text-slate-200 hover:bg-white/15 hover:text-sky-300'
                              }`}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center">
            <button
              id="mobile-menu-toggle-btn"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg focus:outline-none transition-colors ${shouldBeBlue ? 'text-oxford hover:bg-slate-100' : 'text-white hover:bg-white/20'
                }`}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className={`lg:hidden mt-4 pt-4 border-t space-y-2 ${shouldBeBlue ? 'border-slate-200' : 'border-white/20'
            }`}>
            {NAV_ITEMS.map((item) => (
              <div key={item.name} className="space-y-1">
                <Link
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${shouldBeBlue ? 'text-oxford hover:bg-slate-100' : 'text-white hover:bg-white/20'
                    }`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.name}
                    {item.iconType === 'dropdown' ? (
                      <ChevronDown className="w-4 h-4 opacity-80" />
                    ) : (
                      <ChevronRight className="w-4 h-4 opacity-80" />
                    )}
                  </span>
                </Link>
                {item.dropdown && (
                  <div className={`pl-6 space-y-1 border-l ml-4 ${shouldBeBlue ? 'border-slate-200' : 'border-white/20'
                    }`}>
                    {item.dropdown.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${shouldBeBlue ? 'text-slate-700 hover:text-cyan-accent' : 'text-slate-200 hover:text-white'
                          }`}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </header>
  );
}
