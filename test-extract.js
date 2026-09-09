import { extractListPage } from './src/extractor/extractListpage.js';
import fs from 'fs';

const html = fs.readFileSync('/tmp/search-debug.html', 'utf8');
console.log('Running extractListPage...');

try {
  const result = extractListPage(html);
  console.log('Success!');
  console.log('Page Info:', JSON.stringify(result.pageInfo, null, 2));
  console.log('Response count:', result.response.length);
  if (result.response.length > 0) {
    console.log('\nFirst anime:');
    console.log(JSON.stringify(result.response[0], null, 2));
  }
} catch (error) {
  console.error('Error:', error.message);
  console.error(error.stack);
}
