export interface ProgrammeNavItem {
  name: string;
  href: string;
}

export const DEFAULT_PROGRAMME_ITEMS: ProgrammeNavItem[] = [
  { name: 'Integrated M.Sc.', href: '/courses#integrated' },
  { name: 'M.Sc. Physics', href: '/courses#msc' },
  { name: 'Ph.D. Programme', href: '/courses#phd' },
  { name: 'M.Tech. Materials', href: '/courses#mtech' },
  { name: 'PG Diploma', href: '/courses#diploma' },
];

export function getCourseOrderFallback(course: {
  id: string;
  level?: string | null;
  title?: string | null;
  code?: string | null;
}): number {
  const text = `${course.id} ${course.level || ''} ${course.title || ''} ${course.code || ''}`.toLowerCase();
  if (text.includes('integrated') || text.includes('int') || course.id === 'c3') return 1;
  if (text.includes('msc') || text.includes('m.sc') || text.includes('master') || course.id === 'c1') return 2;
  if (text.includes('phd') || text.includes('ph.d') || text.includes('doctor') || course.id === 'c2') return 3;
  if (text.includes('mtech') || text.includes('m.tech') || course.id === 'c4') return 4;
  if (text.includes('diploma') || course.id === 'c5') return 5;
  return 6;
}

export function getCourseNavInfo(course: {
  id: string;
  title: string;
  level?: string | null;
  code?: string | null;
}): { name: string; href: string; hash: string } {
  const text = `${course.id} ${course.level || ''} ${course.title || ''} ${course.code || ''}`.toLowerCase();

  let name = course.title || 'Academic Programme';
  let hash = course.id;

  if (text.includes('integrated') || course.id === 'c3') {
    name = course.id === 'c3' ? 'Integrated M.Sc.' : name;
    hash = 'integrated';
  } else if (text.includes('phd') || text.includes('ph.d') || course.id === 'c2') {
    name = course.id === 'c2' ? 'Ph.D. Programme' : name;
    hash = 'phd';
  } else if (text.includes('msc') || text.includes('m.sc') || course.id === 'c1') {
    name = course.id === 'c1' ? 'M.Sc. Physics' : name;
    hash = 'msc';
  } else if (text.includes('mtech') || text.includes('m.tech') || course.id === 'c4') {
    name = course.id === 'c4' ? 'M.Tech. Materials' : name;
    hash = 'mtech';
  } else if (text.includes('diploma') || course.id === 'c5') {
    name = course.id === 'c5' ? 'PG Diploma' : name;
    hash = 'diploma';
  }

  return { name, href: `/courses#${hash}`, hash };
}

export function formatCourseToNavItem(course: {
  id: string;
  title: string;
  level?: string | null;
  code?: string | null;
}): ProgrammeNavItem {
  const info = getCourseNavInfo(course);
  return { name: info.name, href: info.href };
}
