import { cfFetch } from './src/services/cfBypass.js';
import { load } from 'cheerio';
import fs from 'fs';

async function debugEpisodes() {
  console.log('Fetching episodes page...');
  
  const animeId = 'mushoku-tensei-jobless-reincarnation-season-3-9142';
  const html = await cfFetch(`/watch/${animeId}/ep-1`);
  
  fs.writeFileSync('/tmp/episodes-debug.html', html);
  console.log('Saved to /tmp/episodes-debug.html');
  
  const $ = load(html);
  
  console.log('\n=== Page Analysis ===');
  console.log('Title:', $('title').text());
  console.log('.ssl-item:', $('.ssl-item').length);
  console.log('.ssl-item.ep-item:', $('.ssl-item.ep-item').length);
  console.log('.ep-item:', $('.ep-item').length);
  console.log('.episode-item:', $('.episode-item').length);
  console.log('[data-num]:', $('[data-num]').length);
  
  // Check for alternative selectors
  console.log('\n=== Alternative selectors ===');
  console.log('.eps-item:', $('.eps-item').length);
  console.log('.ss-list a:', $('.ss-list a').length);
  console.log('#episodes-page-1 a:', $('#episodes-page-1 a').length);
  
  // Sample first item if exists
  const firstEp = $('.ssl-item').first();
  if (firstEp.length) {
    console.log('\n=== First .ssl-item ===');
    console.log('HTML:', firstEp.html()?.substring(0, 300));
  }
}

debugEpisodes().catch(console.error);
