import Link from 'next/link';
import { MessageCircleMore, ShieldCheck, Sparkles, Workflow } from 'lucide-react';
import { FeatureGrid } from '@/components/feature-grid';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { env } from '@/lib/env';
import { readSiteConfig } from '@/lib/site-config';

export default function HomePage() {
  const site = readSiteConfig();
  const waMessage = encodeURIComponent(
    'Halo Admin Kreaverse AI, saya tertarik berlangganan. Mohon dibuatkan akun (email + password) untuk akses login ke website. Terima kasih.',
  );
  const waHref = `https://wa.me/${env.whatsappNumber}?text=${waMessage}`;

  return (
    <div className="container space-y-10 py-8 md:py-12">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass rounded-[32px] p-6 md:p-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
            <Sparkles className="h-4 w-4" /> {site.promoBanner.title}
          </div>
          <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">
            {site.name} — studio AI produksi untuk audio, gambar, video, dan mastering.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">{site.tagline}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="lg"><Link href="/tools/image">Mulai Generate</Link></Button>
            <Button size="lg" variant="outline"><a href={waHref} target="_blank">Minta Akun via WhatsApp</a></Button>
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {[
              ['JWT + HTTP Only', 'Login aman per-device'],
              ['SSE Device Lock', 'Notifikasi real-time saat device lain aktif'],
              ['Auto GitHub Deploy', 'Admin edit aset → commit → Railway redeploy'],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-medium">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
        <Card className="overflow-hidden p-0">
          <div className="h-full bg-hero-gradient p-6">
            <CardTitle className="text-xl">Panel readiness</CardTitle>
            <CardDescription className="mt-2">Sudah disiapkan untuk private repo GitHub + Railway Postgres + Cloudinary signed upload.</CardDescription>
            <div className="mt-6 space-y-3">
              {[
                { icon: ShieldCheck, title: 'Admin email hash', desc: 'ADMIN_EMAIL_HASH / ADMIN_PASSWORD_HASH / TOTP' },
                { icon: Workflow, title: 'Dual API mode', desc: 'Server Unlimited atau User Key + saldo real-time' },
                { icon: MessageCircleMore, title: 'CTA tanpa signup', desc: 'Daftar diarahkan ke WhatsApp admin' },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <item.icon className="mb-3 h-5 w-5 text-primary" />
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <FeatureGrid />

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardTitle>Dokumentasi resmi sudah difetch</CardTitle>
          <CardDescription className="mt-2">Semua URL Evolink + Auphonic yang Anda daftarkan sudah diunduh ke folder <code>docs/official</code> dan diubah menjadi registry mesin untuk form/tool.</CardDescription>
        </Card>
        <Card>
          <CardTitle>Tampilan mobile-first</CardTitle>
          <CardDescription className="mt-2">Layout dibuat presisi Android dahulu, lalu naik ke tablet dan desktop tanpa teks tabrakan.</CardDescription>
        </Card>
        <Card>
          <CardTitle>Siap zip & deploy</CardTitle>
          <CardDescription className="mt-2">Repo ini sudah berisi <code>.env.example</code>, <code>railway.json</code>, <code>Prisma schema</code>, dan route API utama.</CardDescription>
        </Card>
      </section>
    </div>
  );
}
