import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCourseNavInfo } from '@/lib/nav-programmes';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { id } = await params;
  let course = await prisma.course.findUnique({
    where: { id },
    select: { id: true, title: true, level: true, code: true },
  });

  if (!course) {
    const allCourses = await prisma.course.findMany({
      select: { id: true, title: true, level: true, code: true },
    });
    course =
      allCourses.find((c) => {
        const info = getCourseNavInfo(c);
        return (
          c.id.toLowerCase() === id.toLowerCase() ||
          info.hash.toLowerCase() === id.toLowerCase() ||
          (c.code && c.code.toLowerCase() === id.toLowerCase())
        );
      }) || null;
  }

  if (!course) {
    notFound();
  }

  const { hash } = getCourseNavInfo(course);
  redirect(`/courses#${hash}`);
}
