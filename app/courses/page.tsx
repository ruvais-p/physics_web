import CoursesPageClient from '@/components/CoursesPageClient';
import type { CourseWithSchemes } from '@/components/CourseCard';
import { prisma } from '@/lib/prisma';
import { getPageHero } from '@/lib/page-hero';
import { getCourseOrderFallback } from '@/lib/nav-programmes';

export const revalidate = 300;

export default async function CoursesPage() {
  let courses: CourseWithSchemes[] = [];

  const [records, heroData] = await Promise.all([
    prisma.course.findMany({
      select: {
        id: true,
        code: true,
        title: true,
        level: true,
        duration: true,
        intake: true,
        fees: true,
        eligibility: true,
        description: true,
        highlights: true,
        sortOrder: true,
        schemes: {
          select: { id: true, year: true, scheme: true, pdfUrl: true, sortOrder: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    }).catch((error) => {
      console.error('Failed to fetch courses:', error);
      return [];
    }),
    getPageHero('courses'),
  ]);

  courses = records
    .map((course) => ({
      ...course,
      code: course.code || '',
      intake: course.intake || 0,
      fees: course.fees || '',
      eligibility: course.eligibility || '',
      sortOrder: course.sortOrder ?? 0,
    }))
    .sort((a, b) => {
      if ((a.sortOrder ?? 0) !== (b.sortOrder ?? 0)) {
        return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      }
      return getCourseOrderFallback(a) - getCourseOrderFallback(b);
    });

  return <CoursesPageClient courses={courses} heroData={heroData} />;
}

