import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { fail, ok } from '@/lib/http';

export async function GET() {
  const session = await getSession();
  if (!session) return fail('Unauthorized', 401);

  if (session.role === 'ADMIN') {
    return ok({
      authenticated: true,
      user: {
        id: 'admin',
        email: session.email,
        role: 'ADMIN',
      },
      deviceLocked: false,
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    include: { sessions: true },
  });
  if (!user) return fail('Unauthorized', 401);

  const deviceSession = user.sessions.find((item) => item.id === session.sessionId);

  return ok({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      locale: user.locale,
      active: user.active,
    },
    deviceLocked: Boolean(deviceSession?.replaceRequestedAt),
    sessionId: session.sessionId,
  });
}
