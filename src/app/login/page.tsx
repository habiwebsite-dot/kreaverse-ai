import { Suspense } from 'react';
import { LoginScreen } from '@/components/login-screen';

export default function LoginPage() {
  return (
    <div className="container py-16">
      <Suspense fallback={<div className="text-sm text-muted-foreground">Memuat form login...</div>}>
        <LoginScreen />
      </Suspense>
    </div>
  );
}
