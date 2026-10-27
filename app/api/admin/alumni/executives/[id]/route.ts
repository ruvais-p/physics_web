import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/api-auth';
import { saveImageAsWebp, isAllowedImageType } from '@/lib/image';
import { revalidatePublicPages } from '@/lib/public-cache';

// PUT /api/admin/alumni/executives/[id] - Update an executive member
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await prisma.alumniExecutive.findUnique({
      where: { id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Executive member not found' }, { status: 404 });
    }

    const contentType = request.headers.get('content-type') || '';
    let name = existing.name;
    let role = existing.role;
    let batch = existing.batch;
    let imagePath = existing.image;
    let isActive = existing.isActive;
    let sortOrder = existing.sortOrder;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      if (formData.has('name')) name = (formData.get('name') as string || '').trim();
      if (formData.has('role')) role = (formData.get('role') as string || '').trim();
      if (formData.has('batch')) batch = (formData.get('batch') as string || '').trim() || null;

      if (formData.has('isActive')) {
        const activeVal = formData.get('isActive');
        isActive = activeVal === 'true' || activeVal === '1';
      }

      if (formData.has('sortOrder')) {
        const sortVal = formData.get('sortOrder');
        sortOrder = parseInt(sortVal as string, 10) || 0;
      }

      const imageFile = formData.get('image') as File | null;
      const imageUrlInput = (formData.get('imageUrl') as string || '').trim();

      if (imageFile && imageFile.size > 0) {
        if (!isAllowedImageType(imageFile.type || imageFile.name)) {
          return NextResponse.json(
            { error: 'Invalid image format. Supported formats: JPG, PNG, WebP.' },
            { status: 400 }
          );
        }
        const saved = await saveImageAsWebp(imageFile, 'public/uploads/alumni', 'executive_photo', {
          maxWidth: 800,
          maxHeight: 800,
          quality: 85,
        });
        imagePath = saved.relativePath;
      } else if (imageUrlInput !== undefined) {
        if (imageUrlInput === '' || imageUrlInput === 'null') {
          imagePath = null;
        } else {
          imagePath = imageUrlInput;
        }
      }
    } else {
      const body = await request.json();
      if (body.name !== undefined) name = (body.name || '').trim();
      if (body.role !== undefined) role = (body.role || '').trim();
      if (body.batch !== undefined) batch = (body.batch || '').trim() || null;
      if (body.image !== undefined) imagePath = body.image || null;
      if (body.isActive !== undefined) isActive = Boolean(body.isActive);
      if (body.sortOrder !== undefined) sortOrder = parseInt(body.sortOrder, 10) || 0;
    }

    if (!name) {
      return NextResponse.json({ error: 'Officer name is required' }, { status: 400 });
    }
    if (!role) {
      return NextResponse.json({ error: 'Officer position/role is required' }, { status: 400 });
    }

    const updated = await prisma.alumniExecutive.update({
      where: { id },
      data: {
        name,
        role,
        batch,
        image: imagePath,
        isActive,
        sortOrder,
      },
    });

    revalidatePublicPages();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update executive member:', error);
    return NextResponse.json({ error: 'Failed to update executive record' }, { status: 500 });
  }
}

// DELETE /api/admin/alumni/executives/[id] - Delete an executive member
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await prisma.alumniExecutive.findUnique({
      where: { id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Executive member not found' }, { status: 404 });
    }

    await prisma.alumniExecutive.delete({
      where: { id },
    });

    revalidatePublicPages();

    return NextResponse.json({ success: true, message: 'Executive member deleted successfully' });
  } catch (error) {
    console.error('Failed to delete executive member:', error);
    return NextResponse.json({ error: 'Failed to delete executive record' }, { status: 500 });
  }
}
