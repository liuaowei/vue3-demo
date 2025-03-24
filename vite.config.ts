import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      // 选项写法
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      }
    },
    hmr: {
      overlay: false
    },
    host: '0.0.0.0'
  },
})
