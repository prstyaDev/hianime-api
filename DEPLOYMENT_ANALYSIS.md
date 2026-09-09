# 📋 Hasil Analisis & Testing HiAnime API - Siap Deploy ke Vercel

## ✅ STATUS TESTING: BERHASIL

API berhasil dijalankan secara lokal menggunakan Node.js dan sebagian besar endpoint berfungsi dengan baik.

---

## 📊 Hasil Testing Endpoint

### ✓ Endpoint yang Berfungsi (200 OK)
1. **Health Check** - `/ping` ✅
2. **API Info** - `/ui` ✅
3. **Homepage Data** - `/api/v1/home` ✅ (mendapat data anime lengkap)
4. **All Genres** - `/api/v1/genres` ✅
5. **Top Airing** - `/api/v1/animes/top-airing` ✅
6. **Most Popular** - `/api/v1/animes/most-popular` ✅
7. **Filter Options** - `/api/v1/filter/options` ✅
8. **Random Anime** - `/api/v1/random` ✅

### ⚠️ Endpoint dengan Issue
1. **Search** - `/api/v1/search?keyword=naruto` → 404 (parsing issue dari source website)
2. **Search Suggestions** - `/api/v1/suggestion?keyword=one` → 400 (no suggestions found)
3. **Anime Detail** - `/api/v1/anime/:id` → 200 tapi data kosong (parsing issue)

**Catatan:** Issue ini kemungkinan karena:
- Website source (hianime.ad) mungkin mengubah struktur HTML
- Perlu update parser/scraper
- Bukan masalah deployment, tapi scraping logic

---

## 🔧 File yang Sudah Dibuat untuk Deployment

### 1. `vercel.json` ✅
```json
{
  "version": 2,
  "builds": [{"src": "src/app.js", "use": "@vercel/node"}],
  "routes": [{"src": "/(.*)", "dest": "src/app.js"}],
  "env": {"NODE_ENV": "production"},
  "regions": ["sin1"]
}
```

### 2. `package.json` ✅ (Updated)
- Removed `bun` dependency (incompatible dengan Vercel)
- Added `@hono/node-server` untuk Node.js compatibility
- Simplified scripts untuk Vercel
- Set Node.js version requirement: `>=18.x`

### 3. `server.js` ✅
Node.js entry point untuk local testing (tidak dipakai di Vercel, tapi berguna untuk dev)

### 4. `.env.example` ✅
Template environment variables lengkap

---

## 🌍 Environment Variables untuk Vercel

### WAJIB (Tidak Ada)
Tidak ada environment variable yang **wajib** untuk menjalankan API ini. Semua sudah ada default values.

### OPSIONAL (Recommended)

#### 1. **Redis Configuration** (Highly Recommended untuk Performance)
```
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```
**Kenapa perlu:**
- API ini melakukan scraping website, sangat lambat tanpa cache
- Redis dari Upstash (free tier) sangat disarankan
- Tanpa Redis, setiap request akan scraping ulang (sangat lambat)
- Dapatkan di: https://upstash.com (Free: 10K commands/day)

**⚠️ WARNING:** Config default punya hardcoded Redis credentials yang **PUBLIC**. Jangan gunakan untuk production! Setup Redis sendiri.

#### 2. **CORS Configuration**
```
ORIGIN=*
```
atau
```
ORIGIN=https://your-frontend.com,https://another-domain.com
```
- Default: `*` (allow all origins)
- Untuk production, set ke domain frontend spesifik

#### 3. **Rate Limiting**
```
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_LIMIT=100
```
- Default sudah sangat permisif (1 billion requests)
- Untuk production, set limit yang masuk akal (contoh: 100 requests per menit)

#### 4. **Base URL** (untuk dokumentasi)
```
BASE_URL=https://your-api.vercel.app
```
- Digunakan di Swagger docs
- Auto-detect jika tidak diset

#### 5. **Cloudflare Bypass** (Jika website source pake Cloudflare protection)
```
CF_CLEARANCE=your-cf-clearance-cookie
CF_USER_AGENT=Mozilla/5.0...
```
- Hanya perlu jika source website blocked by Cloudflare

---

## 📝 Cara Deploy ke Vercel

### Option 1: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables (jika perlu)
vercel env add UPSTASH_REDIS_REST_URL
vercel env add UPSTASH_REDIS_REST_TOKEN

# Deploy production
vercel --prod
```

### Option 2: Vercel Dashboard
1. Push repo ke GitHub
2. Import project di https://vercel.com/new
3. Vercel auto-detect settings dari `vercel.json`
4. Add environment variables di Project Settings → Environment Variables
5. Deploy

---

## ⚠️ Catatan Penting Sebelum Deploy

### 1. **Redis Setup SANGAT DIANJURKAN**
- Tanpa Redis, API akan sangat lambat (scraping setiap request)
- Free tier Upstash cukup untuk testing: https://upstash.com
- Setup 5 menit saja

### 2. **Scraping-Based API = Fragile**
- API ini scraping hianime.ad
- Website bisa berubah struktur kapan saja
- Beberapa endpoint sudah bermasalah (search, detail)
- Perlu maintenance berkala untuk update parser

### 3. **Legal & Ethical**
- Ini adalah unofficial API
- Scraping content orang lain bisa melanggar ToS
- Gunakan untuk personal/educational purpose saja
- Jangan abuse dengan request berlebihan

### 4. **Performance di Vercel**
- Vercel Serverless Functions punya timeout (10s hobby, 60s pro)
- Scraping bisa lambat, bisa timeout di request pertama (cold start)
- Redis cache sangat penting untuk production use

### 5. **Dependencies Warning**
- Package.json asli punya dependencies yang berat:
  - `puppeteer-core`, `sharp` → Mungkin tidak jalan di Vercel (native deps)
  - Sudah diremove dari deployment version
  - Jika ada error, cek di Vercel logs

---

## 🚀 Langkah-langkah Deployment

### Step 1: Setup Redis (5 menit)
1. Buat account di https://upstash.com
2. Create Redis database (pilih region terdekat)
3. Copy **REST URL** dan **REST TOKEN**

### Step 2: Deploy ke Vercel
```bash
vercel
```

### Step 3: Set Environment Variables
Di Vercel Dashboard → Project → Settings → Environment Variables:
```
UPSTASH_REDIS_REST_URL = https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN = your-token
ORIGIN = *
RATE_LIMIT_LIMIT = 100
```

### Step 4: Redeploy
```bash
vercel --prod
```

### Step 5: Test API
```bash
curl https://your-api.vercel.app/ping
curl https://your-api.vercel.app/api/v1/home
```

---

## 🔍 Troubleshooting

### API lambat / timeout
→ Setup Redis cache

### Error "Build failed"
→ Check Vercel logs, kemungkinan dependency issue

### CORS error di frontend
→ Set environment variable `ORIGIN` dengan domain frontend

### Endpoint return 404/500
→ Source website (hianime.ad) mungkin berubah struktur
→ Perlu update parser di `src/parsers/` dan `src/extractor/`

---

## 📚 Endpoints yang Ditest & Working

```
GET /ping                                    ✅ Health check
GET /ui                                      ✅ API info
GET /api/v1/home                             ✅ Homepage data
GET /api/v1/genres                           ✅ All genres
GET /api/v1/animes/top-airing               ✅ Top airing anime
GET /api/v1/animes/most-popular             ✅ Most popular
GET /api/v1/filter/options                  ✅ Filter options
GET /api/v1/random                          ✅ Random anime ID
GET /api/v1/search?keyword=X                ⚠️  404 (parsing issue)
GET /api/v1/suggestion?keyword=X            ⚠️  400 (no data)
GET /api/v1/anime/:id                       ⚠️  200 but empty data
```

---

## ✨ Kesimpulan

**API SIAP DEPLOY** dengan catatan:

✅ **Struktur code:** Clean, menggunakan Hono.js (perfect untuk serverless)
✅ **Dependencies:** Compatible dengan Node.js/Vercel (setelah remove bun)
✅ **Config files:** `vercel.json` dan `package.json` sudah ready
✅ **Core functionality:** Homepage, genres, lists semua berfungsi
⚠️ **Redis:** Strongly recommended untuk production (setup di Upstash)
⚠️ **Scraping issues:** Beberapa endpoint punya parsing issue (bukan deployment issue)
⚠️ **Maintenance:** Perlu update berkala jika source website berubah

**Recommendation:** Deploy sekarang untuk testing, setup Redis untuk production use.

---

Generated: 2026-09-09
