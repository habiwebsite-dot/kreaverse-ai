"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, ChevronDown, Menu, ShieldCheck } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/components/providers/app-provider';
import { BrandMark, useSiteConfig } from '@/components/brand-mark';

const tabs = [
  ['/', 'Beranda'],
  ['/tools/image', 'Gambar'],
  ['/tools/music', 'Audio'],
  ['/tools/video', 'Video'],
  ['/tools/mastering', 'Mastering'],
  ['/results', 'Hasil'],
  ['/settings', 'Settings'],
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const site = useSiteConfig();
  const { user, openLogin, refreshSession, deviceLocked } = useApp();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    await refreshSession();
    router.push('/');
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#060c1d]/95 backdrop-blur-xl">
      <div className="container pb-4 pt-6">
        <div className="flex items-start justify-between gap-4">
          <BrandMark logoUrl={site.logoUrl} title={site.name} subtitle={site.tagline} glow={Boolean(site.logoUrl && site.logoGlowEnabled)} />
          <div className="flex items-center gap-2">
            {deviceLocked ? <Badge className="border-amber-400/30 text-amber-300">Device lock</Badge> : null}
            {user?.role === 'ADMIN' ? (
              <Link href="/admin" className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
                <ShieldCheck className="h-5 w-5" />
              </Link>
            ) : null}
            <button className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300">
              <Bell className="h-5 w-5" />
            </button>
            <button className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-5 grid 