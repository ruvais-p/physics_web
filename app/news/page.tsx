import { getPageHero } from '@/lib/page-hero';
import { prisma } from '@/lib/prisma';
import { sanitizeWebUrl } from '@/lib/url-security';
import NewsPageClient, { type NewsItem, type AwardItem } from '@/components/NewsPageClient';

export const revalidate = 300;

export const metadata = {
  title: 'Department News & Awards',
  description: 'Latest news, scientific breakthroughs, and prestigious awards & honors from the Department of Physics, CUSAT.',
};

const DEFAULT_NEWS_ITEMS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Department of Physics to Co-Develop Advanced Astro-payloads with National Space Agencies',
    date: '16 Jul 2026',
    day: '16',
    month: 'Jul',
    year: '2026',
    image: '/cusat-building.png',
    desc: 'A pioneering agreement has been reached to design and build lightweight cosmic-ray detectors and semiconductor payloads. The project will run out of our thin film and electronics laboratories, providing doctoral students and M.Sc. researchers with hands-on development experience.',
  },
  {
    id: 'news-2',
    title: 'Department of Physics Welcomes Incoming 2026 Batch of Postgraduates & Scholars',
    date: '12 Jul 2026',
    day: '12',
    month: 'Jul',
    year: '2026',
    image: '/eventssss.jpg',
    desc: 'An orientation ceremony was held at the department foyer to welcome the incoming batch of Integrated M.Sc., M.Sc., and Ph.D. scholars. The faculty introduced the research verticals and advanced instrumentation facilities available for academic endeavors.',
  },
  {
    id: 'news-3',
    title: 'Dr. Alex Thomas Awarded Prestigious National Research Fellowship',
    date: '25 Jun 2026',
    day: '25',
    month: 'Jun',
    year: '2026',
    image: '/faculty.png',
    desc: "The Department of Physics is proud to announce that Dr. Alex Thomas has been awarded the National Research Fellowship in Material Physics. This prestigious award supports the department's pioneering research on hybrid polyaniline-graphene nanostructures for next-generation supercapacitors.",
  },
  {
    id: 'news-4',
    title: 'Advanced Instrumentation Lab Receives FE-SEM Upgrades',
    date: '15 May 2026',
    day: '15',
    month: 'May',
    year: '2026',
    image: '/innovation-microscope.png',
    desc: 'The Central Instrumentation Facility has successfully installed advanced software upgrades to the Field Emission Scanning Electron Microscope (FE-SEM). The upgrade will allow high-resolution surface characterization down to 1nm, accelerating thin film photovoltaic research.',
  },
];

const DEFAULT_AWARDS_ITEMS: AwardItem[] = [
  {
    id: 'award-1',
    title: 'National Material Scientist Fellowship 2026',
    year: '2026',
    date: '2026',
    image: null,
    description: 'Recognized for pioneering advancements in hybrid polyaniline-graphene nanostructures for high-energy density supercapacitors and flexible energy storage.',
  },
  {
    id: 'award-2',
    title: 'INSA Young Scientist Medal in Physical Sciences',
    year: '2025',
    date: '2025',
    image: null,
    description: 'Conferred for groundbreaking theoretical and computational investigations into topological phase transitions and non-Hermitian photonics.',
  },
  {
    id: 'award-3',
    title: 'Best International Research Paper Award',
    year: '2025',
    date: '2025',
    image: null,
    description: 'Conferred for the high-impact publication on room-temperature multiferroic perovskite thin films grown via pulsed laser deposition.',
  },
  {
    id: 'award-4',
    title: 'State Young Scientist Award (Physical Sciences)',
    year: '2024',
    date: '2024',
    image: null,
    description: 'Honored for outstanding contributions to magnetic nanocomposite fabrication and low-temperature magneto-transport characterization.',
  },
];

async function getNewsData(): Promise<{ news: NewsItem[]; awards: AwardItem[] }> {
  try {
    const [newsRecords, awardRecords] = await Promise.all([
      prisma.news.findMany({ orderBy: { date: 'desc' } }),
      prisma.award.findMany({ orderBy: { date: 'desc' } }),
    ]);

    const news: NewsItem[] = newsRecords.length > 0
      ? newsRecords.map((item) => {
          const d = item.date ? new Date(item.date) : new Date();
          return {
            id: String(item.id),
            title: item.title,
            date: d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
            day: String(d.getDate()),
            month: d.toLocaleDateString('en-US', { month: 'short' }),
            year: String(d.getFullYear()),
            image: item.image || '/cusat-building.png',
            desc: item.description,
            link: item.link ? sanitizeWebUrl(item.link, false) : null,
          };
        })
      : DEFAULT_NEWS_ITEMS;

    const awards: AwardItem[] = awardRecords.length > 0
      ? awardRecords.map((item) => {
          const d = item.date ? new Date(item.date) : new Date();
          return {
            id: String(item.id),
            title: item.title,
            year: String(d.getFullYear()),
            date: d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
            image: item.image || null,
            description: item.description,
            link: item.link ? sanitizeWebUrl(item.link, false) : null,
          };
        })
      : DEFAULT_AWARDS_ITEMS;

    return { news, awards };
  } catch (error) {
    console.error('Failed to fetch news and awards from database:', error);
    return { news: DEFAULT_NEWS_ITEMS, awards: DEFAULT_AWARDS_ITEMS };
  }
}

export default async function NewsPage() {
  const [heroData, { news, awards }] = await Promise.all([
    getPageHero('news'),
    getNewsData(),
  ]);

  return <NewsPageClient news={news} awards={awards} heroData={heroData} />;
}
