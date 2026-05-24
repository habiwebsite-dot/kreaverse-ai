"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [apiData, setApiData] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [bannerTitle, setBannerTitle] = useState('Unlimited mode aktif');
  const [bannerDescription, setBannerDescription] = useState('Generate tanpa repot input API key saat pool admin tersedia.');
  const [whatsappTemplate, setWhatsappTemplate] = useState('Halo Admin Kreaverse AI, saya tertarik berlangganan. Mohon dibuatkan akun (email + password) untuk akses login ke website. Terima kasih.');
  const [newPoolLabel, setNewPoolLabel] = useState('');
  const [newPoolKey, setNewPoolKey] = useState('');

  async function load() {
    const [statsRes, usersRes, settingsRes, apiRes] = await Promise.all([
      fetch('/api/admin/stats'),
      fetch('/api/admin/users'),
      fetch('/api/admin/settings'),
      fetch('/api/admin/api-keys'),
    ]);

    const [statsJson, usersJson, settingsJson, apiJson] = await Promise.all([
      statsRes.json(),
      usersRes.json(),
      settingsRes.json(),
      apiRes.json(),
    ]);

    setStats(statsJson);
    setUsers(usersJson);
    setSettings(settingsJson);
    setApiData(apiJson);
    if (settingsJson?.whatsappTemplate) setWhatsappTemplate(settingsJson.whatsappTemplate);
  }

  useEffect(() => {
    load().catch(() => undefined);
  }, []);

  async function createUser() {
    const response = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newUserEmail || undefined }),
    });
    const data = await response.json();
    setMessage(`User dibuat: ${data.generatedCredentials?.email} / ${data.generatedCredentials?.password}`);
    setNewUserEmail('');
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
        whatsappTemplate,
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

  async function saveAssets() {
    await fetch('/api/admin/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        promoBanner: {
          title: bannerTitle,
          description: bannerDescription,
          ctaLabel: 'Mulai Kreasi',
        },
      }),
    });
    setMessage('Aset live disimpan dan commit ke GitHub dipicu.');
  }

  return (
    <div className="container space-y-6 py-8">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['Total user', stats?.totalUsers ?? '-'],
          ['Total generate', stats?.totalGenerations ?? '-'],
          ['Active sessions', stats?.activeSessions ?? '-'],
          ['API env pool', apiData?.envPoolCount ?? '-'],
        ].map(([title, value]) => (
          <Card key={title}>
            <CardDescription>{title}</CardDescription>
            <CardTitle className="mt-3 text-3xl">{value}</CardTitle>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardTitle>Manajemen user</CardTitle>
          <CardDescription className="mt-2">Buat akun manual oleh admin. Public signup tetap dinonaktifkan.</CardDescription>
          <div className="mt-4 flex gap-3">
            <Input value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} placeholder="Kosongkan untuk auto generate email" />
            <Button onClick={createUser}>Buat user</Button>
          </div>
          <div className="mt-4 space-y-3">
            {users.map((user) => (
              <div key={user.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-muted-foreground">{user.active ? 'Aktif' : 'Nonaktif'} · {user.sessions.length} sesi · {user.apiKeys.length} key</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => toggleUser(user.id, user.active)}>{user.active ? 'Nonaktifkan' : 'Aktifkan'}</Button>
                    <Button variant="destructive" onClick={() => deleteUser(user.id)}>Hapus</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle>Mode API + WhatsApp</CardTitle>
          <CardDescription className="mt-2">Toggle server unlimited / user key, edit template CTA WhatsApp.</CardDescription>
          <div className="mt-4 grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
              Mode sekarang: <strong>{settings?.apiKeyMode || '-'}</strong>
            </div>
            <Textarea value={whatsappTemplate} onChange={(e) => setWhatsappTemplate(e.target.value)} />
            <Button onClick={saveSettings}>Toggle mode + simpan template</Button>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardTitle>API Key Pool</CardTitle>
          <CardDescription className="mt-2">Tambahkan key baru untuk failover otomatis. User key tersimpan juga muncul di API panel.</CardDescription>
          <div className="mt-4 grid gap-3">
            <Input value={newPoolLabel} onChange={(e) => setNewPoolLabel(e.target.value)} placeholder="Label pool key" />
            <Input value={newPoolKey} onChange={(e) => setNewPoolKey(e.target.value)} placeholder="Masukkan key" />
            <Button onClick={savePoolKey}>Tambah key pool</Button>
          </div>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            {apiData?.pool?.map((item: any) => (
              <div key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                {item.label} · failure {item.failureCount} · active {String(item.active)}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle>Editor aset live</CardTitle>
          <CardDescription className="mt-2">Simpan banner → backend commit ke GitHub → Railway auto redeploy.</CardDescription>
          <div className="mt-4 grid gap-3">
            <Input value={bannerTitle} onChange={(e) => setBannerTitle(e.target.value)} placeholder="Judul banner" />
            <Textarea value={bannerDescription} onChange={(e) => setBannerDescription(e.target.value)} />
            <Button onClick={saveAssets}>Simpan & auto-commit</Button>
          </div>
        </Card>
      </div>

      {message ? <p className="text-sm text-primary">{message}</p> : null}
    </div>
  );
}
