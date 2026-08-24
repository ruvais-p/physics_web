import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuthToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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
    const newImagePaths: string[] = [];

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

      // Count total incoming photos
      const totalIncoming = files.filter(f => f && f.size > 0).length + urls.filter(u => u && u.trim()).length;

      if (currentImageCount + totalIncoming > MAX_PHOTOS) {
        return NextResponse.json(
          { error: `Gallery limit exceeded! Maximum ${MAX_PHOTOS} photos allowed per event. Currently has ${currentImageCount} photo(s).` },
          { status: 400 }
        );
      }

      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });

      // Save uploaded files
      for (const file of files) {
        if (file && file.size > 0) {
          // File size validation: 5MB
          if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: `File ${file.name} exceeds maximum 5MB size limit.` }, { status: 400 });
          }

          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const ext = path.extname(file.name) || '.jpg';
          const filename = `gallery_${eventId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;
          await writeFile(path.join(uploadDir, filename), buffer);
          newImagePaths.push(`/uploads/${filename}`);
        }
      }

      // Add direct URL strings
      for (const urlStr of urls) {
        if (urlStr && urlStr.trim()) {
          newImagePaths.push(urlStr.trim());
        }
      }
    } else {
      const body = await request.json();
      const urls: string[] = Array.isArray(body.imageUrls) ? body.imageUrls : [];
      
      if (currentImageCount + urls.length > MAX_PHOTOS) {
        return NextResponse.json(
          { error: `Gallery limit exceeded! Maximum ${MAX_PHOTOS} photos allowed per event. Currently has ${currentImageCount} photo(s).` },
          { status: 400 }
        );
      }

      urls.forEach(u => {
        if (u && u.trim()) newImagePaths.push(u.trim());
      });
    }

    if (newImagePaths.length === 0) {
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
      newImagePaths.map((imagePath, index) =>
        (prisma as any).eventImage.create({
          data: {
            eventId,
            imagePath,
            sortOrder: startOrder + index,
          },
        })
      )
    );

    return NextResponse.json(createdRecords, { status: 201 });
  } catch (error) {
    console.error('Error uploading event gallery images:', error);
    return NextResponse.json({ error: 'Failed to upload gallery images' }, { status: 500 });
  }
}
