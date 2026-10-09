'use client';

import React, { useState, useEffect } from 'react';
import {
  DEFAULT_PROGRAMME_ITEMS,
  formatCourseToNavItem,
  getCourseOrderFallback,
  type ProgrammeNavItem,
} from './nav-programmes';

export function useProgrammes(initial?: ProgrammeNavItem[]): ProgrammeNavItem[] {
  const [programmes, setProgrammes] = useState<ProgrammeNavItem[]>(
    initial && initial.length > 0 ? initial : DEFAULT_PROGRAMME_ITEMS
  );

  useEffect(() => {
    let isMounted = true;
    const fetchProgrammes = async () => {
      try {
        const res = await fetch('/api/courses?t=' + Date.now(), { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const list = Array.isArray(data) ? data : data?.courses;
        if (Array.isArray(list) && list.length > 0) {
          const sorted = [...list].sort((a: any, b: any) => {
            if ((a.sortOrder ?? 0) !== (b.sortOrder ?? 0)) {
              return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
            }
            return getCourseOrderFallback(a) - getCourseOrderFallback(b);
          });
          if (isMounted) setProgrammes(sorted.map(formatCourseToNavItem));
        }
      } catch {}
    };

    fetchProgrammes();
    const handleUpdate = () => fetchProgrammes();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'physics_courses_updated') fetchProgrammes();
    };

    window.addEventListener('courses-updated', handleUpdate);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('courses-updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleUpdate);
    };
  }, []);

  return programmes;
}

export function handleInPageNav(
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
  pathname: string,
  onAfterNav?: () => void
) {
  onAfterNav?.();
  const [targetPathWithQuery, targetHash] = href.split('#');
  const targetPath = targetPathWithQuery.split('?')[0];

  if (pathname === targetPath) {
    if (!targetHash) {
      e.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      if (window.location.hash) window.history.pushState(null, '', targetPath);
    } else {
      const element = document.getElementById(targetHash);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `#${targetHash}`);
      } else {
        window.history.pushState(null, '', `#${targetHash}`);
        window.dispatchEvent(new HashChangeEvent('hashchange'));
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    }
  }
}
