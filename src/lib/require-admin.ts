import { requireSession } from '@/lib/auth';

export async function requireAdmin() {
  const session = await requireSession();
  if (session.role !== 'ADMIN') {
    throw new Error('FORBIDDEN');
  }
  return session;
}
