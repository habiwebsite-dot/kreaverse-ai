import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

const configPath = path.join(process.cwd(), 'config', 'site.json');

export type SiteConfig = {
  name: string;
  tagline: string;
  logoUrl: string;
  qrLogoUrl: string;
  promoBanner: {
    title: string;
    description: string;
    ctaLabel: string;
  };
  toolLogos: Record<string, string>;
};

export function readSiteConfig(): SiteConfig {
  return JSON.parse(fs.readFileSync(configPath, 'utf8')) as SiteConfig;
}

export async function getSettings() {
  const settings = await prisma.appSetting.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {},
  });
  return settings;
}
