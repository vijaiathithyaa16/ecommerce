// Standalone Backend Server entry point for separate backend deployment (e.g., Render, Railway, AWS, Docker)
import { backendApp } from './app.ts';

const PORT = process.env.PORT || 5000;

backendApp.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`[Atelier Backend API] Running independently at http://0.0.0.0:${PORT}`);
  console.log(`[Atelier Backend API] Health check available at http://0.0.0.0:${PORT}/api/health`);
});
