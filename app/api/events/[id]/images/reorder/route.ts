import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuthToken } from '@/lib/auth';
import { cookies } from 'next/headers';

async function checkAuth() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get('auth_token')?.value ||
    cookieStore.get('admin_token')?.value ||
    cookieStore.get('faculty_token')?.value;

  if (!token) return null;
  return verifyAuthToken(token);
}

interface Params {
  params: Promise<{ id: string }>;
}

// PUT /api/events/[id]/images/reorder - Reorder gallery images
export async function PUT(request: Request, { params }: Params) {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Admin or Faculty session required.' }, { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const eventId = parseInt(resolvedParams.id, 10);

    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    const body = await request.json();
    const imageIds: number[] = body.imageIds;

    if (!Array.isArray(imageIds) || imageIds.length === 0) {
      return NextResponse.json({ error: 'Array of imageIds is required' }, { status: 400 });
    }

    // Perform atomic transaction updating sortOrder for all specified image IDs
    await (prisma as any).$transaction(
      imageIds.map((id, index) =>
        (prisma as any).eventImage.updateMany({
          where: { id, eventId },
          data: { sortOrder: index + 1 },
        })
      )
    );

    const updatedImages = await (prisma as any).eventImage.findMany({
      where: { eventId },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json(updatedImages);
  } catch (error) {
    console.error('Error reordering event gallery images:', error);
    return NextResponse.json({ error: 'Failed to reorder gallery images' }, { status: 500 });
  }
}
