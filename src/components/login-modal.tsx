"use client";

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApp } from '@/components/providers/app-provider';

export function LoginModal() {
  const { loginOpen, closeLogin, refreshSession, fingerprint } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!loginOpen) return null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
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
      if (!response.ok) {
        setError(data.error || 'Login gagal');
        return;
      }
      await refreshSession();
      closeLogin();
      setEmail('');
      setPassword('');
      setOtp('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/75 px-4 py-8 md:items-center">
      <div className="glass w-full max-w-md rounded-[28px] border border-white/10 p-6 shadow-glow">
        <div className="mb-6">
          <p className="text-sm text-primary">Akses Kreaverse AI</p>
          <h3 className="text-2xl font-semibold">Masuk untuk lanjut generate</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Guest tidak bisa generate atau menyimpan API key. Admin wajib memasukkan kode TOTP.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Input placeholder="Kode TOTP admin (opsional untuk user biasa)" value={otp} onChange={(e) => setOtp(e.target.value)} />
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <div className="flex gap-3">
            <Button type="button" variant="ghost" className="flex-1" onClick={closeLogin}>
              Batal
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Memproses...' : 'Masuk'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
