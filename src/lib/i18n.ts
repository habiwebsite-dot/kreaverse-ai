export const locales = ['id', 'en', 'jv', 'mad'] as const;
export type Locale = (typeof locales)[number];

export const dictionaries: Record<Locale, Record<string, string>> = {
  id: {
    appName: 'Kreaverse AI',
    heroTitle: 'Generator AI produksi untuk audio, gambar, video, dan mastering.',
    heroSubtitle: 'Mode gelap, device lock, auto failover API key, dan siap deploy Railway.',
    login: 'Masuk',
    logout: 'Keluar',
    settings: 'Pengaturan',
    results: 'Hasil',
    admin: 'Admin',
  },
  en: {
    appName: 'Kreaverse AI',
    heroTitle: 'Production AI generator for audio, image, video, and mastering.',
    heroSubtitle: 'Dark mode, device lock, API key failover, and Railway-ready deployment.',
    login: 'Login',
    logout: 'Logout',
    settings: 'Settings',
    results: 'Results',
    admin: 'Admin',
  },
  jv: {
    appName: 'Kreaverse AI',
    heroTitle: 'Generator AI kanggo audio, gambar, video, lan mastering.',
    heroSubtitle: 'Mode peteng, kunci piranti, failover API key, lan siap Railway.',
    login: 'Mlebu',
    logout: 'Metu',
    settings: 'Setelan',
    results: 'Asil',
    admin: 'Admin',
  },
  mad: {
    appName: 'Kreaverse AI',
    heroTitle: 'Generator AI ben audio, gambar, video, ben mastering.',
    heroSubtitle: 'Mode peteng, kanci perangkat, failover API key, ben siap Railway.',
    login: 'Masok',
    logout: 'Kaluar',
    settings: 'Setelan',
    results: 'Hasel',
    admin: 'Admin',
  },
};

export function getDictionary(locale?: string) {
  const key = (locale || 'id') as Locale;
  return dictionaries[key] || dictionaries.id;
}
