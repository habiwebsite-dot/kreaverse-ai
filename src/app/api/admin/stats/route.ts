import { prisma } from '@/lib/prisma';
import { fail, ok } from '@/lib/http';
import { requireAdmin } from '@/lib/require-admin';

export async function GET() {
  try {
    await requireAdmin();
    const [totalUsers, totalGenerations, grouped, activeSessions] = await Promise.all([
      prisma.user.count(),
      prisma.generation.count(),
      prisma.generation.groupBy({ by: ['type'], _count: true }),
      prisma.deviceSession.count({ where: { isActive: true } }),
    ]);

    return ok({
      totalUsers,
      totalGenerations,
      activeSessions,
      byType: grouped.reduce<Record<string, number>>((acc, item) => {
        acc[item.type] = item._count;
        return acc;
      }, {}),
    });
  } catch (error) {
    if ((error as Error).message === 'FORBIDDEN' || (error as Error).message === 'UNAUTHORIZED') {
      return fail('Forbidden', 403);
    }
    return fail('Gagal memuat statistik admin.', 500);
  }
}
