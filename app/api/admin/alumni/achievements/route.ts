import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/api-auth';
import { saveImageAsWebp, isAllowedImageType } from '@/lib/image';
import { revalidatePublicPages } from '@/lib/public-cache';

// GET /api/admin/alumni/achievements - List all achievements
export async function GET() {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const achievements = await prisma.alumniAchievement.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json(achievements);
  } catch (error) {
    console.error('Failed to fetch alumni achievements:', error);
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
  }
}

// POST /api/admin/alumni/achievements - Create an achievement
export async function POST(request: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const contentType = request.headers.get('content-type') || '';
    let awardName = '';
    let recipient = '';
    let batch: string | null = null;
    let date = '';
    let desc = '';
    let photoPath: string | null = null;
    let sortOrder = 0;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      awardName = (formData.get('awardName') as string || '').trim();
      recipient = (formData.get('recipient') as string || '').trim();
      batch = (formData.get('batch') as string || '').trim() || null;
      date = (formData.get('date') as string || '').trim();
      desc = (formData.get('desc') as string || '').trim();

      const sortVal = formData.get('sortOrder');
      if (sortVal !== null) {
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
      } else if (photoUrlInput) {
        photoPath = photoUrlInput;
      }
    } else {
      const body = await request.json();
      awardName = (body.awardName || '').trim();
      recipient = (body.recipient || '').trim();
      batch = (body.batch || '').trim() || null;
      date = (body.date || '').trim();
      desc = (body.desc || '').trim();
      photoPath = body.photo || null;
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

    const created = await prisma.alumniAchievement.create({
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

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Failed to create achievement record:', error);
    return NextResponse.json({ error: 'Failed to create achievement' }, { status: 500 });
  }
}
