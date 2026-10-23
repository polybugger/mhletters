import { defineConfig } from 'vite';

export default defineConfig({
  base: './',               // relative URLs, so the built site works from any folder
  server: { port: 5173 },   // `npm run dev -- --host` to open it on a phone over Wi-Fi
  build: { target: 'es2020', chunkSizeWarningLimit: 900 },
});
