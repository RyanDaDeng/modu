<template>
  <div class="relative w-full">
    <!-- Slider Container -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 h-full">
      <!-- Slides -->
      <div 
        class="flex transition-transform duration-500 ease-in-out" 
        :style="`transform: translateX(-${currentIndex * 100}%)`"
      >
        <div 
          v-for="item in items"
          :key="item.id"
          class="w-full flex-shrink-0"
        >
          <router-link
            :to="`/chapter/${item.id}`"
            class="block"
          >
            <!-- Mobile Layout -->
            <div class="sm:hidden relative">
              <div class="p-4 flex gap-4">
                <!-- Mobile Cover -->
                <div class="w-28 flex-shrink-0">
                  <div class="relative">
                    <!-- Book shadow effect -->
                    <div class="absolute inset-0 bg-black/20 rounded-lg transform translate-x-1 translate-y-1"></div>
                    <div class="relative aspect-[3/4] rounded-lg overflow-hidden">
                      <img
                        :src="item.coverImage"
                        :alt="item.name"
                        class="w-full h-full object-cover"
                        @error="handleImageError"
                      />
                      <!-- Category badge on cover -->
                      <div class="absolute top-2 right-0 bg-pink-500 text-white text-[10px] px-2 py-1 rounded-l-full">
                        {{ item.category }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Mobile Info -->
                <div class="flex-1 py-2 min-w-0">
                  <h3 class="text-white font-bold text-base truncate mb-2">
                    {{ item.name }}
                  </h3>
                  <p class="text-gray-400 text-xs mb-3">
                    作者: {{ item.author }}
                  </p>
                  <p class="text-gray-500 text-xs line-clamp-2 mb-3">
                    {{ item.description }}
                  </p>
                  <div class="flex items-center gap-3 text-xs mb-3">
                    <span class="flex items-center gap-1 text-blue-400">
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                      </svg>
                      {{ formatNumber(item.views) }}万
                    </span>
                    <span class="flex items-center gap-1 text-pink-400">
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                      </svg>
                      {{ formatNumber(item.likes || 43.5) }}万
                    </span>
                  </div>
                  <button class="px-6 py-2 bg-pink-500 text-white text-sm rounded-full font-medium">
                    立即阅读
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Desktop Layout -->
            <div class="hidden sm:block">
              <div class="px-6 py-5 flex items-center gap-6">
                <!-- Cover with 3D effect -->
                <div class="flex-shrink-0">
                  <div class="relative group">
                    <!-- Book shadow -->
                    <div class="absolute inset-0 bg-black/20 rounded-lg transform translate-x-1 translate-y-1"></div>
                    
                    <!-- Main cover - w-44 gives us ~176px width, aspect 3:4 gives ~235px height -->
                    <div class="relative w-44 aspect-[3/4] rounded-lg overflow-hidden">
                      <img
                        :src="item.coverImage"
                        :alt="item.name"
                        class="w-full h-full object-cover"
                        @error="handleImageError"
                      />
                      
                      <!-- Category Badge -->
                      <div class="absolute top-2 left-2">
                        <span class="px-2 py-0.5 bg-pink-500 text-white text-[10px] font-medium rounded">
                          {{ item.category }}
                        </span>
                      </div>
                      
                      <!-- Hot Badge -->
                      <div class="absolute top-2 right-0">
                        <span class="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-l">
                          HOT
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <!-- Title -->
                  <h2 class="text-xl font-bold text-white mb-2 truncate">
                    {{ item.name }}
                  </h2>
                  
                  <!-- Author -->
                  <p class="text-gray-400 text-sm mb-3 truncate">
                    作者: {{ item.author }}
                  </p>
                  
                  <!-- Description -->
                  <p class="text-gray-500 text-sm line-clamp-3 mb-4">
                    {{ item.description || '精彩内容等你发现...' }}
                  </p>
                  
                  <!-- Stats -->
                  <div class="flex items-center gap-5 mb-4">
                    <span class="flex items-center gap-1.5 text-sm">
                      <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                      </svg>
                      <span class="text-white font-medium">{{ formatNumber(item.views) }}万</span>
                    </span>
                    
                    <span class="flex items-center gap-1.5 text-sm">
                      <svg class="w-5 h-5 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                      </svg>
                      <span class="text-white font-medium">{{ formatNumber(item.likes || 43.5) }}万</span>
                    </span>
                    
                    <span class="text-green-400 text-sm font-medium">最近更新</span>
                  </div>
                  
                  <!-- Button -->
                  <button class="px-8 py-2.5 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-full transition-colors inline-flex items-center gap-2">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
                    </svg>
                    立即阅读
                  </button>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
      
      <!-- Navigation Dots -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        <button
          v-for="(_, index) in items"
          :key="`dot-${index}`"
          @click="goToSlide(index)"
          class="h-2 transition-all duration-300"
          :class="index === currentIndex 
            ? 'w-8 bg-pink-500 rounded-full' 
            : 'w-2 bg-gray-600 rounded-full hover:bg-gray-500'"
        />
      </div>
      
      <!-- Arrow Navigation -->
      <button
        @click="prevSlide"
        class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-all group"
      >
        <svg class="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <button
        @click="nextSlide"
        class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full transition-all group"
      >
        <svg class="w-6 h-6 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => []
  },
  autoPlay: {
    type: Boolean,
    default: true
  },
  interval: {
    type: Number,
    default: 5000
  }
})

const currentIndex = ref(0)
let autoPlayTimer = null

const formatNumber = (num) => {
  if (!num) return '0'
  if (num >= 10000) {
    return (num / 10000).toFixed(1)
  }
  return (num / 1000).toFixed(1)
}

const handleImageError = (e) => {
  e.target.src = '/placeholder.jpg'
}

const nextSlide = () => {
  if (props.items.length > 0) {
    currentIndex.value = (currentIndex.value + 1) % props.items.length
  }
}

const prevSlide = () => {
  if (props.items.length > 0) {
    currentIndex.value = currentIndex.value === 0 
      ? props.items.length - 1 
      : currentIndex.value - 1
  }
}

const goToSlide = (index) => {
  currentIndex.value = index
  resetAutoPlay()
}

const startAutoPlay = () => {
  if (props.autoPlay && props.items.length > 1) {
    autoPlayTimer = setInterval(nextSlide, props.interval)
  }
}

const stopAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

const resetAutoPlay = () => {
  stopAutoPlay()
  startAutoPlay()
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>
/* Smooth animations */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>