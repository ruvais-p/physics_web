import { EventEmitter } from 'events';
import { prisma } from '@/lib/prisma';

export interface DisplayEvent {
  id: number;
  title: string;
  description: string;
  image: string | null;
  startDate: Date | string;
  endDate: Date | string | null;
  venue: string | null;
  applyLink: string | null;
  brochure: string | null;
  tvDuration: number;
  createdAt: Date | string;
}

export interface DisplayNotice {
  id: string;
  title: string;
  content: string | null;
  category: string;
  date: Date | string;
}

export interface TvDisplayPayload {
  success: boolean;
  timestamp: string;
  isUsingFallback: boolean;
  events: DisplayEvent[];
  notices: DisplayNotice[];
}

// Global singleton so the same EventEmitter instance is shared across all Route Handlers
const globalForTvEmitter = globalThis as unknown as {
  tvEmitter?: EventEmitter;
};

export const tvEmitter = globalForTvEmitter.tvEmitter ?? new EventEmitter();
tvEmitter.setMaxListeners(100);

if (process.env.NODE_ENV !== 'production') {
  globalForTvEmitter.tvEmitter = tvEmitter;
}

/**
 * Triggers an immediate SSE broadcast to all connected TV screens.
 */
export function notifyTvDisplay() {
  try {
    tvEmitter.emit('tv_update');
  } catch (err) {
    console.error('Error emitting TV display update:', err);
  }
}

/**
 * Fetches the active events and notices formatted for the TV display.
 */
export async function getTvDisplayData(): Promise<TvDisplayPayload> {
  // 1. Fetch all events explicitly flagged for TV display
  const tvEvents = await prisma.$queryRaw<DisplayEvent[]>`
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
  `.catch(() => []);

  // 2. Fetch active ticker notices (for the live ticker at bottom of screen)
  const notices = await prisma.notification.findMany({
    where: { isActive: true },
    orderBy: { date: 'desc' },
    take: 8,
    select: {
      id: true,
      title: true,
      content: true,
      category: true,
      date: true,
    },
  }).catch(() => []);

  // 3. Fallback: If no event is flagged for TV broadcast, fetch up to 3 latest upcoming events
  let fallbackEvents: DisplayEvent[] = [];
  if (tvEvents.length === 0) {
    fallbackEvents = await prisma.$queryRaw<DisplayEvent[]>`
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

  return {
    success: true,
    timestamp: new Date().toISOString(),
    isUsingFallback: tvEvents.length === 0,
    events: tvEvents.length > 0 ? tvEvents : fallbackEvents,
    notices: notices as DisplayNotice[],
  };
}
