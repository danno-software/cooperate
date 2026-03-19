import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import blogPlugin from './vite-plugin-blog.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), blogPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react-router') ||
              (id.includes('node_modules/react/') && !id.includes('react-dom') && !id.includes('react-router'))) {
            return 'vendor';
          }
        },
      },
    },
  },
})
