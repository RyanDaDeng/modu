import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(), // Add Tailwind CSS as a plugin
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      // 简单的 API 代理配置（可选）
      // 如果设置了 VITE_DEV_API_URL 则不会使用代理
      '/api': {
        target: 'http://modu.local',
        changeOrigin: true
      }
    }
  }
})
