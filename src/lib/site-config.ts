import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

const configPath = path.join(process.cwd(), 'config', 'site.json');

export type SiteConfig = {
  name: string;
  tagline: string;
  logoUrl: string;
  loginLogoUrl: string;
  footerLogoUrl: string;
  qrLogoUrl: string;
  loginFooterText: string;
  footerText: string;
  providerLogoUrl: string;
  logoGlowEnabled: boolean;
  promoBanner: {
    title: string;
    description: string;
    ctaLabel: string;
    imageUrl?: string;
    linkUrl?: string;
    enabled?: boolean;
  };
  toolLogos: Record<string, string>;
  modelLogos: Record<string, string>;
};

const defaultConfig: SiteConfig = {
  name: 'Kreaverse AI',
  tagline: 'Studio AI generator untuk audio, gambar, video, dan mastering.',
  logoUrl: '',
  loginLogoUrl: '',
  footerLogoUrl: '',
  qrLogoUrl: '',
  loginFooterText: 'Kreaverse AI × HABI STUDIO',
  footerText: 'Kreaverse AI × HABI STUDIO · Creative AI workspace yang rapi, cepat, dan siap produksi.',
  providerLogoUrl: '',
  logoGlowEnabled: true,
  promoBanner: {
    title: 'Unlimited mode aktif',
    description: 'Generate tanpa repot input API key saat pool admin tersedia.',
    ctaLabel: 'Mulai Kreasi',
    imageUrl: '',
    linkUrl: '/settings',
    enabled: false,
  },
  toolLogos: {
    music: '',
    image: '',
    video: '',
    mastering: '',
  },
  modelLogos: {},
};

export function readSiteConfig(): SiteConfig {
  const parsed = JSON.parse(fs.readFileSync(configPath, 'utf8')) as Partial<SiteConfig>;
  return {
    ...defaultConfig,
    ...parsed,
    promoBanner: {
      ...defaultConfig.promoBanner,
      ...(parsed.promoBanner || {}),
    },
    toolLogos: {
      ...defaultConfig.toolLogos,
      ...(parsed.toolLogos || {}),
    },
    modelLogos: {
      ...defaultConfig.modelLogos,
      ...(parsed.modelLogos || {}),
    },
  };
}

export async function getSettings() {
  return prisma.appSetting.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {},
  });
}