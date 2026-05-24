"use client";

import { useApp } from '@/components/providers/app-provider';
import { AuthExperience } from '@/components/auth-experience';

export function LoginModal() {
  const { loginOpen, closeLogin } = useApp();
  if (!loginOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] overflow-auto bg-slate-950/90 backdrop-blur-sm">
      <AuthExperience embedded onSuccess={closeLogin} />
    </div>
  );
}