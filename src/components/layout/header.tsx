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

        <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-7">
          {tabs.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={pathname === href ? 'rounded-full bg-white/10 px-3 py-3 text-center text-base font-semibold text-white' : 'rounded-full px-3 py-3 text-center text-base font-medium text-slate-400'}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {user ? (
            <>
              {user.role === 'USER' ? (
                <Link href="/profile" className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/10 bg-[#131b31]">
                    {user.avatarUrl ? <Image src={user.avatarUrl} alt={user.name || user.email} fill className="object-cover" /> : <div className="flex h-full w-full items-center justify-center text-lg font-black text-cyan-300">{(user.name || user.email).charAt(0).toUpperCase()}</div>}
                  </div>
                  <div className="text-left">
                    <p className="max-w-[120px] truncate text-sm font-semibold text-white">{user.name || user.email.split('@')[0]}</p>
                    <p className="max-w-[120px] truncate text-xs text-slate-400">{user.bio || 'Profil kreator Kreaverse'}</p>
                  </div>
                </Link>
              ) : (
                <Link href="/admin" className={buttonVariants({ variant: 'outline' })}>Admin</Link>
              )}
              <Button variant="ghost" className="h-12 rounded-full px-6 text-lg font-semibold" onClick={logout}>Keluar</Button>
            </>
          ) : (
            <Button onClick={openLogin} className="h-12 rounded-full px-8 text-lg font-black">Masuk</Button>
          )}
          <button className="flex h-12 min-w-[88px] items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 text-lg font-semibold text-slate-200">
            ID <ChevronDown className="h-5 w-5 text-slate-400" />
          </button>
        </div>
      </div>
    </header>
  );
}