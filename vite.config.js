import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
    plugins: [solidPlugin()],
    root: 'src',
    build: {
      outDir: '../dist',
      sourcemap: true,
    },
    server: {
      port: 8085,
      https: false,
      open: '/dist/index.html',
    },
  })