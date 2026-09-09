import { validationError } from '../utils/errors.js';
import { getServers } from './serversController.js';
import { resolveEmbedStream } from '../services/cfBypass.js';
import axios from 'axios';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const streamController = async (c) => {
  let { id, server = 'HD-1', type = 'sub' } = c.req.query();
  if (!id) throw new validationError('id is required');

  server = server.toUpperCase();
  const servers = await getServers(id);

  const pool = servers[type] || servers['sub'] || [];
  let selected = pool.find(s => s.name.toUpperCase() === server)
               || pool.find(s => s.name.toUpperCase().includes(server))
               || pool[0];

  if (!selected) throw new validationError('server not found', { available: pool.map(s => s.name) });

  // Check if this is a megaplay/vidtube direct stream
  if (selected.embedUrl && (selected.embedUrl.includes('megaplay.buzz') || selected.embedUrl.includes('vidtube.site'))) {
    // Megaplay streams are direct links, return as streamingLink for now
    // ExoPlayer can handle these URLs directly with proper headers
    return {
      episode_id: id,
      type,
      server: selected.name,
      
      stream: {
        streaming_link: selected.embedUrl,
        master_m3u8: selected.embedUrl, // Use embed URL as m3u8 source
        variants: [],
        
        headers: {
          'Referer': new URL(selected.embedUrl).origin + '/',
          'User-Agent': UA,
          'Origin': new URL(selected.embedUrl).origin,
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      },
      
      subtitle: null,
      embed_url: selected.embedUrl,
      
      note: 'Direct stream link - may require iframe embedding or JavaScript execution to extract final HLS URL'
    };
  }

  // Try to resolve embed stream (for other providers)
  if (selected.embedUrl) {
    const stream = await resolveEmbedStream(selected.embedUrl);
    
    // Format response for ExoPlayer Android
    return {
      episode_id: id,
      type,
      server: selected.name,
      
      // Streaming info
      stream: {
        master_m3u8: stream.master_m3u8,
        variants: stream.variants || [],
        
        // Required headers for ExoPlayer
        headers: stream.headers || {
          'Referer': selected.embedUrl ? new URL(selected.embedUrl).origin : 'https://hianime.dk',
          'User-Agent': UA,
          'Origin': selected.embedUrl ? new URL(selected.embedUrl).origin : 'https://hianime.dk',
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      },
      
      // Subtitle info
      subtitle: selected.subtitle || stream.subtitle || null,
      
      // Additional info
      embed_url: selected.embedUrl,
    };
  }

  throw new validationError('Could not resolve stream for this server');
};

export default streamController;
