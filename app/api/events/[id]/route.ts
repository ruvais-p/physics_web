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

    const event = await (prisma as any).event.findUnique({
      where: { id: eventId },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

// PUT /api/events/[id] - Update event by ID (Admin & Faculty)
export async function PUT(request: Request, { params }: Params) {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Admin or Faculty session required.' }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const eventId = parseInt(resolvedParams.id, 10);

    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    const existingEvent = await (prisma as any).event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const contentType = request.headers.get('content-type') || '';
    let title = existingEvent.title;
    let description = existingEvent.description;
    let dateStr = existingEvent.date.toISOString();
    let venue = existingEvent.venue;
    let apply_link = existingEvent.apply_link;
    let imagePath = existingEvent.image;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      if (formData.has('title')) title = (formData.get('title') as string || '').trim();
      if (formData.has('description')) description = (formData.get('description') as string || '').trim();
      if (formData.has('date')) dateStr = (formData.get('date') as string || '').trim();
      if (formData.has('venue')) {
        const venueVal = (formData.get('venue') as string || '').trim();
        venue = venueVal ? venueVal : null;
      }
      if (formData.has('apply_link')) {
        const applyVal = (formData.get('apply_link') as string || '').trim();
        apply_link = applyVal ? applyVal : null;
      }

      const imageFile = formData.get('image') as File | null;
      const imageUrlInput = (formData.get('imageUrl') as string || '').trim();

      if (imageFile && imageFile.size > 0) {
        const { relativePath } = await saveImageAsWebp(
          imageFile,
          'public/uploads',
          `event_${eventId}`,
          { quality: 85, maxWidth: 1920 }
        );
        imagePath = relativePath;
      } else if (imageUrlInput) {
        imagePath = imageUrlInput;
      }
    } else {
      const body = await request.json();
      if (body.title !== undefined) title = String(body.title).trim();
      if (body.description !== undefined) description = String(body.description).trim();
      if (body.date !== undefined) dateStr = String(body.date).trim();
      if (body.venue !== undefined) venue = body.venue ? String(body.venue).trim() : null;
      if (body.apply_link !== undefined) apply_link = body.apply_link ? String(body.apply_link).trim() : null;
      if (body.image !== undefined && body.image.trim()) imagePath = String(body.image).trim();
    }

    if (!title) {
      return NextResponse.json({ error: 'Event title is required' }, { status: 400 });
    }
    if (!description) {
      return NextResponse.json({ error: 'Event description is required' }, { status: 400 });
    }

    const eventDate = new Date(dateStr);
    if (isNaN(eventDate.getTime())) {
      return NextResponse.json({ error: 'Invalid event date format' }, { status: 400 });
    }

    const updatedEvent = await (prisma as any).event.update({
      where: { id: eventId },
      data: {
        title,
        description,
        image: imagePath,
        date: eventDate,
        venue,
        apply_link,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE /api/events/[id] - Delete event by ID (Admin & Faculty)
export async function DELETE(request: Request, { params }: Params) {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Admin or Faculty session required.' }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const eventId = parseInt(resolvedParams.id, 10);

    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    await (prisma as any).event.delete({
      where: { id: eventId },
    });

    return NextResponse.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
