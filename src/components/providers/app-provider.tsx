"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type AppUser = {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  locale?: string;
};

type AppContextValue = {
  user: AppUser | null;
  loading: boolean;
  deviceLocked: boolean;
  loginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  refreshSession: () => Promise<void>;
  fingerprint: string;
};

const AppContext = createContext<AppContextValue | null>(null);

function ensureFingerprint() {
  if (typeof window === 'undefined') return 'server-device';
  const saved = localStorage.getItem('kreaverse-device-fingerprint');
  if (saved) return saved;
  const created = crypto.randomUUID();
  localStorage.setItem('kreaverse-device-fingerprint', created);
  return created;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [deviceLocked, setDeviceLocked] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [fingerprint, setFingerprint] = useState('server-device');

  const refreshSession = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      if (!res.ok) {
        setUser(null);
        setDeviceLocked(false);
      } else {
        const data = await res.json();
        setUser(data.user);
        setDeviceLocked(Boolean(data.deviceLocked));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fp = ensureFingerprint();
    setFingerprint(fp);
    refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    if (!user || user.role !== 'USER') return;
    const source = new EventSource('/api/events/stream');

    source.addEventListener('presence', (event) => {
      const payload = JSON.parse((event as MessageEvent).data);
      setDeviceLocked(Boolean(payload.deviceLocked));
    });

    source.addEventListener('notifications', (event) => {
      const payload = JSON.parse((event as MessageEvent).data) as Array<{ message: string }>;
      if (payload[0]?.message) {
        // eslint-disable-next-line no-alert
        window.alert(payload[0].message);
      }
    });

    return () => source.close();
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      loading,
      deviceLocked,
      loginOpen,
      openLogin: () => setLoginOpen(true),
      closeLogin: () => setLoginOpen(false),
      refreshSession,
      fingerprint,
    }),
    [deviceLocked, fingerprint, loading, loginOpen, refreshSession, user],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}
