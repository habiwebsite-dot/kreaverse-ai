# Kreaverse AI

Platform agregasi 11 provider AI (Kie AI, API Box, Apiframe.ai, Crun.ai, SunoAPI.org, Evolink.ai, AI Mastering, DeepSeek, Leonardo.ai, Gemini AI, Grok AI) untuk generasi gambar, video, audio, chat, dan mastering.

## Cara Deploy ke Render

1. Fork atau upload repository ini ke GitHub.
2. Buka [Render Dashboard](https://dashboard.render.com/), buat **New Web Service**, hubungkan dengan repo GitHub.
3. Render akan membaca `render.yaml` dan secara otomatis membuat service.
4. Isi **Environment Variables** berikut di dashboard Render (atau di `render.yaml` sebelum push):
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` – dari dashboard Cloudinary
   - `PROVIDER_API_KEYS` – JSON string, contoh: `{"kie_ai":"key1,key2","deepseek":"sk-...","gemini":"AIza...","leonardo":"...","grok":"..."}`
   - `ADMIN_PASSWORD_HASH` – bcrypt hash dari password `habi.studio.com` (bisa generate online)
   - `SESSION_SECRET` – string acak
5. Klik **Deploy**. Setelah selesai, backend berjalan di URL yang disediakan Render.
6. Anti-sleep: server melakukan self-ping setiap 14 menit via cron internal, jadi selalu aktif.

## Cara Mengganti Logo, QR, Ikon

- Letakkan file logo di `public/images/logo.png`
- QR pembayaran di `public/images/qr-payment.png`
- Ikon provider/model di folder `public/images/providers/` dengan nama sesuai key provider (misal `kie-ai.png`)
- Admin dapat mengganti QR dan pengaturan lainnya melalui panel admin (`/admin`) setelah login sebagai admin.

## Struktur

- `src/` – backend Node.js
- `public/` – frontend SPA (HTML, CSS, JS)
- `admin/` – admin panel

## Catatan

Semua perubahan admin (harga, promo, logo, QR) langsung tersimpan di `config/settings.json` dan langsung terlihat di frontend.

Untuk pertanyaan, hubungi WhatsApp: +62851-1982-1813.