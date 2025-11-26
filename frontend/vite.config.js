import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true
  },
  resolve: {
    alias: {
      '@utils': path.resolve(__dirname, './src/utils')
    }
  },
  // Production optimizations
  build: {
    // Reduce bundle size
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          utils: ['axios', 'jwt-decode']
        }
      }
    },
    // Enable gzip compression
    brotliSize: true,
    chunkSizeWarningLimit: 1000
  }
})