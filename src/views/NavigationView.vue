<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden">
    <!-- Background Image -->
    <div class="fixed inset-0">
      <img
        src="/img_1.png"
        alt="Background"
        class="w-full h-full object-cover"
      />
      <!-- Dark Overlay with gradient -->
      <div class="absolute inset-0 bg-gradient-to-br from-black/70 via-purple-900/50 to-pink-900/50"></div>

      <!-- Animated particles effect -->
      <div class="absolute inset-0">
        <div class="particle particle-1"></div>
        <div class="particle particle-2"></div>
        <div class="particle particle-3"></div>
        <div class="particle particle-4"></div>
      </div>
    </div>

    <!-- Content -->
    <div class="relative z-10 container mx-auto px-4 py-8">
      <!-- Logo and Title -->
      <div class="text-center mb-8 sm:mb-12">
        <div class="flex justify-center mb-4 sm:mb-6">
          <SiteLogo :size="'large'" module=''  />
        </div>
        <h1 class="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4">
          欢迎来到魔都
        </h1>
      </div>

      <!-- Navigation Cards -->
      <div class="grid grid-cols-2 gap-3 sm:gap-6 max-w-2xl mx-auto">
        <!-- Comic Module -->
        <router-link
          to="/comic"
          class="group relative bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-12 hover:border-pink-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 overflow-hidden active:scale-95"
        >
          <!-- Gradient glow effect -->
          <div class="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-purple-500/0 group-hover:from-pink-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>

          <div class="relative">
            <!-- Icon -->
            <div class="flex justify-center mb-3 sm:mb-6">
              <div class="w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg class="w-6 h-6 sm:w-10 sm:h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </div>
            </div>

            <!-- Title -->
            <h2 class="text-xl sm:text-3xl font-bold text-white text-center group-hover:text-pink-400 transition-colors">
              漫画
            </h2>
          </div>
        </router-link>

        <!-- Video Module -->
        <router-link
          to="/video"
          class="group relative bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-12 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden active:scale-95"
        >
          <!-- Gradient glow effect -->
          <div class="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all duration-300"></div>

          <div class="relative">
            <!-- Icon -->
            <div class="flex justify-center mb-3 sm:mb-6">
              <div class="w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg class="w-6 h-6 sm:w-10 sm:h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
            </div>

            <!-- Title -->
            <h2 class="text-xl sm:text-3xl font-bold text-white text-center group-hover:text-purple-400 transition-colors">
              视频
            </h2>
          </div>
        </router-link>
      </div>

      <!-- Links Section -->
      <div class="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-4 mt-8 sm:mt-12">
        <!-- Permanent Link Button -->
        <button
          @click="showPermanentLinkModal = true"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-pink-500/20 hover:bg-pink-500/30 active:bg-pink-500/40 border border-pink-400/50 hover:border-pink-400/70 text-pink-300 hover:text-pink-200 text-sm sm:text-base rounded-full transition-all hover:scale-105 active:scale-95 backdrop-blur-sm cursor-pointer"
        >
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd" />
          </svg>
          永久链接
        </button>

        <!-- Telegram Community Link -->
        <a
          href="https://t.me/+frktRDVHynY3OTA1"
          target="_blank"
          rel="noopener noreferrer"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-blue-500/20 hover:bg-blue-500/30 active:bg-blue-500/40 border border-blue-400/50 hover:border-blue-400/70 text-blue-300 hover:text-blue-200 text-sm sm:text-base rounded-full transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
        >
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.121.099.154.232.17.326.016.094.036.308.02.475z"/>
          </svg>
          加入 Telegram 社群
        </a>
      </div>

      <!-- Permanent Link Modal -->
      <PermanentLinksModal v-model="showPermanentLinkModal" />

      <!-- Footer Note -->
      <div class="text-center mt-6 sm:mt-8 text-gray-500 text-xs sm:text-sm px-4">
        <p>18+ 成人内容 · 仅限成年人访问</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SiteLogo from '@/components/SiteLogo.vue'
import PermanentLinksModal from '@/components/PermanentLinksModal.vue'

const showPermanentLinkModal = ref(false)
</script>

<style scoped>
/* Animated particles */
.particle {
  position: absolute;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  opacity: 0.3;
  animation: float 20s infinite ease-in-out;
}

.particle-1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.particle-2 {
  width: 120px;
  height: 120px;
  top: 70%;
  right: 10%;
  animation-delay: 5s;
}

.particle-3 {
  width: 60px;
  height: 60px;
  bottom: 10%;
  left: 30%;
  animation-delay: 10s;
}

.particle-4 {
  width: 100px;
  height: 100px;
  top: 40%;
  right: 30%;
  animation-delay: 15s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.3;
  }
  33% {
    transform: translateY(-100px) rotate(120deg);
    opacity: 0.5;
  }
  66% {
    transform: translateY(100px) rotate(240deg);
    opacity: 0.2;
  }
}
</style>
