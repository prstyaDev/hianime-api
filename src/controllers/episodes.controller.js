import { validationError } from '../utils/errors.js';
import { cfFetch, cfFetchAjax } from '../services/cfBypass.js';
import { load } from 'cheerio';

const episodesController = async (c) => {
  const id = c.req.param('id');
  if (!id) throw new validationError('id is required');

  try {
    // Extract numeric anime ID from slug (e.g., "anime-name-1234" -> "1234")
    const numericIdMatch = id.match(/-(\d+)$/);
    if (!numericIdMatch) {
      throw new validationError('Invalid anime ID format. Expected format: anime-name-1234');
    }
    const animeId = numericIdMatch[1];

    // Fetch episodes list via AJAX endpoint
    const ajaxData = await cfFetchAjax(`/ajax/v2/episode/list/${animeId}`, '/');
    
    if (!ajaxData || !ajaxData.html) {
      throw new validationError('Failed to fetch episodes list');
    }

    const $ = load(ajaxData.html);
    const episodes = [];

    // Parse episode items from HTML
    $('.detail-infor-content .ss-list a').each((i, el) => {
      const href = $(el).attr('href') || '';
      const epNum = parseInt($(el).attr('data-number'), 10) || i + 1;
      const title = $(el).attr('title') || $(el).text().trim() || `Episode ${epNum}`;
      const isFiller = $(el).hasClass('ssl-item-filler');
      
      // Extract episode ID from href: /watch/slug?ep=123456
      const epIdMatch = href.match(/[?&]ep=(\d+)/);
      const epId = epIdMatch ? epIdMatch[1] : '';
      
      if (epNum && epId) {
        episodes.push({
          episodeNumber: epNum,
          title,
          id: epId,
          isFiller,
        });
      }
    });

    episodes.sort((a, b) => a.episodeNumber - b.episodeNumber);

    return { totalEpisodes: episodes.length, episodes };
  } catch (err) {
    console.error('[episodesController]', err.message);
    throw new validationError('Failed to fetch episodes. Make sure the anime ID is correct.', { id, error: err.message });
  }
};

export default episodesController;
