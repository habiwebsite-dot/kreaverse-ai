import { prisma } from '@/lib/prisma';
import { encryptText } from '@/lib/crypto';
import { fail, ok } from '@/lib/http';
import { requireSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await requireSession();
    if (session.role !== 'USER') return fail('Forbidden', 403);
    const user = await prisma.user.findUnique({
      where: { id: session.sub },
      include: { apiKeys: true, sessions: true },
    });
    return ok({
      locale: user?.locale || 'id',
      theme: 'dark',
      profile: {
        name: user?.name || '',
        bio: user?.bio || '',
        address: user?.address || '',
        avatarUrl: user?.avatarUrl || '',
      },
      hasEvolinkKey: Boolean(user?.apiKeys.find((item) => item.provider === 'evolink')),
      activeSessions: user?.sessions.length || 0,
    });
  } catch {
    return fail('Unauthorized', 401);
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireSession();
    if (session.role !== 'USER') return fail('Forbidden', 403);
    const body = await request.json();

    const updateData: Record<string, unknown> = {};

    if (body.locale) updateData.locale = String(body.locale);
    if (body.name !== undefined) updateData.name = String(body.name || '');
    if (body.bio !== undefined) updateData.bio = String(body.bio || '');
    if (body.address !== undefined) updateData.address = String(body.address || '');
    if (body.avatarUrl !== undefined) updateData.avatarUrl = String(body.avatarUrl || '');

    if (Object.keys(updateData).length > 0) {
      await prisma.user.update({ where: { id: session.sub }, data: updateData });
    }

    if (body.evolinkApiKey) {
      await prisma.userApiKey.upsert({
        where: { userId_provider: { userId: session.sub, provider: 'evolink' } },
        update: { encryptedKey: encryptText(String(body.evolinkApiKey)) },
        create: { userId: session.sub, provider: 'evolink', encryptedKey: encryptText(String(body.evolinkApiKey)) },
      });
    }

    return ok({ ok: true });
  } catch (error) {
    console.error(error);
    return fail('Gagal menyimpan pengaturan.', 500);
  }
}