import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/api-auth';
import { DEFAULT_PAGE_HEROES } from '@/lib/page-hero';

// GET all Page Heroes for Admin Dashboard
export async function GET() {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
  }

  try {
    const records = await prisma.pageHero.findMany();
    const recordMap = new Map(records.map((record) => [record.pageKey, record]));

    const list = Object.values(DEFAULT_PAGE_HEROES).map((defaults) => {
      const saved = recordMap.get(defaults.pageKey);
      return {
        pageKey: defaults.pageKey,
        pageName: defaults.pageName,
        title: saved?.title || defaults.title,
        subtitle: saved?.subtitle !== null && saved?.subtitle !== undefined ? saved.subtitle : defaults.subtitle,
        image: saved?.image || defaults.image,
        updatedAt: saved?.updatedAt || null,
        isCustomized: Boolean(saved),
      };
    });

    return NextResponse.json(list);
  } catch (error) {
    console.error('Error fetching CMS page heroes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page hero configurations' },
      { status: 500 }
    );
  }
}
