"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Camera, MapPin, UserRound } from 'lucide-react';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { uploadFileToCloudinary } from '@/lib/client-upload';

export function ProfileEditorCard() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [address, setAddress] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setName(data.profile?.name || '');
        setBio(data.profile?.bio || '');
        setAddress(data.profile?.address || '');
        setAvatarUrl(data.profile?.avatarUrl || '');
      })
      .catch(() => undefined);
  }, []);

  async function saveProfile() {
    setSaving(true);
    const response = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, bio, address, avatarUrl }),
    });
    const data = await response.json();
    setSaving(false);
    setStatus(response.ok ? 'Profil pengguna berhasil disimpan.' : data.error || 'Gagal menyimpan profil.');
  }

  async function uploadAvatar(file: File | null) {
    if (!file) return;
    setStatus('Mengunggah foto...');
    try {
      const uploaded = await uploadFileToCloudinary(file, 'kreaverse-ai/profile');
      setAvatarUrl(uploaded.secure_url);
      setStatus('Foto profil siap disimpan.');
    } catch (error) {
      setStatus((error as Error).message);
    }
  }

  return (
    <Card className="overflow-hidden rounded-[34px] border border-white/10 bg-[#121b31] p-0">
      <div className="border-b border-white/5 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_45%)] px-5 py-6">
        <CardTitle className="text-[32px] font-black text-white">Profil Pengguna</CardTitle>
        <CardDescription className="mt-2 text-slate-300">Lengkapi nama, bio, alamat, dan foto. Semua data ini akan terlihat di dashboard admin.</CardDescription>
      </div>
      <div className="space-y-5 px-5 py-5">
        <div className="flex items-center gap-4 rounded-[28px] border border-white/10 bg-[#18233c] p-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-[24px] border border-white/10 bg-[#0f1528]">
            {avatarUrl ? (
              <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400"><UserRound className="h-8 w-8" /></div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Foto profil Kreaverse</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">Ukuran ideal 1024×1024 JPG/PNG. Admin akan bisa melihat foto ini.</p>
          </div>
          <label className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-cyan-400 text-slate-950 shadow-[0_0_25px_rgba(34,211,238,0.35)]">
            <Camera className="h-5 w-5" />
            <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadAvatar(e.target.files?.[0] || null)} />
          </label>
        </div>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama tampilan pengguna" />
        <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio singkat akun pengguna" className="min-h-[120px] rounded-[28px] bg-[#18233c]" />
        <div className="rounded-[28px] border border-white/10 bg-[#18233c] p-4">
          <div className="mb-3 flex items-center gap-2 text-sm text-slate-300"><MapPin className="h-4 w-4" /> Alamat / lokasi</div>
          <Textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Alamat atau lokasi pengguna" className="min-h-[100px] rounded-[24px] bg-[#11192d]" />
        </div>
        <Button onClick={saveProfile} disabled={saving} className="h-14 w-full rounded-full text-base font-black">
          {saving ? 'Menyimpan profil...' : 'Simpan profil'}
        </Button>
        {status ? <p className="text-sm text-cyan-300">{status}</p> : null}
      </div>
    </Card>
  );
}
