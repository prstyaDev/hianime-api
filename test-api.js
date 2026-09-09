import app from './src/app.js';

async function testEndpoint(path, description) {
  try {
    const req = new Request(`http://localhost:3000${path}`);
    const res = await app.fetch(req);
    const contentType = res.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();
      console.log(`✓ ${description}`);
      console.log(`  Status: ${res.status}`);
      console.log(`  Response:`, JSON.stringify(data, null, 2).substring(0, 200) + '...');
      return true;
    } else {
      const text = await res.text();
      console.log(`✓ ${description}`);
      console.log(`  Status: ${res.status}`);
      console.log(`  Response type: ${contentType || 'text'}`);
      return true;
    }
  } catch (error) {
    console.log(`✗ ${description}`);
    console.log(`  Error: ${error.message}`);
    return false;
  }
}

console.log('=== Testing HiAnime API Endpoints ===\n');

// Test basic endpoints
await testEndpoint('/ping', 'Health Check (/ping)');
console.log('');

await testEndpoint('/ui', 'UI Info (/ui)');
console.log('');

await testEndpoint('/api/v1/home', 'Homepage Data (/api/v1/home)');
console.log('');

await testEndpoint('/api/v1/search?keyword=naruto', 'Search Anime (/api/v1/search)');
console.log('');

await testEndpoint('/api/v1/genres', 'All Genres (/api/v1/genres)');
console.log('');

await testEndpoint('/api/v1/anime/one-piece-100', 'Anime Detail (/api/v1/anime/:id)');
console.log('');

console.log('=== Testing Complete ===');
