import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/api-auth';
import { revalidatePublicPages } from '@/lib/public-cache';
import { sanitizeWebUrl } from '@/lib/url-security';
import { hasPdfSignature } from '@/lib/file-security';
import fs from 'fs/promises';
import path from 'path';

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
        pdfUrl: true,
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
    const contentType = request.headers.get('content-type') || '';
    let title = '';
    let category = 'General';
    let link: string | null = null;
    let pdfPath: string | null = null;
    let content: string | null = null;
    let isActive = true;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      title = (formData.get('title') as string || '').trim();
      category = (formData.get('category') as string || 'General').trim();
      const linkInput = (formData.get('link') as string || '').trim();
      if (linkInput) link = sanitizeWebUrl(linkInput, false);
      const contentInput = (formData.get('content') as string || '').trim();
      if (contentInput) content = contentInput;
      if (formData.has('isActive')) {
        isActive = formData.get('isActive') === 'true';
      }

      const pdfFile = formData.get('pdf') as File | null;
      const pdfUrlInput = (formData.get('pdfUrl') as string || '').trim();

      if (pdfFile && pdfFile.size > 0) {
        if (!pdfFile.name.toLowerCase().endsWith('.pdf') && pdfFile.type !== 'application/pdf') {
          return NextResponse.json({ error: 'Only PDF documents (.pdf) are allowed.' }, { status: 400 });
        }
        const bytes = await pdfFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        if (!hasPdfSignature(buffer)) {
          return NextResponse.json({ error: 'Uploaded file is not a valid PDF document.' }, { status: 400 });
        }
        const timestamp = Date.now();
        const sanitizedName = path.parse(pdfFile.name).name.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50);
        const fileName = `notice_${timestamp}_${sanitizedName || 'document'}.pdf`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'notifications');
        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(path.join(uploadDir, fileName), buffer);
        pdfPath = `/uploads/notifications/${fileName}`;
      } else if (pdfUrlInput) {
        pdfPath = sanitizeWebUrl(pdfUrlInput, true);
      }
    } else {
      const body = await request.json();
      title = (body.title || '').trim();
      category = (body.category || 'General').trim();
      link = body.link ? sanitizeWebUrl(body.link, false) : null;
      pdfPath = body.pdfUrl ? sanitizeWebUrl(body.pdfUrl, true) : null;
      content = typeof body.content === 'string' ? body.content.trim().slice(0, 10_000) || null : null;
      if (body.isActive !== undefined) {
        isActive = Boolean(body.isActive);
      }
    }

    if (!title || title.length > 200) {
      return NextResponse.json({ error: 'Title is required (max 200 chars)' }, { status: 400 });
    }

    // Mutually exclusive: strictly allow either PDF or Link, never both
    if (pdfPath) {
      link = null;
    } else if (link) {
      pdfPath = null;
    }

    const newNotification = await prisma.notification.create({
      data: {
        title,
        category: category.slice(0, 80) || 'General',
        link,
        pdfUrl: pdfPath,
        content,
        isActive,
      },
    });

    revalidatePublicPages();
    return NextResponse.json(newNotification, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}
