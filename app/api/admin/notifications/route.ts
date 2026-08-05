import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Fetch all notifications for Admin Dashboard
export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
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
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching admin notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

// POST: Add a new notification
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, link, isActive, content } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const newNotification = await prisma.notification.create({
      data: {
        title,
        category: category || 'General',
        link: link || null,
        content: content || null,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json(newNotification, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}
