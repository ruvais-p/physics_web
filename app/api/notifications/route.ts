import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        link: true,
        isActive: true,
        date: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(
      notifications.map((item: any) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        link: item.link || '#',
        isActive: item.isActive,
        date: new Date(item.date).toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }),
      }))
    );
  } catch (error) {
    console.error('Error fetching public notifications:', error);
    return NextResponse.json([], { status: 500 });
  }
}
