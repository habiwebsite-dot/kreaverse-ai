"use client";

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FancySelectOption = {
  value: string;
  label: string;
  description?: string;
  badge?: string;
};

export function FancySelect({
  value,
  onChange,
  options,
  className,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: FancySelectOption[];
  className?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const selected = options.find((item) => item.value === value);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-14 w-full items-center justify-between rounded-[24px] border border-white/10 bg-[#1b2238] px-4 text-left text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
      >
        <div className="min-w-0">
          <p className="truncate text-base font-medium">{selected?.label || placeholder || 'Pilih opsi'}</p>
          {selected?.description ? <p className="truncate text-xs text-slate-400">{selected.description}</p> : null}
        </div>
        <ChevronDown className={cn('h-5 w-5 text-slate-400 transition', open && 'rotate-180')} />
      </button>
      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 overflow-hidden rounded-[24px] border border-white/10 bg-[#10172b] shadow-2xl">
          {options.map((item) => {
            const active = item.value === value;
            return (
              <button
                type="button"
                key={item.value}
                onClick={() => {
                  onChange(item.value);
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-start justify-between gap-3 border-b border-white/5 px-4 py-4 text-left last:border-b-0',
                  active ? 'bg-cyan-400/10' : 'hover:bg-white/5',
                )}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    {item.badge ? (
                      <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-red-300 animate-pulse">
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                  {item.description ? <p className="mt-1 text-xs text-slate-400">{item.description}</p> : null}
                </div>
                {active ? <Check className="mt-1 h-4 w-4 text-cyan-300" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
