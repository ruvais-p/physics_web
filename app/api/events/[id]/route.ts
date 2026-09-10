import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import path from 'path';
import fs from 'fs/promises';
import { saveImageAsWebp } from '@/lib/image';
import { getAdminSession } from '@/lib/api-auth';
import { sanitizeWebUrl } from '@/lib/url-security';
import { revalidatePublicPages } from '@/lib/public-cache';
import { hasPdfSignature, deleteUploadedFile } from '@/lib/file-security';

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/events/[id] - Fetch single event by ID
export async function GET(request: Request, { params }: Params) {
  try {
    const resolvedParams = await params;
    const eventId = parseInt(resolvedParams.id, 10);

    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    const items = await prisma.$queryRaw<any[]>`
      SELECT id, title, description, image, start_date AS "startDate", end_date AS "endDate", venue, apply_link, brochure, created_at AS "createdAt", updated_at AS "updatedAt"
      FROM events
      WHERE id = ${eventId}
      LIMIT 1
    `;

    const event = items[0] || null;

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const images = await prisma.$queryRaw<any[]>`
      SELECT id, event_id AS "eventId", image_path AS "imagePath", sort_order AS "sortOrder", created_at AS "createdAt"
      FROM "EventImage"
      WHERE event_id = ${eventId}
      ORDER BY sort_order ASC
    `.catch(() => []);

    return NextResponse.json({ ...event, images });
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

// PUT /api/events/[id] - Update event by ID (Admin only)
export async function PUT(request: Request, { params }: Params) {
  const user = await getAdminSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const eventId = parseInt(resolvedParams.id, 10);

    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    const existingEvents = await prisma.$queryRaw<any[]>`
      SELECT id, title, description, image, start_date AS "startDate", end_date AS "endDate", venue, apply_link, brochure
      FROM events
      WHERE id = ${eventId}
      LIMIT 1
    `;

    const existingEvent = existingEvents[0] || null;

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const contentType = request.headers.get('content-type') || '';
    let title = existingEvent.title;
    let description = existingEvent.description;
    let startDateStr = existingEvent.startDate ? new Date(existingEvent.startDate).toISOString() : '';
    let endDateStr = existingEvent.endDate ? new Date(existingEvent.endDate).toISOString() : '';
    let venue = existingEvent.venue;
    let apply_link = existingEvent.apply_link;
    let brochurePath: string | null = existingEvent.brochure;
    let imagePath = existingEvent.image;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      if (formData.has('title')) title = (formData.get('title') as string || '').trim();
      if (formData.has('description')) description = (formData.get('description') as string || '').trim();
      if (formData.has('startDate')) startDateStr = (formData.get('startDate') as string || '').trim();
      else if (formData.has('date')) startDateStr = (formData.get('date') as string || '').trim();
      if (formData.has('endDate')) endDateStr = (formData.get('endDate') as string || '').trim();
      if (formData.has('venue')) {
        const venueVal = (formData.get('venue') as string || '').trim();
        venue = venueVal ? venueVal : null;
      }
      if (formData.has('apply_link')) {
        const applyVal = (formData.get('apply_link') as string || '').trim();
        apply_link = applyVal ? (sanitizeWebUrl(applyVal, true) || applyVal) : null;
      }

      const imageFile = formData.get('image') as File | null;
      const imageUrlInput = (formData.get('imageUrl') as string || '').trim();

      if (imageFile && imageFile.size > 0) {
        const { relativePath } = await saveImageAsWebp(
          imageFile,
          path.join(process.cwd(), 'public', 'uploads'),
          `event_${eventId}`,
          { quality: 85, maxWidth: 1920 }
        );
        imagePath = relativePath;
      } else if (imageUrlInput) {
        imagePath = sanitizeWebUrl(imageUrlInput) || imageUrlInput || imagePath;
      }

      // Handle brochure file or URL
      const brochureFile = formData.get('brochure') as File | null;
      const brochureUrlInput = (formData.get('brochureUrl') as string || '').trim();
      const removeBrochure = formData.get('removeBrochure') === 'true';

      if (removeBrochure) {
        if (existingEvent.brochure) {
          await deleteUploadedFile(existingEvent.brochure, 'events');
        }
        brochurePath = null;
      } else if (brochureFile && brochureFile.size > 0) {
        if (!brochureFile.name.toLowerCase().endsWith('.pdf') && brochureFile.type !== 'application/pdf') {
          return NextResponse.json({ error: 'Only PDF documents are allowed for event brochure.' }, { status: 400 });
        }
        const bytes = await brochureFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        if (!hasPdfSignature(buffer)) {
          return NextResponse.json({ error: 'Uploaded brochure is not a valid PDF file.' }, { status: 400 });
        }
        if (existingEvent.brochure) {
          await deleteUploadedFile(existingEvent.brochure, 'events');
        }
        const timestamp = Date.now();
        const sanitizedName = path.parse(brochureFile.name).name.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50);
        const fileName = `brochure_${eventId}_${timestamp}_${sanitizedName || 'document'}.pdf`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'events');
        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(path.join(uploadDir, fileName), buffer);
        brochurePath = `/uploads/events/${fileName}`;
      } else if (formData.has('brochureUrl')) {
        if (brochureUrlInput) {
          brochurePath = sanitizeWebUrl(brochureUrlInput, true) || brochureUrlInput;
        } else {
          brochurePath = null;
        }
      }
    } else {
      const body = await request.json();
      if (body.title !== undefined) title = String(body.title).trim();
      if (body.description !== undefined) description = String(body.description).trim();
      if (body.startDate !== undefined) startDateStr = String(body.startDate).trim();
      else if (body.date !== undefined) startDateStr = String(body.date).trim();
      if (body.endDate !== undefined) endDateStr = String(body.endDate).trim();
      if (body.venue !== undefined) venue = body.venue ? String(body.venue).trim() : null;
      if (body.apply_link !== undefined) apply_link = body.apply_link ? (sanitizeWebUrl(body.apply_link, true) || String(body.apply_link)) : null;
      if (body.brochure !== undefined) brochurePath = body.brochure ? (sanitizeWebUrl(body.brochure, true) || String(body.brochure)) : null;
      if (body.image !== undefined && body.image.trim()) imagePath = sanitizeWebUrl(body.image) || body.image || imagePath;
    }

    if (!title) {
      return NextResponse.json({ error: 'Event title is required' }, { status: 400 });
    }
    if (!description) {
      return NextResponse.json({ error: 'Event description is required' }, { status: 400 });
    }

    const eventStartDate = new Date(startDateStr);
    if (isNaN(eventStartDate.getTime())) {
      return NextResponse.json({ error: 'Invalid event start date format' }, { status: 400 });
    }

    let eventEndDate: Date | null = null;
    if (endDateStr) {
      const parsedEndDate = new Date(endDateStr);
      if (!isNaN(parsedEndDate.getTime())) {
        eventEndDate = parsedEndDate;
      }
    }

    const result = await prisma.$queryRaw<any[]>`
      UPDATE events
      SET
        title = ${title},
        description = ${description},
        image = ${imagePath},
        start_date = ${eventStartDate},
        end_date = ${eventEndDate},
        venue = ${venue},
        apply_link = ${apply_link},
        brochure = ${brochurePath},
        updated_at = NOW()
      WHERE id = ${eventId}
      RETURNING id, title, description, image, start_date AS "startDate", end_date AS "endDate", venue, apply_link, brochure, created_at AS "createdAt", updated_at AS "updatedAt"
    `;

    revalidatePublicPages();
    return NextResponse.json(result[0] || { success: true });
  } catch (error) {
    console.error('Error updating event:', error);
    const message = error instanceof Error ? error.message : 'Failed to update event';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/events/[id] - Delete event by ID (Admin only)
export async function DELETE(request: Request, { params }: Params) {
  const user = await getAdminSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const eventId = parseInt(resolvedParams.id, 10);

    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    const existingEvents = await prisma.$queryRaw<any[]>`
      SELECT id, brochure FROM events WHERE id = ${eventId} LIMIT 1
    `;
    const eventToDelete = existingEvents[0] || null;

    if (eventToDelete && eventToDelete.brochure) {
      await deleteUploadedFile(eventToDelete.brochure, 'events');
    }

    await prisma.$executeRaw`DELETE FROM events WHERE id = ${eventId}`;

    revalidatePublicPages();
    return NextResponse.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete event';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
