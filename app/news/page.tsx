import { getPageHero } from '@/lib/page-hero';
import { prisma } from '@/lib/prisma';
import { sanitizeWebUrl } from '@/lib/url-security';
import NewsPageClient, { type NewsItem, type AwardItem } from '@/components/NewsPageClient';

export const revalidate = 300;

export const metadata = {
  title: 'Department News & Awards',
  description: 'Latest news, scientific breakthroughs, and prestigious awards & honors from the Department of Physics, CUSAT.',
};

async function getNewsData(): Promise<{ news: NewsItem[]; awards: AwardItem[] }> {
  try {
    const [newsRecords, awardRecords] = await Promise.all([
      prisma.news.findMany({ orderBy: { date: 'desc' } }),
      prisma.award.findMany({ orderBy: { date: 'desc' } }),
    ]);

    const news: NewsItem[] = newsRecords.map((item) => {
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
    });

    const awards: AwardItem[] = awardRecords.map((item) => {
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
    });

    return { news, awards };
  } catch (error) {
    console.error('Failed to fetch news and awards from database:', error);
    return { news: [], awards: [] };
  }
}

export default async function NewsPage() {
  const [heroData, { news, awards }] = await Promise.all([
    getPageHero('news'),
    getNewsData(),
  ]);

  return <NewsPageClient news={news} awards={awards} heroData={heroData} />;
}
