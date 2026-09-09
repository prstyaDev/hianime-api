# Dokumentasi API Streaming untuk ExoPlayer Android

## 📋 Ringkasan Perubahan

Endpoint `/api/v1/stream` telah diperbaiki untuk mendukung integrasi dengan ExoPlayer Android. Perubahan utama mencakup:

1. ✅ Response JSON yang terstruktur dengan nested object
2. ✅ Headers HTTP wajib (Referer, User-Agent, Origin) disertakan dalam response
3. ✅ Ekstraksi URL streaming .m3u8 (HLS master playlist)
4. ✅ Daftar variants dengan resolusi berbeda (1080p, 720p, 480p, 360p)
5. ✅ Support subtitle (.vtt format)

---

## 🔧 File yang Dimodifikasi

### 1. `src/services/cfBypass.js`

**Fungsi `parseMasterM3u8`:**
- Menambahkan object `headers` ke dalam response
- Headers mencakup: Referer, User-Agent, Origin, Accept, Accept-Language, Sec-Fetch-*
- Headers ini diperlukan oleh CDN streaming untuk memverifikasi request

**Fungsi `resolveEmbedStream`:**
- Meningkatkan ekstraksi subtitle dari HTML embed page
- Menangani berbagai format subtitle (track tag, JSON, inline)
- Menambahkan fallback headers jika resolve gagal

### 2. `src/controllers/streamController.js`

**Response Structure:**
```javascript
{
  success: true,
  data: {
    episode_id: string,
    type: "sub" | "dub" | "raw",
    server: string,
    stream: {
      master_m3u8: string,      // URL HLS master playlist
      variants: Array,          // Daftar kualitas video
      headers: Object           // Headers wajib untuk request
    },
    subtitle: string | null,    // URL subtitle VTT
    embed_url: string           // URL embed source
  }
}
```

---

## 🚀 Cara Penggunaan

### Endpoint: `/api/v1/stream`

**Query Parameters:**
- `id` (required): Format `{anime-slug}::ep={episode_id}` atau `{anime-slug}?ep={episode_id}`
- `server` (optional): Nama server (default: "HD-1")
- `type` (optional): "sub", "dub", atau "raw" (default: "sub")

**Contoh Request:**
```bash
GET /api/v1/stream?id=mushoku-tensei-jobless-reincarnation-season-3-9142::ep=178650&server=HD-1&type=sub
```

**Contoh Response:**
```json
{
  "success": true,
  "data": {
    "episode_id": "mushoku-tensei-jobless-reincarnation-season-3-9142::ep=178650",
    "type": "sub",
    "server": "HD-1",
    "stream": {
      "master_m3u8": "https://cdn.example.com/anime/master.m3u8",
      "variants": [
        {
          "name": "1080p",
          "resolution": "1920x1080",
          "bandwidth_kbps": 4500,
          "url": "https://cdn.example.com/anime/1080p.m3u8"
        },
        {
          "name": "720p",
          "resolution": "1280x720",
          "bandwidth_kbps": 2500,
          "url": "https://cdn.example.com/anime/720p.m3u8"
        }
      ],
      "headers": {
        "Referer": "https://embed.example.com",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Origin": "https://embed.example.com",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site"
      }
    },
    "subtitle": "https://cdn.example.com/subtitles/en.vtt",
    "embed_url": "https://embed.example.com/e/abc123"
  }
}
```

---

## 📱 Integrasi dengan ExoPlayer Android (Kotlin)

### 1. Setup Dependencies

Tambahkan ke `build.gradle.kts`:
```kotlin
dependencies {
    implementation("androidx.media3:media3-exoplayer:1.2.0")
    implementation("androidx.media3:media3-ui:1.2.0")
    implementation("androidx.media3:media3-exoplayer-hls:1.2.0")
    
    // Untuk HTTP request
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
}
```

### 2. Data Class untuk Response

```kotlin
data class StreamResponse(
    val success: Boolean,
    val data: StreamData
)

data class StreamData(
    val episode_id: String,
    val type: String,
    val server: String,
    val stream: StreamInfo,
    val subtitle: String?,
    val embed_url: String
)

data class StreamInfo(
    val master_m3u8: String,
    val variants: List<Variant>,
    val headers: Map<String, String>
)

data class Variant(
    val name: String,
    val resolution: String,
    val bandwidth_kbps: Int,
    val url: String
)
```

### 3. Retrofit API Interface

```kotlin
interface AnimeStreamApi {
    @GET("api/v1/stream")
    suspend fun getStream(
        @Query("id") id: String,
        @Query("server") server: String = "HD-1",
        @Query("type") type: String = "sub"
    ): StreamResponse
}
```

### 4. Setup ExoPlayer dengan Headers

```kotlin
class VideoPlayerActivity : AppCompatActivity() {
    private lateinit var player: ExoPlayer
    private lateinit var playerView: PlayerView
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_video_player)
        
        playerView = findViewById(R.id.player_view)
        
        // Fetch stream data
        lifecycleScope.launch {
            try {
                val streamResponse = api.getStream(
                    id = "mushoku-tensei-jobless-reincarnation-season-3-9142::ep=178650",
                    server = "HD-1",
                    type = "sub"
                )
                
                if (streamResponse.success) {
                    setupPlayer(streamResponse.data)
                }
            } catch (e: Exception) {
                Log.e("VideoPlayer", "Error fetching stream", e)
            }
        }
    }
    
    private fun setupPlayer(streamData: StreamData) {
        val streamInfo = streamData.stream
        
        // 1. Create DataSource Factory with custom headers
        val dataSourceFactory = DefaultHttpDataSource.Factory().apply {
            setDefaultRequestProperties(streamInfo.headers)
        }
        
        // 2. Build MediaItem
        val mediaItemBuilder = MediaItem.Builder()
            .setUri(streamInfo.master_m3u8)
        
        // 3. Add subtitle if available
        streamData.subtitle?.let { subtitleUrl ->
            val subtitle = MediaItem.SubtitleConfiguration.Builder(Uri.parse(subtitleUrl))
                .setMimeType(MimeTypes.TEXT_VTT)
                .setLanguage("en")
                .setSelectionFlags(C.SELECTION_FLAG_DEFAULT)
                .build()
            
            mediaItemBuilder.setSubtitleConfigurations(listOf(subtitle))
        }
        
        val mediaItem = mediaItemBuilder.build()
        
        // 4. Initialize ExoPlayer
        player = ExoPlayer.Builder(this)
            .setMediaSourceFactory(
                DefaultMediaSourceFactory(dataSourceFactory)
            )
            .build()
        
        // 5. Setup player
        playerView.player = player
        player.setMediaItem(mediaItem)
        player.prepare()
        player.playWhenReady = true
    }
    
    override fun onDestroy() {
        super.onDestroy()
        player.release()
    }
}
```

### 5. Layout XML (activity_video_player.xml)

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <androidx.media3.ui.PlayerView
        android:id="@+id/player_view"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:use_controller="true"
        app:show_subtitle_button="true"
        app:show_buffering="when_playing" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

### 6. Permissions (AndroidManifest.xml)

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

---

## 🧪 Testing Endpoint

### Test dengan curl:

```bash
# 1. Cek available servers
curl "http://localhost:3000/api/v1/servers?id=mushoku-tensei-jobless-reincarnation-season-3-9142::ep=178650"

# 2. Get stream URL dengan headers
curl "http://localhost:3000/api/v1/stream?id=mushoku-tensei-jobless-reincarnation-season-3-9142::ep=178650&server=HD-1&type=sub"

# 3. Test server lain
curl "http://localhost:3000/api/v1/stream?id=mushoku-tensei-jobless-reincarnation-season-3-9142::ep=178650&server=HD-2&type=sub"

# 4. Test dubbed version
curl "http://localhost:3000/api/v1/stream?id=mushoku-tensei-jobless-reincarnation-season-3-9142::ep=178650&server=HD-1&type=dub"
```

### Test Script:

Jalankan test script yang disediakan:
```bash
node test-stream-response.js
```

---

## ⚠️ Catatan Penting

### 1. Cloudflare Bypass
Endpoint ini memerlukan Cloudflare bypass untuk mengakses hianime.dk. Pastikan environment variable `CF_CLEARANCE` sudah diset:

```bash
# Di .env file
CF_CLEARANCE=your_cf_clearance_cookie_value
CF_USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
```

**Cara mendapatkan CF_CLEARANCE:**
1. Buka https://hianime.dk di browser
2. Buka DevTools (F12) → Application → Cookies
3. Copy nilai cookie `cf_clearance`
4. Paste ke environment variable

### 2. Headers di ExoPlayer
Headers yang dikembalikan API **WAJIB** digunakan saat request ke CDN streaming. Tanpa headers ini, request akan ditolak dengan error 403/401.

### 3. HLS Streaming
API mengembalikan URL master playlist (.m3u8). ExoPlayer akan otomatis:
- Memilih kualitas terbaik sesuai bandwidth
- Melakukan adaptive bitrate streaming
- Handle buffering dan network changes

### 4. Subtitle Format
Subtitle dalam format WebVTT (.vtt). ExoPlayer mendukung format ini secara native.

### 5. Error Handling
Selalu handle kemungkinan error:
- Network timeout
- Invalid episode ID
- Server tidak tersedia
- CF bypass gagal

---

## 📊 Response Format Comparison

### ❌ Format Lama (Tidak Optimal)
```json
{
  "id": "...",
  "type": "sub",
  "server": "HD-1",
  "embedUrl": "...",
  "master_m3u8": "...",
  "subtitle": null,
  "variants": [...]
}
```

### ✅ Format Baru (Optimal untuk ExoPlayer)
```json
{
  "success": true,
  "data": {
    "episode_id": "...",
    "type": "sub",
    "server": "HD-1",
    "stream": {
      "master_m3u8": "...",
      "variants": [...],
      "headers": { ... }  // ← PENTING!
    },
    "subtitle": "...",
    "embed_url": "..."
  }
}
```

**Keuntungan format baru:**
1. Headers tersedia langsung tanpa perlu hardcode
2. Struktur lebih jelas dan terseparasi
3. Field `success` untuk error handling
4. Lebih mudah di-parse di Kotlin/Java

---

## 🔗 Resources

- [ExoPlayer Documentation](https://developer.android.com/guide/topics/media/exoplayer)
- [Media3 (New ExoPlayer)](https://developer.android.com/jetpack/androidx/releases/media3)
- [HLS Streaming Guide](https://developer.android.com/guide/topics/media/media-formats#hls)

---

## 📝 Changelog

### Version 1.1.0 (2024-09-09)
- ✅ Added headers object to stream response
- ✅ Enhanced subtitle extraction
- ✅ Restructured response format for better Android integration
- ✅ Added comprehensive documentation

---

**Dibuat oleh:** Kiro CLI  
**Tanggal:** 9 September 2026  
**Episode Testing:** Mushoku Tensei Season 3 EP 178650
