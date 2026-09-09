import { cfFetchAjax } from './src/services/cfBypass.js';
import { load } from 'cheerio';

const testSelectors = async () => {
  const episodeId = '178650';
  
  try {
    const data = await cfFetchAjax(`/ajax/v2/episode/servers?episodeId=${episodeId}`, '/watch/mushoku-tensei-jobless-reincarnation-season-3-9142/ep-178650');
    
    if (!data || !data.html) {
      console.error('No HTML in response');
      return;
    }
    
    const $ = load(data.html);
    
    console.log('=== Full HTML (first 2000 chars) ===');
    console.log(data.html.substring(0, 2000));
    
    console.log('\n=== Testing selectors ===');
    
    const selectors = [
      '.servers-sub',
      '.servers-sub .ps__-list',
      '.ps_-block-sub',
      '.ps_-block-sub .ps__-list',
      '.servers-dub',
      '.servers-dub .ps__-list',
      '.ps_-block-dub',
      '.ps_-block-dub .ps__-list',
    ];
    
    selectors.forEach(sel => {
      const count = $(sel).length;
      console.log(`${sel}: ${count} elements`);
      if (count > 0) {
        const items = $(sel).first().find('.server-item').length;
        console.log(`  → .server-item inside: ${items}`);
      }
    });
    
    console.log('\n=== All .server-item elements ===');
    $('.server-item').each((i, el) => {
      const id = $(el).attr('data-id');
      const name = $(el).find('a').text().trim();
      const parent = $(el).parent().parent().attr('class');
      console.log(`${i+1}. id="${id}", name="${name}", parent="${parent}"`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testSelectors();
