"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const INTERVAL = 1000 * 60 * 60 * 3;

export function PromoOverlay({
  enabled,
  imageUrl,
  title,
  description,
  ctaLabel,
  linkUrl,
}: {
  enabled?: boolean;
  imageUrl?: string;
  title: string;
  description: string;
  ctaLabel: string;
  linkUrl?: string;
}) {
  const key = useMemo(() => 'kreaverse-promo-overlay', []);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!enabled || !imageUrl) return;
    const last = Number(localStorage.getItem(key) || 0);
    if (Date.now() - last < INTERVAL) return;
    localStorage.setItem(key, String(Date.now()));
    setOpen(true);
  }, [enabled, imageUrl, key]);

  if (!open || !enabled || !imageUrl) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/85 px-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-cyan-400/20 bg-[#0f172b] shadow-[0_0_80px_rgba(34,211,238,0.18)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_35%)] animate-pulse" />
        <div className="relative aspect-[4/5] w-full">
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        </div>
        <div className="relative space-y-3 p-5">
          <p className="text-2xl font-black text-white">{title}</p>
          <p className="text-sm text-slate-300">{description}</p>
          <div className="flex gap-3">
            <button onClick={() => setOpen(false)} className="h-12 flex-1 rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-white">
              Nanti saja
            </button>
            <Link href={linkUrl || '/settings'} onClick={() => setOpen(false)} className="flex h-12 flex-1 items-center justify-center rounded-full bg-cyan-400 text-sm font-black text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.35)]">
              {ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
