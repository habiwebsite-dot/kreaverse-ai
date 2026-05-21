# ✨ kreaverse-ai

Platform agregasi **11 provider AI** dalam satu dashboard.
**Owner:** HABI-STUDIO.AI · Jember Jawa Timur.

## 🌐 11 Provider (terpisah, tidak dicampur)

| # | Provider | Docs |
|---|---|---|
| 1 | Kie AI | https://docs.kie.ai |
| 2 | API.box | https://docs.api.box |
| 3 | Apiframe AI | https://docs.apiframe.ai |
| 4 | Crun AI | https://docs.crun.ai |
| 5 | Suno API | https://docs.sunoapi.org |
| 6 | Evolink AI | https://docs.evolink.ai |
| 7 | AI Mastering | https://aimastering.com/api_docs/ |
| 8 | DeepSeek | https://api-docs.deepseek.com |
| 9 | Leonardo AI | https://docs.leonardo.ai |
| 10 | Gemini AI (Imagen & Veo) | https://ai.google.dev |
| 11 | Grok (xAI) | https://docs.x.ai |

## 🧭 Unified API

| Fungsi | Method | Endpoint |
|--|--|--|
| Buat Task | POST | `/api/v1/jobs/createTask` |
| Cek Status | GET | `/api/v1/jobs/recordInfo?taskId={id}` |
| Download | GET | `/api/v1/common/download-url` |
| Kredit | GET | `/api/v1/user/credits` |

Alur: createTask → recordInfo (0 antri, 1 proses, 2 sukses, 3 gagal) → ambil `resultJson.resultUrls`.

## 🚀 Setup Lokal

```bash
git clone <repo>
cd kreaverse-ai
cp .env.example .env
# isi CLOUDINARY_* dan API key provider sesuai kebutuhan
npm install
npm run dev
# buka http://localhost:3000
```

## ☁️ Deploy

### Vercel
```bash
npm i -g vercel
vercel
```
Konfigurasi sudah ada di `vercel.json`. Tambahkan env di dashboard Vercel.

### Cloudflare Pages
- Build command: `npm install`
- Output directory: `public`
- Functions: arahkan ke `src/index.js`
- Tambahkan env di Pages settings.

### Hosting Node biasa
```bash
npm start
```

## 🔐 Akun Default
- Email: `habistudio.ai@unlimited.com`
- Password: `habi.studio.com`

## 💳 Premium
Rp **700.000** / 3 bulan **unlimited**.
Bayar via WhatsApp: **+62 851-1982-1813**

## 🎁 Undang Teman
Login → buat URL undangan → teman klaim kode → trial 3 hari.

## 🔑 API Key Mode
- **ON Unlimited** = pakai server owner.
- **OFF** = pakai API key sendiri (mendukung 20+ key per provider, auto-failover).
- Tombol *Simpan & Cek Otomatis*: 🟢 aktif / 🔴 tidak aktif.

## 📁 Struktur File Hasil
- Audio → folder `kreaverse-ai/audio` di Cloudinary
- Image → folder `kreaverse-ai/image`
- Video → folder `kreaverse-ai/video`
Tidak dicampur, masing-masing punya tombol download terpisah.

## 🌍 Bahasa
Indonesia (default), Jawa, Madura, Inggris — ganti di navbar.

## 👤 Owner
**kreaverse-ai** — By **HABI-STUDIO.AI**
