import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { saveImageAsWebp, isAllowedImageType } from '@/lib/image';
import { getAdminSession } from '@/lib/api-auth';

import { revalidatePublicPages } from '@/lib/public-cache';

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/events/[id]/images - Fetch all gallery images for an event
export async function GET(request: Request, { params }: Params) {
  try {
    const resolvedParams = await params;
    const eventId = parseInt(resolvedParams.id, 10);

    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    const images = await (prisma as any).eventImage.findMany({
      where: { eventId },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching event gallery images:', error);
    return NextResponse.json({ error: 'Failed to fetch event gallery images' }, { status: 500 });
  }
}

// POST /api/events/[id]/images - Upload multiple gallery images (Max 20 total limit)
export async function POST(request: Request, { params }: Params) {
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

    // 1. Verify Event existence
    const existingEvent = await (prisma as any).event.findUnique({
      where: { id: eventId },
      include: { images: true },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const currentImageCount = existingEvent.images.length;
    const MAX_PHOTOS = 20;

    const contentType = request.headers.get('content-type') || '';
    const itemsToCreate: { imagePath: string; caption: string | null }[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const rawFiles = [
        ...formData.getAll('images'),
        ...formData.getAll('images[]'),
        ...formData.getAll('image'),
      ] as File[];
      const files = rawFiles.filter((f) => f && typeof f === 'object' && f.size > 0);

      const rawUrls = [
        ...formData.getAll('imageUrls'),
        ...formData.getAll('imageUrl'),
      ] as string[];
      const urls = rawUrls.filter((u) => typeof u === 'string' && u.trim());

      const rawCaptions = [
        ...formData.getAll('captions'),
        ...formData.getAll('captions[]'),
      ] as string[];

      // Count total incoming photos
      const totalIncoming = files.filter(f => f && f.size > 0).length + urls.filter(u => u && u.trim()).length;

      if (currentImageCount + totalIncoming > MAX_PHOTOS) {
        return NextResponse.json(
          { error: `Gallery limit exceeded! Maximum ${MAX_PHOTOS} photos allowed per event. Currently has ${currentImageCount} photo(s).` },
          { status: 400 }
        );
      }

      const uploadDir = 'public/uploads/events';

      // Save uploaded files as WebP
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file && file.size > 0) {
          // File size validation: 10MB
          if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: `File ${file.name} exceeds maximum 10MB size limit.` }, { status: 400 });
          }

          if (!isAllowedImageType(file.type || file.name)) {
            return NextResponse.json({ error: `File ${file.name} is not a supported image format.` }, { status: 400 });
          }

          const { relativePath } = await saveImageAsWebp(
            file,
            uploadDir,
            `gallery_${eventId}`,
            { quality: 85, maxWidth: 1920 }
          );

          const captionVal = rawCaptions[i] ? String(rawCaptions[i]).trim() : '';
          itemsToCreate.push({
            imagePath: relativePath,
            caption: captionVal || null,
          });
        }
      }

      // Add direct URL strings
      for (let j = 0; j < urls.length; j++) {
        const urlStr = urls[j];
        if (urlStr && urlStr.trim()) {
          const captionVal = rawCaptions[files.length + j] ? String(rawCaptions[files.length + j]).trim() : '';
          itemsToCreate.push({
            imagePath: urlStr.trim(),
            caption: captionVal || null,
          });
        }
      }
    } else {
      const body = await request.json();
      const urls: string[] = Array.isArray(body.imageUrls) ? body.imageUrls : [];
      const bodyCaptions: string[] = Array.isArray(body.captions) ? body.captions : [];
      
      if (currentImageCount + urls.length > MAX_PHOTOS) {
        return NextResponse.json(
          { error: `Gallery limit exceeded! Maximum ${MAX_PHOTOS} photos allowed per event. Currently has ${currentImageCount} photo(s).` },
          { status: 400 }
        );
      }

      urls.forEach((u, idx) => {
        if (u && u.trim()) {
          const captionVal = bodyCaptions[idx] ? String(bodyCaptions[idx]).trim() : '';
          itemsToCreate.push({
            imagePath: u.trim(),
            caption: captionVal || null,
          });
        }
      });
    }

    if (itemsToCreate.length === 0) {
      return NextResponse.json({ error: 'No valid image files or URLs provided for upload.' }, { status: 400 });
    }

    // Get highest current sortOrder
    const lastImage = await (prisma as any).eventImage.findFirst({
      where: { eventId },
      orderBy: { sortOrder: 'desc' },
    });

    let startOrder = lastImage ? lastImage.sortOrder + 1 : 1;

    // Create EventImage database records
    const createdRecords = await (prisma as any).$transaction(
      itemsToCreate.map((item, index) =>
        (prisma as any).eventImage.create({
          data: {
            eventId,
            imagePath: item.imagePath,
            caption: item.caption,
            sortOrder: startOrder + index,
          },
        })
      )
    );

    revalidatePublicPages();
    return NextResponse.json(createdRecords, { status: 201 });
  } catch (error) {
    console.error('Error uploading event gallery images:', error);
    return NextResponse.json({ error: 'Failed to upload gallery images' }, { status: 500 });
  }
}
