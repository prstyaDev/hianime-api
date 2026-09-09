import app from './src/app.js';
import { serve } from '@hono/node-server';

const PORT = process.env.PORT || 3000;

console.log(`Server is running at http://0.0.0.0:${PORT}`);
console.log(`Docs: http://0.0.0.0:${PORT}/docs`);
console.log(`Swagger: http://0.0.0.0:${PORT}`);

serve({
  fetch: app.fetch,
  port: PORT,
  hostname: '0.0.0.0'
});
