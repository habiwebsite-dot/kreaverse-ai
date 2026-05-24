"use client";

import { useEffect, useState } from 'react';
import { useSiteConfig } from '@/components/brand-mark';

export function Footer() {
  const site = useSiteConfig();
  const [glow, setGlow] = useState(false);

  useEffect(() => {
    setGlow(true);
    const timeout = setTimeout(() => setGlow(false), 20000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <footer className="px-4 py-10 text-center">
      <div className="container rounded-[32px] border border-white/10 bg-[#0d1427] px-6 py-8 text-sm text-slate-400">
        <p className={glow ? 'bg-gradient-to-r from-white via-cyan-200 to-violet-200 bg-clip-text text-lg font-black text-transparent animate-pulse' : 'text-lg font-black text-white'}>
          {site.footerText}
        </p>
        <p className="mt-3 leading-7 text-slate-500">Desain mobile-first yang fokus ke pengalaman kreator: cepat login, mudah generate, dan nyaman dipakai di Android maupun desktop.</p>
      </div>
    </footer>
  );
}