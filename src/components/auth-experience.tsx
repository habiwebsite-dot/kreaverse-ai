"use client";

import { FormEvent, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MessageCircleMore, ShieldCheck, UserRound } from 'lucide-react';
import { useApp } from '@/components/providers/app-provider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BrandMark, useSiteConfig } from '@/components/brand-mark';

export function AuthExperience({ embedded = false, onSuccess }: { embedded?: boolean; onSuccess?: () => void }) {
  const router = useRouter();
  const params = useSearchParams();
  const site = useSiteConfig();
  const { fingerprint, refreshSession } = useApp();
  const [mode, setMode] = useState<'user' | 'admin'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const [sentCode, setSentCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER || '6285119821813';
  const waMessage = useMemo(() => encodeURIComponent('Halo Admin Kreaverse AI, saya ingin mendapatkan akses kode verifikasi admin dan aktivasi akun.'), []);
  const waHref = `https://wa.me/${waNumber}?text=${waMessage}`;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-device-fingerprint': fingerprint,
        'x-device-name': navigator.userAgent.includes('Android') ? 'Android Device' : 'Browser Device',
      },
      body: JSON.stringify({ email, password, otp }),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) return setError(data.error || 'Gagal login');
    await refreshSession();
    if (onSuccess) onSuccess();
    router.push(params.get('next') || (mode === 'admin' ? '/admin' : '/'));
  }

  function requestAdminCode() {
    setSendingCode(true);
    setTimeout(() => {
      setSendingCode(false);
      setSentCode(true);
      window.open(waHref, '_blank');
    }, 1200);
  }

  return (
    <div className={embedded ? 'w-full' : 'min-h-screen bg-[linear-gradient(180deg,#050816_0%,#09132a_55%,#0d1630_100%)]'}>
      <div className={embedded ? '' : 'mx-auto max-w-md px-4 py-8'}>
        <div className="rounded-[36px] border border-white/10 bg-[#0b1228] shadow-[0_20px_80px_rgba(5,8,22,0.55)]">
          <div className="border-b border-white/5 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_42%)] px-6 pb-6 pt-8">
            <BrandMark logoUrl={site.loginLogoUrl || site.logoUrl} title={site.name} subtitle={site.tagline} size={64} glow={Boolean(site.loginLogoUrl && site.logoGlowEnabled)} />
            <div className="mt-6 flex rounded-full border border-white/10 bg-white/5 p-1">
              {[
                { id: 'user', label: 'Pengguna', icon: UserRound },
                { id: 'admin', label: 'Admin', icon: ShieldCheck },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setMode(item.id as 'user' | 'admin');
                    setError('');
                  }}
                  className={item.id === mode ? 'flex flex-1 items-center justify-center gap-2 rounded-full bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950' : 'flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-slate-300'}
                >
                  <item.icon className="h-4 w-4" /> {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6 px-6 py-6">
            {mode === 'user' ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">Mode Pengguna</p>
                  <h1 className="mt-2 text-[42px] font-black leading-none text-white">Masuk untuk lanjut generate</h1>
                  <p className="mt-4 text-base leading-8 text-slate-300">
                    Login pengguna hanya membutuhkan email dan password. Akses model AI unlimited lifetime didapat setelah admin membuatkan akun untuk Anda.
                  </p>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-[#131b31] p-5 text-sm text-slate-300">
                  <p className="font-semibold text-white">Cara login pengguna</p>
                  <ol className="mt-3 list-decimal space-y-2 pl-4 leading-6">
                    <li>Masukkan email yang dibuat admin.</li>
                    <li>Masukkan password pengguna Anda.</li>
                    <li>Masuk dan langsung gunakan tool AI yang tersedia.</li>
                  </ol>
                </div>
                <div className="rounded-[28px] border border-cyan-400/15 bg-cyan-400/10 p-5 text-sm text-cyan-50">
                  <p className="font-semibold">Cara mendapatkan email & password</p>
                  <p className="mt-2 leading-6 text-cyan-100/90">
                    Klik tombol langganan/WhatsApp untuk meminta akun pengguna. Admin akan membuat email dan password akses model AI generate unlimited lifetime untuk akun Anda.
                  </p>
                  <a href={waHref} target="_blank" className="mt-4 flex h-12 items-center justify-center gap-2 rounded-full bg-cyan-400 text-sm font-black text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.35)]">
                    <MessageCircleMore className="h-4 w-4" /> Langganan & minta akun
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">Mode Admin</p>
                  <h1 className="mt-2 text-[42px] font-black leading-none text-white">Masuk admin dengan kode verifikasi</h1>
                  <p className="mt-4 text-base leading-8 text-slate-300">
                    Login admin membutuhkan email, password, dan kode verifikasi WhatsApp Admin. Tombol minta kode hanya animasi UI + shortcut WhatsApp ke admin Kreaverse AI.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={requestAdminCode}
                  className="flex w-full items-center justify-center gap-3 rounded-[28px] border border-emerald-400/25 bg-emerald-400/10 px-5 py-4 text-left text-sm font-semibold text-emerald-50"
                >
                  <span className={sendingCode ? 'inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-400 animate-pulse text-slate-950' : 'inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300'}>
                    <MessageCircleMore className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-black">Minta kode verifikasi WhatsApp Admin</span>
                    <span className="block text-xs text-emerald-100/75">{sendingCode ? 'Membuka WhatsApp dan mengirim animasi kode...' : sentCode ? 'WhatsApp dibuka, masukkan kode verifikasi admin.' : 'Tekan untuk membuka WhatsApp Kreaverse AI.'}</span>
                  </span>
                </button>
              </div>
            )}

            <form className="space-y-4" onSubmit={submit}>
              <Input type="email" placeholder={mode === 'admin' ? 'Email admin' : 'Email pengguna'} value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input type="password" placeholder={mode === 'admin' ? 'Password admin' : 'Password pengguna'} value={password} onChange={(e) => setPassword(e.target.value)} required />
              {mode === 'admin' ? <Input placeholder="Kode verifikasi WhatsApp Admin" value={otp} onChange={(e) => setOtp(e.target.value)} required /> : null}
              {error ? <p className="text-sm font-semibold text-rose-400">{error}</p> : null}
              <div className="flex gap-3">
                {embedded ? (
                  <Button type="button" variant="ghost" className="flex-1" onClick={onSuccess}>Tutup</Button>
                ) : null}
                <Button type="submit" className="h-14 flex-1 rounded-full text-base font-black" disabled={loading}>
                  {loading ? 'Memproses...' : mode === 'admin' ? 'Masuk Admin' : 'Masuk Pengguna'}
                </Button>
              </div>
            </form>
            <p className="pb-2 text-center text-sm text-slate-500">{site.loginFooterText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
