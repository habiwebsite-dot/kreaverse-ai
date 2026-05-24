import { nanoid } from 'nanoid';
import { prisma } from '@/lib/prisma';
import { fail, ok } from '@/lib/http';
import { hashPassword } from '@/lib/auth';
import { requireAdmin } from '@/lib/require-admin';

function generateCredentials() {
  const suffix = nanoid(6).toLowerCase();
  return {
    email: `member-${suffix}@kreaverse.ai`,
    password: `Kreaverse!${nanoid(8)}`,
  };
}

export async function GET() {
  try {
    await requireAdmin();
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        apiKeys: true,
        sessions: true,
      },
    });
    return ok(users);
  } catch (error) {
    return fail('Gagal memuat user.', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json().catch(() => ({}));
    const generated = generateCredentials();
    const email = String(body.email || generated.email).toLowerCase();
    const plainPassword = String(body.password || generated.password);

    const user = await prisma.user.create({
      data: {
        email,
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
