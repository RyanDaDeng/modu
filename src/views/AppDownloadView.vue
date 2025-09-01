<template>
  <AppLayout
    title="App下载"
    :show-back="true"
    :show-bottom-nav="true"
    :show-top-nav="false"
  >
    <div class="min-h-screen relative overflow-hidden">
      <!-- Background Screenshots - Desktop Only -->
      <div class="absolute inset-0 hidden sm:block">
        <div class="absolute inset-0 flex">
          <div class="flex-1 relative">
            <img 
              src="/img_2.png" 
              alt="Background 1" 
              class="w-full h-full object-cover opacity-40"
              @error="handleImageError"
            />
          </div>
          <div class="flex-1 relative">
            <img 
              src="/img_3.png" 
              alt="Background 2" 
              class="w-full h-full object-cover opacity-40"
              @error="handleImageError"
            />
          </div>
        </div>
        <!-- Overlay gradient -->
        <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/50"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 container mx-auto px-4 py-8">
        <div class="max-w-2xl mx-auto">
          <!-- App Title -->
          <div class="text-center mb-8">
            <h1 class="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              魔都 App
            </h1>
            <p class="text-gray-400">更流畅的阅读体验</p>
          </div>

          <!-- Main Download Card -->
          <div class="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 mb-6">
            <!-- Platform badges -->
            <div class="flex justify-center gap-3 mb-6">
              <div class="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
                <span class="text-green-300 font-medium">✓ Android</span>
              </div>
              <div class="px-4 py-2 bg-gray-700/50 border border-gray-600/30 rounded-full">
                <span class="text-gray-500">✗ iOS</span>
              </div>
            </div>

            <!-- QR Code and Download Button -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-8">
              <!-- QR Code -->
              <div class="text-center">
                <div class="bg-white p-3 rounded-xl inline-block mb-3">
                  <qrcode-vue 
                    :value="downloadUrl" 
                    :size="120"
                    level="M"
                    render-as="svg"
                  />
                </div>
                <p class="text-gray-400 text-sm">扫码下载</p>
              </div>

              <!-- Divider -->
              <div class="hidden sm:block w-px h-32 bg-gray-700"></div>
              <div class="sm:hidden w-32 h-px bg-gray-700"></div>

              <!-- Direct Download -->
              <div class="text-center">
                <a 
                  :href="downloadUrl"
                  download
                  class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium rounded-full transition-all transform hover:scale-105 shadow-lg mb-3"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  安卓APK下载
                </a>
                <p class="text-gray-400 text-sm">文件大小: 5MB</p>
              </div>
            </div>
          </div>

          <!-- Warnings Section -->
          <div class="space-y-3 mb-6">
            <!-- WebView Warning -->
            <div class="bg-red-900/30 backdrop-blur-sm border border-red-500/30 rounded-xl p-4">
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 class="text-red-400 font-semibold mb-1">无法加载页面？</h4>
                  <p class="text-gray-300 text-sm">
                    设备浏览器内核过旧，请更新 Android System WebView 或 Chrome 浏览器
                  </p>
                </div>
              </div>
            </div>

            <!-- Content Warning -->
            <div class="bg-yellow-900/30 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-4">
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p class="text-gray-300 text-sm">
                    因含成人内容，可能会被系统拦截
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Installation Guide -->
          <div class="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 class="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              安装指南
            </h3>
            
            <div class="grid sm:grid-cols-2 gap-3">
              <div class="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                <span class="flex-shrink-0 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</span>
                <p class="text-gray-300 text-sm">设定 → 安全性 → 开启「未知来源」</p>
              </div>
              
              <div class="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                <span class="flex-shrink-0 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</span>
                <p class="text-gray-300 text-sm">关闭「禁止安装恶意应用」</p>
              </div>
              
              <div class="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                <span class="flex-shrink-0 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</span>
                <p class="text-gray-300 text-sm">下载 APK 并同意安装</p>
              </div>
              
              <div class="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                <span class="flex-shrink-0 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">4</span>
                <p class="text-gray-300 text-sm">无视安全提示，继续安装</p>
              </div>
            </div>
            
            <!-- Tips -->
            <div class="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p class="text-blue-400 font-medium mb-2">💡 提示</p>
              <ul class="text-gray-400 text-sm space-y-1">
                <li>• 建议使用 Chrome 浏览器下载</li>
                <li>• 安装前需卸载旧版本</li>
                <li>• 首次启动需要网络验证</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { computed } from 'vue'
import AppLayout from '@/components/AppLayout.vue'
import QrcodeVue from 'qrcode.vue'
import { handleImageError } from '@/utils/handleImageError'

// Generate download URL based on current location
const downloadUrl = computed(() => {
  const baseUrl = window.location.origin
  return `${baseUrl}/modu-v1-release.apk`
})
</script>

<style scoped>
/* Add subtle animation to the download button */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.hover\:scale-105:hover {
  animation: pulse 2s infinite;
}
</style>