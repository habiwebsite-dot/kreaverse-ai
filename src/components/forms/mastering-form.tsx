"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { uploadFileToCloudinary } from '@/lib/client-upload';
import { safeJsonParse } from '@/lib/utils';
import { useApp } from '@/components/providers/app-provider';

type AlgorithmField = {
  default_value?: string | boolean | number;
  type?: string;
  display_name?: string;
  description?: string;
  options?: Array<{ value: string; display_name: string }>;
};

export function MasteringForm() {
  const { user, openLogin } = useApp();
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [title, setTitle] = useState('Mastering Demo Kreaverse');
  const [preset, setPreset] = useState('');
  const [action, setAction] = useState('start');
  const [advancedJson, setAdvancedJson] = useState('{\n  "loudnesstarget": "-16",\n  "maxpeak": "-1",\n  "filtermethod": "hipfilter"\n}');
  const [algorithms, setAlgorithms] = useState<Record<string, AlgorithmField>>({});
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/auphonic/algorithms', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => setAlgorithms(data.data || {}))
      .catch(() => setAlgorithms({}));
  }, []);

  async function handleSubmit() {
    if (!user) return openLogin();
    if (!audioFile) return setStatus('Unggah audio terlebih dahulu.');
    setLoading(true);
    setStatus('');
    try {
      const uploaded = await uploadFileToCloudinary(audioFile, 'kreaverse-ai/mastering');
      const fields: Record<string, string> = {
        title,
        input_file: uploaded.secure_url,
        action,
      };
      if (preset) fields.preset = preset;

      Object.entries(values).forEach(([key, value]) => {
        if (value !== '') fields[key] = value;
      });

      Object.assign(fields, safeJsonParse<Record<string, string>>(advancedJson, {}));

      const response = await fetch('/api/generate/auphonic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Mastering gagal');
      setStatus(`Production Auphonic dibuat: ${data?.data?.uuid || data?.uuid || 'OK'}`);
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardTitle>AI Mastering — Auphonic Simple API</CardTitle>
      <CardDescription className="mt-2">
        Input audio diupload ke Cloudinary lalu dikirim sebagai <code>input_file</code> URL sesuai Simple API. Seluruh parameter tambahan bisa di-merge lewat Advanced JSON, sementara daftar algoritma di bawah di-load dari endpoint resmi Auphonic.
      </CardDescription>
      <div className="mt-6 grid gap-4">
        <Input type="file" accept="audio/*,video/*" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} />
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="title" />
        <Input value={preset} onChange={(e) => setPreset(e.target.value)} placeholder="preset UUID / nama preset (opsional)" />
        <select value={action} onChange={(e) => setAction(e.target.value)} className="h-11 rounded-xl border border-white/10 bg-white/5 px-3">
          <option value="start">start</option>
          <option value="save">save</option>
        </select>
        <div className="grid gap-3 md:grid-cols-2">
          {Object.entries(algorithms).slice(0, 18).map(([key, field]) => {
            const current = values[key] ?? String(field.default_value ?? '');
            if (field.type === 'checkbox') {
              return (
                <label key={key} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm">
                  <span>{field.display_name || key}</span>
                  <input
                    type="checkbox"
                    checked={current === 'true'}
                    onChange={(e) => setValues((prev) => ({ ...prev, [key]: String(e.target.checked) }))}
                  />
                </label>
              );
            }
            return (
              <label key={key} className="grid gap-2 text-sm">
                <span>{field.display_name || key}</span>
                <Input value={current} onChange={(e) => setValues((prev) => ({ ...prev, [key]: e.target.value }))} />
              </label>
            );
          })}
        </div>
        <Textarea value={advancedJson} onChange={(e) => setAdvancedJson(e.target.value)} className="min-h-[180px] font-mono text-xs" />
        <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Mengirim ke Auphonic...' : 'Mulai Mastering'}</Button>
        {status ? <p className="text-sm text-primary">{status}</p> : null}
      </div>
    </Card>
  );
}
