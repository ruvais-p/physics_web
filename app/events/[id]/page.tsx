import EventDetailPageClient, { type EventDetailItem } from '@/components/EventDetailPageClient';
import { prisma } from '@/lib/prisma';
import { sanitizeWebUrl } from '@/lib/url-security';

export const revalidate = 300;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const events = await prisma.event.findMany({ select: { id: true } });
    return events.map((event) => ({ id: String(event.id) }));
  } catch (error) {
    console.error('Failed to generate event routes:', error);
    return [];
  }
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;
  const eventId = Number.parseInt(id, 10);
  let liveEvent: EventDetailItem | null = null;

  if (Number.isInteger(eventId)) {
    try {
      const item = await prisma.event.findUnique({
        where: { id: eventId },
        include: { images: { orderBy: { sortOrder: 'asc' } } },
      });

      if (item) {
        const sDate = item.startDate;
        const eDate = item.endDate ? new Date(item.endDate) : null;
        const startStr = sDate.toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
        const endStr = eDate
          ? eDate.toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : null;
        const dateDisplay = endStr && endStr !== startStr ? `${startStr} – ${endStr}` : startStr;

        liveEvent = {
          id: String(item.id),
          title: item.title,
          date: dateDisplay,
          time: sDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          venue: item.venue || '',
          image: item.image || '',
          desc: item.description,
          fullDetails: item.description,
          applyLink: sanitizeWebUrl(item.apply_link, true) || undefined,
          brochure: sanitizeWebUrl(item.brochure, true) || undefined,
          galleryImages: item.images,
        };
      }
    } catch (error) {
      console.error('Failed to fetch event details:', error);
    }
  }

  return <EventDetailPageClient liveEvent={liveEvent} />;
}
