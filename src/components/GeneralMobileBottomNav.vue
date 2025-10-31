<template>
  <div class="lg:hidden fixed bottom-0 left-0 right-0 z-40">
    <!-- Glassmorphism background with gradient border -->
    <div class="absolute inset-0 bg-gray-900/80 backdrop-blur-xl border-t border-white/10"></div>

    <!-- Gradient top border -->
    <div class="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>

    <!-- Navigation Items -->
    <div class="relative grid grid-cols-5 h-20 pb-safe">
      <!-- 导航 -->
      <router-link
        to="/"
        class="group flex flex-col items-center justify-center py-3 transition-all duration-300 relative"
        :class="{ 'text-pink-400': isActive('/'), 'text-gray-400': !isActive('/') }"
      >
        <!-- Active indicator -->
        <div v-if="isActive('/')"
             class="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent"></div>

        <!-- Icon container with glow effect -->
        <div class="relative">
          <svg class="w-7 h-7 transition-transform group-active:scale-95"
               :class="{ 'filter drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]': isActive('/') }"
               fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
        </div>
        <span class="text-xs mt-1.5 font-medium"
              :class="{ 'text-pink-400': isActive('/'), 'text-gray-500': !isActive('/') }">
          导航
        </span>
      </router-link>

      <!-- 视频 -->
      <router-link
        to="/video"
        class="group flex flex-col items-center justify-center py-3 transition-all duration-300 relative"
        :class="{ 'text-purple-400': isActive('/video'), 'text-gray-400': !isActive('/video') }"
      >
        <!-- Active indicator -->
        <div v-if="isActive('/video')"
             class="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent"></div>

        <div class="relative">
          <svg class="w-7 h-7 transition-transform group-active:scale-95"
               :class="{ 'filter drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]': isActive('/video') }"
               fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
        </div>
        <span class="text-xs mt-1.5 font-medium"
              :class="{ 'text-purple-400': isActive('/video'), 'text-gray-500': !isActive('/video') }">
          视频
        </span>
      </router-link>

      <!-- 漫画 -->
      <router-link
        to="/comic"
        class="group flex flex-col items-center justify-center py-3 transition-all duration-300 relative"
        :class="{ 'text-cyan-400': isActive('/comic'), 'text-gray-400': !isActive('/comic') }"
      >
        <!-- Active indicator -->
        <div v-if="isActive('/comic')"
             class="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent"></div>

        <div class="relative">
          <svg class="w-7 h-7 transition-transform group-active:scale-95"
               :class="{ 'filter drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]': isActive('/comic') }"
               fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
        </div>
        <span class="text-xs mt-1.5 font-medium"
              :class="{ 'text-cyan-400': isActive('/comic'), 'text-gray-500': !isActive('/comic') }">
          漫画
        </span>
      </router-link>

      <!-- 充值 -->
      <router-link
        to="/vip"
        class="group flex flex-col items-center justify-center py-3 transition-all duration-300 relative"
        :class="{ 'text-green-400': isActive('/vip'), 'text-gray-400': !isActive('/vip') }"
      >
        <!-- Active indicator -->
        <div v-if="isActive('/vip')"
             class="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent"></div>

        <div class="relative">
          <svg class="w-7 h-7 transition-transform group-active:scale-95"
               :class="{ 'filter drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]': isActive('/vip') }"
               fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
          </svg>
        </div>
        <span class="text-xs mt-1.5 font-medium"
              :class="{ 'text-green-400': isActive('/vip'), 'text-gray-500': !isActive('/vip') }">
          充值
        </span>
      </router-link>

      <!-- 我的 -->
      <button
        @click="handleMyClick"
        class="group flex flex-col items-center justify-center py-3 transition-all duration-300 relative cursor-pointer"
        :class="{ 'text-yellow-400': isActive('/profile'), 'text-gray-400': !isActive('/profile') }"
      >
        <!-- Active indicator -->
        <div v-if="isActive('/profile')"
             class="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent"></div>

        <div class="relative">
          <svg class="w-7 h-7 transition-transform group-active:scale-95"
               :class="{ 'filter drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]': isActive('/profile') }"
               fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
        </div>
        <span class="text-xs mt-1.5 font-medium"
              :class="{ 'text-yellow-400': isActive('/profile'), 'text-gray-500': !isActive('/profile') }">
          我的
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Check if a menu item is active
const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

// Handle "我的" click
const handleMyClick = () => {
  if (!authStore.isLoggedIn) {
    router.push('/login')
  } else {
    router.push('/profile')
  }
}
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
