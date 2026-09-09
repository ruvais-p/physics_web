import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/api-auth';
import { sanitizeWebUrl } from '@/lib/url-security';

// PUT: Update an existing notification
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { title, category, link, isActive, content } = body;

    if (typeof title !== 'string' || !title.trim() || title.length > 200) {
      return NextResponse.json({ error: 'A valid title is required' }, { status: 400 });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: {
        title: title.trim(),
        category: typeof category === 'string' ? category.trim().slice(0, 80) || 'General' : 'General',
        link: link ? sanitizeWebUrl(link) : null,
        content: typeof content === 'string' ? content.trim().slice(0, 10_000) || null : null,
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}

// DELETE: Remove a notification
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    await prisma.notification.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
}
