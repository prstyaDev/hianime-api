# ⚙️ Cloudflare Pages - Environment Variables Setup

## 📍 Lokasi Setting

**Cloudflare Dashboard:**
```
Pages → Your Project → Settings → Environment Variables
```

**Direct URL:**
```
https://dash.cloudflare.com/[account-id]/pages/view/[project-name]/settings/environment-variables
```

---

## 🔴 WAJIB (Required)

### 1. **CF_CLEARANCE** (CRITICAL!)

**Variable Name:**
```
CF_CLEARANCE
```

**Value:** Cookie `cf_clearance` dari browser

**Cara Dapat:**

#### Step-by-step:

1. **Buka https://hianime.dk di Chrome/Firefox**
2. **Klik kanan** → **Inspect** (atau F12)
3. **Application tab** (Chrome) atau **Storage tab** (Firefox)
4. **Cookies** → `https://hianime.dk`
5. **Cari cookie:** `cf_clearance`
6. **Copy Value** (format: `xxxxxxxx-xxxxxxxxx-xxxxxxxxx`)

**Contoh Value:**
```
1a2b3c4d-AbCdEfGh-1234567890abcdef-1234567890
```

**⚠️ IMPORTANT:**
- Cookie ini **EXPIRED setiap 30-60 hari**
- Jika expired, API akan down
- Harus manual update di Cloudflare dashboard
- Gunakan browser yang sama untuk consistency

---

### 2. **CF_USER_AGENT** (CRITICAL!)

**Variable Name:**
```
CF_USER_AGENT
```

**Value:** User-Agent dari browser yang sama

**Cara Dapat:**

#### Option A - Via DevTools:

1. Buka https://hianime.dk di browser
2. Buka Console (F12 → Console tab)
3. Ketik: `navigator.userAgent`
4. Copy hasilnya

#### Option B - Via Website:

1. Buka https://www.whatismybrowser.com/detect/what-is-my-user-agent
2. Copy "Your User Agent" value

**Contoh Value:**
```
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36
```

**⚠️ MUST MATCH:**
- User-Agent harus **SAMA PERSIS** dengan browser yang digunakan untuk get cf_clearance
- Jika beda, Cloudflare akan block

---

## 🟡 HIGHLY RECOMMENDED (Redis Cache)

### 3. **UPSTASH_REDIS_REST_URL**

**Variable Name:**
```
UPSTASH_REDIS_REST_URL
```

**Value:** Upstash Redis REST URL

**Cara Dapat:**

1. **Sign up:** https://upstash.com (gratis)
2. **Create Database:**
   - Klik "Create Database"
   - Name: `hianime-api-cache`
   - Type: **Regional** (faster)
   - Region: **Asia Pacific (Singapore)** atau terdekat
   - Enable Eviction: **Yes**
3. **Copy URL:**
   - Go to database details
   - Scroll to "REST API" section
   - Copy **UPSTASH_REDIS_REST_URL**

**Contoh Value:**
```
https://correct-eagle-12345.upstash.io
```

---

### 4. **UPSTASH_REDIS_REST_TOKEN**

**Variable Name:**
```
UPSTASH_REDIS_REST_TOKEN
```

**Value:** Upstash Redis REST Token

**Cara Dapat:**

Same location as URL:
- Database details → REST API section
- Copy **UPSTASH_REDIS_REST_TOKEN**

**Contoh Value:**
```
AXaEAAIncDJlNTY5YWM4NWQ5ZGE0Mzg1YTljY2ZiOThiZTA3YzE0MHAyMzAzNDA
```

**Why Redis:**
- ⚡ 90%+ faster response times
- 💰 Free tier: 10,000 commands/day (cukup untuk testing)
- 🚀 Reduce load on source website
- ✅ Required untuk production use

---

## 🟢 OPTIONAL (Tapi Disarankan)

### 5. **ORIGIN** (CORS)

**Variable Name:**
```
ORIGIN
```

**Value:** Allowed origins untuk CORS

**Options:**

#### Allow All (Development/Testing):
```
*
```

#### Specific Domain (Production):
```
https://yourfrontend.com
```

#### Multiple Domains:
```
https://yourfrontend.com,https://app.yourdomain.com,https://yourdomain.com
```

**Default:** `*` (jika tidak diset)

---

### 6. **RATE_LIMIT_ENABLED**

**Variable Name:**
```
RATE_LIMIT_ENABLED
```

**Value:**
```
true
```

**Purpose:** Enable/disable rate limiting

**Default:** `true`

---

### 7. **RATE_LIMIT_LIMIT**

**Variable Name:**
```
RATE_LIMIT_LIMIT
```

**Value:** Max requests per window

**Recommended Values:**
```
100      # Conservative (production)
500      # Medium
1000     # Permissive (development)
```

**Default:** `1000000000` (practically unlimited)

---

### 8. **RATE_LIMIT_WINDOW_MS**

**Variable Name:**
```
RATE_LIMIT_WINDOW_MS
```

**Value:** Time window in milliseconds

**Common Values:**
```
60000    # 1 minute
300000   # 5 minutes
900000   # 15 minutes
```

**Default:** `60000` (1 minute)

---

### 9. **ENABLE_LOGGING**

**Variable Name:**
```
ENABLE_LOGGING
```

**Value:**
```
true   # Enable detailed logs
false  # Disable logs (faster)
```

**When to Enable:**
- ✅ Development/testing
- ✅ Debugging issues
- ❌ Production (slower, cost more)

**Default:** `false`

---

### 10. **LOG_LEVEL**

**Variable Name:**
```
LOG_LEVEL
```

**Value:**
```
ERROR   # Only errors
WARN    # Errors + warnings
INFO    # Errors + warnings + info (recommended)
DEBUG   # Everything (very verbose)
```

**Default:** `INFO`

---

## 📋 Quick Setup Checklist

### Minimal Setup (Will Work, But Slow):

```bash
✅ CF_CLEARANCE          # CRITICAL
✅ CF_USER_AGENT         # CRITICAL
```

### Recommended Setup (Fast + Reliable):

```bash
✅ CF_CLEARANCE                    # CRITICAL
✅ CF_USER_AGENT                   # CRITICAL
✅ UPSTASH_REDIS_REST_URL          # Highly recommended
✅ UPSTASH_REDIS_REST_TOKEN        # Highly recommended
✅ ORIGIN=*                        # For CORS
✅ RATE_LIMIT_LIMIT=100            # Reasonable limit
```

### Production Setup (Best):

```bash
✅ CF_CLEARANCE                    # CRITICAL
✅ CF_USER_AGENT                   # CRITICAL
✅ UPSTASH_REDIS_REST_URL          # CRITICAL for production
✅ UPSTASH_REDIS_REST_TOKEN        # CRITICAL for production
✅ ORIGIN=https://yourdomain.com   # Your actual domain
✅ RATE_LIMIT_ENABLED=true
✅ RATE_LIMIT_LIMIT=100
✅ RATE_LIMIT_WINDOW_MS=60000
✅ ENABLE_LOGGING=false            # Disable for performance
✅ LOG_LEVEL=ERROR                 # Only log errors
```

---

## 🎯 Step-by-Step: Setting Environment Variables di Cloudflare

### Method 1: Via Cloudflare Dashboard (Recommended)

1. **Login** ke https://dash.cloudflare.com/

2. **Navigate:**
   ```
   Pages → Select Your Project → Settings → Environment Variables
   ```

3. **Add Variable:**
   - Click "Add variable"
   - **Variable name:** (contoh: `CF_CLEARANCE`)
   - **Value:** (paste value)
   - **Environment:** Select:
     - ✅ Production
     - ✅ Preview (optional)
   - Click "Save"

4. **Repeat** untuk semua variables

5. **Important:** Klik "Save and Redeploy" setelah selesai

---

### Method 2: Via Wrangler CLI (Advanced)

```bash
# Set individual secret
wrangler pages secret put CF_CLEARANCE --project-name=your-project

# Akan prompt untuk input value
# Paste value → Enter

# Repeat untuk semua secrets
wrangler pages secret put CF_USER_AGENT --project-name=your-project
wrangler pages secret put UPSTASH_REDIS_REST_URL --project-name=your-project
wrangler pages secret put UPSTASH_REDIS_REST_TOKEN --project-name=your-project
```

---

## 🔐 Environment Variables Security

### ✅ DO:
- ✅ Use Cloudflare's environment variables (encrypted at rest)
- ✅ Rotate CF_CLEARANCE every 30-60 days
- ✅ Keep UPSTASH tokens private
- ✅ Use different Redis for production vs development

### ❌ DON'T:
- ❌ Commit secrets to GitHub
- ❌ Share CF_CLEARANCE publicly
- ❌ Use same tokens across multiple projects
- ❌ Forget to update expired CF_CLEARANCE

---

## 🧪 Testing After Setup

### Test 1: Health Check

```bash
curl https://your-project.pages.dev/ping
```

**Expected:**
```json
{
  "status": "ok",
  "timestamp": "2026-09-10T...",
  "environment": "cloudflare-workers"
}
```

---

### Test 2: Homepage (Tests CF Bypass)

```bash
curl https://your-project.pages.dev/api/v1/home
```

**Success (with CF_CLEARANCE working):**
```json
{
  "success": true,
  "data": {
    "spotlights": [...],
    "trending": [...],
    ...
  }
}
```

**Failure (CF_CLEARANCE expired or wrong):**
```json
{
  "success": false,
  "message": "Failed to fetch / — CF bypass unsuccessful"
}
```

---

### Test 3: Redis Cache (Tests Redis Connection)

```bash
# First request (cache miss)
curl https://your-project.pages.dev/api/v1/home

# Second request (should be faster - cache hit)
curl https://your-project.pages.dev/api/v1/home
```

**Check Cloudflare Logs for:**
```
Cache MISS: home          # First request
Cache SET: home (TTL: 86400s)
Cache HIT: home           # Second request
```

---

## 🚨 Troubleshooting

### Error: "CF_CLEARANCE env not set"

**Cause:** Environment variable tidak ada atau salah nama

**Fix:**
1. Check spelling: `CF_CLEARANCE` (case-sensitive)
2. Check environment: Production vs Preview
3. Redeploy after setting

---

### Error: "CF bypass unsuccessful"

**Cause:** CF_CLEARANCE expired atau User-Agent tidak match

**Fix:**
1. Get new cf_clearance cookie (lihat cara di atas)
2. Pastikan CF_USER_AGENT sama dengan browser
3. Update di Cloudflare dashboard
4. Redeploy

---

### Error: "Redis connection failed"

**Cause:** UPSTASH credentials salah atau Upstash down

**Fix:**
1. Verify URL dan Token di Upstash dashboard
2. Test connection:
   ```bash
   curl https://your-redis-url.upstash.io/get/test \
     -H "Authorization: Bearer your-token"
   ```
3. Check Upstash database status
4. Update credentials di Cloudflare

---

### API Slow (No Cache)

**Cause:** Redis tidak configured atau tidak konek

**Fix:**
1. Verify UPSTASH_REDIS_REST_URL dan TOKEN set
2. Check Cloudflare logs for "Redis client initialized"
3. If not working, API will fallback to direct scraping (slow)

---

## 📊 Environment Variables Summary Table

| Variable | Required | Default | Purpose | Example |
|----------|----------|---------|---------|---------|
| `CF_CLEARANCE` | ✅ **YES** | None | Bypass Cloudflare protection | `1a2b3c4d-...` |
| `CF_USER_AGENT` | ✅ **YES** | None | Browser fingerprint | `Mozilla/5.0 ...` |
| `UPSTASH_REDIS_REST_URL` | ⚠️ Highly Rec | None | Redis cache URL | `https://...upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | ⚠️ Highly Rec | None | Redis auth token | `AXaE...` |
| `ORIGIN` | Optional | `*` | CORS allowed origins | `*` or domain |
| `RATE_LIMIT_ENABLED` | Optional | `true` | Enable rate limiting | `true` |
| `RATE_LIMIT_LIMIT` | Optional | `1B` | Max requests/window | `100` |
| `RATE_LIMIT_WINDOW_MS` | Optional | `60000` | Rate limit window | `60000` |
| `ENABLE_LOGGING` | Optional | `false` | Enable detailed logs | `false` |
| `LOG_LEVEL` | Optional | `INFO` | Logging verbosity | `INFO` |

---

## 🎯 Recommended Configuration (Copy-Paste)

```env
# CRITICAL (Get these first!)
CF_CLEARANCE=<get from browser cookies>
CF_USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36

# REDIS (Get from upstash.com)
UPSTASH_REDIS_REST_URL=<your upstash url>
UPSTASH_REDIS_REST_TOKEN=<your upstash token>

# CORS
ORIGIN=*

# RATE LIMITING
RATE_LIMIT_ENABLED=true
RATE_LIMIT_LIMIT=100
RATE_LIMIT_WINDOW_MS=60000

# LOGGING (disable for production)
ENABLE_LOGGING=false
LOG_LEVEL=ERROR
```

---

## ⏰ Maintenance Schedule

### Monthly (CRITICAL):
- 🔄 Check CF_CLEARANCE cookie expiry
- 🔄 Update if expired (API will be down!)
- 🔄 Test API after update

### Weekly:
- 📊 Check Redis usage in Upstash dashboard
- 📊 Monitor cache hit rate
- 📊 Check error logs

### As Needed:
- ⚙️ Adjust rate limits based on traffic
- ⚙️ Update CORS origins for new domains

---

## 📞 Support

**Need help getting:**
- CF_CLEARANCE cookie? → Follow browser DevTools guide above
- Upstash Redis? → https://upstash.com (5 minutes signup)
- User-Agent? → Open Console, type `navigator.userAgent`

**API not working after setup?**
- Check Cloudflare Functions logs
- Verify all variables are set correctly
- Test endpoints with curl
- Check if CF_CLEARANCE expired

---

**Next:** Setelah set environment variables, **redeploy project** di Cloudflare Pages!

```
Pages → Your Project → Deployments → "Retry deployment"
```

---

**Generated:** 10 September 2026  
**Purpose:** Environment variables setup untuk Cloudflare Pages  
**Status:** Ready to use
