import { getTvDisplayData, tvEmitter, type TvDisplayPayload } from '@/lib/tv-events';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let isClosed = false;

      const safeEnqueue = (text: string) => {
        if (isClosed) return;
        try {
          controller.enqueue(encoder.encode(text));
        } catch {
          isClosed = true;
        }
      };

      const sendPayload = (payload: TvDisplayPayload) => {
        safeEnqueue(`data: ${JSON.stringify(payload)}\n\n`);
      };

      // 1. Send initial snapshot immediately upon connection
      try {
        const initialData = await getTvDisplayData();
        sendPayload(initialData);
      } catch (err) {
        console.error('Failed to send initial SSE TV data:', err);
      }

      // 2. Real-time update listener
      const onTvUpdate = async () => {
        if (isClosed) return;
        try {
          const freshData = await getTvDisplayData();
          sendPayload(freshData);
        } catch (err) {
          console.error('Failed to push SSE update to TV:', err);
        }
      };

      tvEmitter.on('tv_update', onTvUpdate);

      // 3. Heartbeat ping every 25s to keep connection alive through proxies
      const heartbeatInterval = setInterval(() => {
        if (isClosed) return;
        safeEnqueue(': ping\n\n');
      }, 25000);

      // 4. Teardown when connection is closed
      const cleanup = () => {
        if (isClosed) return;
        isClosed = true;
        clearInterval(heartbeatInterval);
        tvEmitter.off('tv_update', onTvUpdate);
        try {
          controller.close();
        } catch {
          // Stream already closed
        }
      };

      request.signal.addEventListener('abort', cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform, no-store',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
