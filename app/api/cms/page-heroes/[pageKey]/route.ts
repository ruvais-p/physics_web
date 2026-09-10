import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { saveImageAsWebp, isAllowedImageType } from '@/lib/image';
import { getAdminSession } from '@/lib/api-auth';
import { sanitizeWebUrl } from '@/lib/url-security';
import { revalidatePublicPages } from '@/lib/public-cache';
import { DEFAULT_PAGE_HEROES } from '@/lib/page-hero';

interface RouteContext {
  params: Promise<{ pageKey: string }>;
}

// GET single page hero configuration
export async function GET(request: Request, context: RouteContext) {
  const { pageKey } = await context.params;
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
  }

  const defaults = DEFAULT_PAGE_HEROES[pageKey];
  if (!defaults) {
    return NextResponse.json({ error: 'Invalid page key' }, { status: 404 });
  }

  try {
    const record = await (prisma as any).pageHero.findUnique({
      where: { pageKey },
    });

    return NextResponse.json({
      pageKey,
      pageName: defaults.pageName,
      title: record?.title || defaults.title,
      subtitle: record?.subtitle !== null && record?.subtitle !== undefined ? record.subtitle : defaults.subtitle,
      image: record?.image || defaults.image,
      updatedAt: record?.updatedAt || null,
      isCustomized: Boolean(record),
    });
  } catch (error) {
    console.error(`Error fetching page hero for ${pageKey}:`, error);
    return NextResponse.json({ error: 'Failed to fetch page hero' }, { status: 500 });
  }
}

// POST/PUT update page hero
export async function POST(request: Request, context: RouteContext) {
  const { pageKey } = await context.params;
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
  }

  const defaults = DEFAULT_PAGE_HEROES[pageKey];
  if (!defaults) {
    return NextResponse.json({ error: 'Invalid page key' }, { status: 400 });
  }

  try {
    const contentType = request.headers.get('content-type') || '';
    let title = '';
    let subtitle = '';
    let imagePath = '';

    const existing = await (prisma as any).pageHero.findUnique({
      where: { pageKey },
    });

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      title = (formData.get('title') as string || '').trim();
      subtitle = (formData.get('subtitle') as string || '').trim();
      const imageFile = formData.get('image') as File | null;
      const imageUrlInput = (formData.get('imageUrl') as string || '').trim();

      if (imageFile && imageFile.size > 0) {
        if (!isAllowedImageType(imageFile.type || imageFile.name)) {
          return NextResponse.json({ error: 'Unsupported image format' }, { status: 400 });
        }

        const { relativePath } = await saveImageAsWebp(
          imageFile,
          'public/uploads',
          `hero_${pageKey}`,
          { quality: 85, maxWidth: 2560 }
        );
        imagePath = relativePath;
      } else if (imageUrlInput) {
        imagePath = sanitizeWebUrl(imageUrlInput) || '';
      } else if (existing?.image) {
        imagePath = existing.image;
      } else {
        imagePath = defaults.image;
      }
    } else {
      const body = await request.json();
      title = (body.title || '').trim();
      subtitle = (body.subtitle || '').trim();
      imagePath = sanitizeWebUrl(body.image) || existing?.image || defaults.image;
    }

    if (!title) {
      return NextResponse.json({ error: 'Hero title is required' }, { status: 400 });
    }

    const updated = await (prisma as any).pageHero.upsert({
      where: { pageKey },
      update: {
        title,
        subtitle,
        image: imagePath,
      },
      create: {
        pageKey,
        title,
        subtitle,
        image: imagePath,
      },
    });

    revalidatePublicPages();

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error(`Error saving page hero for ${pageKey}:`, error);
    return NextResponse.json(
      { error: 'Failed to update page hero' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  return POST(request, context);
}
