import { prisma } from '@/lib/prisma';

export interface PageHeroConfig {
  pageKey: string;
  pageName: string;
  title: string;
  subtitle: string;
  image: string;
}

export const DEFAULT_PAGE_HEROES: Record<string, PageHeroConfig> = {
  about: {
    pageKey: 'about',
    pageName: 'About Department',
    title: 'ABOUT DEPARTMENT',
    subtitle: '',
    image: '/campus.jpg',
  },
  people: {
    pageKey: 'people',
    pageName: 'Faculty & Scholars',
    title: 'FACULTY & SCHOLARS',
    subtitle: '',
    image: '/faculty.png',
  },
  courses: {
    pageKey: 'courses',
    pageName: 'Programs & Curriculum',
    title: 'ACADEMIC PROGRAMS',
    subtitle: '',
    image: '/campus.jpg',
  },
  research: {
    pageKey: 'research',
    pageName: 'Research & Labs',
    title: 'RESEARCH & INNOVATION',
    subtitle: '',
    image: '/campus.jpg',
  },
  facilities: {
    pageKey: 'facilities',
    pageName: 'Facilities',
    title: 'CENTRAL INSTRUMENTATION FACILITIES',
    subtitle: '',
    image: '/campus.jpg',
  },
  journals: {
    pageKey: 'journals',
    pageName: 'Journals & Publications',
    title: 'PUBLICATIONS & JOURNALS',
    subtitle: '',
    image: '/campus.jpg',
  },
  projects: {
    pageKey: 'projects',
    pageName: 'Projects & Grants',
    title: 'SPONSORED RESEARCH PROJECTS',
    subtitle: '',
    image: '/campus.jpg',
  },
  events: {
    pageKey: 'events',
    pageName: 'Events & Workshops',
    title: 'DEPARTMENT EVENTS',
    subtitle: '',
    image: '/campus.jpg',
  },
  news: {
    pageKey: 'news',
    pageName: 'News & Awards',
    title: 'DEPARTMENT NEWS & AWARDS',
    subtitle: '',
    image: '/campus.jpg',
  },
  announcements: {
    pageKey: 'announcements',
    pageName: 'Announcements & Notices',
    title: 'ANNOUNCEMENTS & NOTICES',
    subtitle: '',
    image: '/campus.jpg',
  },
  contact: {
    pageKey: 'contact',
    pageName: 'Contact & Admissions',
    title: 'CONTACT DEPARTMENT',
    subtitle: '',
    image: '/campus.jpg',
  },
  alumni: {
    pageKey: 'alumni',
    pageName: 'Global Alumni',
    title: 'GLOBAL ALUMNI NETWORK',
    subtitle: '',
    image: '/campus.jpg',
  },
  library: {
    pageKey: 'library',
    pageName: 'Department Library',
    title: 'DEPARTMENT LIBRARY',
    subtitle: '',
    image: '/campus.jpg',
  },
};

export async function getPageHero(pageKey: string): Promise<{
  title: string;
  subtitle: string;
  image: string;
}> {
  const defaults = DEFAULT_PAGE_HEROES[pageKey] || {
    pageKey,
    pageName: pageKey,
    title: pageKey.toUpperCase(),
    subtitle: '',
    image: '/campus.jpg',
  };

  try {
    const pageHero = prisma.pageHero;

    // A server process started before `prisma generate` may briefly retain an
    // older client during hot reload. Defaults keep public pages available.
    if (!pageHero) {
      return {
        title: defaults.title,
        subtitle: defaults.subtitle,
        image: defaults.image,
      };
    }

    const record = await pageHero.findUnique({
      where: { pageKey },
      select: { title: true, subtitle: true, image: true },
    });

    if (record) {
      return {
        title: record.title || defaults.title,
        subtitle: record.subtitle !== null && record.subtitle !== undefined ? record.subtitle : defaults.subtitle,
        image: record.image || defaults.image,
      };
    }
  } catch (error) {
    console.error(`Failed to fetch page hero for "${pageKey}":`, error);
  }

  return {
    title: defaults.title,
    subtitle: defaults.subtitle,
    image: defaults.image,
  };
}
