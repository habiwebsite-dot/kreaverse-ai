"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { KeyRound, Languages, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FancySelect } from '@/components/ui/fancy-select';
import { ToggleSwitch } from '@/components/ui/toggle-switch';

export function ApiKeySettingsForm() {
  const [locale, setLocale] = useState('id');
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [status, setStatus] = useState('');
  const [modeOn, setModeOn] = useState(true);

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
    <Card className="overflow-hidden rounded-[34px] border border-white/10 bg-[#121b31] p-0">
      <div className="border-b border-white/5 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.18),transparent_45%)] px-5 py-6">
        <CardTitle className="text-[32px] font-black text-white">Settings & API Key</CardTitle>
        <CardDescription className="mt-2 text-slate-300">Atur bahasa, tema server / manual key, dan akses cepat untuk membuat API key provider.</CardDescription>
      </div>
      <div className="space-y-5 px-5 py-5">
        <div className="rounded-[28px] border border-white/10 bg-[#18233c] p-4">
          <div className="mb-3 flex items-center gap-2 text-sm text-slate-300"><Languages className="h-4 w-4" /> Bahasa antarmuka</div>
          <FancySelect
            value={locale}
            onChange={setLocale}
            options={[
              { value: 'id', label: 'Indonesia', description: 'Bahasa default utama' },
              { value: 'en', label: 'English', description: 'For global users' },
              { value: 'jv', label: 'Jawa', description: 'Nuansa lokal Jawa' },
              { value: 'mad', label: 'Madura', description: 'Nuansa lokal Madura' },
            ]}
          />
        </div>

        <div className="rounded-[28px] border border-cyan-400/15 bg-cyan-400/10 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm text-cyan-100"><Sparkles className="h-4 w-4" /> Mode penggunaan API</div>
          <ToggleSwitch checked={modeOn} onChange={setModeOn} labels={{ on: 'Server Unlimited aktif', off: 'Masuk mode API key pengguna' }} />
          <p className="mt-3 text-sm leading-6 text-cyan-50/90">
            Jika mode server aktif, tampilan saldo akan bernuansa <strong>Unlimited</strong> dan user tinggal generate. Jika mode dimatikan oleh admin atau traffic penuh, pengguna dapat memasukkan API key sendiri di bawah ini.
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#18233c] p-4">
          <div className="mb-3 flex items-center gap-2 text-sm text-slate-300"><KeyRound className="h-4 w-4" /> Provider API key manual</div>
          <FancySelect
            value="evolink"
            onChange={() => undefined}
            options={[{ value: 'evolink', label: 'EvoLink.AI', description: 'Provider utama untuk image, audio, dan video' }]}
          />
          <label className="mt-4 grid gap-2 text-sm">
            <span className="text-slate-300">API Key Evolink pribadi {hasKey ? '(sudah tersimpan)' : ''}</span>
            <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Masukkan API key Evolink Anda" className="h-14 rounded-[24px] bg-[#11192d]" />
          </label>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Button onClick={save} className="h-14 rounded-full text-base font-black">Simpan API Key</Button>
            <Link href="https://evolink.ai/dashboard/keys" target="_blank" className="flex h-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-white">
              Generate API Key
            </Link>
          </div>
          {status ? <p className="mt-4 text-sm text-cyan-300">{status}</p> : null}
        </div>
      </div>
    </Card>
  );
}