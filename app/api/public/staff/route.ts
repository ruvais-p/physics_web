import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 300;

// GET /api/public/staff - List active office staff members
export async function GET() {
  try {
    const staff = await prisma.staff.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        designation: true,
        email: true,
        phone: true,
        room: true,
        image: true,
        sortOrder: true,
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error('Error fetching public staff list:', error);
    return NextResponse.json({ error: 'Failed to load staff list' }, { status: 500 });
  }
}
