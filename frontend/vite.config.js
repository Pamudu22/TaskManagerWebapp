import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
   tailwindcss()],
   server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080/api/v1', // Adjust the target to your backend API URL
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/api'), // no-op here but needed
      },
    },
  },
})