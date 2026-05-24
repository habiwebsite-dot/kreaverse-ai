import Link from 'next/link';
import { ArrowRight, Music4, Sparkles, Wand2, Video, ShieldCheck, KeyRound } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { env } from '@/lib/env';
import { readSiteConfig } from '@/lib/site-config';
import { PromoOverlay } from '@/components/promo-overlay';

const tools = [
  { href: '/tools/image', title: 'Kreaverse Image', subtitle: 'Nano Banana • GPT Image • Wan', icon: Wand2, badge: 'Terbaru' },
  { href: '/tools/music', title: 'Kreaverse Audio', subtitle: 'Suno • Voice Design • TTS', icon: Music4 },
  { href: '/tools/video', title: 'Kreaverse Video', subtitle: 'Veo • Kling • Grok • Seedance', icon: Video, badge: 'Hot' },
  { href: '/tools/mastering', title: 'Kreaverse Mastering', subtitle: 'Auphonic • audio cleanup', icon: Sparkles },
];

export default async function HomePage() {
  const site = readSiteConfig();
  const session = await getSession();
  const waMessage = encodeURIComponent('Halo Admin Kreaverse AI, saya tertarik berlangganan. Mohon dibuatkan akun (email + password) untuk akses login ke website. Terima kasih.');
  const waHref = `https://wa.me/${env.whatsappNumber}?text=${waMessage}`;

  return (
    <div className="container space-y-6 py-6">
      <PromoOverlay
        enabled={site.promoBanner.enabled}
        imageUrl={site.promoBanner.imageUrl}
        title={site.promoBanner.title}
        description={site.promoBanner.description}
        ctaLabel={site.promoBanner.ctaLabel}
        linkUrl={site.promoBanner.linkUrl}
      />

      <section className="overflow-hidden rounded-[36px] border border-white/10 bg-[#1a2640] shadow-[0_20px_80px_rgba(5,8,22,0.45)]">
        <div className="bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_35%),linear-gradient(180deg,rgba(13,20,39,0.4),transparent)] px-6 pb-8 pt-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100">
            <Sparkles className="h-4 w-4" /> {site.promoBanner.title}
          </div>
          <h1 className="mt-6 text-[64px] font-black leading-[0.95] tracking-[-0.04em] text-white">
            {site.name} — studio AI produksi untuk audio, gambar, video, dan mastering.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">{site.tagline}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/tools/video" className="flex h-14 items-center gap-2 rounded-full bg-cyan-400 px-6 text-base font-black text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.35)]">
              Mulai create <ArrowRight className="h-4 w-4" />
            </Link>
            {!session ? (
              <a href={waHref} target="_blank" className="flex h-14 items-center rounded-full border border-white/10 bg-white/5 px-6 text-base font-semibold text-white">
                Minta akun via WhatsApp
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-4">
        {tools.map((tool) => (
          <Link key={tool.title} href={tool.href} className="rounded-[32px] border border-white/10 bg-[#121b31] p-5 shadow-[0_12px_40px_rgba(4,9,20,0.35)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-[24px] bg-cyan-400/10 text-cyan-300">
                  <tool.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-black text-white">{tool.title}</p>
                    {tool.badge ? <span className="rounded-full bg-red-500/15 px-2 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-red-300 animate-pulse">{tool.badge}</span> : null}
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{tool.subtitle}</p>
                </div>
              </div>
              <ArrowRight className="mt-1 h-5 w-5 text-slate-500" />
            </div>
          </Link>
        ))}
      </section>

      <section className="grid gap-4">
        <div className="rounded-[32px] border border-white/10 bg-[#121b31] p-5">
          <div className="flex items-center gap-3 text-white">
            <ShieldCheck className="h-5 w-5 text-emerald-300" />
            <p className="text-xl font-black">Login cepat & akses rapi</p>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Pengguna hanya login dengan email dan password. Admin punya jalur login khusus beserta kode verifikasi admin. Semua disusun mobile-first agar nyaman dipakai di Android.
          </p>
        </div>
        <div className="rounded-[32px] border border-white/10 bg-[#121b31] p-5">
          <div className="flex items-center gap-3 text-white">
            <KeyRound className="h-5 w-5 text-cyan-300" />
            <p className="text-xl font-black">Server unlimited & API key pribadi</p>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Saat server aktif, pengguna melihat status unlimited. Saat traffic penuh atau admin mematikan mode server, user dapat memasukkan API key Evolink pribadi lewat menu Settings.
          </p>
        </div>
      </section>
    </div>
  );
}