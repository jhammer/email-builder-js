import { resolve } from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  base: '/email-builder-js/',
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/main.tsx'),
        helpers: resolve(__dirname, 'src/helpers.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunk-[name].js',
      },
    },
  },
});
