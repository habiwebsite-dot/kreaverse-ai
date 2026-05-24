"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/components/providers/app-provider';
import { Equalizer } from '@/components/equalizer';

const sunoModels = ['suno-v5-beta', 'suno-v4.5plus-beta', 'suno-v4.5all-beta', 'suno-v4.5-beta', 'suno-v4-beta'];

export function MusicGeneratorForm() {
  const { user, openLogin } = useApp();
  const [model, setModel] = useState('suno-v5-beta');
  const [customMode, setCustomMode] = useState(true);
  const [instrumental, setInstrumental] = useState(false);
  const [prompt, setPrompt] = useState('[Verse]\nMalam ini kota bercahaya...');
  const [title, setTitle] = useState('Kreaverse Night');
  const [style, setStyle] = useState('pop, electronic, upbeat, female vocals');
  const [negativeTags, setNegativeTags] = useState('heavy metal, screaming');
  const [vocalGender, setVocalGender] = useState('f');
  const [styleWeight, setStyleWeight] = useState(0.7);
  const [weirdness, setWeirdness] = useState(0.3);
  const [audioWeight, setAudioWeight] = useState(0.5);
  const [personaId, setPersonaId] = useState('');
  const [personaModel, setPersonaModel] = useState('style_persona');
  const [localAudio, setLocalAudio] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!user) return openLogin();
    setLoading(true);
    setStatus('');
    try {
      const payload: Record<string, unknown> = {
        model,
        custom_mode: customMode,
        instrumental,
        prompt,
        style,
        title,
        negative_tags: negativeTags,
        vocal_gender: vocalGender,
        style_weight: styleWeight,
        weirdness_constraint: weirdness,
        audio_weight: audioWeight,
      };

      if (!personaId) {
        delete payload.persona_id;
        delete payload.persona_model;
      } else {
        payload.persona_id = personaId;
        payload.persona_model = personaModel;
      }

      const response = await fetch('/api/generate/evolink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId: 'suno-music-generation', payload }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Generate audio gagal');
      setStatus(`Task audio dibuat: ${data.id}`);
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const sliders: Array<{ label: string; value: number; setter: (value: number) => void }> = [
    { label: 'Style weight', value: styleWeight, setter: setStyleWeight },
    { label: 'Weirdness constraint', value: weirdness, setter: setWeirdness },
    { label: 'Audio weight', value: audioWeight, setter: setAudioWeight },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <Card>
        <CardTitle>Music Studio — Suno Music Generation Beta</CardTitle>
        <CardDescription className="mt-2">
          Endpoint resmi yang tersedia di daftar Anda adalah Suno Music Generation. Upload audio di bawah hanya untuk preview + equalizer lokal; tidak dikirim ke Evolink karena field itu tidak ada di dokumentasi resmi yang Anda berikan.
        </CardDescription>
        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm">
            Model
            <select value={model} onChange={(e) => setModel(e.target.value)} className="h-11 rounded-xl border border-white/10 bg-white/5 px-3">
              {sunoModels.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm">
              Custom mode
              <input type="checkbox" checked={customMode} onChange={(e) => setCustomMode(e.target.checked)} />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm">
              Instrumental
              <input type="checkbox" checked={instrumental} onChange={(e) => setInstrumental(e.target.checked)} />
            </label>
          </div>

          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
          <Input value={style} onChange={(e) => setStyle(e.target.value)} placeholder="Style / tags" />
          <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Lyrics atau prompt" />
          <Input value={negativeTags} onChange={(e) => setNegativeTags(e.target.value)} placeholder="Negative tags" />

          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-2 text-sm">
              Vocal gender
              <select value={vocalGender} onChange={(e) => setVocalGender(e.target.value)} className="h-11 rounded-xl border border-white/10 bg-white/5 px-3">
                <option value="f">f</option>
                <option value="m">m</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              Persona model
              <select value={personaModel} onChange={(e) => setPersonaModel(e.target.value)} className="h-11 rounded-xl border border-white/10 bg-white/5 px-3">
                <option value="style_persona">style_persona</option>
                <option value="voice_persona">voice_persona</option>
              </select>
            </label>
          </div>

          <Input value={personaId} onChange={(e) => setPersonaId(e.target.value)} placeholder="persona_id (opsional)" />

          {sliders.map((item) => (
            <label key={item.label} className="grid gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span>{item.label}</span>
                <span>{item.value.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={item.value}
                onChange={(e) => item.setter(Number(e.target.value))}
              />
            </label>
          ))}

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Mengirim task...' : 'Generate Musik'}
          </Button>

          {status ? <p className="text-sm text-primary">{status}</p> : null}
        </div>
      </Card>

      <Card>
        <CardTitle>Preview Audio & Equalizer</CardTitle>
        <CardDescription className="mt-2">Bass / Mid / Treble via Web Audio API (BiquadFilterNode).</CardDescription>
        <div className="mt-6 grid gap-4">
          <Input type="file" accept="audio/*" onChange={(e) => setLocalAudio(e.target.files?.[0] || null)} />
          <Equalizer file={localAudio} />
        </div>
      </Card>
    </div>
  );
}
