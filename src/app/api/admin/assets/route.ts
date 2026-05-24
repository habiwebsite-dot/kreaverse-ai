import fs from 'fs/promises';
import path from 'path';
import { requireAdmin } from '@/lib/require-admin';
import { fail, ok } from '@/lib/http';
import { commitRepoFile } from '@/lib/github';
import { prisma } from '@/lib/prisma';
import { readSiteConfig } from '@/lib/site-config';

const configPath = path.join(process.cwd(), 'config', 'site.json');

export async function GET() {
  try {
    await requireAdmin();
    return ok(readSiteConfig());
  } catch {
    return fail('Gagal memuat aset live.', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const current = readSiteConfig();
    const nextConfig = {
      ...current,
      ...body,
      promoBanner: {
        ...current.promoBanner,
        ...(body.promoBanner || {}),
      },
      toolLogos: {
        ...current.toolLogos,
        ...(body.toolLogos || {}),
      },
      modelLogos: {
        ...current.modelLogos,
        ...(body.modelLogos || {}),
      },
    };

    const content = JSON.stringify(nextConfig, null, 2);
    await fs.writeFile(configPath, content, 'utf8');
    await prisma.appSetting.upsert({
      where: { id: 'singleton' },
      update: { siteConfigJson: nextConfig },
      create: { siteConfigJson: nextConfig },
    });
    await commitRepoFile('config/site.json', content, 'chore: update site assets from admin panel');

    return ok({ ok: true, config: nextConfig });
  } catch (error) {
    console.error(error);
    return fail('Gagal menyimpan aset live.', 500);
  }
}