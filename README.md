# Kreaverse AI

**Production AI Generator Platform** — Audio, Image, Video, Mastering

🚀 **Deploy:** Railway.com (Auto-deploy from GitHub)
🎵 **Audio:** Suno, Qwen TTS, Auphonic
🖼️ **Image:** Nanobanana, Midjourney, GPT-4O, Seedream, Wan2.5
🎬 **Video:** Seedance 2.0, HappyHorse, Sora 2, Veo 3.1, Wan2.7, Kling
👑 **Admin:** Live asset editor with GitHub auto-commit
🔐 **Security:** Device Lock, JWT, 2FA, API Key Pool with Failover

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Setup database
npm run prisma:migrate

# Dev server
npm run dev
```

Open http://localhost:3000

## Architecture

- **Frontend:** Next.js 14 (App Router) + TypeScript + TailwindCSS + shadcn/ui
- **Backend:** Next.js API Routes + Prisma ORM
- **Database:** PostgreSQL
- **Storage:** Cloudinary
- **Auth:** JWT + HTTP-Only Cookies + Device Lock

## Documentation

- [Evolink API](https://docs.evolink.ai)
- [Auphonic API](https://auphonic.com/help/api/)
- [Railway Deployment](https://railway.app)

## Admin Access

**Email:** `habistudio.ai@unlimited.com`
**Panel:** `/admin`

## License

Private
