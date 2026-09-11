import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/api-auth';
import { saveImageAsWebp } from '@/lib/image';
import { sanitizeWebUrl } from '@/lib/url-security';
import { revalidatePublicPages } from '@/lib/public-cache';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  const user = await getAdminSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
  }

  try {
    const contentType = request.headers.get('content-type') || '';
    let title = '';
    let description = '';
    let startDateStr = '';
    let endDateStr = '';
    let venue: string | null = null;
    let applyLink: string | null = null;
    let notificationCategory = 'General';
    let imagePath = '';
    let targets: string[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      title = (formData.get('title') as string || '').trim();
      description = (formData.get('description') as string || '').trim();
      startDateStr = (formData.get('startDate') as string || formData.get('date') as string || '').trim();
      endDateStr = (formData.get('endDate') as string || '').trim();
      
      const venueInput = (formData.get('venue') as string || '').trim();
      if (venueInput) venue = venueInput;

      const applyLinkInput = (formData.get('apply_link') as string || formData.get('link') as string || '').trim();
      if (applyLinkInput) applyLink = sanitizeWebUrl(applyLinkInput, false);

      const categoryInput = (formData.get('notificationCategory') as string || formData.get('category') as string || '').trim();
      if (categoryInput) notificationCategory = categoryInput;

      const targetsRaw = formData.get('targets') as string || '';
      try {
        targets = JSON.parse(targetsRaw);
      } catch {
        targets = targetsRaw.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
      }

      const imageFile = formData.get('image') as File | null;
      const imageUrlInput = (formData.get('imageUrl') as string || '').trim();

      if (imageFile && imageFile.size > 0) {
        const { relativePath } = await saveImageAsWebp(
          imageFile,
          'public/uploads',
          'broadcast',
          { quality: 85, maxWidth: 1920 }
        );
        imagePath = relativePath;
      } else if (imageUrlInput) {
        imagePath = sanitizeWebUrl(imageUrlInput) || '';
      }
    } else {
      const body = await request.json();
      title = (body.title || '').trim();
      description = (body.description || '').trim();
      startDateStr = (body.startDate || body.date || '').trim();
      endDateStr = (body.endDate || '').trim();
      venue = body.venue ? String(body.venue).trim() : null;
      applyLink = body.apply_link || body.link ? sanitizeWebUrl(body.apply_link || body.link, false) : null;
      notificationCategory = body.notificationCategory || body.category || 'General';
      imagePath = sanitizeWebUrl(body.image) || '';
      targets = Array.isArray(body.targets) ? body.targets.map((t: string) => String(t).toLowerCase()) : [];
    }

    if (!title) {
      return NextResponse.json({ error: 'Post title is required.' }, { status: 400 });
    }

    if (!targets || targets.length === 0) {
      return NextResponse.json({ error: 'Please select at least one publish destination (Notifications, News, or Events).' }, { status: 400 });
    }

    const broadcastId = randomUUID();
    const now = new Date();
    const eventStartDate = startDateStr ? new Date(startDateStr) : now;
    if (isNaN(eventStartDate.getTime())) {
      return NextResponse.json({ error: 'Invalid start date format.' }, { status: 400 });
    }

    let eventEndDate: Date | null = null;
    if (endDateStr) {
      const parsedEndDate = new Date(endDateStr);
      if (!isNaN(parsedEndDate.getTime())) {
        eventEndDate = parsedEndDate;
      }
    }

    const createdSummary: {
      notificationId?: string;
      newsId?: string;
      eventId?: number;
    } = {};

    const willPublishEvent = targets.includes('events') || targets.includes('event');
    const willPublishNews = targets.includes('news');
    const willPublishNotification = targets.includes('notifications') || targets.includes('notification');

    // 1. Publish to Events if targeted
    if (willPublishEvent) {
      const eventRows = await prisma.$queryRaw<any[]>`
        INSERT INTO events (title, description, image, start_date, end_date, venue, apply_link, broadcast_id, created_at, updated_at)
        VALUES (${title}, ${description}, ${imagePath || '/eventssss.jpg'}, ${eventStartDate}, ${eventEndDate}, ${venue}, ${applyLink}, ${broadcastId}, NOW(), NOW())
        RETURNING id
      `;
      if (eventRows.length > 0) {
        createdSummary.eventId = eventRows[0].id;
      }
    }

    // 2. Publish to News if targeted
    if (willPublishNews) {
      const newsId = randomUUID();
      await prisma.$queryRaw`
        INSERT INTO "News" (id, title, description, image, date, link, "broadcastId", "createdAt", "updatedAt")
        VALUES (${newsId}, ${title}, ${description}, ${imagePath || null}, ${eventStartDate}, ${applyLink}, ${broadcastId}, NOW(), NOW())
      `;
      createdSummary.newsId = newsId;
    }

    // 3. Publish to Notifications if targeted
    if (willPublishNotification) {
      const notifId = randomUUID();
      // Auto-resolve link if not manually supplied:
      // Priority 1: Link to newly created event (/events/[id])
      // Priority 2: Link to News (/news)
      // Priority 3: Custom manual link
      let notifLink = applyLink;
      if (!notifLink) {
        if (createdSummary.eventId) {
          notifLink = `/events/${createdSummary.eventId}`;
        } else if (createdSummary.newsId) {
          notifLink = '/news';
        }
      }

      const notifCategory = notificationCategory || (willPublishEvent ? 'Event' : willPublishNews ? 'News' : 'Notice');

      await prisma.$queryRaw`
        INSERT INTO "Notification" (id, title, content, category, link, "isActive", "broadcastId", date, "createdAt", "updatedAt")
        VALUES (${notifId}, ${title}, ${description || null}, ${notifCategory}, ${notifLink}, true, ${broadcastId}, ${eventStartDate}, NOW(), NOW())
      `;
      createdSummary.notificationId = notifId;
    }

    revalidatePublicPages();

    return NextResponse.json({
      success: true,
      message: `Content published successfully to ${targets.join(', ')}.`,
      broadcastId,
      targets: createdSummary,
    });
  } catch (error: any) {
    console.error('Error in multi-target broadcast publish:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to publish broadcast.' },
      { status: 500 }
    );
  }
}
