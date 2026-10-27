import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/api-auth';
import { saveImageAsWebp, isAllowedImageType } from '@/lib/image';
import { revalidatePublicPages } from '@/lib/public-cache';

// PUT /api/admin/alumni/achievements/[id] - Update an achievement
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
    const existing = await prisma.alumniAchievement.findUnique({
      where: { id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    const contentType = request.headers.get('content-type') || '';
    let awardName = existing.awardName;
    let recipient = existing.recipient;
    let batch = existing.batch;
    let date = existing.date;
    let desc = existing.desc;
    let photoPath = existing.photo;
    let sortOrder = existing.sortOrder;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      if (formData.has('awardName')) awardName = (formData.get('awardName') as string || '').trim();
      if (formData.has('recipient')) recipient = (formData.get('recipient') as string || '').trim();
      if (formData.has('batch')) batch = (formData.get('batch') as string || '').trim() || null;
      if (formData.has('date')) date = (formData.get('date') as string || '').trim();
      if (formData.has('desc')) desc = (formData.get('desc') as string || '').trim();

      if (formData.has('sortOrder')) {
        const sortVal = formData.get('sortOrder');
        sortOrder = parseInt(sortVal as string, 10) || 0;
      }

      const photoFile = formData.get('photo') as File | null;
      const photoUrlInput = (formData.get('photoUrl') as string || '').trim();

      if (photoFile && photoFile.size > 0) {
        if (!isAllowedImageType(photoFile.type || photoFile.name)) {
          return NextResponse.json(
            { error: 'Invalid photo format. Supported formats: JPG, PNG, WebP.' },
            { status: 400 }
          );
        }
        const saved = await saveImageAsWebp(photoFile, 'public/uploads/alumni', 'achievement_photo', {
          maxWidth: 1200,
          maxHeight: 900,
          quality: 85,
        });
        photoPath = saved.relativePath;
      } else if (photoUrlInput !== undefined) {
        if (photoUrlInput === '' || photoUrlInput === 'null') {
          photoPath = null;
        } else {
          photoPath = photoUrlInput;
        }
      }
    } else {
      const body = await request.json();
      if (body.awardName !== undefined) awardName = (body.awardName || '').trim();
      if (body.recipient !== undefined) recipient = (body.recipient || '').trim();
      if (body.batch !== undefined) batch = (body.batch || '').trim() || null;
      if (body.date !== undefined) date = (body.date || '').trim();
      if (body.desc !== undefined) desc = (body.desc || '').trim();
      if (body.photo !== undefined) photoPath = body.photo || null;
      if (body.sortOrder !== undefined) sortOrder = parseInt(body.sortOrder, 10) || 0;
    }

    if (!awardName) {
      return NextResponse.json({ error: 'Name of the award/achievement is required' }, { status: 400 });
    }
    if (!recipient) {
      return NextResponse.json({ error: 'Recipient name is required' }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ error: 'Date of award is required' }, { status: 400 });
    }
    if (!desc) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    const updated = await prisma.alumniAchievement.update({
      where: { id },
      data: {
        awardName,
        recipient,
        batch,
        date,
        desc,
        photo: photoPath,
        sortOrder,
      },
    });

    revalidatePublicPages();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update achievement:', error);
    return NextResponse.json({ error: 'Failed to update achievement record' }, { status: 500 });
  }
}

// DELETE /api/admin/alumni/achievements/[id] - Delete an achievement
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
    const existing = await prisma.alumniAchievement.findUnique({
      where: { id },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
    }

    await prisma.alumniAchievement.delete({
      where: { id },
    });

    revalidatePublicPages();

    return NextResponse.json({ success: true, message: 'Achievement deleted successfully' });
  } catch (error) {
    console.error('Failed to delete achievement:', error);
    return NextResponse.json({ error: 'Failed to delete achievement record' }, { status: 500 });
  }
}
