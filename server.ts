// Unified Full-Stack Server Entry Point
// Integrates the decoupled backend (/server/app.ts) with Vite in development and static asset serving in production
import express from 'express';
import path from 'path';
import { backendApp } from './server/app.ts';

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Mount backend API routes from modular backend
app.use(backendApp);

async function startServer() {
  if (!isProd) {
    // Mount Vite middleware in development
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve pre-built frontend distribution
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Atelier Full-Stack Server] Running on http://0.0.0.0:${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

startServer();
