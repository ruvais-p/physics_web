import EventsPageClient, { type EventItem } from '@/components/EventsPageClient';
import { prisma } from '@/lib/prisma';
import { getPageHero } from '@/lib/page-hero';

export const revalidate = 300;

export default async function EventsPage() {
  let events: EventItem[] = [];

  const [records, heroData] = await Promise.all([
    prisma.$queryRaw<any[]>`
      SELECT id, title, description, image, start_date AS "startDate", end_date AS "endDate", venue, brochure
      FROM events
      ORDER BY start_date DESC
    `.catch((error: any) => {
      console.error('Failed to fetch public events:', error);
      return [];
    }),
    getPageHero('events'),
  ]);

  events = records.map((item: any) => {
    const sDate = item.startDate ? new Date(item.startDate) : new Date();
    const eDate = item.endDate ? new Date(item.endDate) : null;
    const startStr = sDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    const endStr = eDate ? eDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : null;
    const dateDisplay = endStr && endStr !== startStr ? `${startStr} – ${endStr}` : startStr;

    return {
      id: String(item.id),
      title: item.title,
      category: 'Seminar' as const,
      date: dateDisplay,
      day: String(sDate.getDate()),
      month: sDate.toLocaleDateString('en-US', { month: 'short' }),
      year: String(sDate.getFullYear()),
      time: sDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      venue: item.venue || 'Department of Physics, CUSAT',
      image: item.image || '/eventssss.jpg',
      desc: item.description,
      fullDetails: item.description,
      brochure: item.brochure || null,
      timestamp: sDate.getTime(),
    };
  });

  return <EventsPageClient events={events} heroData={heroData} />;
}

