import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false, // Disable source maps in production
  },
  server: {
    sourcemapIgnoreList: () => true, // Ignore missing source maps during development
  }

})
// vite.config.js
