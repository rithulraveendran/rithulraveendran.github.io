import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Environment-aware base path determination:
// 1. Explicit VITE_BASE_PATH env var (e.g., '/portfolio-revamp/' in GitHub Actions)
// 2. Default to '/' for Vercel, GitHub Pages user sites, and local development
const basePath = process.env.VITE_BASE_PATH || '/';

export default defineConfig({
  plugins: [react()],
  base: basePath,
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    open: false,
  },
  build: {
    target: 'es2022',
    sourcemap: true,
  },
});
