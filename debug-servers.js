import { cfFetch } from './src/services/cfBypass.js';
import { load } from 'cheerio';

const testEpisode = async () => {
  try {
    console.log('Fetching watch page...');
    const html = await cfFetch('/watch/mushoku-tensei-jobless-reincarnation-season-3-9142/ep-178650');
    
    console.log('\n=== HTML LENGTH:', html.length);
    console.log('\n=== First 1000 chars:');
    console.log(html.substring(0, 1000));
    
    // Save HTML to file for inspection
    const fs = await import('fs');
    fs.writeFileSync('/data/data/com.termux/files/home/wibufy-backend/debug-watch-page.html', html);
    console.log('\n=== Full HTML saved to debug-watch-page.html');
    
    const $ = load(html);
    
    console.log('\n=== Looking for server elements:');
    console.log('1. [data-video] elements:', $('[data-video]').length);
    console.log('2. .server-item elements:', $('.server-item').length);
    console.log('3. .ps__-list elements:', $('.ps__-list').length);
    console.log('4. .servers-sub:', $('.servers-sub').length);
    console.log('5. .servers-dub:', $('.servers-dub').length);
    
    // Check for data-video attributes
    console.log('\n=== Checking [data-video] content:');
    $('[data-video]').slice(0, 3).each((i, el) => {
      const url = $(el).attr('data-video');
      const text = $(el).text().trim();
      console.log(`  ${i+1}. Text: "${text}", URL: ${url}`);
    });
    
    // Check server structure
    console.log('\n=== Checking server block structure:');
    $('.ps__-list').each((i, el) => {
      const dataId = $(el).attr('data-id');
      const items = $(el).find('[data-video]').length;
      const serverItems = $(el).find('.server-item').length;
      console.log(`  Block ${i+1}: data-id="${dataId}", [data-video]=${items}, .server-item=${serverItems}`);
    });
    
    // Try to find any video iframe or embed
    console.log('\n=== Looking for iframes/embeds:');
    console.log('iframe count:', $('iframe').length);
    $('iframe').slice(0, 2).each((i, el) => {
      console.log(`  iframe ${i+1} src:`, $(el).attr('src'));
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
};

testEpisode();
