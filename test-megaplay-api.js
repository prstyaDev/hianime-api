import axios from 'axios';

const testMegaplayAPI = async () => {
  const embedUrl = 'https://megaplay.buzz/stream/s-2/976085/sub';
  const id = embedUrl.split('/').slice(-2, -1)[0]; // Extract: 976085
  
  const apiEndpoints = [
    `https://megaplay.buzz/getSources`,
    `https://megaplay.buzz/api/getSources`,
    `https://megaplay.buzz/ajax/getSources`,
  ];
  
  for (const apiUrl of apiEndpoints) {
    try {
      console.log(`\n=== Testing: ${apiUrl}`);
      const { data } = await axios.post(apiUrl, 
        { id },
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': embedUrl,
            'Origin': 'https://megaplay.buzz',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 10000,
        }
      );
      
      console.log('Success! Response:', JSON.stringify(data, null, 2).substring(0, 1000));
      if (data && data.sources) {
        console.log('\nSources found:', data.sources.length);
        data.sources.forEach((s, i) => {
          console.log(`  ${i+1}. ${s.file || s.url || JSON.stringify(s)}`);
        });
      }
      if (data && data.tracks) {
        console.log('\nTracks/Subtitles found:', data.tracks.length);
        data.tracks.forEach((t, i) => {
          console.log(`  ${i+1}. ${t.file || t.url || JSON.stringify(t)}`);
        });
      }
      
      break; // Stop after first success
    } catch (error) {
      console.log(`Failed: ${error.message}`);
    }
  }
};

testMegaplayAPI();
