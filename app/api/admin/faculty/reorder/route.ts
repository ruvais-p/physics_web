import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

async function authenticateAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value || cookieStore.get('auth_token')?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

// PUT /api/admin/faculty/reorder - Reorder faculty accounts
export async function PUT(request: Request) {
  const admin = await authenticateAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { items } = body as { items: Array<{ id: string; sortOrder: number }> };

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Items array is required for reordering' }, { status: 400 });
    }

    await prisma.$transaction(
      items.map((item) =>
        prisma.faculty.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: 'Faculty members reordered successfully',
    });
  } catch (error) {
    console.error('Error reordering faculty members:', error);
    return NextResponse.json(
      { error: 'Failed to reorder faculty members' },
      { status: 500 }
    );
  }
}
