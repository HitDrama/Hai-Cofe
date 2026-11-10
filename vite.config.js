import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        main: resolve(rootDir, 'index.html'),
        about: resolve(rootDir, 'about.html'),
        drinks: resolve(rootDir, 'drinks.html'),
        news: resolve(rootDir, 'news.html'),
        newsDetail: resolve(rootDir, 'news-detail.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});

