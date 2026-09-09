import { load } from 'cheerio';
import fs from 'fs';

const html = fs.readFileSync('/tmp/search-debug.html', 'utf8');
const $ = load(html);

console.log('Full selector test:');
console.log('.block_area-content.block_area-list.film_list .film_list-wrap .flw-item:', 
  $('.block_area-content.block_area-list.film_list .film_list-wrap .flw-item').length);

console.log('\nStep by step:');
console.log('.block_area-content:', $('.block_area-content').length);
console.log('.block_area-list:', $('.block_area-list').length);
console.log('.film_list:', $('.film_list').length);
console.log('.block_area-content.block_area-list:', $('.block_area-content.block_area-list').length);
console.log('.block_area-content.block_area-list.film_list:', $('.block_area-content.block_area-list.film_list').length);

console.log('\nSimpler selectors:');
console.log('.film_list .flw-item:', $('.film_list .flw-item').length);
console.log('.film_list-wrap .flw-item:', $('.film_list-wrap .flw-item').length);

// Check actual classes
const filmList = $('.film_list').first();
console.log('\n.film_list classes:', filmList.attr('class'));

const blockArea = $('.block_area-content').first();
console.log('.block_area-content classes:', blockArea.attr('class'));

// Test the working selector
const items = $('.film_list-wrap .flw-item');
console.log('\n=== First item details ===');
const first = items.first();
const title = first.find('.film-detail .film-name .dynamic-name').text();
const id = first.find('.film-detail .film-name .dynamic-name').attr('href');
console.log('Title:', title);
console.log('ID href:', id);
