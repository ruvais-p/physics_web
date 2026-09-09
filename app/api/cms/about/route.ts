import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/api-auth';

// GET CMS About Us record
export async function GET() {
  const user = await getAdminSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const aboutRecord = await prisma.aboutUs.findFirst({
      orderBy: { id: 'asc' },
    });

    return NextResponse.json(aboutRecord || { content: '' });
  } catch (error) {
    console.error('Error fetching CMS about us record:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about us details' },
      { status: 500 }
    );
  }
}

// POST/PUT save CMS About Us details
export async function POST(request: Request) {
  const user = await getAdminSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const existing = await prisma.aboutUs.findFirst({
      orderBy: { id: 'asc' },
    });

    const contentType = request.headers.get('content-type') || '';
    let content = existing?.content || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      if (formData.has('content')) {
        content = (formData.get('content') as string || '').trim();
      }
    } else {
      const body = await request.json();
      if (body.content !== undefined) content = (body.content || '').trim();
    }

    if (!content) {
      return NextResponse.json({ error: 'About Us content is required' }, { status: 400 });
    }

    let result;
    if (existing) {
      result = await prisma.aboutUs.update({
        where: { id: existing.id },
        data: {
          content,
        },
      });
    } else {
      result = await prisma.aboutUs.create({
        data: {
          content,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error saving about us details:', error);
    return NextResponse.json(
      { error: 'Failed to save about us details' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  return POST(request);
}
