import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/api-auth';
import { revalidatePublicPages } from '@/lib/public-cache';
import { sanitizeWebUrl } from '@/lib/url-security';

// GET: Fetch all notifications for Admin Dashboard
export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, category, link, isActive, content } = body;

    if (typeof title !== 'string' || !title.trim() || title.length > 200) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const newNotification = await prisma.notification.create({
      data: {
        title: title.trim(),
        category: typeof category === 'string' ? category.trim().slice(0, 80) || 'General' : 'General',
        link: link ? sanitizeWebUrl(link) : null,
        content: typeof content === 'string' ? content.trim().slice(0, 10_000) || null : null,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    revalidatePublicPages();
    return NextResponse.json(newNotification, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}
