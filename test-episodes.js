import app from './src/app.js';

async function testEpisodes() {
  console.log('=== Testing Episodes Endpoint ===\n');
  
  const animeId = 'mushoku-tensei-jobless-reincarnation-season-3-9142';
  const req = new Request(`http://localhost:3000/api/v1/episodes/${animeId}`);
  const res = await app.fetch(req);
  const data = await res.json();
  
  console.log(`Status: ${res.status}`);
  console.log(`Success: ${data.success}`);
  
  if (!data.success) {
    console.log(`Error: ${data.message}`);
  } else {
    console.log(`\nTotal Episodes: ${data.data.totalEpisodes}`);
    console.log(`Episodes count: ${data.data.episodes?.length || 0}`);
    
    if (data.data.episodes && data.data.episodes.length > 0) {
      console.log(`\nFirst episode:`);
      console.log(JSON.stringify(data.data.episodes[0], null, 2));
      
      console.log(`\nLast episode:`);
      const last = data.data.episodes[data.data.episodes.length - 1];
      console.log(JSON.stringify(last, null, 2));
    }
  }
}

testEpisodes().catch(console.error);
