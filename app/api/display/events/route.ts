import { NextResponse } from 'next/server';
import { getTvDisplayData } from '@/lib/tv-events';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const data = await getTvDisplayData();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error fetching TV display events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch display broadcast events', events: [], notices: [] },
      { status: 500 }
    );
  }
}

