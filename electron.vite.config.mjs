import { defineConfig } from 'electron-vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        input: {
          index: `${root}src/main.js`,
        },
      },
    },
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: `${root}src/preload.js`,
        },
      },
    },
  },
  renderer: {
    root: '.',
    plugins: [react(), tailwindcss()],
    build: {
      rollupOptions: {
        input: {
          index: `${root}index.html`,
        },
      },
    },
  },
});