import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solidPlugin()],
  root: 'src',
  build: {
    outDir: '../dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 800000,
  },
  server: {
    port: 8085,
    https: false,
    host: '0.0.0.0',
    open: '/dist/index.html',
  },
});