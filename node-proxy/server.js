import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const port = Number(process.env.PORT || 3000);
const here = path.dirname(fileURLToPath(import.meta.url));
const testHtml = path.resolve(here, '../web/youtube-test.html');
const upstream = process.env.APP_UPSTREAM;

app.disable('x-powered-by');

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'trezioplay-tizen-diagnostic' });
});

app.get('/youtube-test', (_req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.sendFile(testHtml);
});

// Optional reverse proxy for YOUR OWN app/site only.
// Do not set APP_UPSTREAM to YouTube endpoints.
if (upstream) {
  const target = new URL(upstream);
  if (!['http:', 'https:'].includes(target.protocol)) {
    throw new Error('APP_UPSTREAM must use http:// or https://');
  }
  if (/(^|\.)youtube\.com$|(^|\.)googlevideo\.com$/i.test(target.hostname)) {
    throw new Error('APP_UPSTREAM must point to your own site, not YouTube');
  }

  app.use('/app', createProxyMiddleware({
    target: target.origin,
    changeOrigin: true,
    secure: true,
    pathRewrite: (p) => `${target.pathname.replace(/\/$/, '')}${p === '/' ? '' : p}`,
    on: {
      proxyReq(proxyReq, req) {
        // Preserve client identity; do not spoof/remove Referer to YouTube.
        console.info(`[app-proxy] ${req.method} ${req.originalUrl}`);
      },
      error(err, _req, res) {
        console.error('[app-proxy]', err.message);
        if (!res.headersSent) res.status(502).json({ error: 'Upstream app unavailable' });
      }
    }
  }));
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Diagnostic server listening on :${port}`);
});
