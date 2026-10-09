'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { ProgrammeNavItem } from '@/lib/nav-programmes';

export default function LayoutWrapper({
  children,
  initialProgrammes,
}: {
  children: React.ReactNode;
  initialProgrammes?: ProgrammeNavItem[];
}) {
  const pathname = usePathname();
  const isPortalRoute = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin') || pathname?.startsWith('/faculty') || pathname === '/login';

  // Ensure window always starts at the top when navigating between routes
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [pathname]);

  if (isPortalRoute) {
    return <div className="flex-grow flex flex-col">{children}</div>;
  }

  return (
    <>
      <Navbar initialProgrammes={initialProgrammes} />
      <main className="flex-grow">{children}</main>
      <Footer initialProgrammes={initialProgrammes} />
    </>
  );
}

