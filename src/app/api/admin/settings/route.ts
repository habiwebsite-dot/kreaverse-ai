import { prisma } from '@/lib/prisma';
import { fail, ok } from '@/lib/http';
import { requireAdmin } from '@/lib/require-admin';

export async function GET() {
  try {
    await requireAdmin();
    const settings = await prisma.appSetting.upsert({ where: { id: 'singleton' }, update: {}, create: {} });
    return ok(settings);
  } catch (error) {
    return fail('Gagal memuat settings.', 500);
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const settings = await prisma.appSetting.upsert({
      where: { id: 'singleton' },
      update: {
        apiKeyMode: body.apiKeyMode,
        whatsappTemplate: body.whatsappTemplate,
        promoBannerJson: body.promoBannerJson,
      },
      create: {
        apiKeyMode: body.apiKeyMode,
        whatsappTemplate: body.whatsappTemplate,
        promoBannerJson: body.promoBannerJson,
      },
    });
    return ok(settings);
  } catch (error) {
    return fail('Gagal menyimpan settings.', 500);
  }
}
