<template>
  <div>
    <!-- Grid Layout -->
    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 relative">
      <!-- Loading overlay slot -->
      <slot name="loading-overlay"></slot>
      <router-link
        v-for="comic in displayedItems"
        :key="comic.id"
        :to="`/chapter/${comic.id}`"
        class="group block relative"
      >
        <!-- Gradient border effect on hover -->
        <div class="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-lg opacity-0 group-hover:opacity-50 blur-sm transition-opacity"></div>
        
        <!-- Main card with glassmorphism -->
        <div class="relative bg-gray-900/60 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden group-hover:border-pink-500/30 transition-all">
          <div class="relative aspect-[3/4] bg-gray-800/50">
            <img
              :src="getAlbumCover(comic.id)"
              :alt="comic.name"
              class="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
              loading="lazy"
              @error="handleImageError"
            />
            <!-- New Badge -->
            <div v-if="showNewBadge" class="absolute top-2 right-2">
              <span class="px-2 py-1 text-xs bg-red-600/70 backdrop-blur-sm border border-red-400/60 text-white font-medium rounded-full">
                新
              </span>
            </div>
            <!-- Category Label -->
            <div v-if="comic.category" class="absolute top-2 left-2">
              <span class="px-2 py-1 text-xs bg-pink-600/70 backdrop-blur-sm border border-pink-400/60 text-white font-medium rounded-full">
                {{ getCategoryLabel(comic.category) }}
              </span>
            </div>
          </div>
          <div class="p-2">
            <h3 class="text-xs sm:text-sm font-semibold text-white truncate">
              {{ comic.name }}
            </h3>
            <p class="text-xs text-gray-400 mt-0.5 truncate">
              {{ comic.author || '未知作者' }}
            </p>
            <div v-if="comic.update_at" class="text-xs text-gray-500 mt-1">
              {{ formatUpdateTime(comic.update_at) }}
            </div>
          </div>
        </div>
      </router-link>
    </div>
    
    <!-- Load More Button -->
    <div v-if="hasMore" class="flex justify-center mt-6">
      <button
        @click="loadMore"
        class="flex items-center gap-1 text-gray-400 hover:text-pink-500 transition-colors cursor-pointer"
      >
        <span>加载更多</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getImageServer } from '@/utils/imageServer'
import { handleImageError } from '@/utils/handleImageError'

const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => []
  },
  initialCount: {
    type: Number,
    default: 6
  },
  incrementCount: {
    type: Number,
    default: 6
  },
  showNewBadge: {
    type: Boolean,
    default: false
  }
})

const visibleCount = ref(props.initialCount)

const displayedItems = computed(() => {
  return props.items.slice(0, visibleCount.value)
})

const hasMore = computed(() => {
  return visibleCount.value < props.items.length
})

const loadMore = () => {
  visibleCount.value = Math.min(
    visibleCount.value + props.incrementCount,
    props.items.length
  )
}

const getAlbumCover = (id) => {
  const server = getImageServer()
  return `${server}/media/albums/${id}_3x4.jpg`
}

const getCategoryLabel = (category) => {
  if (typeof category === 'object') {
    return category.title || category.name || ''
  }
  return category || ''
}

const formatUpdateTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp * 1000)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)
  
  if (diff < 3600) {
    const minutes = Math.floor(diff / 60)
    return `${minutes}分钟前`
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600)
    return `${hours}小时前`
  } else if (diff < 2592000) {
    const days = Math.floor(diff / 86400)
    return `${days}天前`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}
</script>