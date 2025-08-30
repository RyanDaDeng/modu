<template>
  <transition name="fade-slide">
    <button
      v-if="showButton"
      @click="scrollToTop"
      class="fixed bottom-20 sm:bottom-6 right-4 z-40 group cursor-pointer"
      aria-label="返回顶部"
    >
      <!-- Glassmorphism background with gradient border -->
      <div class="relative">
        <!-- Gradient border effect -->
        <div class="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition-opacity"></div>
        
        <!-- Main button -->
        <div class="relative p-3 bg-gray-900/80 backdrop-blur-xl rounded-full border border-white/10 group-hover:bg-gray-800/90 transition-transform duration-300 group-hover:scale-110">
          <!-- Arrow icon with gradient -->
          <svg
            class="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
          
          <!-- Pulse effect on hover -->
          <div class="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
        </div>
      </div>
      
      <!-- Tooltip on hover -->
      <div class="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900/90 backdrop-blur-sm text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        返回顶部
      </div>
    </button>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showButton = ref(false)

const handleScroll = () => {
  // Show button when scrolled down 300px
  showButton.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // Check initial scroll position
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}
</style>