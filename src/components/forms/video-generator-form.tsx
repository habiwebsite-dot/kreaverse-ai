"use client";

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { uploadFileToCloudinary } from '@/lib/client-upload';
import { safeJsonParse } from '@/lib/utils';
import { useApp } from '@/components/providers/app-provider';

const modelMap = {
  'seedance-2.0-image-to-video': {
    label: 'Seedance 2.0 Image-to-Video',
    model: 'seedance-2.0-image-to-video',
    maxImages: 2,
    aspectRatios: ['adaptive', '16:9', '9:16', '1:1', '4:3', '3:4', '21:9'],
    qualities: ['480p', '720p', '1080p'],
  },
  'kling-o3-image-to-video': {
    label: 'Kling O3 Image-to-Video',
    model: 'kling-o3-image-to-video',
    maxImages: 4,
    aspectRatios: ['16:9', '9:16', '1:1'],
    qualities: ['720p', '1080p', '4k'],
  },
  'wan2.7-image-to-video': {
    label: 'Wan2.7 Image-to-Video',
    model: 'wan2.7-image-to-video',
    maxImages: 2,
    aspectRatios: ['16:9', '9:16', '1:1'],
    qualities: ['720p', '1080p'],
    modes: ['first_frame', 'first_last_frame', 'video_continuation'],
  },
} as const;

type VideoDocId = keyof typeof modelMap;

export function VideoGeneratorForm() {
  const { user, openLogin } = useApp();
  const [docId, setDocId] = useState<VideoDocId>('seedance-2.0-image-to-video');
  const [prompt, setPrompt] = useState('Kamera perlahan mendekat, suasana hidup dan sinematik.');
  const [files, setFiles] = useState<File[]>([]);
  const [duration, setDuration] = useState(5);
  const [aspectRatio, setAspectRatio] = useState('adaptive');
  const [quality, setQuality] = useState('720p');
  const [generateAudio, setGenerateAudio] = useState(true);
  const [sound, setSound] = useState('off');
  const [generationMode, setGenerationMode] = useState('first_frame');
  const [advanced, setAdvanced] = useState('{}');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const config = useMemo(() => modelMap[docId], [docId]);

  async function handleSubmit() {
    if (!user) return openLogin();
    setLoading(true);
    setStatus('');
    try {
      if (files.length === 0) throw new Error('Minimal satu gambar dibutuhkan.');
      if (files.length > config.maxImages) throw new Error(`Model ini maksimal ${config.maxImages} media.`);
      const uploaded = await Promise.all(files.map((file) => uploadFileToCloudinary(file, 'kreaverse-ai/videos')));
      const urls = uploaded.map((item) => item.secure_url);
      const payload: Record<string, unknown> = {
        model: config.model,
        prompt,
        duration,
        quality,
        ...safeJsonParse<Record<string, unknown>>(advanced, {}),
      };
      if (docId === 'seedance-2.0-image-to-video') {
        payload.image_urls = urls.slice(0, 2);
        payload.aspect_ratio = aspectRatio;
        payload.generate_audio = generateAudio;
      }
      if (docId === 'kling-o3-image-to-video') {
        payload.image_start = urls[0];
        if (urls[1]) payload.image_end = urls[1];
        payload.image_urls = urls.slice(2);
        payload.aspect_ratio = aspectRatio;
        payload.sound = sound;
      }
      if (docId === 'wan2.7-image-to-video') {
        payload.generation_mode = generationMode;
        payload.image_start = urls[0];
        if (urls[1]) payload.image_end = urls[1];
        payload.aspect_ratio = aspectRatio === 'adaptive' ? '16:9' : aspectRatio;
      }

      const response = await fetch('/api/generate/evolink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId, payload }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Generate video gagal');
      setStatus(`Task video dibuat: ${data.id}`);
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardTitle>Video Generator resmi Evolink</CardTitle>
      <CardDescription className="mt-2">
        Seedance, Kling, dan Wan2.7 dengan parameter persis sesuai dokumentasi yang Anda kirim. Watermark overlay akan tampil 5 detik sekali per jam per device saat preview hasil.
      </CardDescription>
      <div className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm">
          Model
          <select value={docId} onChange={(e) => setDocId(e.target.value as VideoDocId)} className="h-11 rounded-xl border border-white/10 bg-white/5 px-3">
            {Object.entries(modelMap).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}
          </select>
        </label>
        <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Prompt video" />
        <Input type="file" accept="image/*" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} />
        <div className="grid grid-cols-2 gap-3">
          <Input type="number" min={2} max={15} value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
          <select value={quality} onChange={(e) => setQuality(e.target.value)} className="h-11 rounded-xl border border-white/10 bg-white/5 px-3">
            {config.qualities.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="h-11 rounded-xl border border-white/10 bg-white/5 px-3">
          {config.aspectRatios.map((item) => <option key={item}>{item}</option>)}
        </select>
        {'modes' in config ? (
          <select value={generationMode} onChange={(e) => setGenerationMode(e.target.value)} className="h-11 rounded-xl border border-white/10 bg-white/5 px-3">
            {config.modes.map((item) => <option key={item}>{item}</option>)}
          </select>
        ) : null}
        {docId === 'seedance-2.0-image-to-video' ? (
          <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm">
            Generate audio sinkron
            <input type="checkbox" checked={generateAudio} onChange={(e) => setGenerateAudio(e.target.checked)} />
          </label>
        ) : null}
        {docId === 'kling-o3-image-to-video' ? (
          <select value={sound} onChange={(e) => setSound(e.target.value)} className="h-11 rounded-xl border border-white/10 bg-white/5 px-3">
            <option value="off">sound: off</option>
            <option value="on">sound: on</option>
          </select>
        ) : null}
        <Textarea value={advanced} onChange={(e) => setAdvanced(e.target.value)} className="min-h-[100px] font-mono text-xs" placeholder="Advanced JSON merge" />
        <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Membuat task video...' : 'Generate Video'}</Button>
        {status ? <p className="text-sm text-primary">{status}</p> : null}
      </div>
    </Card>
  );
}
