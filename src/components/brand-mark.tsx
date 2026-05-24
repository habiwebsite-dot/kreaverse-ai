"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';

type SiteConfig = {
  name: string;
  tagline: string;
  logoUrl: string;
  loginLogoUrl: string;
  footerLogoUrl: string;
  loginFooterText: string;
  footerText: string;
  logoGlowEnabled: boolean;
};

const fallback: SiteConfig = {
  name: 'Kreaverse AI',
  tagline: 'AI studio siap Railway',
  logoUrl: '',
  loginLogoUrl: '',
  footerLogoUrl: '',
  loginFooterText: 'Kreaverse AI × HABI STUDIO',
  footerText: 'Kreaverse AI × HABI STUDIO',
  logoGlowEnabled: true,
};

export function useSiteConfig() {
  const [site, setSite] = useState<SiteConfig>(fallback);
  useEffect(() => {
    fetch('/api/public/site-config', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => setSite({ ...fallback, ...data }))
      .catch(() => setSite(fallback));
  }, []);
  return site;
}

export function BrandMark({
  logoUrl,
  title,
  subtitle,
  size = 52,
  glow = false,
}: {
  logoUrl?: string;
  title: string;
  subtitle?: string;
  size?: number;
  glow?: boolean;
}) {
  const showLogo = Boolean(logoUrl);
  const [glowOn, setGlowOn] = useState(glow);

  useEffect(() => {
    setGlowOn(glow);
    if (!glow) return;
    const timeout = setTimeout(() => setGlowOn(false), 10000);
    return () => clearTimeout(timeout);
  }, [glow]);

  return (
    <div className="flex items-center gap-4">
      <div
        className={glowOn ? 'relative flex shrink-0 items-center justify-center overflow-hidden rounded-[28px] bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 shadow-[0_0_40px_rgba(34,211,238,0.25)]' : 'relative flex shrink-0 items-center justify-center overflow-hidden rounded-[28px] bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500'}
        style={{ width: size, height: size }}
      >
        {showLogo ? (
          <Image src={logoUrl || ''} alt={title} fill className="object-cover" />
        ) : (
          <span className="text-2xl font-black text-slate-950">K</span>
        )}
      </div>
      <div>
        <p className={glowOn ? 'bg-gradient-to-r from-white via-cyan-200 to-violet-200 bg-clip-text text-xl font-black text-transparent animate-pulse' : 'text-xl font-black text-white'}>{title}</p>
        {subtitle ? <p className="text-sm text-slate-400">{subtitle}</p> : null}
      </div>
    </div>
  );
}
