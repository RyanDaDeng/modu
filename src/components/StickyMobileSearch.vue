<template>
  <transition
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-300 ease-in"
    enter-from-class="-translate-y-full opacity-0"
    leave-to-class="-translate-y-full opacity-0"
  >
    <div 
      v-if="isVisible"
      class="lg:hidden fixed top-0 left-0 right-0 z-50 pt-safe bg-gray-900/95 backdrop-blur-md border-b border-white/20"
    >
      <div class="container mx-auto px-4 py-2">
        <div class="relative group">
          <!-- Gradient border glow effect -->
          <div class="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
          
          <!-- Search input -->
          <input
            @click="handleSearchClick"
            @focus="handleSearchClick"
            type="text"
            placeholder="搜索漫画、作者..."
            class="relative w-full px-4 py-2.5 pl-10 bg-gray-800/80 backdrop-blur-sm border border-white/40 rounded-full text-white placeholder-gray-300 focus:outline-none focus:border-pink-500/70 focus:bg-gray-800/90 transition-all cursor-pointer"
            readonly
          />
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          <!-- Search button -->
          <button
            @click="handleSearchClick"
            class="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium text-sm rounded-full transition-all cursor-pointer shadow-lg"
          >
            搜索
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const emit = defineEmits(['search-click'])

const isVisible = ref(false)
let searchBarElement = null
let lastScrollY = 0

// Check if the main search bar is out of view
const checkSearchBarVisibility = () => {
  // Only show on mobile
  if (window.innerWidth >= 1024) {
    isVisible.value = false
    return
  }
  
  // Find the main search bar (MobileSearchBar component)
  if (!searchBarElement) {
    searchBarElement = document.querySelector('.mobile-search-bar')
  }
  
  if (searchBarElement) {
    const rect = searchBarElement.getBoundingClientRect()
    // Show sticky search when main search is above viewport
    isVisible.value = rect.bottom < 0
  } else {
    // If no main search bar found, check scroll position
    // Show after scrolling down 200px
    isVisible.value = window.scrollY > 200
  }
  
  lastScrollY = window.scrollY
}

const handleSearchClick = () => {
  emit('search-click')
}

onMounted(() => {
  window.addEventListener('scroll', checkSearchBarVisibility, { passive: true })
  window.addEventListener('resize', checkSearchBarVisibility, { passive: true })
  // Initial check
  checkSearchBarVisibility()
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkSearchBarVisibility)
  window.removeEventListener('resize', checkSearchBarVisibility)
})
</script>