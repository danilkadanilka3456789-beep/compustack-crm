
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    base: './', // Добавлено для корректной работы на GitHub Pages
    server: {
      host: true,
      port: 5173,
      strictPort: true,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './'),
      },
    },
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});
