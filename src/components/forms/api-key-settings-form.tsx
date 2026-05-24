"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function ApiKeySettingsForm() {
  const [locale, setLocale] = useState('id');
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setLocale(data.locale || 'id');
        setHasKey(Boolean(data.hasEvolinkKey));
      })
      .catch(() => undefined);
  }, []);

  async function save() {
    const response = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale, evolinkApiKey: apiKey || undefined }),
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus(data.error || 'Gagal menyimpan');
      return;
    }
    setStatus('Pengaturan tersimpan.');
    if (apiKey) setHasKey(true);
    setApiKey('');
  }

  return (
    <Card>
      <CardTitle>Pengaturan akun</CardTitle>
      <CardDescription className="mt-2">
        Saat mode server OFF atau saldo admin habis, masukkan API key pribadi di sini agar route menggunakan endpoint <code>GET /v1/credits</code> dan generate dengan key Anda.
      </CardDescription>
      <div className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm">
          Bahasa UI
          <select value={locale} onChange={(e) => setLocale(e.target.value)} className="h-11 rounded-xl border border-white/10 bg-white/5 px-3">
            <option value="id">Indonesia</option>
            <option value="en">English</option>
            <option value="jv">Jawa</option>
            <option value="mad">Madura</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          API Key Evolink pribadi {hasKey ? '(sudah tersimpan)' : ''}
          <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Masukkan API key" />
        </label>
        <Button onClick={save}>Simpan API Key</Button>
        {status ? <p className="text-sm text-primary">{status}</p> : null}
      </div>
    </Card>
  );
}
