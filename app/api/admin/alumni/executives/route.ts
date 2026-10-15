import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/api-auth';
import { saveImageAsWebp, isAllowedImageType } from '@/lib/image';
import { revalidatePublicPages } from '@/lib/public-cache';

// GET /api/admin/alumni/executives - List all executive members
export async function GET() {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const executives = await prisma.alumniExecutive.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
    return NextResponse.json(executives);
  } catch (error) {
    console.error('Failed to fetch alumni executives:', error);
    return NextResponse.json({ error: 'Failed to fetch executive records' }, { status: 500 });
  }
}

// POST /api/admin/alumni/executives - Create a new executive member
export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const contentType = request.headers.get('content-type') || '';
    let name = '';
    let role = '';
    let batch: string | null = null;
    let imagePath: string | null = null;
    let isActive = true;
    let sortOrder = 0;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      name = (formData.get('name') as string || '').trim();
      role = (formData.get('role') as string || '').trim();
      batch = (formData.get('batch') as string || '').trim() || null;

      const activeVal = formData.get('isActive');
      if (activeVal !== null) {
        isActive = activeVal === 'true' || activeVal === '1';
      }

      const sortVal = formData.get('sortOrder');
      if (sortVal !== null) {
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
      } else if (imageUrlInput) {
        imagePath = imageUrlInput;
      }
    } else {
      const body = await request.json();
      name = (body.name || '').trim();
      role = (body.role || '').trim();
      batch = (body.batch || '').trim() || null;
      imagePath = body.image || null;
      if (body.isActive !== undefined) isActive = Boolean(body.isActive);
      if (body.sortOrder !== undefined) sortOrder = parseInt(body.sortOrder, 10) || 0;
    }

    if (!name) {
      return NextResponse.json({ error: 'Officer name is required' }, { status: 400 });
    }
    if (!role) {
      return NextResponse.json({ error: 'Officer position/role is required' }, { status: 400 });
    }

    const created = await prisma.alumniExecutive.create({
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

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Failed to create executive record:', error);
    return NextResponse.json({ error: 'Failed to create executive member' }, { status: 500 });
  }
}
