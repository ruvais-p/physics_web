export interface ProgrammeNavItem {
  name: string;
  href: string;
}

export const DEFAULT_PROGRAMME_ITEMS: ProgrammeNavItem[] = [
  { name: 'Ph.D. Programme', href: '/courses#phd' },
  { name: 'Integrated M.Sc.', href: '/courses#integrated' },
  { name: 'M.Sc. Physics', href: '/courses#msc' },
  { name: 'M.Tech. Materials', href: '/courses#mtech' },
  { name: 'PG Diploma', href: '/courses#diploma' },
];

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getCourseOrderFallback(course: {
  id: string;
  level?: string | null;
  title?: string | null;
  code?: string | null;
}): number {
  const text = `${course.id} ${course.level || ''} ${course.title || ''} ${course.code || ''}`.toLowerCase();
  if (text.includes('phd') || text.includes('ph.d') || text.includes('doctor')) return 1;
  if (text.includes('integrated') || text.includes('int')) return 2;
  if (text.includes('msc') || text.includes('m.sc') || text.includes('master')) return 3;
  if (text.includes('mtech') || text.includes('m.tech')) return 4;
  if (text.includes('diploma')) return 5;
  return 10;
}

export function getCourseNavInfo(course: {
  id: string;
  title: string;
  level?: string | null;
  code?: string | null;
}): { name: string; href: string; hash: string } {
  const text = `${course.level || ''} ${course.title || ''} ${course.code || ''}`.toLowerCase();

  let hash = slugifyTitle(course.title || '') || course.id.toLowerCase();
  let name = course.title || 'Academic Programme';

  if (text.includes('phd') || text.includes('ph.d') || text.includes('doctor')) {
    hash = 'phd';
    name = course.title || 'Ph.D. Programme';
  } else if (text.includes('integrated') || text.includes('int')) {
    hash = 'integrated';
    name = course.title || 'Integrated M.Sc.';
  } else if (text.includes('msc') || text.includes('m.sc') || text.includes('master')) {
    hash = 'msc';
    name = course.title || 'M.Sc. Physics';
  } else if (text.includes('mtech') || text.includes('m.tech')) {
    hash = 'mtech';
    name = course.title || 'M.Tech. Materials';
  } else if (text.includes('diploma')) {
    hash = 'diploma';
    name = course.title || 'PG Diploma';
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
