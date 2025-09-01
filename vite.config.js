import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    legacy({
      // 这里写要兼容的旧浏览器
      targets: ['defaults', 'Android >= 5', 'Chrome >= 49'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      modernPolyfills: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    // ✅ 不要再写 target: 'es2015' 了，交给 legacy 插件处理
    modulePreload: { polyfill: true } // 旧环境需要
    // Vite 5 里也可以写 polyfillModulePreload: true
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://modu.local',
        changeOrigin: true
      }
    }
  }
})
