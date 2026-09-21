import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/anniversary-11-months/',
  server: {
    port: 5173,
    open: true
  }
})
