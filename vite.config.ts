import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || '.', '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('lucide-react')) return 'vendor-icons';
              return 'vendor-core';
            }
            if (id.includes('/src/techmaster/')) return 'app-techmaster';
            if (id.includes('/src/promptcraft/')) return 'app-promptcraft';
            if (id.includes('/src/apix/')) return 'app-apix';
            if (id.includes('/src/cloudops/')) return 'app-cloudops';
            if (id.includes('/src/netsec/')) return 'app-netsec';
            if (id.includes('/src/gitstudio/')) return 'app-gitstudio';
            if (id.includes('/src/docucraft/')) return 'app-docucraft';
            if (id.includes('/src/compiler/')) return 'app-compiler';
            if (id.includes('/src/cyber/')) return 'app-cyber';
            if (id.includes('/src/devforge/')) return 'app-devforge';
            if (id.includes('/src/sukhan/')) return 'app-sukhan';
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
