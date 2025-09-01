<template>
  <AppLayout
    title="App下载"
    :show-back="true"
    :show-bottom-nav="true"
    :show-top-nav="false"
  >
    <div class="min-h-screen py-4 sm:py-6">
      <div class="container mx-auto px-4 max-w-3xl">
        <!-- App Preview Section -->
        <div class="bg-gray-900/60 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-5 mb-4">
          <h1 class="text-xl sm:text-2xl font-bold text-center mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            魔都 App
          </h1>
          
          <!-- Platform Support Notice -->
          <div class="flex flex-col sm:flex-row gap-2 mb-3 justify-center">
            <div class="px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full">
              <span class="text-green-300 text-sm font-medium">Android 支持</span>
            </div>
            <div class="px-3 py-1.5 bg-gray-700/50 border border-gray-600/30 rounded-full">
              <span class="text-gray-400 text-sm">iOS 暂不支持</span>
            </div>
          </div>
          
          <!-- QR Code Download Section -->
          <div class="flex justify-center mb-4">
            <div class="bg-gray-900/60 backdrop-blur-sm border border-white/10 rounded-lg p-3 inline-block">
              <h2 class="text-white font-semibold text-sm mb-2 text-center">扫码下载</h2>
              <div class="bg-white p-2 rounded-lg mb-2">
                <qrcode-vue 
                  :value="downloadUrl" 
                  :size="100"
                  level="M"
                  render-as="svg"
                />
              </div>
              <a 
                :href="downloadUrl"
                download
                class="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium text-xs rounded-full transition-all transform hover:scale-105 shadow-lg w-full justify-center"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                安卓APK下载
              </a>
              <p class="text-gray-400 text-xs mt-1 text-center">5MB</p>
            </div>
          </div>
          
          <!-- Download Section Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Left Section: Three Column Layout -->
            <div class="flex gap-2" style="height: 360px">
              <!-- Screenshot 1 -->
              <div class="flex-1 relative rounded-lg overflow-hidden h-full">
                <img 
                  src="/img_2.png" 
                  alt="App Screenshot 1" 
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
              </div>
              
              <!-- Center Image -->
              <div class="flex-1 relative rounded-lg overflow-hidden h-full">
                <img 
                  src="/img_4.png" 
                  alt="App Screenshot Center" 
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
              </div>
              
              <!-- Screenshot 2 -->
              <div class="flex-1 relative rounded-lg overflow-hidden h-full">
                <img 
                  src="/img_3.png" 
                  alt="App Screenshot 2" 
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
              </div>
            </div>
            
            <!-- Installation Guide on Right -->
            <div class="flex flex-col h-full" style="height: 360px">
              <!-- Warning Notice -->
              <div class="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-2 mb-3">
                <div class="flex items-start gap-1.5">
                  <svg class="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p class="text-gray-300 text-xs leading-relaxed">
                      因含成人內容，可能會被系統攔截。請按照下方操作。
                    </p>
                  </div>
                </div>
              </div>
              
              <h3 class="text-white font-semibold text-sm mb-2 flex items-center gap-1">
                <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                安装指南
              </h3>
              
              <div class="space-y-2">
                <!-- Compact Steps -->
                <div class="flex items-start gap-2 p-2 bg-gray-800/50 rounded-lg">
                  <span class="flex-shrink-0 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</span>
                  <p class="text-gray-300 text-xs">設定 → 安全性 → 開啟「未知來源」</p>
                </div>
                
                <div class="flex items-start gap-2 p-2 bg-gray-800/50 rounded-lg">
                  <span class="flex-shrink-0 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</span>
                  <p class="text-gray-300 text-xs">關閉「禁止安裝惡意應用」</p>
                </div>
                
                <div class="flex items-start gap-2 p-2 bg-gray-800/50 rounded-lg">
                  <span class="flex-shrink-0 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</span>
                  <p class="text-gray-300 text-xs">下載 APK 並同意安裝</p>
                </div>
                
                <div class="flex items-start gap-2 p-2 bg-gray-800/50 rounded-lg">
                  <span class="flex-shrink-0 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">4</span>
                  <p class="text-gray-300 text-xs">無視安全提示，繼續安裝</p>
                </div>
              </div>
              
              <!-- Compact Tips -->
              <div class="mt-3 p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p class="text-blue-400 text-xs font-medium mb-1">💡 提示</p>
                <ul class="text-gray-400 text-xs space-y-0.5">
                  <li>• 使用 Chrome 下載</li>
                  <li>• 需卸載舊版本</li>
                  <li>• 首次需聯網驗證</li>
                </ul>
              </div>
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