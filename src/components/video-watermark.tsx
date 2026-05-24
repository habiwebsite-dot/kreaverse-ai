"use client";

import { useEffect, useMemo, useState } from 'react';

const INTERVAL = 1000 * 60 * 60;

export function VideoWatermark({ fingerprint }: { fingerprint: string }) {
  const key = useMemo(() => `kreaverse-watermark-${fingerprint}`, [fingerprint]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const last = Number(localStorage.getItem(key) || 0);
    const shouldShow = Date.now() - last > INTERVAL;
    if (!shouldShow) return;
    setVisible(true);
    localStorage.setItem(key, String(Date.now()));
    const timeout = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timeout);
  }, [key]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-transparent">
      <div className="animate-float rounded-full border border-white/15 px-5 py-3 text-center shadow-[0_0_60px_rgba(255,255,255,0.08)]">
        <p className="bg-gradient-to-r from-white via-cyan-300 to-violet-300 bg-clip-text text-sm font-semibold tracking-[0.35em] text-transparent md:text-base">
          KREAVERSE AI X HABI STUDIO
        </p>
      </div>
    </div>
  );
}
