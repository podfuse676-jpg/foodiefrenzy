import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true
  },
  // Production optimizations
  build: {
    // Enable gzip compression
    brotliSize: true,
    chunkSizeWarningLimit: 1000
  }
})