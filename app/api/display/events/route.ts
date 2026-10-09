import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // 1. Fetch all events explicitly flagged for TV display
    const tvEvents = await prisma.$queryRaw<any[]>`
      SELECT 
        id, 
        title, 
        description, 
        image, 
        start_date AS "startDate", 
        end_date AS "endDate", 
        venue, 
        apply_link AS "applyLink", 
        brochure, 
        tv_duration AS "tvDuration",
        created_at AS "createdAt"
      FROM events
      WHERE broadcast_to_tv = true
      ORDER BY 
        CASE 
          WHEN start_date >= NOW() THEN 0 
          ELSE 1 
        END,
        start_date ASC
    `;

    // 2. Fetch active ticker notices (for the live ticker at bottom of screen)
    const notices = await prisma.$queryRaw<any[]>`
      SELECT id, title, content, category, date
      FROM "Notification"
      WHERE "isActive" = true
      ORDER BY date DESC
      LIMIT 8
    `.catch(() => []);

    // 3. Fallback: If no event is flagged for TV broadcast, fetch up to 3 latest upcoming events
    let fallbackEvents: any[] = [];
    if (tvEvents.length === 0) {
      fallbackEvents = await prisma.$queryRaw<any[]>`
        SELECT 
          id, 
          title, 
          description, 
          image, 
          start_date AS "startDate", 
          end_date AS "endDate", 
          venue, 
          apply_link AS "applyLink", 
          brochure, 
          12 AS "tvDuration",
          created_at AS "createdAt"
        FROM events
        ORDER BY start_date DESC
        LIMIT 3
      `.catch(() => []);
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      isUsingFallback: tvEvents.length === 0,
      events: tvEvents.length > 0 ? tvEvents : fallbackEvents,
      notices,
    }, {
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
