import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: 'https://naveeratech.com/campaigns/data-engineering/',
  plugins: [react()]
})