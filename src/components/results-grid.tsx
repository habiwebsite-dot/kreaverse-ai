"use client";

import { useMemo, useState } from 'react';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/components/providers/app-provider';
import { VideoWatermark } from '@/components/video-watermark';

type Item = {
  id: string;
  model: string;
  type: string;
  status: string;
  createdAt: string;
  previewUrl: string | null;
  resultUrls: string[];
};

export function ResultsGrid({ items }: { items: Item[] }) {
  const { fingerprint } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'IMAGE' | 'AUDIO' | 'VIDEO' | 'MASTERING'>('ALL');
  const [preview, setPreview] = useState<Item | null>(null);

  const filtered = useMemo(
    () => items.filter((item) => filter === 'ALL' || item.type === filter),
    [filter, items],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {['ALL', 'IMAGE', 'AUDIO', 'VIDEO', 'MASTERING'].map((item) => (
          <Button key={item} variant={filter === item ? 'default' : 'outline'} onClick={() => setFilter(item as typeof filter)}>
            {item}
          </Button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => (
          <Card key={item.id} className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">{item.model}</CardTitle>
                <CardDescription>{item.status} · {new Date(item.createdAt).toLocaleString('id-ID')}</CardDescription>
              </div>
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs">{item.type}</span>
            </div>
            {item.previewUrl ? (
              item.type === 'IMAGE' ? <img src={item.previewUrl} alt={item.model} className="h-52 w-full rounded-xl object-cover" /> : null
            ) : null}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPreview(item)}>Preview</Button>
              {item.previewUrl ? <a href={item.previewUrl} download className="inline-flex h-11 items-center rounded-xl border border-white/10 px-4 text-sm">Download</a> : null}
            </div>
          </Card>
        ))}
      </div>

      {preview ? (
        <div className="fixed inset-0 z-50 bg-slate-950/90 p-4">
          <div className="mx-auto flex h-full max-w-5xl flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Preview {preview.model}</h3>
              <Button variant="ghost" onClick={() => setPreview(null)}>Tutup</Button>
            </div>
            <div className="relative flex-1 overflow-hidden rounded-3xl border border-white/10 bg-black/60 p-3">
              {preview.type === 'IMAGE' && preview.previewUrl ? (
                <img src={preview.previewUrl} alt={preview.model} className="h-full w-full object-contain" />
              ) : null}
              {(preview.type === 'VIDEO' || preview.type === 'MASTERING') && preview.previewUrl ? (
                <>
                  {preview.type === 'VIDEO' ? <VideoWatermark fingerprint={fingerprint} /> : null}
                  <video controls className="h-full w-full object-contain" src={preview.previewUrl} />
                </>
              ) : null}
              {preview.type === 'AUDIO' && preview.previewUrl ? <audio controls className="w-full" src={preview.previewUrl} /> : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
