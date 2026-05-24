"use client";

import { cn } from '@/lib/utils';

export function ToggleSwitch({
  checked,
  onChange,
  labels,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  labels?: { on: string; off: string };
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-12 w-full items-center rounded-full border px-4 transition',
        checked ? 'border-cyan-400/40 bg-cyan-400/10' : 'border-white/10 bg-[#171d31]',
      )}
    >
      <span className={cn('text-sm font-semibold', checked ? 'text-cyan-200' : 'text-slate-300')}>
        {checked ? labels?.on || 'Aktif' : labels?.off || 'Nonaktif'}
      </span>
      <span
        className={cn(
          'absolute right-2 flex h-8 w-14 items-center rounded-full px-1 transition',
          checked ? 'bg-cyan-400/25 justify-end' : 'bg-white/10 justify-start',
        )}
      >
        <span className={cn('h-6 w-6 rounded-full transition', checked ? 'bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.35)]' : 'bg-slate-400')} />
      </span>
    </button>
  );
}
