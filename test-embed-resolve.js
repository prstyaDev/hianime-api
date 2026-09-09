import axios from 'axios';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const testEmbed = async () => {
  const embedUrl = 'https://megaplay.buzz/stream/s-2/976085/sub';
  
  try {
    console.log('Fetching embed:', embedUrl);
    const { data: html } = await axios.get(embedUrl, {
      headers: {
        'User-Agent': UA,
        'Referer': 'https://hianime.dk/',
      },
      timeout: 15000,
    });
    
    console.log('\n=== HTML LENGTH:', html.length);
    console.log('\n=== First 1500 chars:');
    console.log(html.substring(0, 1500));
    
    // Look for m3u8 patterns
    console.log('\n=== Searching for m3u8 URLs:');
    const m3u8Matches = html.match(/https?:\/\/[^\s"']+?\.m3u8[^\s"']*/g);
    if (m3u8Matches) {
      m3u8Matches.forEach((url, i) => console.log(`  ${i+1}. ${url}`));
    } else {
      console.log('  No .m3u8 URLs found');
    }
    
    // Look for subtitle
    console.log('\n=== Searching for subtitle:');
    const subMatches = html.match(/https?:\/\/[^\s"']+?\.(vtt|srt|ass)[^\s"']*/g);
    if (subMatches) {
      subMatches.forEach((url, i) => console.log(`  ${i+1}. ${url}`));
    } else {
      console.log('  No subtitle URLs found');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testEmbed();
