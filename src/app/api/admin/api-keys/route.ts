import { prisma } from '@/lib/prisma';
import { fail, ok } from '@/lib/http';
import { requireAdmin } from '@/lib/require-admin';
import { encryptText } from '@/lib/crypto';
import { env } from '@/lib/env';

export async function GET() {
  try {
    await requireAdmin();
    const [pool, userKeys] = await Promise.all([
      prisma.apiKeyPool.findMany({ where: { provider: 'evolink' }, orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }] }),
      prisma.userApiKey.findMany({ include: { user: true }, orderBy: { updatedAt: 'desc' } }),
    ]);

    return ok({
      envPoolCount: env.evolinkApiKeys.length,
      pool,
      userKeys: userKeys.map((item) => ({
        id: item.id,
        provider: item.provider,
        creditsSnapshot: item.creditsSnapshot,
        userEmail: item.user.email,
        updatedAt: item.updatedAt,
      })),
    });
  } catch (error) {
    return fail('Gagal memuat API key.', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const item = await prisma.apiKeyPool.create({
      data: {
        provider: 'evolink',
        label: body.label || `Pool ${Date.now()}`,
        encryptedKey: encryptText(String(body.key || '')),
        priority: Number(body.priority || 0),
      },
    });
    return ok(item);
  } catch (error) {
    return fail('Gagal menambah API key.', 500);
  }
}
