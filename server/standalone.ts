import cors from 'cors';
import { backendApp } from './app.ts';

const PORT = process.env.PORT || 10000;

backendApp.use(cors({ origin: true, credentials: true }));

backendApp.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`[Atelier Backend API] Running independently at http://0.0.0.0:${PORT}`);
  console.log(`[Atelier Backend API] Health check available at http://0.0.0.0:${PORT}/api/health`);
});
