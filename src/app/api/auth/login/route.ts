import { NextRequest } from 'next/server';
import { nanoid } from 'nanoid';
import { prisma } from '@/lib/prisma';
import { fail, ok } from '@/lib/http';
import { getRequestMeta, setSessionCookie, signSession, verifyPassword } from '@/lib/auth';
import { verifyAdminCredentials } from '@/lib/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, otp } = body as { email?: string; password?: string; otp?: string };

    if (!email || !password) {
      return fail('Email dan password wajib diisi.', 400);
    }

    const meta = getRequestMeta();
    const normalizedEmail = email.trim().toLowerCase();

    const adminOk = otp ? await verifyAdminCredentials(normalizedEmail, password, otp) : false;
    if (adminOk) {
      const sessionId = `admin-${nanoid(18)}`;
      const token = signSession({
        sub: 'admin',
        role: 'ADMIN',
        email: normalizedEmail,
        sessionId,
        fingerprint: meta.fingerprint,
      });
      setSessionCookie(token);
      return ok({ ok: true, role: 'ADMIN', sessionId });
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user || !user.active) {
      return fail('Akun tidak ditemukan atau dinonaktifkan.', 404);
    }

    const passwordOk = await verifyPassword(password, user.passwordHash);
    if (!passwordOk) {
      return fail('Password salah.', 401);
    }

    const session = await prisma.deviceSession.upsert({
      where: {
        userId_fingerprint: {
          userId: user.id,
          fingerprint: meta.fingerprint,
        },
      },
      update: {
        isActive: true,
        deviceName: meta.deviceName,
        userAgent: meta.userAgent,
        ipAddress: meta.ipAddress,
        replaceRequestedAt: null,
        replacedById: null,
        lastSeenAt: new Date(),
      },
      create: {
        userId: user.id,
        fingerprint: meta.fingerprint,
        deviceName: meta.deviceName,
        userAgent: meta.userAgent,
        ipAddress: meta.ipAddress,
      },
    });

    const otherSessions = await prisma.deviceSession.findMany({
      where: {
        userId: user.id,
        id: { not: session.id },
        isActive: true,
      },
    });

    if (otherSessions.length > 0) {
      await prisma.deviceSession.updateMany({
        where: { id: { in: otherSessions.map((item) => item.id) } },
        data: { replaceRequestedAt: new Date(), replacedById: session.id },
      });
      await prisma.notification.createMany({
        data: otherSessions.map((item) => ({
          userId: user.id,
          sessionId: item.id,
          type: 'DEVICE_LOCK',
          title: 'Perangkat lain aktif',
          message:
            'Akun Anda sedang aktif di perangkat lain. Silakan logout perangkat tersebut untuk melanjutkan.',
        })),
      });
    }

    const token = signSession({
      sub: user.id,
      role: 'USER',
      email: user.email,
      sessionId: session.id,
      fingerprint: meta.fingerprint,
    });
    setSessionCookie(token);

    return ok({ ok: true, role: 'USER', sessionId: session.id });
  } catch (error) {
    console.error(error);
    return fail('Gagal login.', 500);
  }
}
