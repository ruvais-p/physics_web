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
    subtitle: 'Advancing fundamental physics, materials science, quantum technology, and photonics since 1963.',
    image: '/campus.jpg',
  },
  people: {
    pageKey: 'people',
    pageName: 'Faculty & Scholars',
    title: 'FACULTY & SCHOLARS',
    subtitle: 'Meet our Head of Department, distinguished professors, principal investigators, and doctoral research scholars.',
    image: '/faculty.png',
  },
  courses: {
    pageKey: 'courses',
    pageName: 'Programs & Curriculum',
    title: 'ACADEMIC PROGRAMS',
    subtitle: 'Choice-Based Credit System (CBCS) offering M.Sc., Ph.D., and 5-Year Integrated M.Sc. degree programs.',
    image: '/campus.jpg',
  },
  research: {
    pageKey: 'research',
    pageName: 'Research & Labs',
    title: 'RESEARCH & INNOVATION',
    subtitle: 'Theoretical & Experimental frontiers across Quantum Physics, Photonics, Materials, and Cosmology.',
    image: '/campus.jpg',
  },
  facilities: {
    pageKey: 'facilities',
    pageName: 'Central Facilities',
    title: 'CENTRAL INSTRUMENTATION FACILITIES',
    subtitle: 'State-of-the-art analytical instrumentation supporting cutting-edge experimental physics research.',
    image: '/campus.jpg',
  },
  journals: {
    pageKey: 'journals',
    pageName: 'Journals & Publications',
    title: 'PUBLICATIONS & JOURNALS',
    subtitle: 'Peer-reviewed research articles, high-impact journals, and departmental scientific publications.',
    image: '/campus.jpg',
  },
  projects: {
    pageKey: 'projects',
    pageName: 'Projects & Grants',
    title: 'SPONSORED RESEARCH PROJECTS',
    subtitle: 'Extramural research grants funded by DST, UGC, CSIR, DAE-BRNS, and national funding bodies.',
    image: '/campus.jpg',
  },
  events: {
    pageKey: 'events',
    pageName: 'Events & Workshops',
    title: 'DEPARTMENT EVENTS',
    subtitle: 'National seminars, international web-symposiums, technical workshops, and endowment lectures.',
    image: '/campus.jpg',
  },
  news: {
    pageKey: 'news',
    pageName: 'News & Awards',
    title: 'DEPARTMENT NEWS & AWARDS',
    subtitle: 'Latest updates on scientific breakthroughs, prestigious faculty accolades, research awards, and press releases.',
    image: '/campus.jpg',
  },
  announcements: {
    pageKey: 'announcements',
    pageName: 'Announcements & Notices',
    title: 'ANNOUNCEMENTS & NOTICES',
    subtitle: 'Official circulars, examination schedules, academic notifications, and departmental announcements.',
    image: '/campus.jpg',
  },
  contact: {
    pageKey: 'contact',
    pageName: 'Contact & Admissions',
    title: 'CONTACT DEPARTMENT',
    subtitle: 'Department of Physics, Cochin University of Science and Technology (CUSAT), Kochi - 682022.',
    image: '/campus.jpg',
  },
  alumni: {
    pageKey: 'alumni',
    pageName: 'Global Alumni',
    title: 'GLOBAL ALUMNI NETWORK',
    subtitle: 'Since 1971, nurturing exceptional minds making significant contributions across academia, research labs, and industry worldwide.',
    image: '/campus.jpg',
  },
  library: {
    pageKey: 'library',
    pageName: 'Department Library',
    title: 'DEPARTMENT LIBRARY',
    subtitle: 'Over 5,000 reference textbooks, archived Ph.D. theses, and digital subscriptions to APS, IOP, and IEEE.',
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
    const record = await (prisma as any).pageHero.findUnique({
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
