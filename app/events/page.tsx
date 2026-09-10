import EventsPageClient, { type EventItem } from '@/components/EventsPageClient';
import { prisma } from '@/lib/prisma';

export const revalidate = 300;

export default async function EventsPage() {
  let events: EventItem[] = [];

  try {
    const records = await prisma.event.findMany({
      select: { id: true, title: true, description: true, image: true, date: true, venue: true },
      orderBy: { date: 'desc' },
    });

    events = records.map((item) => ({
      id: String(item.id),
      title: item.title,
      category: 'Seminar',
      date: item.date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      day: String(item.date.getDate()),
      month: item.date.toLocaleDateString('en-US', { month: 'short' }),
      year: String(item.date.getFullYear()),
      time: item.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      venue: item.venue || 'Department of Physics, CUSAT',
      image: item.image || '/eventssss.jpg',
      desc: item.description,
      fullDetails: item.description,
      timestamp: item.date.getTime(),
    }));
  } catch (error) {
    console.error('Failed to fetch public events:', error);
  }

  return <EventsPageClient events={events} />;
}
