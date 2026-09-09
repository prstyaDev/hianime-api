import app from './src/app.js';

async function quickTest() {
  console.log('=== Testing New Domain (hianime.dk) ===\n');
  
  // Test search
  const searchReq = new Request('http://localhost:3000/api/v1/search?keyword=mushoku');
  const searchRes = await app.fetch(searchReq);
  const searchData = await searchRes.json();
  
  console.log(`Search Status: ${searchRes.status}`);
  console.log(`Search Success: ${searchData.success}`);
  if (!searchData.success) {
    console.log(`Error: ${searchData.message}`);
  } else {
    console.log(`Results: ${searchData.data?.response?.length || 0} anime found`);
    if (searchData.data?.response?.[0]) {
      console.log(`First result: ${searchData.data.response[0].title}`);
      console.log(`  ID: ${searchData.data.response[0].id}`);
    }
  }
}

quickTest().catch(console.error);
