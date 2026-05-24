"use client";

import { useEffect, useRef, useState } from 'react';

export function Equalizer({ file }: { file: File | null }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const bassRef = useRef<BiquadFilterNode | null>(null);
  const midRef = useRef<BiquadFilterNode | null>(null);
  const trebleRef = useRef<BiquadFilterNode | null>(null);
  const [src, setSrc] = useState('');
  const [bass, setBass] = useState(0);
  const [mid, setMid] = useState(0);
  const [treble, setTreble] = useState(0);

  useEffect(() => {
    if (!file) {
      setSrc('');
      return;
    }
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!audioRef.current || !src || contextRef.current) return;
    const context = new AudioContext();
    const source = context.createMediaElementSource(audioRef.current);
    const bassFilter = context.createBiquadFilter();
    bassFilter.type = 'lowshelf';
    bassFilter.frequency.value = 200;
    const midFilter = context.createBiquadFilter();
    midFilter.type = 'peaking';
    midFilter.frequency.value = 1000;
    midFilter.Q.value = 1;
    const trebleFilter = context.createBiquadFilter();
    trebleFilter.type = 'highshelf';
    trebleFilter.frequency.value = 3000;

    source.connect(bassFilter);
    bassFilter.connect(midFilter);
    midFilter.connect(trebleFilter);
    trebleFilter.connect(context.destination);

    contextRef.current = context;
    sourceRef.current = source;
    bassRef.current = bassFilter;
    midRef.current = midFilter;
    trebleRef.current = trebleFilter;
  }, [src]);

  useEffect(() => {
    if (bassRef.current) bassRef.current.gain.value = bass;
  }, [bass]);
  useEffect(() => {
    if (midRef.current) midRef.current.gain.value = mid;
  }, [mid]);
  useEffect(() => {
    if (trebleRef.current) trebleRef.current.gain.value = treble;
  }, [treble]);

  if (!src) return <p className="text-sm text-muted-foreground">Unggah audio untuk mencoba equalizer.</p>;

  return (
    <div className="space-y-4">
      <audio ref={audioRef} controls src={src} className="w-full" onPlay={() => contextRef.current?.resume()} />
      {[
        ['Bass', bass, setBass],
        ['Mid', mid, setMid],
        ['Treble', treble, setTreble],
      ].map(([label, value, setter]) => (
        <label key={label} className="grid gap-2 text-sm">
          <div className="flex items-center justify-between"><span>{label}</span><span>{Number(value)} dB</span></div>
          <input type="range" min={-15} max={15} value={Number(value)} onChange={(e) => (setter as (v:number)=>void)(Number(e.target.value))} />
        </label>
      ))}
    </div>
  );
}
