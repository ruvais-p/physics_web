import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuthToken } from '@/lib/auth';
import { cookies } from 'next/headers';

async function checkAuth() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get('auth_token')?.value ||
    cookieStore.get('admin_token')?.value ||
    cookieStore.get('faculty_token')?.value;

  if (!token) return null;
  return verifyAuthToken(token);
}

export async function PUT(request: Request) {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { items } = body as { items: Array<{ id: number; order: number }> };

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Items array is required for reordering' }, { status: 400 });
    }

    await prisma.$transaction(
      items.map((item) =>
        prisma.hero.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: 'Hero slides reordered successfully',
    });
  } catch (error) {
    console.error('Error reordering hero slides:', error);
    return NextResponse.json(
      { error: 'Failed to reorder hero slides' },
      { status: 500 }
    );
  }
}
