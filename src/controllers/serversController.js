import { validationError } from '../utils/errors.js';
import { cfFetchAjax } from '../services/cfBypass.js';
import { load } from 'cheerio';

// hianime.dk uses AJAX to load servers
// id format: "steinsgate-3::ep=213" OR "steinsgate-3?ep=213"
const parseId = (id) => {
  // normalize :: to ?
  const normalized = id.replace('::', '?');
  const slugMatch = normalized.match(/^([^?]+)/);
  const epMatch = normalized.match(/ep=(\d+)/);
  return {
    slug: slugMatch?.[1] || null,
    episode: epMatch?.[1] || '1',
  };
};

export const getServers = async (id) => {
  const { slug, episode } = parseId(id);
  if (!slug) throw new validationError('Invalid id format. Use: anime-slug::ep=123');

  // Fetch servers via AJAX endpoint — hianime.dk loads servers dynamically
  const data = await cfFetchAjax(`/ajax/v2/episode/servers?episodeId=${episode}`, `/watch/${slug}/ep-${episode}`);
  
  if (!data || !data.html) {
    throw new validationError('Failed to fetch servers');
  }
  
  const $ = load(data.html);

  const extractList = (selector, type) => {
    const servers = [];
    
    // hianime.dk AJAX format: uses .server-item with data-hash (base64 encoded URL)
    $(selector).find('.server-item').each((i, el) => {
      const dataHash = $(el).attr('data-hash');
      const serverName = $(el).attr('data-server-name') || $(el).find('a').text().trim() || `Server ${i + 1}`;
      const serverType = $(el).attr('data-type') || type;
      
      if (dataHash) {
        // Decode base64 hash to get embed URL
        let embedUrl = null;
        try {
          embedUrl = Buffer.from(dataHash, 'base64').toString('utf-8');
        } catch (e) {
          console.error('Failed to decode data-hash:', e.message);
        }
        
        servers.push({
          index: i + 1,
          type: serverType,
          name: serverName,
          embedUrl,
          hash: dataHash,
        });
      }
    });
    
    return servers;
  };

  const sub = extractList('.servers-sub .ps__-list', 'sub');
  const dub = extractList('.servers-dub .ps__-list', 'dub');
  const raw = extractList('.servers-raw .ps__-list', 'raw');

  return {
    episode: Number(episode),
    sub,
    dub,
    raw,
  };
};

const serversController = async (c) => {
  const id = c.req.query('id');
  if (!id) throw new validationError('id is required. Example: ?id=steinsgate-3::ep=213');
  return getServers(id);
};

export default serversController;
