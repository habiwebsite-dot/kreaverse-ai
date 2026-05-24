import { cookies, headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '@/lib/env';
import { prisma } from '@/lib/prisma';
import { decryptText } from '@/lib/crypto';

export const AUTH_COOKIE = 'kreaverse_session';

export type SessionPayload = {
  sub: string;
  role: 'USER' | 'ADMIN';
  email: string;
  sessionId: string;
  fingerprint: string;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signSession(payload: SessionPayload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: '30d' });
}

export function verifySessionToken(token?: string | null): SessionPayload | null {
  if (!token) return null;
  try {
    return jwt.verify(token, env.jwtSecret) as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const token = cookies().get(AUTH_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error('UNAUTHORIZED');
  return session;
}

export function setSessionCookie(token: string) {
  cookies().set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearSessionCookie() {
  cookies().delete(AUTH_COOKIE);
}

export function getRequestMeta() {
  const h = headers();
  return {
    fingerprint: h.get('x-device-fingerprint') || 'unknown-device',
    deviceName: h.get('x-device-name') || 'Unknown device',
    userAgent: h.get('user-agent') || '',
    ipAddress: h.get('x-forwarded-for')?.split(',')[0]?.trim() || '0.0.0.0',
  };
}

export async function getUserApiKey(userId: string, provider = 'evolink') {
  const item = await prisma.userApiKey.findUnique({
    where: { userId_provider: { userId, provider } },
  });
  if (!item) return null;
  return { ...item, plainKey: decryptText(item.encryptedKey) };
}
