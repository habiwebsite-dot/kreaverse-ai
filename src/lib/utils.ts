import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUnlimited(value?: boolean) {
  return value ? 'Unlimited' : 'Saldo Terbatas';
}

export function formatCredits(value?: number | null) {
  if (value == null) return '-';
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(value);
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]) {
  return keys.reduce((acc, key) => {
    if (obj[key] !== undefined) {
      acc[key] = obj[key];
    }
    return acc;
  }, {} as Pick<T, K>);
}
