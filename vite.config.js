import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    laravel({
      input: [
        'resources/css/app.css',
        'resources/js/app.tsx',
      ],
      refresh: true,
    }),
    react({
      // 👇 PENTING: Enable automatic JSX runtime
      jsxRuntime: 'automatic',
      babel: {
        plugins: [],
      },
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './resources/js'),
    },
  },

  esbuild: {
    // 👇 PENTING: Support TSX files
    loader: 'tsx',
    include: /resources\/js\/.*\.tsx?$/,
  },

  server: {
    hmr: {
      host: 'localhost',
    },
  },
});
