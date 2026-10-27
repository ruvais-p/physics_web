import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/api-auth';
import { saveImageAsWebp } from '@/lib/image';
import { sanitizeWebUrl } from '@/lib/url-security';
import { revalidatePublicPages } from '@/lib/public-cache';

// GET all News records
export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching CMS news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

// POST create new News record
export async function POST(request: Request) {
  const user = await getAdminSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
  }

  try {
    const contentType = request.headers.get('content-type') || '';
    let title = '';
    let description = '';
    let dateStr = '';
    let link: string | null = null;
    let imagePath = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      title = (formData.get('title') as string || '').trim();
      description = (formData.get('description') as string || '').trim();
      dateStr = (formData.get('date') as string || '').trim();
      const linkInput = (formData.get('link') as string || '').trim();
      if (linkInput) link = sanitizeWebUrl(linkInput, false);

      const imageFile = formData.get('image') as File | null;
      const imageUrlInput = (formData.get('imageUrl') as string || '').trim();

      if (imageFile && imageFile.size > 0) {
        const { relativePath } = await saveImageAsWebp(
          imageFile,
          'public/uploads',
          'news',
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
      dateStr = (body.date || '').trim();
      link = body.link ? sanitizeWebUrl(body.link, false) : null;
      imagePath = sanitizeWebUrl(body.image) || '';
    }

    if (!title) {
      return NextResponse.json({ error: 'News title is required.' }, { status: 400 });
    }
    if (!description) {
      return NextResponse.json({ error: 'News description is required.' }, { status: 400 });
    }

    const newsDate = dateStr ? new Date(dateStr) : new Date();

    const createdNews = await prisma.news.create({
      data: {
        title,
        description,
        image: imagePath || null,
        date: newsDate,
        link,
      },
    });

    revalidatePublicPages();

    return NextResponse.json({ success: true, id: createdNews.id }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating news:', error);
    const message = error instanceof Error ? error.message : 'Failed to create news.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
