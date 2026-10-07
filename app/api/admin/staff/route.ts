import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/api-auth';
import { saveImageAsWebp, isAllowedImageType } from '@/lib/image';
import { revalidatePublicPages } from '@/lib/public-cache';

// GET /api/admin/staff - List all office staff
export async function GET() {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const staff = await prisma.staff.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
    return NextResponse.json(staff);
  } catch (error) {
    console.error('Failed to fetch staff members:', error);
    return NextResponse.json({ error: 'Failed to fetch staff records' }, { status: 500 });
  }
}

// POST /api/admin/staff - Create new office staff member
export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const contentType = request.headers.get('content-type') || '';
    let name = '';
    let designation = '';
    let email: string | null = null;
    let phone: string | null = null;
    let room: string | null = null;
    let imagePath: string | null = null;
    let isActive = true;
    let sortOrder = 0;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      name = (formData.get('name') as string || '').trim();
      designation = (formData.get('designation') as string || '').trim();
      email = (formData.get('email') as string || '').trim() || null;
      phone = (formData.get('phone') as string || '').trim() || null;
      room = (formData.get('room') as string || '').trim() || null;
      
      const activeVal = formData.get('isActive');
      if (activeVal !== null) {
        isActive = activeVal === 'true' || activeVal === '1';
      }

      const sortVal = formData.get('sortOrder');
      if (sortVal !== null) {
        sortOrder = parseInt(sortVal as string, 10) || 0;
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
      }
    } else {
      const body = await request.json();
      name = (body.name || '').trim();
      designation = (body.designation || '').trim();
      email = (body.email || '').trim() || null;
      phone = (body.phone || '').trim() || null;
      room = (body.room || '').trim() || null;
      imagePath = body.image || null;
      if (body.isActive !== undefined) isActive = Boolean(body.isActive);
      if (body.sortOrder !== undefined) sortOrder = Number(body.sortOrder) || 0;
    }

    if (!name) {
      return NextResponse.json({ error: 'Staff name is required.' }, { status: 400 });
    }
    if (!designation) {
      return NextResponse.json({ error: 'Staff designation is required.' }, { status: 400 });
    }

    // Determine default sortOrder if not provided
    if (sortOrder === 0) {
      const maxOrder = await prisma.staff.aggregate({ _max: { sortOrder: true } });
      sortOrder = (maxOrder._max.sortOrder || 0) + 1;
    }

    const newStaff = await prisma.staff.create({
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

    return NextResponse.json(newStaff, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create staff member:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create staff member.' },
      { status: 500 }
    );
  }
}
