"use client";

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Activity, BadgeCheck, ImagePlus, KeyRound, Users, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { uploadFileToCloudinary } from '@/lib/client-upload';
import { ToggleSwitch } from '@/components/ui/toggle-switch';
import { FancySelect } from '@/components/ui/fancy-select';

export function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [apiData, setApiData] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [handle, setHandle] = useState('habi');
  const [customPassword, setCustomPassword] = useState('');
  const [newPoolLabel, setNewPoolLabel] = useState('');
  const [newPoolKey, setNewPoolKey] = useState('');
  const [assetSaving, setAssetSaving] = useState(false);

  const [assetForm, setAssetForm] = useState<any>({
    loginLogoUrl: '',
    logoUrl: '',
    providerLogoUrl: '',
    footerText: 'Kreaverse AI × HABI STUDIO · Creative AI workspace yang rapi, cepat, dan siap produksi.',
    loginFooterText: 'Kreaverse AI × HABI STUDIO',
    promoBanner: { title: 'Unlimited mode aktif', description: 'Generate tanpa repot input API key saat pool admin tersedia.', ctaLabel: 'Lihat Langganan', imageUrl: '', linkUrl: '/settings', enabled: false },
    toolLogos: { image: '', music: '', video: '', mastering: '' },
    modelLogos: {},
  });

  async function load() {
    const [statsRes, usersRes, settingsRes, apiRes, assetsRes] = await Promise.all([
      fetch('/api/admin/stats'),
      fetch('/api/admin/users'),
      fetch('/api/admin/settings'),
      fetch('/api/admin/api-keys'),
      fetch('/api/admin/assets'),
    ]);

    const [statsJson, usersJson, settingsJson, apiJson, assetsJson] = await Promise.all([
      statsRes.json(),
      usersRes.json(),
      settingsRes.json(),
      apiRes.json(),
      assetsRes.json(),
    ]);

    setStats(statsJson);
    setUsers(usersJson);
    setSettings(settingsJson);
    setApiData(apiJson);
    setAssetForm({
      loginLogoUrl: assetsJson.loginLogoUrl || '',
      logoUrl: assetsJson.logoUrl || '',
      providerLogoUrl: assetsJson.providerLogoUrl || '',
      footerText: assetsJson.footerText || '',
      loginFooterText: assetsJson.loginFooterText || '',
      promoBanner: {
        title: assetsJson.promoBanner?.title || 'Unlimited mode aktif',
        description: assetsJson.promoBanner?.description || '',
        ctaLabel: assetsJson.promoBanner?.ctaLabel || 'Lihat Langganan',
        imageUrl: assetsJson.promoBanner?.imageUrl || '',
        linkUrl: assetsJson.promoBanner?.linkUrl || '/settings',
        enabled: Boolean(assetsJson.promoBanner?.enabled),
      },
      toolLogos: assetsJson.toolLogos || { image: '', music: '', video: '', mastering: '' },
      modelLogos: assetsJson.modelLogos || {},
    });
  }

  useEffect(() => {
    load().catch(() => undefined);
  }, []);

  const computedEmail = `${(handle || 'habi').toLowerCase()}@kreaverse.ai`;
  const computedPassword = customPassword || `${(handle || 'habi').toLowerCase()}-kreaverse.ai`;

  async function createUser() {
    const response = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: computedEmail, password: computedPassword, handle, name: handle }),
    });
    const data = await response.json();
    setMessage(`User dibuat: ${data.generatedCredentials?.email} / ${data.generatedCredentials?.password}`);
    setHandle('habi');
    setCustomPassword('');
    await load();
  }

  async function toggleUser(userId: string, active: boolean) {
    await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    });
    await load();
  }

  async function deleteUser(userId: string) {
    await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
    await load();
  }

  async function saveSettings() {
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKeyMode: settings?.apiKeyMode === 'SERVER_UNLIMITED' ? 'USER_KEY' : 'SERVER_UNLIMITED',
        whatsappTemplate: settings?.whatsappTemplate,
      }),
    });
    await load();
  }

  async function savePoolKey() {
    await fetch('/api/admin/api-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: newPoolLabel, key: newPoolKey }),
    });
    setNewPoolLabel('');
    setNewPoolKey('');
    await load();
  }

  async function uploadAsset(file: File | null, target: string) {
    if (!file) return;
    setMessage('Mengunggah aset ke Cloudinary...');
    const uploaded = await uploadFileToCloudinary(file, 'kreaverse-ai/assets');
    if (target.startsWith('promoBanner.')) {
      const field = target.split('.')[1];
      setAssetForm((prev: any) => ({ ...prev, promoBanner: { ...prev.promoBanner, [field]: uploaded.secure_url } }));
    } else if (target.startsWith('toolLogos.')) {
      const field = target.split('.')[1];
      setAssetForm((prev: any) => ({ ...prev, toolLogos: { ...prev.toolLogos, [field]: uploaded.secure_url } }));
    } else {
      setAssetForm((prev: any) => ({ ...prev, [target]: uploaded.secure_url }));
    }
    setMessage('Aset siap disimpan ke website.');
  }

  async function saveAssets() {
    setAssetSaving(true);
    await fetch('/api/admin/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assetForm),
    });
    setAssetSaving(false);
    setMessage('Aset live disimpan. Railway akan mengikuti commit terbaru.');
    await load();
  }

  const totalUserKeys = useMemo(() => users.reduce((acc, user) => acc + user.apiKeys.length, 0), [users]);

  return (
    <div className="container space-y-6 py-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Total user', stats?.totalUsers ?? '-', Users],
          ['Aktif sekarang', stats?.activeSessions ?? '-', Activity],
          ['Key user tersimpan', totalUserKeys, KeyRound],
          ['Pool server', apiData?.pool?.length ?? '-', BadgeCheck],
        ].map(([title, value, Icon]) => (
          <Card key={String(title)} className="rounded-[32px] border border-white/10 bg-[#121b31] p-5">
            <div className="flex items-center justify-between">
              <CardDescription>{String(title)}</CardDescription>
              {/* @ts-ignore */}
              <Icon className="h-5 w-5 text-cyan-300" />
            </div>
            <CardTitle className="mt-4 text-4xl font-black text-white">{String(value)}</CardTitle>
          </Card>
        ))}
      </div>

      <Card className="rounded-[34px] border border-white/10 bg-[#121b31] p-5">
        <CardTitle className="text-[32px] font-black text-white">Login & brand assets</CardTitle>
        <CardDescription className="mt-2 text-slate-300">Upload logo login, logo website, logo provider, banner promo, dan tool logo. Semua ukuran sudah disiapkan mobile-first.</CardDescription>
        <div className="mt-5 grid gap-4">
          {[
            ['loginLogoUrl', 'Logo login (512×512 PNG/SVG)'],
            ['logoUrl', 'Logo website/header (512×512 PNG/SVG)'],
            ['providerLogoUrl', 'Logo provider EvoLink (256×256 PNG/SVG)'],
          ].map(([field, label]) => (
            <div key={field} className="rounded-[28px] border border-white/10 bg-[#18233c] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="mt-1 text-xs text-slate-400">Upload aset lalu simpan. Jika tidak ada file, elemen akan disembunyikan otomatis.</p>
                </div>
                <label className="flex h-12 items-center gap-2 rounded-full bg-cyan-400 px-4 text-sm font-black text-slate-950">
                  <ImagePlus className="h-4 w-4" /> Upload
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadAsset(e.target.files?.[0] || null, String(field))} />
                </label>
              </div>
              {(assetForm as any)[field] ? <p className="mt-3 truncate text-xs text-cyan-300">{(assetForm as any)[field]}</p> : null}
            </div>
          ))}

          <div className="rounded-[28px] border border-white/10 bg-[#18233c] p-4">
            <p className="text-sm font-semibold text-white">Banner promo pengguna</p>
            <p className="mt-1 text-xs text-slate-400">Ukuran ideal 1080×1350 atau 1080×1920. Akan muncul 1x per 3 jam jika diaktifkan dan jika file tersedia.</p>
            <div className="mt-4 flex items-center gap-3">
              <ToggleSwitch checked={Boolean(assetForm.promoBanner.enabled)} onChange={(checked) => setAssetForm((prev: any) => ({ ...prev, promoBanner: { ...prev.promoBanner, enabled: checked } }))} labels={{ on: 'Banner aktif', off: 'Banner mati' }} />
            </div>
            <div className="mt-4 grid gap-3">
              <Input value={assetForm.promoBanner.title} onChange={(e) => setAssetForm((prev: any) => ({ ...prev, promoBanner: { ...prev.promoBanner, title: e.target.value } }))} placeholder="Judul banner" />
              <Textarea value={assetForm.promoBanner.description} onChange={(e) => setAssetForm((prev: any) => ({ ...prev, promoBanner: { ...prev.promoBanner, description: e.target.value } }))} className="min-h-[100px] rounded-[24px] bg-[#11192d]" />
              <Input value={assetForm.promoBanner.linkUrl} onChange={(e) => setAssetForm((prev: any) => ({ ...prev, promoBanner: { ...prev.promoBanner, linkUrl: e.target.value } }))} placeholder="Link tujuan banner" />
              <label className="flex h-12 items-center justify-center gap-2 rounded-full bg-cyan-400 text-sm font-black text-slate-950">
                <Wand2 className="h-4 w-4" /> Upload banner
                <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadAsset(e.target.files?.[0] || null, 'promoBanner.imageUrl')} />
              </label>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              ['image', 'Logo tool image'],
              ['music', 'Logo tool music'],
              ['video', 'Logo tool video'],
              ['mastering', 'Logo tool mastering'],
            ].map(([field, label]) => (
              <div key={field} className="rounded-[28px] border border-white/10 bg-[#18233c] p-4">
                <p className="text-sm font-semibold text-white">{label}</p>
                <label className="mt-3 flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-white">
                  Upload logo
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadAsset(e.target.files?.[0] || null, `toolLogos.${field}`)} />
                </label>
              </div>
            ))}
          </div>

          <Input value={assetForm.loginFooterText} onChange={(e) => setAssetForm((prev: any) => ({ ...prev, loginFooterText: e.target.value }))} placeholder="Teks bawah login" />
          <Textarea value={assetForm.footerText} onChange={(e) => setAssetForm((prev: any) => ({ ...prev, footerText: e.target.value }))} className="min-h-[100px] rounded-[28px] bg-[#18233c]" />
          <Button onClick={saveAssets} disabled={assetSaving} className="h-14 rounded-full text-base font-black">
            {assetSaving ? 'Menyimpan aset...' : 'Simpan aset & auto-commit'}
          </Button>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-[34px] border border-white/10 bg-[#121b31] p-5">
          <CardTitle className="text-[28px] font-black text-white">Manajemen user</CardTitle>
          <CardDescription className="mt-2 text-slate-300">Format cepat: email <strong>{'{nama}@kreaverse.ai'}</strong> dan password <strong>{'{nama}-kreaverse.ai'}</strong>. Kamu tinggal ganti nama depannya.</CardDescription>
          <div className="mt-5 grid gap-3">
            <Input value={handle} onChange={(e) => setHandle(e.target.value.toLowerCase())} placeholder="Nama depan user, contoh habi" />
            <Input value={computedEmail} readOnly className="bg-[#18233c]" />
            <Input value={computedPassword} onChange={(e) => setCustomPassword(e.target.value)} placeholder="Password custom atau biarkan auto" />
            <Button onClick={createUser} className="h-14 rounded-full text-base font-black">Buat user</Button>
          </div>
          <div className="mt-5 space-y-3">
            {users.map((user) => {
              const latest = user.sessions?.[0];
              return (
                <div key={user.id} className="rounded-[28px] border border-white/10 bg-[#18233c] p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-[22px] border border-white/10 bg-[#0f1528]">
                      {user.avatarUrl ? <Image src={user.avatarUrl} alt={user.email} fill className="object-cover" /> : <div className="flex h-full w-full items-center justify-center text-xl font-black text-cyan-300">{(user.name || user.email).charAt(0).toUpperCase()}</div>}
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-black text-white">{user.name || user.email.split('@')[0]}</p>
                      <p className="text-sm text-slate-300">{user.email}</p>
                      <p className="mt-1 text-xs text-slate-400">{user.active ? 'Online siap pakai' : 'Tidak aktif'} · {user.apiKeys.length} key · last seen {latest?.lastSeenAt ? new Date(latest.lastSeenAt).toLocaleString('id-ID') : '-'}</p>
                      {user.bio ? <p className="mt-2 text-xs leading-5 text-slate-400">{user.bio}</p> : null}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" className="rounded-full" onClick={() => toggleUser(user.id, user.active)}>{user.active ? 'Nonaktifkan' : 'Aktifkan'}</Button>
                    <Button variant="destructive" className="rounded-full" onClick={() => deleteUser(user.id)}>Hapus</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[34px] border border-white/10 bg-[#121b31] p-5">
            <CardTitle className="text-[28px] font-black text-white">Mode API server</CardTitle>
            <CardDescription className="mt-2 text-slate-300">Admin bisa mematikan mode server. Saat dimatikan, user akan diarahkan memakai API key pribadi.</CardDescription>
            <div className="mt-5 space-y-4">
              <ToggleSwitch checked={settings?.apiKeyMode === 'SERVER_UNLIMITED'} onChange={() => saveSettings()} labels={{ on: 'Server Unlimited aktif', off: 'Server key dimatikan' }} />
              <div className="rounded-[28px] border border-white/10 bg-[#18233c] p-4 text-sm text-slate-300">Mode sekarang: <strong>{settings?.apiKeyMode || '-'}</strong></div>
            </div>
          </Card>

          <Card className="rounded-[34px] border border-white/10 bg-[#121b31] p-5">
            <CardTitle className="text-[28px] font-black text-white">API key pool server</CardTitle>
            <CardDescription className="mt-2 text-slate-300">Bisa ditambah sampai banyak key. Untuk fase ini sudah siap menambah key pool dan melihat status aktifnya.</CardDescription>
            <div className="mt-5 grid gap-3">
              <FancySelect value="evolink" onChange={() => undefined} options={[{ value: 'evolink', label: 'EvoLink pool server', description: 'Pool utama Kreaverse AI' }]} />
              <Input value={newPoolLabel} onChange={(e) => setNewPoolLabel(e.target.value)} placeholder="Label key pool" />
              <Input value={newPoolKey} onChange={(e) => setNewPoolKey(e.target.value)} placeholder="Masukkan API key pool" />
              <Button onClick={savePoolKey} className="h-14 rounded-full text-base font-black">Tambah key pool</Button>
            </div>
            <div className="mt-5 space-y-2">
              {apiData?.pool?.map((item: any) => (
                <div key={item.id} className="rounded-[22px] border border-white/10 bg-[#18233c] p-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-white">{item.label}</span>
                    <span className={item.active ? 'rounded-full bg-emerald-400/10 px-2 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-300' : 'rounded-full bg-rose-500/10 px-2 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-rose-300'}>{item.active ? 'Aktif' : 'Nonaktif'}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {message ? <p className="text-sm text-cyan-300">{message}</p> : null}
    </div>
  );
}