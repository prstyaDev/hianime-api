/**
 * Test script untuk mendemonstrasikan response structure endpoint /stream
 * untuk integrasi ExoPlayer Android
 * 
 * Mushoku Tensei Season 3 - Episode 178650
 * URL: https://hianime.dk/watch/mushoku-tensei-jobless-reincarnation-season-3-9142?ep=178650
 */

// Contoh response yang akan dikembalikan oleh endpoint /api/v1/stream
const expectedStreamResponse = {
  success: true,
  data: {
    episode_id: "mushoku-tensei-jobless-reincarnation-season-3-9142::ep=178650",
    type: "sub",
    server: "HD-1",
    
    // Informasi streaming utama
    stream: {
      // Master playlist URL (HLS)
      master_m3u8: "https://example-cdn.com/hls/anime/mushoku-s3/ep1/master.m3u8",
      
      // Daftar variant streams (berbagai kualitas)
      variants: [
        {
          name: "1080p",
          resolution: "1920x1080",
          bandwidth_kbps: 4500,
          url: "https://example-cdn.com/hls/anime/mushoku-s3/ep1/1080p.m3u8"
        },
        {
          name: "720p",
          resolution: "1280x720",
          bandwidth_kbps: 2500,
          url: "https://example-cdn.com/hls/anime/mushoku-s3/ep1/720p.m3u8"
        },
        {
          name: "480p",
          resolution: "854x480",
          bandwidth_kbps: 1200,
          url: "https://example-cdn.com/hls/anime/mushoku-s3/ep1/480p.m3u8"
        },
        {
          name: "360p",
          resolution: "640x360",
          bandwidth_kbps: 800,
          url: "https://example-cdn.com/hls/anime/mushoku-s3/ep1/360p.m3u8"
        }
      ],
      
      // Headers WAJIB untuk request streaming (untuk ExoPlayer)
      headers: {
        "Referer": "https://embed.example.com",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Origin": "https://embed.example.com",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site"
      }
    },
    
    // URL subtitle (jika ada)
    subtitle: "https://example-cdn.com/subtitles/mushoku-s3-ep1-en.vtt",
    
    // URL embed source
    embed_url: "https://embed.example.com/e/abc123xyz"
  }
};

console.log('='.repeat(80));
console.log('EXPECTED STREAM RESPONSE FOR EXOPLAYER ANDROID');
console.log('='.repeat(80));
console.log(JSON.stringify(expectedStreamResponse, null, 2));
console.log('\n');

console.log('='.repeat(80));
console.log('CARA PENGGUNAAN DI ANDROID KOTLIN (ExoPlayer)');
console.log('='.repeat(80));
console.log(`
// 1. Fetch stream data dari API
val response = api.getStream(
    id = "mushoku-tensei-jobless-reincarnation-season-3-9142::ep=178650",
    server = "HD-1",
    type = "sub"
)

// 2. Ambil data stream
val streamData = response.data.stream
val m3u8Url = streamData.master_m3u8
val headers = streamData.headers

// 3. Setup ExoPlayer dengan headers
val dataSourceFactory = DefaultHttpDataSource.Factory().apply {
    setDefaultRequestProperties(headers)
}

val mediaItem = MediaItem.Builder()
    .setUri(m3u8Url)
    .build()

val player = ExoPlayer.Builder(context)
    .setMediaSourceFactory(
        DefaultMediaSourceFactory(dataSourceFactory)
    )
    .build()

player.setMediaItem(mediaItem)
player.prepare()
player.playWhenReady = true

// 4. Tambahkan subtitle jika ada
response.data.subtitle?.let { subtitleUrl ->
    val subtitle = MediaItem.SubtitleConfiguration.Builder(Uri.parse(subtitleUrl))
        .setMimeType(MimeTypes.TEXT_VTT)
        .setLanguage("en")
        .setSelectionFlags(C.SELECTION_FLAG_DEFAULT)
        .build()
    
    val mediaItemWithSubtitle = MediaItem.Builder()
        .setUri(m3u8Url)
        .setSubtitleConfigurations(listOf(subtitle))
        .build()
    
    player.setMediaItem(mediaItemWithSubtitle)
}
`);

console.log('\n');
console.log('='.repeat(80));
console.log('ENDPOINT TESTING');
console.log('='.repeat(80));
console.log(`
1. Test Servers Endpoint:
   curl "http://localhost:3000/api/v1/servers?id=mushoku-tensei-jobless-reincarnation-season-3-9142::ep=178650"

2. Test Stream Endpoint:
   curl "http://localhost:3000/api/v1/stream?id=mushoku-tensei-jobless-reincarnation-season-3-9142::ep=178650&server=HD-1&type=sub"

3. Test dengan server lain:
   curl "http://localhost:3000/api/v1/stream?id=mushoku-tensei-jobless-reincarnation-season-3-9142::ep=178650&server=HD-2&type=sub"

4. Test dubbed version:
   curl "http://localhost:3000/api/v1/stream?id=mushoku-tensei-jobless-reincarnation-season-3-9142::ep=178650&server=HD-1&type=dub"
`);
