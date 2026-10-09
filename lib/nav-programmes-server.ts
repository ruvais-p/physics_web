import { prisma } from '@/lib/prisma';
import {
  DEFAULT_PROGRAMME_ITEMS,
  formatCourseToNavItem,
  getCourseOrderFallback,
  type ProgrammeNavItem,
} from './nav-programmes';

export async function getProgrammesNavItems(): Promise<ProgrammeNavItem[]> {
  try {
    const records = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        level: true,
        code: true,
        sortOrder: true,
      },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });

    if (!records || records.length === 0) {
      return DEFAULT_PROGRAMME_ITEMS;
    }

    const sorted = [...records].sort((a, b) => {
      if ((a.sortOrder ?? 0) !== (b.sortOrder ?? 0)) {
        return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      }
      return getCourseOrderFallback(a) - getCourseOrderFallback(b);
    });

    return sorted.map(formatCourseToNavItem);
  } catch (error) {
    console.error('Failed to fetch programmes nav items in getProgrammesNavItems:', error);
    return DEFAULT_PROGRAMME_ITEMS;
  }
}
