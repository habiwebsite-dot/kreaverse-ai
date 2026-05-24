import { prisma } from '@/lib/prisma';
import { fail, ok } from '@/lib/http';
import { requireAdmin } from '@/lib/require-admin';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const body = await request.json();
    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        active: body.active,
        locale: body.locale,
      },
    });
    return ok(user);
  } catch (error) {
    return fail('Gagal memperbarui user.', 500);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    await prisma.user.delete({ where: { id: params.id } });
    return ok({ ok: true });
  } catch (error) {
    return fail('Gagal menghapus user.', 500);
  }
}
