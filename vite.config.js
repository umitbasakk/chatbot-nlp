import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window',
  },
  server: {
    allowedHosts: ['izuchat.online','www.izuchat.online'],
    host:'0.0.0.0',
    port:5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://api.openpipe.ai',  // API isteklerinin yönlendirilmesi gereken hedef URL
        changeOrigin: true,                  // Başlıkları hedef sunucuya uygun hale getirir
        rewrite: (path) => path.replace(/^\/api/, ''), // "/api" kısmını kaldırır
      },
    },
  },
})
