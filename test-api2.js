import app from './src/app.js';

async function testEndpoint(path, description) {
  try {
    const req = new Request(`http://localhost:3000${path}`);
    const res = await app.fetch(req);
    const data = await res.json();
    
    console.log(`${res.status === 200 ? '✓' : '✗'} ${description}`);
    console.log(`  Status: ${res.status}`);
    console.log(`  Success: ${data.success}`);
    if (data.message) console.log(`  Message: ${data.message}`);
    if (data.data) {
      const preview = JSON.stringify(data.data).substring(0, 150);
      console.log(`  Data: ${preview}...`);
    }
    return res.status === 200;
  } catch (error) {
    console.log(`✗ ${description}`);
    console.log(`  Error: ${error.message}`);
    return false;
  }
}

console.log('=== Testing Additional Endpoints ===\n');

await testEndpoint('/api/v1/animes/top-airing?page=1', 'Top Airing Anime');
console.log('');

await testEndpoint('/api/v1/animes/most-popular?page=1', 'Most Popular Anime');
console.log('');

await testEndpoint('/api/v1/suggestion?keyword=one', 'Search Suggestions');
console.log('');

await testEndpoint('/api/v1/filter/options', 'Filter Options');
console.log('');

await testEndpoint('/api/v1/random', 'Random Anime');
console.log('');

console.log('=== Test Complete ===');
