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
      include: { apiKeys: true },
    });
    return ok({
      locale: user?.locale || 'id',
      hasEvolinkKey: Boolean(user?.apiKeys.find((item) => item.provider === 'evolink')),
    });
  } catch (error) {
    return fail('Unauthorized', 401);
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireSession();
    if (session.role !== 'USER') return fail('Forbidden', 403);
    const body = await request.json();

    if (body.locale) {
      await prisma.user.update({ where: { id: session.sub }, data: { locale: String(body.locale) } });
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
