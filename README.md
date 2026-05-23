# EvoLink AI + Auphonic API Gateway

Express.js API gateway untuk EvoLink AI dan Auphonic, siap deploy ke Railway.

## Fitur

- **Audio**: Suno music generation, persona, Qwen TTS/voice design
- **Image**: Nanobanana, Midjourney V7, GPT-4o, GPT Image 2, Seedream, Wan2.5
- **Video**: Seedance 2.0, Happyhorse, Sora 2, VEO 3.1, Wan 2.7, Kling, Grok
- **File**: Upload via base64, stream, atau URL
- **Auphonic**: Audio mastering, noise reduction, leveling
- Rate limiting, auth middleware, error handling lengkap

## Setup

```bash
# Install dependencies
npm install

# Copy env file
cp .env.example .env
# Edit .env dan isi API keys

# Jalankan development
npm run dev

# Production
npm start
```

## Environment Variables

| Variable | Keterangan |
|---|---|
| `EVOLINK_API_KEY` | API key dari dashboard EvoLink |
| `EVOLINK_BASE_URL` | Base URL EvoLink (default: https://api.evolink.ai) |
| `AUPHONIC_API_KEY` | API key dari Auphonic |
| `API_SECRET_KEY` | Secret key gateway ini (opsional) |
| `PORT` | Port server (default: 3000) |

## Deploy ke Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

railway login
railway init
railway up

# Set environment variables
railway variables set EVOLINK_API_KEY=xxx
railway variables set AUPHONIC_API_KEY=xxx
railway variables set API_SECRET_KEY=xxx
railway variables set NODE_ENV=production
```

## Quick Test

```bash
# Health check
curl https://your-app.railway.app/health

# Generate image
curl -X POST https://your-app.railway.app/api/image/nanobanana2/generate \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_secret" \
  -d '{"prompt": "a beautiful sunset"}'

# Check credits
curl https://your-app.railway.app/api/account/credits \
  -H "X-API-Key: your_secret"
```

## Endpoints

Lihat `GET /` untuk daftar lengkap semua endpoint.
