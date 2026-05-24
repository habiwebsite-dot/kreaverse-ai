import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/components/providers/app-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LoginModal } from '@/components/login-modal';

export const metadata: Metadata = {
  title: 'Kreaverse AI',
  description: 'Platform AI generator audio, gambar, video, dan mastering siap deploy Railway.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="dark">
      <body>
        <AppProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <LoginModal />
        </AppProvider>
      </body>
    </html>
  );
}
