import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'USER') {
    return new Response('Unauthorized', { status: 401 });
  }

  const encoder = new TextEncoder();
  let interval: ReturnType<typeof setInterval> | undefined;
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, payload: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`));
      };

      send('ready', { ok: true, at: new Date().toISOString() });

      interval = setInterval(async () => {
        try {
          const [notifications, deviceSession, recentTasks] = await Promise.all([
            prisma.notification.findMany({
              where: {
                userId: session.sub,
                OR: [{ sessionId: null }, { sessionId: session.sessionId }],
                readAt: null,
              },
              orderBy: { createdAt: 'desc' },
              take: 10,
            }),
            prisma.deviceSession.findUnique({ where: { id: session.sessionId } }),
            prisma.generation.findMany({
              where: { userId: session.sub },
              orderBy: { updatedAt: 'desc' },
              take: 5,
            }),
          ]);

          if (notifications.length > 0) {
            send('notifications', notifications);
          }

          send('presence', {
            deviceLocked: Boolean(deviceSession?.replaceRequestedAt),
            timestamp: new Date().toISOString(),
          });

          send(
            'tasks',
            recentTasks.map((task) => ({
              id: task.id,
              taskId: task.taskId,
              status: task.status,
              model: task.model,
              previewUrl: task.previewUrl,
              resultUrls: task.resultUrls,
              type: task.type,
            })),
          );
        } catch (error) {
          send('error', { message: 'stream error', detail: (error as Error).message });
        }
      }, 4000);

      timeout = setTimeout(() => {
        if (interval) clearInterval(interval);
        controller.close();
      }, 1000 * 60 * 5);

      controller.enqueue(encoder.encode(': connected\n\n'));
    },
    cancel() {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
