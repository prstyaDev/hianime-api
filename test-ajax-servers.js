import { cfFetchAjax } from './src/services/cfBypass.js';
import axios from 'axios';
import config from './src/config/config.js';

const testAjaxServers = async () => {
  const episodeId = '178650';
  
  console.log('Testing AJAX endpoints for episode:', episodeId);
  
  const endpointsToTry = [
    `/ajax/v2/episode/servers?episodeId=${episodeId}`,
    `/ajax/episode/servers?episodeId=${episodeId}`,
    `/ajax/server/list/${episodeId}`,
    `/ajax/v2/server/list?episodeId=${episodeId}`,
  ];
  
  for (const endpoint of endpointsToTry) {
    try {
      console.log(`\n=== Trying: ${endpoint}`);
      const data = await cfFetchAjax(endpoint, '/watch/mushoku-tensei-jobless-reincarnation-season-3-9142/ep-178650');
      console.log('Success! Response:', JSON.stringify(data, null, 2).substring(0, 500));
      
      // If we got valid data, also check HTML structure
      if (data && typeof data === 'object' && data.html) {
        const { load } = await import('cheerio');
        const $ = load(data.html);
        console.log('\nHTML structure:');
        console.log('  [data-video] elements:', $('[data-video]').length);
        console.log('  .server-item elements:', $('.server-item').length);
        console.log('  .ps__-list elements:', $('.ps__-list').length);
      }
      
      break; // Stop after first success
    } catch (error) {
      console.log(`Failed: ${error.message}`);
    }
  }
};

testAjaxServers();
