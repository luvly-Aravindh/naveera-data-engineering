import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // For production builds (deploy to specific campaign URL)
  // For localhost/development, use empty base so assets load from root
  base: process.env.NODE_ENV === 'production' 
    ? 'https://naveeratech.com/campaigns/data-engineering/' 
    : '/',
  plugins: [react()],
  server: {
    // Proxy API calls to PHP backend during development
    proxy: {
      '/index.php': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})