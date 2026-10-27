import express from 'express';
import path from 'path';
import cors from 'cors';
import { backendApp } from './server/app.ts';

// Extract CLI port if passed by dev supervisor (e.g. --port 3000), otherwise use process.env.PORT or default to 10000
const args = process.argv.slice(2);
const portIndex = args.indexOf('--port');
const cliPort = portIndex !== -1 ? Number(args[portIndex + 1]) : null;
const PORT = cliPort || process.env.PORT || 10000;
const isProd = process.env.NODE_ENV === 'production';

// Ensure CORS is enabled for all origins and headers
backendApp.use(cors({ origin: true, credentials: true }));

async function startServer() {
  if (!isProd) {
    // Mount Vite dev server middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    backendApp.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.resolve(process.cwd(), 'dist');
    backendApp.use(express.static(distPath));
    backendApp.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Call backendApp.listen with PORT and 0.0.0.0
  backendApp.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Atelier Server] Running on http://0.0.0.0:${PORT} (PORT=${PORT}, isProd=${isProd})`);
    console.log(`[Atelier Server] Health check available at http://0.0.0.0:${PORT}/api/health`);
  });
}

startServer();
