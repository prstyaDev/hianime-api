import { axiosInstance } from './src/services/axiosInstance.js';
import { load } from 'cheerio';
import fs from 'fs';

async function debugSearch() {
  console.log('Fetching search HTML...');
  const result = await axiosInstance('/search?keyword=mushoku&page=1');
  
  if (!result.success) {
    console.error('Failed to fetch:', result.message);
    return;
  }
  
  // Save HTML untuk analysis
  fs.writeFileSync('/tmp/search-debug.html', result.data);
  console.log('HTML saved to /tmp/search-debug.html');
  
  const $ = load(result.data);
  
  // Check various selectors
  console.log('\n=== HTML Analysis ===');
  console.log('Total .flw-item:', $('.flw-item').length);
  console.log('Total .block_area-content:', $('.block_area-content').length);
  console.log('Total .film_list:', $('.film_list').length);
  console.log('Total .film_list-wrap:', $('.film_list-wrap').length);
  
  // Try to find anime items dengan berbagai selector
  console.log('\n=== Looking for anime items ===');
  console.log('.flw-item count:', $('.flw-item').length);
  console.log('.film-poster count:', $('.film-poster').length);
  console.log('.film-detail count:', $('.film-detail').length);
  
  // Check page structure
  console.log('\n=== Page Structure ===');
  console.log('Title:', $('title').text());
  console.log('Main content classes:', $('#main-content').attr('class'));
  
  // Sample first item if exists
  const firstItem = $('.flw-item').first();
  if (firstItem.length) {
    console.log('\n=== First Item HTML ===');
    console.log(firstItem.html().substring(0, 500));
  } else {
    console.log('\n No .flw-item found!');
    // Try alternative selectors
    console.log('\nTrying alternative:');
    console.log('  .anime-item:', $('.anime-item').length);
    console.log('  .item:', $('.item').length);
    console.log('  [data-id]:', $('[data-id]').length);
  }
}

debugSearch().catch(console.error);
