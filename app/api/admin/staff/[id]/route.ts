import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/api-auth';
import { saveImageAsWebp, isAllowedImageType } from '@/lib/image';
import { revalidatePublicPages } from '@/lib/public-cache';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PUT /api/admin/staff/[id] - Update staff member
export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const existing = await prisma.staff.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Staff member not found.' }, { status: 404 });
    }

    const contentType = request.headers.get('content-type') || '';
    let name = existing.name;
    let designation = existing.designation;
    let email: string | null = existing.email;
    let phone: string | null = existing.phone;
    let room: string | null = existing.room;
    let imagePath: string | null = existing.image;
    let isActive = existing.isActive;
    let sortOrder = existing.sortOrder;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      if (formData.has('name')) name = (formData.get('name') as string || '').trim();
      if (formData.has('designation')) designation = (formData.get('designation') as string || '').trim();
      if (formData.has('email')) email = (formData.get('email') as string || '').trim() || null;
      if (formData.has('phone')) phone = (formData.get('phone') as string || '').trim() || null;
      if (formData.has('room')) room = (formData.get('room') as string || '').trim() || null;
      
      if (formData.has('isActive')) {
        const activeVal = formData.get('isActive');
        isActive = activeVal === 'true' || activeVal === '1';
      }

      if (formData.has('sortOrder')) {
        sortOrder = parseInt(formData.get('sortOrder') as string, 10) || 0;
      }

      const imageFile = formData.get('image') as File | null;
      if (imageFile && imageFile.size > 0) {
        if (!isAllowedImageType(imageFile.type || imageFile.name)) {
          return NextResponse.json({ error: 'Invalid image format. Supported formats: JPG, PNG, WebP.' }, { status: 400 });
        }
        const saved = await saveImageAsWebp(imageFile, 'public/uploads/staff', 'staff_photo', {
          maxWidth: 800,
          maxHeight: 800,
          quality: 85,
        });
        imagePath = saved.relativePath;
      } else if (formData.has('removeImage') && formData.get('removeImage') === 'true') {
        imagePath = null;
      }
    } else {
      const body = await request.json();
      if (body.name !== undefined) name = (body.name || '').trim();
      if (body.designation !== undefined) designation = (body.designation || '').trim();
      if (body.email !== undefined) email = (body.email || '').trim() || null;
      if (body.phone !== undefined) phone = (body.phone || '').trim() || null;
      if (body.room !== undefined) room = (body.room || '').trim() || null;
      if (body.image !== undefined) imagePath = body.image || null;
      if (body.isActive !== undefined) isActive = Boolean(body.isActive);
      if (body.sortOrder !== undefined) sortOrder = Number(body.sortOrder) || 0;
    }

    if (!name) {
      return NextResponse.json({ error: 'Staff name cannot be empty.' }, { status: 400 });
    }
    if (!designation) {
      return NextResponse.json({ error: 'Staff designation cannot be empty.' }, { status: 400 });
    }

    const updated = await prisma.staff.update({
      where: { id },
      data: {
        name,
        designation,
        email,
        phone,
        room,
        image: imagePath,
        isActive,
        sortOrder,
      },
    });

    revalidatePublicPages();

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error(`Failed to update staff member ${id}:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to update staff member.' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/staff/[id] - Remove staff member
export async function DELETE(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const existing = await prisma.staff.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Staff member not found.' }, { status: 404 });
    }

    await prisma.staff.delete({ where: { id } });

    revalidatePublicPages();

    return NextResponse.json({ success: true, message: 'Staff member removed successfully.' });
  } catch (error: any) {
    console.error(`Failed to delete staff member ${id}:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete staff member.' },
      { status: 500 }
    );
  }
}
