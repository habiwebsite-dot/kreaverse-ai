import { Suspense } from 'react';
import { LoginScreen } from '@/components/login-screen';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050816] px-4 py-10 text-sm text-slate-400">Memuat tampilan login...</div>}>
      <LoginScreen />
    </Suspense>
  );
}