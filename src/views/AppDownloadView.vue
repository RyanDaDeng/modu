<template>
  <GeneralLayout
    title="APP 安装"
    :show-top-nav="true"
    :show-bottom-nav="true"
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
              魔都 APP
            </h1>
            <p class="text-gray-400 mb-4">安装到主屏幕，享受原生应用体验</p>
            
            <!-- Platform icons -->
            <div class="flex justify-center gap-4">
              <!-- Android icon -->
              <div class="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
                <img 
                  src="/img_5.png" 
                  alt="Android" 
                  class="w-5 h-5 object-contain"
                  @error="handleImageError"
                />
                <span class="text-green-300 font-medium">Android</span>
              </div>
              
              <!-- iOS icon -->
              <div class="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full">
                <img 
                  src="/img_11.png" 
                  alt="iOS" 
                  class="w-5 h-5 object-contain"
                  @error="handleImageError"
                />
                <span class="text-blue-300 font-medium">iOS</span>
              </div>
            </div>
          </div>

          <!-- Android Installation Guide -->
          <div class="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6">
            <h3 class="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Android 安装指南
            </h3>
            
            <!-- Browser Support Notice -->
            <div class="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
              <p class="text-green-400 text-sm mb-2">🤖 支持安装的浏览器</p>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div class="flex items-center gap-1 text-green-300">
                  <span class="text-green-500">✓</span> Chrome
                </div>
                <div class="flex items-center gap-1 text-green-300">
                  <span class="text-green-500">✓</span> Edge
                </div>
                <div class="flex items-center gap-1 text-green-300">
                  <span class="text-green-500">✓</span> Samsung Browser
                </div>
                <div class="flex items-center gap-1 text-green-300">
                  <span class="text-green-500">✓</span> Opera
                </div>
              </div>
              <p class="text-yellow-400 text-xs mt-2">⚠️ 其他浏览器可能不支持安装功能</p>
            </div>
            
            <div class="grid sm:grid-cols-2 gap-3">
              <div class="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                <span class="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</span>
                <p class="text-gray-300 text-sm">使用支持的浏览器打开本站</p>
              </div>
              
              <div class="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                <span class="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</span>
                <p class="text-gray-300 text-sm">点击右上角菜单 <span class="text-green-400">⋮</span></p>
              </div>
              
              <div class="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                <span class="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</span>
                <p class="text-gray-300 text-sm">选择「添加到主屏幕」</p>
              </div>
              
              <div class="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                <span class="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">4</span>
                <p class="text-gray-300 text-sm">点击「安装」完成</p>
              </div>
            </div>
          </div>

          <!-- iOS PWA Installation Guide -->
          <div class="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 class="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              iOS 安装指南
            </h3>
            
            <div class="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
              <p class="text-blue-400 text-sm mb-2">🍎 iOS用户可以将网站添加到主屏幕，体验原生App般的使用感受</p>
            </div>
            
            <!-- Step by step with images -->
            <div class="grid sm:grid-cols-2 gap-3">
              <!-- Step 1 with Safari icon -->
              <div class="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                <span class="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</span>
                <div class="flex-1 flex items-center gap-2">
                  <p class="text-gray-300 text-sm">使用 Safari 浏览器打开本站</p>
                  <img 
                    src="/safari.jpg" 
                    alt="Safari" 
                    class="w-6 h-6 rounded object-contain"
                    @error="handleImageError"
                  />
                </div>
              </div>
              
              <!-- Step 2 with Share icon -->
              <div class="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                <span class="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</span>
                <div class="flex-1 flex items-center gap-2">
                  <p class="text-gray-300 text-sm">点击底部分享按钮</p>
                  <img 
                    src="/addToScreen.jpg" 
                    alt="Share" 
                    class="w-6 h-6 rounded object-contain"
                    @error="handleImageError"
                  />
                </div>
              </div>
              
              <!-- Step 3 -->
              <div class="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                <span class="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</span>
                <p class="text-gray-300 text-sm">选择「添加到主屏幕」</p>
              </div>
              
              <!-- Step 4 -->
              <div class="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                <span class="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">4</span>
                <p class="text-gray-300 text-sm">点击「添加」完成安装</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </GeneralLayout>
</template>

<script setup>
import GeneralLayout from '@/components/GeneralLayout.vue'
import { handleImageError } from '@/utils/handleImageError'
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