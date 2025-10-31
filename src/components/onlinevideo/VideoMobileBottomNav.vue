<template>
  <div class="lg:hidden fixed bottom-0 left-0 right-0 z-40">
    <!-- Glassmorphism background with gradient border -->
    <div class="absolute inset-0 bg-gray-900/80 backdrop-blur-xl border-t border-white/10"></div>

    <!-- Gradient top border -->
    <div class="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>

    <!-- Navigation Items -->
    <div class="relative grid grid-cols-3 h-20 pb-safe">
      <!-- 首页 -->
      <router-link
        to="/video"
        class="group flex flex-col items-center justify-center py-3 transition-all duration-300 relative"
        :class="{ 'text-pink-400': isVideoHome, 'text-gray-400': !isVideoHome }"
      >
        <!-- Active indicator -->
        <div v-if="isVideoHome"
             class="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent"></div>

        <!-- Icon container with glow effect -->
        <div class="relative">
          <svg class="w-7 h-7 transition-transform group-active:scale-95"
               :class="{ 'filter drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]': isVideoHome }"
               fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </div>
        <span class="text-xs mt-1.5 font-medium"
              :class="{ 'text-pink-400': isVideoHome, 'text-gray-500': !isVideoHome }">
          首页
        </span>
      </router-link>

      <!-- 收藏 -->
      <router-link
        to="/video/favorites"
        class="group flex flex-col items-center justify-center py-3 transition-all duration-300 relative"
        :class="{ 'text-purple-400': $route.path === '/video/favorites', 'text-gray-400': $route.path !== '/video/favorites' }"
      >
        <!-- Active indicator -->
        <div v-if="$route.path === '/video/favorites'"
             class="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent"></div>

        <div class="relative">
          <svg class="w-7 h-7 transition-transform group-active:scale-95"
               :class="{ 'filter drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]': $route.path === '/video/favorites' }"
               fill="currentColor" viewBox="0 0 20 20">
            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
          </svg>
        </div>
        <span class="text-xs mt-1.5 font-medium"
              :class="{ 'text-purple-400': $route.path === '/video/favorites', 'text-gray-500': $route.path !== '/video/favorites' }">
          收藏
        </span>
      </router-link>

      <!-- 我的 -->
      <button
        @click="handleMyClick"
        class="group flex flex-col items-center justify-center py-3 transition-all duration-300 relative cursor-pointer"
        :class="{ 'text-yellow-400': isUserMenuActive, 'text-gray-400': !isUserMenuActive }"
      >
        <!-- Active indicator -->
        <div v-if="isUserMenuActive"
             class="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent"></div>

        <div class="relative">
          <svg class="w-7 h-7 transition-transform group-active:scale-95"
               :class="{ 'filter drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]': isUserMenuActive }"
               fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
        </div>
        <span class="text-xs mt-1.5 font-medium"
              :class="{ 'text-yellow-400': isUserMenuActive, 'text-gray-500': !isUserMenuActive }">
          我的
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { useUserMenu } from '@/composables/useUserMenu'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { isUserMenuOpen, toggle } = useUserMenu()

// 判断是否在视频首页
const isVideoHome = computed(() => route.path === '/video')

// 判断用户菜单是否激活
const isUserMenuActive = computed(() => isUserMenuOpen.value)

// 处理我的按钮点击
const handleMyClick = () => {
  if (!authStore.isLoggedIn) {
    router.push('/login')
  } else {
    toggle()
  }
}
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
