import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: 'https://getnos.io/naveera-data-engineering',
  plugins: [react()]
})