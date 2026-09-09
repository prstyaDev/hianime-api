import { cfFetchAjax } from './src/services/cfBypass.js';

async function testAjaxEpisodes() {
  console.log('Testing AJAX episodes endpoint...\n');
  
  // Extract anime numeric ID from slug: mushoku-tensei-jobless-reincarnation-season-3-9142
  const animeId = '9142';
  
  // Try common AJAX endpoints
  const endpoints = [
    `/ajax/v2/episode/list/${animeId}`,
    `/ajax/episode/list/${animeId}`,
    `/ajax/v2/episodes/${animeId}`,
    `/v2/episode/list/${animeId}`,
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Trying: ${endpoint}`);
      const data = await cfFetchAjax(endpoint, '/');
      console.log('Success!');
      console.log(JSON.stringify(data, null, 2).substring(0, 500));
      break;
    } catch (err) {
      console.log(`  Failed: ${err.message}`);
    }
  }
}

testAjaxEpisodes().catch(console.error);
