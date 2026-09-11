import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import path from 'path';
import fs from 'fs/promises';
import { saveImageAsWebp } from '@/lib/image';
import { getAdminSession } from '@/lib/api-auth';
import { sanitizeWebUrl } from '@/lib/url-security';
import { revalidatePublicPages } from '@/lib/public-cache';
import { hasPdfSignature } from '@/lib/file-security';

// GET /api/events - Fetch all events ordered by startDate desc
export async function GET() {
  try {
    const events = await prisma.$queryRaw<any[]>`
      SELECT id, title, description, image, start_date AS "startDate", end_date AS "endDate", venue, apply_link, brochure, created_at AS "createdAt", updated_at AS "updatedAt"
      FROM events
      ORDER BY start_date DESC
    `;
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST /api/events - Create new event (Admin only)
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
    let apply_link: string | null = null;
    let brochurePath: string | null = null;
    let imagePath = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      title = (formData.get('title') as string || '').trim();
      description = (formData.get('description') as string || '').trim();
      startDateStr = (formData.get('startDate') as string || formData.get('date') as string || '').trim();
      endDateStr = (formData.get('endDate') as string || '').trim();
      const venueInput = (formData.get('venue') as string || '').trim();
      if (venueInput) venue = venueInput;
      const applyLinkInput = (formData.get('apply_link') as string || '').trim();
      if (applyLinkInput) apply_link = sanitizeWebUrl(applyLinkInput, false);

      const imageFile = formData.get('image') as File | null;
      const imageUrlInput = (formData.get('imageUrl') as string || '').trim();

      if (imageFile && imageFile.size > 0) {
        const { relativePath } = await saveImageAsWebp(
          imageFile,
          path.join(process.cwd(), 'public', 'uploads'),
          'event',
          { quality: 85, maxWidth: 1920 }
        );
        imagePath = relativePath;
      } else if (imageUrlInput) {
        imagePath = sanitizeWebUrl(imageUrlInput) || '';
      }

      // Handle optional PDF brochure file or URL
      const brochureFile = formData.get('brochure') as File | null;
      const brochureUrlInput = (formData.get('brochureUrl') as string || '').trim();

      if (brochureFile && brochureFile.size > 0) {
        if (!brochureFile.name.toLowerCase().endsWith('.pdf') && brochureFile.type !== 'application/pdf') {
          return NextResponse.json({ error: 'Only PDF documents are allowed for event brochure.' }, { status: 400 });
        }
        const bytes = await brochureFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        if (!hasPdfSignature(buffer)) {
          return NextResponse.json({ error: 'Uploaded brochure is not a valid PDF file.' }, { status: 400 });
        }
        const timestamp = Date.now();
        const sanitizedName = path.parse(brochureFile.name).name.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50);
        const fileName = `brochure_${timestamp}_${sanitizedName || 'document'}.pdf`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'events');
        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(path.join(uploadDir, fileName), buffer);
        brochurePath = `/uploads/events/${fileName}`;
      } else if (brochureUrlInput) {
        brochurePath = sanitizeWebUrl(brochureUrlInput, false);
      }
    } else {
      const body = await request.json();
      title = (body.title || '').trim();
      description = (body.description || '').trim();
      startDateStr = (body.startDate || body.date || '').trim();
      endDateStr = (body.endDate || '').trim();
      venue = body.venue ? String(body.venue).trim() : null;
      apply_link = body.apply_link ? sanitizeWebUrl(body.apply_link, false) : null;
      brochurePath = body.brochure ? sanitizeWebUrl(body.brochure, false) : null;
      imagePath = sanitizeWebUrl(body.image) || '';
    }

    if (!title) {
      return NextResponse.json({ error: 'Event title is required' }, { status: 400 });
    }
    if (!description) {
      return NextResponse.json({ error: 'Event description is required' }, { status: 400 });
    }
    if (!imagePath) {
      return NextResponse.json({ error: 'Event cover image (upload or URL) is required' }, { status: 400 });
    }
    if (!startDateStr) {
      return NextResponse.json({ error: 'Event start date is required' }, { status: 400 });
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
      INSERT INTO events (title, description, image, start_date, end_date, venue, apply_link, brochure, created_at, updated_at)
      VALUES (${title}, ${description}, ${imagePath}, ${eventStartDate}, ${eventEndDate}, ${venue}, ${apply_link}, ${brochurePath}, NOW(), NOW())
      RETURNING id, title, description, image, start_date AS "startDate", end_date AS "endDate", venue, apply_link, brochure, created_at AS "createdAt", updated_at AS "updatedAt"
    `;

    revalidatePublicPages();
    return NextResponse.json(result[0] || { success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
