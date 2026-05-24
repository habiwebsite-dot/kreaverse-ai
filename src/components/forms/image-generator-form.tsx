"use client";

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { uploadFileToCloudinary } from '@/lib/client-upload';
import { safeJsonParse } from '@/lib/utils';
import { useApp } from '@/components/providers/app-provider';

const models = {
  'nanobanana-image-generate': {
    label: 'Nanobanana Beta (max 5 refs)',
    model: 'nano-banana-beta',
    maxRefs: 5,
    sizes: ['auto', '1:1', '2:3', '3:2', '4:3', '3:4', '16:9', '9:16'],
    extra: ['size'],
  },
  'nanobanana-pro-beta-image-generate': {
    label: 'Nanobanana Pro Beta (max 10 refs / 5 real person)',
    model: 'nano-banana-pro-beta',
    maxRefs: 10,
    sizes: ['auto', '1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9'],
    qualities: ['1K', '2K', '4K'],
  },
  'gpt-image-2-beta-image-generation': {
    label: 'GPT Image 2 Beta (max 16 refs)',
    model: 'gpt-image-2-beta',
    maxRefs: 16,
    sizes: ['auto', '1:1', '2:3', '3:2', '4:3', '3:4', '5:4', '4:5', '16:9', '9:16', '21:9', '9:21'],
    resolutions: ['1K', '2K'],
  },
  'wan2.5-image-to-image': {
    label: 'Wan2.5 Image-to-Image (max 2 refs)',
    model: 'wan2.5-image-to-image',
    maxRefs: 2,
    counts: [1, 2, 3, 4],
  },
} as const;

type ModelKey = keyof typeof models;

export function ImageGeneratorForm() {
  const { user, openLogin } = useApp();
  const [docId, setDocId] = useState<ModelKey>('nanobanana-image-generate');
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState('auto');
  const [quality, setQuality] = useState('2K');
  const [resolution, setResolution] = useState('1K');
  const [count, setCount] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const [advanced, setAdvanced] = useState('{}');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const config = useMemo(() => models[docId], [docId]);

  async function handleSubmit() {
    if (!user) return openLogin();
    setLoading(true);
    setResult('');
    try {
      if (files.length > config.maxRefs) {
        throw new Error(`Model ini maksimum ${config.maxRefs} referensi.`);
      }
      const uploadedUrls = await Promise.all(files.map((file) => uploadFileToCloudinary(file, 'kreaverse-ai/images')));
      const advancedJson = safeJsonParse<Record<string, unknown>>(advanced, {});
      const payload: Record<string, unknown> = {
        model: config.model,
        prompt,
        image_urls: uploadedUrls.map((item) => item.secure_url),
        ...advancedJson,
      };
      if (docId === 'nanobanana-image-generate') payload.size = size;
      if (docId === 'nanobanana-pro-beta-image-generate') {
        payload.size = size;
        payload.quality = quality;
      }
      if (docId === 'gpt-image-2-beta-image-generation') {
        payload.size = size;
        payload.resolution = resolution;
      }
      if (docId === 'wan2.5-image-to-image') payload.n = count;

      const response = await fetch('/api/generate/evolink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId, payload }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Generate gagal');
      setResult(`Task dibuat: ${data.id}`);
    } catch (error) {
      setResult((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardTitle>Image-to-Image resmi Evolink</CardTitle>
      <CardDescription className="mt-2">
        Upload 5 referensi aman untuk model Nanobanana/GPT Image 2. Jika pilih Wan2.5, otomatis dibatasi 2 sesuai dokumentasi resmi.
      </CardDescription>
      <div className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm">
          Model
          <select value={docId} onChange={(e) => setDocId(e.target.value as ModelKey)} className="h-11 rounded-xl border border-white/10 bg-white/5 px-3">
            {Object.entries(models).map(([value, item]) => (
              <option key={value} value={value}>{item.label}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          Prompt
          <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Deskripsikan edit/gambar yang diinginkan" />
        </label>
        {'sizes' in config ? (
          <label className="grid gap-2 text-sm">
            Aspect Ratio / Size
            <select value={size} onChange={(e) => setSize(e.target.value)} className="h-11 rounded-xl border border-white/10 bg-white/5 px-3">
              {config.sizes.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        ) : null}
        {'qualities' in config ? (
          <label className="grid gap-2 text-sm">
            Quality
            <select value={quality} onChange={(e) => setQuality(e.target.value)} className="h-11 rounded-xl border border-white/10 bg-white/5 px-3">
              {config.qualities.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        ) : null}
        {'resolutions' in config ? (
          <label className="grid gap-2 text-sm">
            Resolution
            <select value={resolution} onChange={(e) => setResolution(e.target.value)} className="h-11 rounded-xl border border-white/10 bg-white/5 px-3">
              {config.resolutions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        ) : null}
        {'counts' in config ? (
          <label className="grid gap-2 text-sm">
            Jumlah output (n)
            <Input type="number" min={1} max={4} value={count} onChange={(e) => setCount(Number(e.target.value))} />
          </label>
        ) : null}
        <label className="grid gap-2 text-sm">
          Upload referensi ({files.length}/{config.maxRefs})
          <Input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
        </label>
        <label className="grid gap-2 text-sm">
          Advanced JSON (opsional, akan di-merge persis ke payload)
          <Textarea value={advanced} onChange={(e) => setAdvanced(e.target.value)} className="min-h-[100px] font-mono text-xs" />
        </label>
        <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Mengunggah & membuat task...' : 'Generate Gambar'}</Button>
        {result ? <p className="text-sm text-primary">{result}</p> : null}
      </div>
    </Card>
  );
}
