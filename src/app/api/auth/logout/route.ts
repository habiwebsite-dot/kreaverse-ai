import { prisma } from '@/lib/prisma';
import { clearSessionCookie, getSession } from '@/lib/auth';
import { ok } from '@/lib/http';

export async function POST() {
  const session = await getSession();
  if (session?.role === 'USER') {
    await prisma.deviceSession.updateMany({
      where: { id: session.sessionId },
      data: { isActive: false },
    }).catch(() => undefined);
  }
  clearSessionCookie();
  return ok({ ok: true });
}
