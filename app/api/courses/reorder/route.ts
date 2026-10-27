import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/api-auth';
import { revalidatePublicPages } from '@/lib/public-cache';

// PUT /api/courses/reorder - Batch reorder courses/programmes
export async function PUT(request: Request) {
  const user = await getAdminSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Admin login required.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { items } = body as { items: Array<{ id: string; sortOrder: number }> };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items array is required for reordering' }, { status: 400 });
    }

    await prisma.$transaction(
      items.map((item) =>
        prisma.course.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    );

    revalidatePublicPages();
    return NextResponse.json({
      success: true,
      message: 'Programmes reordered successfully',
    });
  } catch (error) {
    console.error('Error reordering courses:', error);
    return NextResponse.json(
      { error: 'Failed to reorder courses' },
      { status: 500 }
    );
  }
}
