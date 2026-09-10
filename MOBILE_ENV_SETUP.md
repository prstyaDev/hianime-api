# 📱 Setup Environment Variables - Panduan HP/Mobile

## 🎯 TL;DR - Yang Harus Dilakukan:

1. ✅ Get `CF_CLEARANCE` cookie dari browser
2. ✅ Get `CF_USER_AGENT` dari browser  
3. ✅ Setup Upstash Redis (opsional tapi sangat disarankan)
4. ✅ Input semua ke Cloudflare Pages dashboard

---

## 📱 Method 1: Kiwi Browser (TERMUDAH untuk Android)

### Step 1: Install Kiwi Browser

**Google Play Store:**
```
Search: "Kiwi Browser"
atau
Link: https://play.google.com/store/apps/details?id=com.kiwibrowser.browser
```

Kiwi = Chrome + Support Extensions

---

### Step 2: Install Cookie Editor Extension

```
1. Buka Kiwi Browser
2. Tap menu (⋮) pojok kanan atas
3. Pilih "Extensions"
4. Tap "⊕ (from store)"
5. Search: "Cookie-Editor"
6. Install extension
```

---

### Step 3: Get CF_CLEARANCE Cookie

```
1. Buka Kiwi Browser
2. Go to: https://hianime.dk
3. Tunggu page load SEPENUHNYA (penting!)
4. Tap icon Cookie-Editor (di address bar/toolbar)
5. Scroll cari cookie: "cf_clearance"
6. Tap cookie → akan show details
7. Long press di "Value" → Copy
```

**Cookie format:**
```
xxxxxxxx-xxxxxxxxx-xxxxxxxxxx-xxxxxxxxxx
(angka + huruf + dash)
```

**Save ini di notepad/notes!**

---

### Step 4: Get CF_USER_AGENT

Masih di Kiwi Browser:

```
1. Tap address bar
2. Ketik: javascript:alert(navigator.userAgent)
3. Tap Go/Enter
```

Akan muncul popup dengan text panjang seperti:
```
Mozilla/5.0 (Linux; Android 13; ...) Chrome/131.0.0.0 Mobile Safari/537.36
```

**Long press → Select All → Copy**

**Save ini di notepad/notes!**

---

## 📱 Method 2: Firefox Mobile (Alternative)

### Step 1: Install Firefox

Google Play:
```
Search: "Firefox Browser"
atau  
https://play.google.com/store/apps/details?id=org.mozilla.firefox
```

---

### Step 2: Install Cookie Quick Manager

```
1. Buka Firefox
2. Tap menu (⋮)
3. Add-ons
4. Find more add-ons
5. Search: "Cookie Quick Manager"
6. Tap Add to Firefox
```

---

### Step 3: Get Cookies

```
1. Go to: https://hianime.dk
2. Tunggu load sepenuhnya
3. Menu (⋮) → Add-ons → Cookie Quick Manager
4. Tap "hianime.dk" domain
5. Cari: cf_clearance
6. Tap → akan show value
7. Long press → Copy
```

---

### Step 4: Get User-Agent

```
1. Firefox address bar
2. Ketik: about:support
3. Scroll ke "User Agent"
4. Long press → Copy
```

---

## 📱 Method 3: Pakai Desktop Mode Browser Biasa

Jika tidak mau install app tambahan:

### Chrome Mobile:

```
1. Buka Chrome
2. Go to: https://hianime.dk
3. Menu (⋮) → Desktop site (centang)
4. Menu (⋮) → More tools → Developer tools (jika ada)
```

**⚠️ Chrome mobile biasa SUSAH lihat cookies!**  
**Lebih baik pakai Kiwi/Firefox**

---

## 🗒️ Template Notepad - Copy Hasil Kamu

Setelah dapat semua, save di notepad seperti ini:

```
=== CLOUDFLARE ENV VARS ===

CF_CLEARANCE:
xxxxxxxx-xxxxxxxxx-xxxxxxxxxx-xxxxxxxxxx

CF_USER_AGENT:
Mozilla/5.0 (Linux; Android 13; ...) Chrome/131.0.0.0 Mobile Safari/537.36

=== END ===
```

---

## 🌐 Setup Upstash Redis (dari HP)

### Step 1: Sign Up Upstash

```
1. Browser HP → https://upstash.com
2. Tap "Sign up"
3. Login dengan GitHub atau Email
4. Gratis, no credit card needed
```

---

### Step 2: Create Database

```
1. Setelah login → Tap "Create Database"
2. Isi form:
   - Name: hianime-api-cache
   - Type: Regional (tap ini)
   - Region: Asia Pacific (Singapore)
   - Enable Eviction: Yes (toggle on)
3. Tap "Create"
```

---

### Step 3: Copy Credentials

```
1. Setelah database created, tap database name
2. Scroll ke "REST API" section
3. Akan ada 2 values:

   📋 UPSTASH_REDIS_REST_URL
   Tap "Copy" button
   → Save di notepad

   📋 UPSTASH_REDIS_REST_TOKEN  
   Tap "Copy" button
   → Save di notepad
```

---

## 🔐 Input ke Cloudflare Pages (dari HP)

### Step 1: Login Cloudflare

```
Browser HP → https://dash.cloudflare.com
Login dengan akun kamu
```

---

### Step 2: Navigate ke Project

```
1. Tap "Pages" (di sidebar atau menu)
2. Tap project kamu (wibufy-proxy atau apapun namanya)
3. Tap "Settings" tab
4. Scroll ke "Environment Variables"
```

---

### Step 3: Add Variables Satu-satu

Tap "**Add variable**" untuk setiap variable:

#### Variable 1: CF_CLEARANCE
```
Variable name: CF_CLEARANCE
Value: [paste dari notepad - cookie value]
Environment: Production ✅
Tap "Save"
```

#### Variable 2: CF_USER_AGENT
```
Variable name: CF_USER_AGENT
Value: [paste dari notepad - user agent]
Environment: Production ✅
Tap "Save"
```

#### Variable 3: UPSTASH_REDIS_REST_URL
```
Variable name: UPSTASH_REDIS_REST_URL
Value: [paste dari Upstash]
Environment: Production ✅
Tap "Save"
```

#### Variable 4: UPSTASH_REDIS_REST_TOKEN
```
Variable name: UPSTASH_REDIS_REST_TOKEN
Value: [paste dari Upstash]
Environment: Production ✅
Tap "Save"
```

#### Variable 5: ORIGIN (Optional)
```
Variable name: ORIGIN
Value: *
Environment: Production ✅
Tap "Save"
```

#### Variable 6: RATE_LIMIT_LIMIT (Optional)
```
Variable name: RATE_LIMIT_LIMIT
Value: 100
Environment: Production ✅
Tap "Save"
```

---

### Step 4: Deploy

```
1. Scroll ke atas page
2. Tap "Deployments" tab
3. Tap latest deployment
4. Tap "Retry deployment" (atau tunggu auto-redeploy)
5. Tunggu 2-3 menit
```

---

## ✅ Verifikasi Setup (Test dari HP)

### Test 1: Ping

Buka browser:
```
https://your-project.pages.dev/ping
```

**Should see:**
```json
{"status":"ok","timestamp":"..."}
```

---

### Test 2: API

```
https://your-project.pages.dev/api/v1/home
```

**If Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**If Error:**
```json
{
  "success": false,
  "message": "CF bypass unsuccessful"
}
```
→ CF_CLEARANCE salah/expired, get lagi dari browser

---

## 🔄 Maintenance (Setiap 1-2 Bulan)

CF_CLEARANCE cookie **expired** setiap 30-60 hari.

**Tanda-tanda expired:**
- API suddenly return error
- "CF bypass unsuccessful"
- All endpoints return 403/503

**Fix:**
```
1. Buka Kiwi/Firefox lagi
2. Go to https://hianime.dk
3. Get new cf_clearance cookie (ikuti step di atas)
4. Update di Cloudflare dashboard:
   - Pages → Project → Settings → Environment Variables
   - Edit CF_CLEARANCE
   - Paste new value
   - Save
5. Redeploy
```

---

## 📋 Quick Checklist

```
✅ Install Kiwi Browser / Firefox
✅ Install Cookie Editor extension
✅ Buka https://hianime.dk
✅ Copy cf_clearance cookie
✅ Copy user agent
✅ Sign up Upstash (https://upstash.com)
✅ Create Redis database
✅ Copy Redis URL & Token
✅ Login Cloudflare Dashboard
✅ Go to Pages → Project → Settings → Env Vars
✅ Add 4-6 variables
✅ Save and redeploy
✅ Test: /ping dan /api/v1/home
```

---

## 🆘 Troubleshooting

### "Can't find cf_clearance cookie"

**Problem:** Cookie belum ada atau website belum load

**Fix:**
```
1. Clear browser cache
2. Buka https://hianime.dk lagi
3. Tunggu page FULLY loaded (5-10 detik)
4. Coba cari cookie lagi
5. If still nothing → website mungkin berubah domain
```

---

### "Cloudflare dashboard susah dibuka di HP"

**Fix:**
```
1. Use desktop mode: Browser menu → Desktop site
2. Zoom out page (pinch)
3. Atau gunakan Chrome Remote Desktop dari laptop
```

---

### "Extension not working"

**Fix:**
```
- Pastikan pakai Kiwi Browser (bukan Chrome biasa)
- Atau switch ke Firefox + Cookie Quick Manager
```

---

### "Redis URL copy susah"

**Fix:**
```
1. Upstash dashboard → Database → REST API
2. Ada icon "Copy" di sebelah URL
3. Tap icon → auto copied
4. Long press di notepad → Paste
```

---

## 💡 Tips

### Simpan Credentials Aman

```
1. Pakai Password Manager (Bitwarden, 1Password)
2. Atau Secure Notes di HP
3. JANGAN share CF_CLEARANCE ke orang lain
4. JANGAN commit ke GitHub
```

---

### Bookmark Important Pages

```
✅ Cloudflare Dashboard: https://dash.cloudflare.com
✅ Upstash Console: https://console.upstash.com
✅ Your API: https://your-project.pages.dev
```

---

## 🎯 Minimum Setup (Jika Buru-buru)

Kalau mau cepat, cukup set 2 ini dulu:

```
✅ CF_CLEARANCE       (WAJIB)
✅ CF_USER_AGENT      (WAJIB)
```

Redis bisa ditambah nanti (tapi API akan lambat).

---

## ⏱️ Estimasi Waktu

```
📱 Install browser + extension:  5 menit
🍪 Get cookies + user agent:     3 menit
☁️  Setup Upstash Redis:         5 menit
⚙️  Input ke Cloudflare:         5 menit
🧪 Testing:                      2 menit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TOTAL:                        ~20 menit
```

---

## 📞 Need Help?

Kalau stuck di step manapun, just ask:

- "Gimana cara copy cookie di Kiwi?"
- "Upstash error, gimana?"
- "Cloudflare dashboard bingung"
- dll

I'm here to help! 😊

---

**Generated:** 10 September 2026  
**Platform:** Mobile/HP  
**Status:** Ready to use  
**Next:** Follow step 1 → Install Kiwi Browser
