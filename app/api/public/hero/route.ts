import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const slides = await prisma.hero.findMany({
      where: { is_visible: true },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' },
      ],
    });

    return NextResponse.json(slides);
  } catch (error) {
    console.error('Error fetching public hero slides:', error);
    return NextResponse.json(
      { error: 'Failed to load hero slides' },
      { status: 500 }
    );
  }
}
