import { app } from '../server/index.js';

export default function handler(req, res) {
  // If Vercel rewrote the URL to /api or if x-matched-path is present, normalize req.url
  const matchedPath = req.headers['x-matched-path'] || req.headers['x-vercel-original-url'];
  if (matchedPath && matchedPath.startsWith('/api') && req.url !== matchedPath) {
    req.url = matchedPath;
  }
  return app(req, res);
}
