import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/chat': 'http://localhost:5000',
      '/diagnose': 'http://localhost:5000',
      '/simulate': 'http://localhost:5000',
      '/evaluate': 'http://localhost:5000',
      '/microlearning': 'http://localhost:5000',
      '/research': 'http://localhost:5000',
      '/health': 'http://localhost:5000',
    },
  },
})
