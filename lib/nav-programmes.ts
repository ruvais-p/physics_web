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
  if (course.id === 'c2') return 1;
  if (course.id === 'c3') return 2;
  if (course.id === 'c1') return 3;
  if (course.id === 'c4') return 4;
  if (course.id === 'c5') return 5;

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
  // 1. Explicit core course mappings by fixed ID
  if (course.id === 'c2') {
    return { name: 'Ph.D. Programme', href: '/courses#phd', hash: 'phd' };
  }
  if (course.id === 'c3') {
    return { name: 'Integrated M.Sc.', href: '/courses#integrated', hash: 'integrated' };
  }
  if (course.id === 'c1') {
    return { name: 'M.Sc. Physics', href: '/courses#msc', hash: 'msc' };
  }
  if (course.id === 'c4') {
    return { name: 'M.Tech. Materials', href: '/courses#mtech', hash: 'mtech' };
  }
  if (course.id === 'c5') {
    return { name: 'PG Diploma', href: '/courses#diploma', hash: 'diploma' };
  }

  // 2. Dynamic / CMS-created courses: use clean unique slug from title, fallback to course ID
  const name = course.title || 'Academic Programme';
  const slug = slugifyTitle(course.title || '') || course.id.toLowerCase();
  const hash = slug;

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
