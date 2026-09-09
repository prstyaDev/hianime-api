import app from './src/app.js';

async function testDetail() {
  console.log('=== Testing Anime Detail ===\n');
  
  // Test dengan ID dari URL contoh
  const animeId = 'mushoku-tensei-jobless-reincarnation-season-3-9142';
  const req = new Request(`http://localhost:3000/api/v1/anime/${animeId}`);
  const res = await app.fetch(req);
  const data = await res.json();
  
  console.log(`Status: ${res.status}`);
  console.log(`Success: ${data.success}`);
  
  if (!data.success) {
    console.log(`Error: ${data.message}`);
  } else {
    console.log(`\nAnime Data:`);
    console.log(`  Title: ${data.data.title}`);
    console.log(`  Japanese: ${data.data.japanese}`);
    console.log(`  ID: ${data.data.id}`);
    console.log(`  Type: ${data.data.type}`);
    console.log(`  Episodes: Sub=${data.data.episodes?.sub}, Dub=${data.data.episodes?.dub}`);
    console.log(`  Synopsis length: ${data.data.synopsis?.length || 0} chars`);
  }
}

testDetail().catch(console.error);
