import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/api-auth';
import { saveImageAsWebp } from '@/lib/image';
import { sanitizeWebUrl } from '@/lib/url-security';
import { revalidatePublicPages } from '@/lib/public-cache';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const records = await prisma.$queryRaw<any[]>`
      SELECT id, title, description, image, date, link, "broadcastId", "createdAt", "updatedAt"
      FROM "Award"
      WHERE id = ${id}
      LIMIT 1
    `;
    if (records.length === 0) {
      return NextResponse.json({ error: 'Award item not found' }, { status: 404 });
    }
    return NextResponse.json(records[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch award item' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  const user = await getAdminSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existingRecords = await prisma.$queryRaw<any[]>`
      SELECT * FROM "Award" WHERE id = ${id} LIMIT 1
    `;
    if (existingRecords.length === 0) {
      return NextResponse.json({ error: 'Award item not found' }, { status: 404 });
    }
    const existing = existingRecords[0];

    const contentType = request.headers.get('content-type') || '';
    let title = existing.title;
    let description = existing.description;
    let dateStr = existing.date ? new Date(existing.date).toISOString() : '';
    let link = existing.link;
    let imagePath = existing.image;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      if (formData.has('title')) title = (formData.get('title') as string || '').trim();
      if (formData.has('description')) description = (formData.get('description') as string || '').trim();
      if (formData.has('date')) dateStr = (formData.get('date') as string || '').trim();
      if (formData.has('link')) {
        const linkInput = (formData.get('link') as string || '').trim();
        link = linkInput ? sanitizeWebUrl(linkInput, false) : null;
      }

      const imageFile = formData.get('image') as File | null;
      const imageUrlInput = (formData.get('imageUrl') as string || '').trim();

      if (imageFile && imageFile.size > 0) {
        const { relativePath } = await saveImageAsWebp(
          imageFile,
          'public/uploads',
          'award',
          { quality: 85, maxWidth: 1920 }
        );
        imagePath = relativePath;
      } else if (imageUrlInput) {
        imagePath = sanitizeWebUrl(imageUrlInput) || imagePath;
      }
    } else {
      const body = await request.json();
      if (body.title !== undefined) title = String(body.title).trim();
      if (body.description !== undefined) description = String(body.description).trim();
      if (body.date !== undefined) dateStr = String(body.date).trim();
      if (body.link !== undefined) link = body.link ? sanitizeWebUrl(body.link, false) : null;
      if (body.image !== undefined) imagePath = sanitizeWebUrl(body.image) || imagePath;
    }

    if (!title) {
      return NextResponse.json({ error: 'Award title is required.' }, { status: 400 });
    }
    if (!description) {
      return NextResponse.json({ error: 'Award description is required.' }, { status: 400 });
    }

    const awardDate = dateStr ? new Date(dateStr) : new Date();

    await prisma.$queryRaw`
      UPDATE "Award"
      SET title = ${title}, description = ${description}, image = ${imagePath || null}, date = ${awardDate}, link = ${link}, "updatedAt" = NOW()
      WHERE id = ${id}
    `;

    revalidatePublicPages();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating award:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update award.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const user = await getAdminSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.$queryRaw`DELETE FROM "Award" WHERE id = ${id}`;
    revalidatePublicPages();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete award item.' }, { status: 500 });
  }
}
