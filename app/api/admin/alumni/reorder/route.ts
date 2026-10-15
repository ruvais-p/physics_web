import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/api-auth';
import { prisma } from '@/lib/prisma';
import { revalidatePublicPages } from '@/lib/public-cache';

// PUT /api/admin/alumni/reorder - Drag & drop reorder for alumni sections
export async function PUT(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, items } = body as {
      type: 'executives' | 'achievements' | 'programs';
      items: Array<{ id: string; sortOrder: number }>;
    };

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Items array is required for reordering' }, { status: 400 });
    }

    if (type === 'executives') {
      await prisma.$transaction(
        items.map((item) =>
          prisma.alumniExecutive.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          })
        )
      );
    } else if (type === 'achievements') {
      await prisma.$transaction(
        items.map((item) =>
          prisma.alumniAchievement.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          })
        )
      );
    } else if (type === 'programs') {
      await prisma.$transaction(
        items.map((item) =>
          prisma.alumniSponsoredProgram.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          })
        )
      );
    } else {
      return NextResponse.json({ error: 'Invalid reorder type' }, { status: 400 });
    }

    revalidatePublicPages();

    return NextResponse.json({
      success: true,
      message: 'Reordered successfully',
    });
  } catch (error) {
    console.error('Error reordering alumni records:', error);
    return NextResponse.json({ error: 'Failed to reorder items' }, { status: 500 });
  }
}
