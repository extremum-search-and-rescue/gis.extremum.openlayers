import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { resolve } from 'path'

export default defineConfig({
  plugins: [solidPlugin(), basicSsl()],
  root: 'src',
  build: {
    outDir: '../dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/index.html'),
        geocase: resolve(__dirname, 'src/geo-case.html'),
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
        chunkFileNames: '[name].js',
        manualChunks: (id) => {
          if (id.includes('ol-mapbox-style')) {
            return 'vt';
          }
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 800000,
  },
  server: {
    port: 44325,
    https: true,
    host: '0.0.0.0',
    open: '/dist/index.html',
  },
});