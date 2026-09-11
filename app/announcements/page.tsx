import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getPageHero } from '@/lib/page-hero';
import { sanitizeWebUrl } from '@/lib/url-security';
import AnnouncementsPageClient, { AnnouncementItem } from '@/components/AnnouncementsPageClient';

export const metadata: Metadata = {
  title: 'Announcements & Notices',
  description: 'Official announcements, notices, exam timetables, and circulars from the Department of Physics, CUSAT.',
};

export const revalidate = 300;

export default async function AnnouncementsPage() {
  let announcements: AnnouncementItem[] = [];

  const [records, heroData] = await Promise.all([
    prisma.notification.findMany({
      where: { isActive: true },
      orderBy: { date: 'desc' },
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        link: true,
        date: true,
      },
    }).catch((error) => {
      console.error('Failed to fetch public announcements:', error);
      return [];
    }),
    getPageHero('announcements'),
  ]);

  announcements = records.map((item) => ({
    id: item.id,
    title: item.title,
    content: item.content,
    category: item.category || 'General',
    link: sanitizeWebUrl(item.link) || '#',
    date: item.date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
    rawDate: item.date.toISOString(),
  }));

  return <AnnouncementsPageClient announcements={announcements} heroData={heroData} />;
}

