"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/components/providers/app-provider';
import { locales } from '@/lib/i18n';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, openLogin, refreshSession, deviceLocked } = useApp();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    await refreshSession();
    router.push('/');
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
      <div className="container flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 font-black text-slate-950">K</div>
            <div>
              <p className="text-sm font-semibold">Kreaverse AI</p>
              <p className="text-xs text-muted-foreground">AI studio siap Railway</p>
            </div>
          </Link>
          {deviceLocked ? <Badge className="border-amber-400/30 text-amber-300">Perangkat lain aktif</Badge> : null}
        </div>
        <nav className="flex flex-wrap items-center gap-2">
          {[
            ['/', 'Beranda'],
            ['/tools/image', 'Gambar'],
            ['/tools/music', 'Audio'],
            ['/tools/video', 'Video'],
            ['/tools/mastering', 'Mastering'],
            ['/results', 'Hasil'],
            ['/settings', 'Settings'],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={`rounded-full px-3 py-2 text-sm ${pathname === href ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white'}`}
            >
              {label}
            </Link>
          ))}
          <select className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm" defaultValue={user?.locale || 'id'}>
            {locales.map((locale) => (
              <option key={locale} value={locale}>
                {locale.toUpperCase()}
              </option>
            ))}
          </select>
          {user?.role === 'ADMIN' ? (
            <Button asChild variant="outline"><Link href="/admin">Admin</Link></Button>
          ) : null}
          {user ? (
            <Button variant="ghost" onClick={logout}>Keluar</Button>
          ) : (
            <Button onClick={openLogin}>Masuk</Button>
          )}
        </nav>
      </div>
    </header>
  );
}
