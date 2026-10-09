import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/api-auth';
import { revalidatePublicPages } from '@/lib/public-cache';
import { sanitizeWebUrl } from '@/lib/url-security';
import { hasPdfSignature, deleteUploadedFile } from '@/lib/file-security';
import fs from 'fs/promises';
import path from 'path';

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
    const existing = await prisma.notification.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    const contentType = request.headers.get('content-type') || '';
    let title = existing.title;
    let category = existing.category;
    let link = existing.link;
    let pdfPath = existing.pdfUrl;
    let content = existing.content;
    let isActive = existing.isActive;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      if (formData.has('title')) {
        title = (formData.get('title') as string || '').trim();
      }
      if (formData.has('category')) {
        category = (formData.get('category') as string || 'General').trim();
      }
      if (formData.has('link')) {
        const linkInput = (formData.get('link') as string || '').trim();
        link = linkInput ? sanitizeWebUrl(linkInput, false) : null;
      }
      if (formData.has('content')) {
        const contentInput = (formData.get('content') as string || '').trim();
        content = contentInput || null;
      }
      if (formData.has('isActive')) {
        isActive = formData.get('isActive') === 'true';
      }

      const removePdf = formData.get('removePdf') === 'true';
      const pdfFile = formData.get('pdf') as File | null;
      const pdfUrlInput = (formData.get('pdfUrl') as string || '').trim();

      if (removePdf) {
        if (existing.pdfUrl) {
          await deleteUploadedFile(existing.pdfUrl, 'notifications').catch(() => {});
        }
        pdfPath = null;
      } else if (pdfFile && pdfFile.size > 0) {
        if (!pdfFile.name.toLowerCase().endsWith('.pdf') && pdfFile.type !== 'application/pdf') {
          return NextResponse.json({ error: 'Only PDF documents (.pdf) are allowed.' }, { status: 400 });
        }
        const bytes = await pdfFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        if (!hasPdfSignature(buffer)) {
          return NextResponse.json({ error: 'Uploaded file is not a valid PDF document.' }, { status: 400 });
        }
        if (existing.pdfUrl) {
          await deleteUploadedFile(existing.pdfUrl, 'notifications').catch(() => {});
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
      if (body.title !== undefined) title = String(body.title).trim();
      if (body.category !== undefined) category = String(body.category).trim();
      if (body.link !== undefined) link = body.link ? sanitizeWebUrl(body.link, false) : null;
      if (body.removePdf) {
        if (existing.pdfUrl) {
          await deleteUploadedFile(existing.pdfUrl, 'notifications').catch(() => {});
        }
        pdfPath = null;
      } else if (body.pdfUrl !== undefined) {
        pdfPath = body.pdfUrl ? sanitizeWebUrl(body.pdfUrl, true) : null;
      }
      if (body.content !== undefined) {
        content = typeof body.content === 'string' ? body.content.trim().slice(0, 10_000) || null : null;
      }
      if (body.isActive !== undefined) {
        isActive = Boolean(body.isActive);
      }
    }

    if (!title || title.length > 200) {
      return NextResponse.json({ error: 'A valid title is required (max 200 chars)' }, { status: 400 });
    }

    // Mutually exclusive: strictly allow either PDF or Link, never both
    if (pdfPath) {
      link = null;
    } else if (link) {
      if (existing.pdfUrl) {
        await deleteUploadedFile(existing.pdfUrl, 'notifications').catch(() => {});
      }
      pdfPath = null;
    }

    const updatedNotification = await prisma.notification.update({
      where: { id },
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
    const existing = await prisma.notification.findUnique({
      where: { id },
    });

    if (existing?.pdfUrl) {
      await deleteUploadedFile(existing.pdfUrl, 'notifications').catch(() => {});
    }

    await prisma.notification.delete({
      where: { id },
    });

    revalidatePublicPages();
    return NextResponse.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
}
