import CoursesPageClient from '@/components/CoursesPageClient';
import type { CourseWithSchemes } from '@/components/CourseCard';
import { prisma } from '@/lib/prisma';
import { getPageHero } from '@/lib/page-hero';

export const revalidate = 300;

export const metadata = {
  title: 'Academic Programs & Curriculum | Department of Physics, CUSAT',
  description:
    'Explore doctoral (Ph.D.), postgraduate (M.Sc.), and integrated academic programs, curriculum regulations, and research pathways at the Department of Physics, Cochin University of Science and Technology (CUSAT).',
};

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
        schemes: {
          select: { id: true, year: true, scheme: true, pdfUrl: true, sortOrder: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { id: 'asc' },
    }).catch((error) => {
      console.error('Failed to fetch courses:', error);
      return [];
    }),
    getPageHero('courses'),
  ]);

  const getCourseOrder = (course: { id: string; level?: string | null; title?: string | null; code?: string | null }) => {
    const text = `${course.id} ${course.level || ''} ${course.title || ''} ${course.code || ''}`.toLowerCase();
    if (text.includes('phd') || text.includes('ph.d') || text.includes('doctor') || course.id === 'c2') return 1;
    if (text.includes('msc') || text.includes('m.sc') || text.includes('master') || course.id === 'c1') return 2;
    if (text.includes('integrated') || text.includes('int') || course.id === 'c3') return 3;
    return 4;
  };

  courses = records
    .map((course) => ({
      ...course,
      code: course.code || '',
      intake: course.intake || 0,
      fees: course.fees || '',
      eligibility: course.eligibility || '',
    }))
    .sort((a, b) => getCourseOrder(a) - getCourseOrder(b));

  return <CoursesPageClient courses={courses} heroData={heroData} />;
}

