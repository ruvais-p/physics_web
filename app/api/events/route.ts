import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuthToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { saveImageAsWebp } from '@/lib/image';

async function checkAuth() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get('auth_token')?.value ||
    cookieStore.get('admin_token')?.value ||
    cookieStore.get('faculty_token')?.value;

  if (!token) return null;
  return verifyAuthToken(token);
}

// GET /api/events - Fetch all events ordered by date desc
export async function GET() {
  try {
    const events = await (prisma as any).event.findMany({
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST /api/events - Create new event (Admin & Faculty)
export async function POST(request: Request) {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Admin or Faculty session required.' }, { status: 401 });
  }

  try {
    const contentType = request.headers.get('content-type') || '';
    let title = '';
    let description = '';
    let dateStr = '';
    let venue: string | null = null;
    let apply_link: string | null = null;
    let imagePath = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      title = (formData.get('title') as string || '').trim();
      description = (formData.get('description') as string || '').trim();
      dateStr = (formData.get('date') as string || '').trim();
      const venueInput = (formData.get('venue') as string || '').trim();
      if (venueInput) venue = venueInput;
      const applyLinkInput = (formData.get('apply_link') as string || '').trim();
      if (applyLinkInput) apply_link = applyLinkInput;

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
        imagePath = imageUrlInput;
      }
    } else {
      const body = await request.json();
      title = (body.title || '').trim();
      description = (body.description || '').trim();
      dateStr = (body.date || '').trim();
      venue = body.venue ? String(body.venue).trim() : null;
      apply_link = body.apply_link ? String(body.apply_link).trim() : null;
      imagePath = (body.image || '').trim();
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
    if (!dateStr) {
      return NextResponse.json({ error: 'Event date is required' }, { status: 400 });
    }

    const eventDate = new Date(dateStr);
    if (isNaN(eventDate.getTime())) {
      return NextResponse.json({ error: 'Invalid event date format' }, { status: 400 });
    }

    const newEvent = await (prisma as any).event.create({
      data: {
        title,
        description,
        image: imagePath,
        date: eventDate,
        venue,
        apply_link,
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
