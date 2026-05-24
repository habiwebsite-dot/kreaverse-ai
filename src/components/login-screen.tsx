"use client";

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useApp } from '@/components/providers/app-provider';

export function LoginScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const { fingerprint, refreshSession } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    router.push(params.get('next') || '/');
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardTitle>Masuk ke Kreaverse AI</CardTitle>
      <CardDescription className="mt-2">User biasa cukup email + password. Admin wajib isi TOTP.</CardDescription>
      <form className="mt-6 grid gap-4" onSubmit={submit}>
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input placeholder="OTP admin" value={otp} onChange={(e) => setOtp(e.target.value)} />
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <Button type="submit" disabled={loading}>{loading ? 'Memproses...' : 'Masuk'}</Button>
      </form>
    </Card>
  );
}
