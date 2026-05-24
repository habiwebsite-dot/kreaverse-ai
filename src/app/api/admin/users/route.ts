import { nanoid } from 'nanoid';
import { prisma } from '@/lib/prisma';
import { fail, ok } from '@/lib/http';
import { hashPassword } from '@/lib/auth';
import { requireAdmin } from '@/lib/require-admin';

function generateCredentials(baseName?: string) {
  const clean = (baseName || nanoid(6)).toLowerCase().replace(/[^a-z0-9]/g, '');
  const finalName = clean || nanoid(6).toLowerCase();
  return {
    email: `${finalName}@kreaverse.ai`,
    password: `Kreaverse!${nanoid(8)}`,
  };
}

export async function GET() {
  try {
    await requireAdmin();
    const users = await prisma.user.findMany({
      where: { role: 'USER' },
      orderBy: { createdAt: 'desc' },
      include: {
        apiKeys: true,
        sessions: { orderBy: { lastSeenAt: 'desc' } },
      },
    });
    return ok(users);
  } catch {
    return fail('Gagal memuat user.', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json().catch(() => ({}));
    const generated = generateCredentials(body.handle || body.emailPrefix);
    const email = String(body.email || generated.email).toLowerCase();
    const plainPassword = String(body.password || generated.password);
    const userName = String(body.name || email.split('@')[0]);

    const user = await prisma.user.create({
      data: {
        email,
        name: userName,
        passwordHash: await hashPassword(plainPassword),
        role: 'USER',
      },
    });

    return ok({
      user,
      generatedCredentials: {
        email,
        password: plainPassword,
      },
    });
  } catch (error) {
    console.error(error);
    return fail('Gagal membuat user.', 500);
  }
}