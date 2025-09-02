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
  },
  build: {
    // Remove console.log, console.warn, console.error, and debugger statements in production
    terserOptions: {
      compress: {
        drop_console: true,     // Remove all console.* statements
        drop_debugger: true,    // Remove debugger statements
        pure_funcs: ['console.log', 'console.warn', 'console.error', 'console.debug', 'console.trace']
      }
    },
    // Alternatively, if you want to keep console.error and console.warn:
    // terserOptions: {
    //   compress: {
    //     drop_console: false,
    //     drop_debugger: true,
    //     pure_funcs: ['console.log', 'console.debug', 'console.trace']
    //   }
    // }
  },
  // Define global constants
  define: {
    // This will replace console.log with empty function in production
    // (Alternative approach if you prefer)
    // 'console.log': process.env.NODE_ENV === 'production' ? '(() => {})' : 'console.log'
  }
})