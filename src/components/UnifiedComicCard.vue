<template>
  <router-link
    :to="`/chapter/${comic.id}`"
    class="block relative group"
  >
    <!-- Gradient border effect on hover -->
    <div class="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-lg opacity-0 group-hover:opacity-50 blur-sm transition-all duration-300"></div>
    
    <!-- Main card with glassmorphism -->
    <div class="relative bg-gray-900/60 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden group-hover:border-pink-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/20 flex flex-col">
      <!-- Cover Image Container -->
      <div class="relative aspect-[3/4] bg-gray-800/50 overflow-hidden flex-shrink-0">
        <img
          :src="getComicImage()"
          :alt="comic.name || comic.title"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          :loading="lazyLoad ? 'lazy' : 'eager'"
          @error="handleImageError"
        />
        
        <!-- Gradient overlay for better text visibility -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <!-- Category Badge -->
        <div v-if="showCategory && getCategory()" class="absolute top-1 left-1 sm:top-2 sm:left-2 z-10">
          <span class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs bg-pink-600/70 backdrop-blur-sm border border-pink-400/60 text-white font-medium rounded-full shadow-lg">
            {{ getCategory() }}
          </span>
        </div>
        
        <!-- Episode Badge (for updates/latest) -->
        <div v-if="showEpisode && comic.episode" class="absolute top-1 right-1 sm:top-2 sm:right-2 z-10">
          <span class="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs bg-blue-600/70 backdrop-blur-sm border border-blue-400/60 text-white font-medium rounded-full shadow-lg">
            {{ comic.episode }}话
          </span>
        </div>
        
        <!-- Stats Overlay -->
        <div v-if="showStats && (comic.watched || comic.liked)" class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1 sm:p-2">
          <div class="flex items-center justify-between text-white text-[10px] sm:text-xs">
            <span v-if="comic.watched" class="flex items-center gap-0.5 sm:gap-1">
              <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
              </svg>
              {{ formatNumber(comic.watched) }}
            </span>
            <span v-if="comic.liked" class="flex items-center gap-0.5 sm:gap-1">
              <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
              </svg>
              {{ formatNumber(comic.liked) }}
            </span>
          </div>
        </div>
        
        <!-- Update Date Badge (for updates page) -->
        <div v-if="showUpdateDate && comic.datetime_updated" class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1 sm:p-2">
          <div class="text-white text-[10px] sm:text-xs text-center">
            {{ formatUpdateDate(comic.datetime_updated) }}
          </div>
        </div>
      </div>
      
      <!-- Comic Info -->
      <div class="p-1.5 sm:p-2 md:p-3 flex flex-col">
        <!-- Title - always takes 2 lines space -->
        <h3 class="text-xs sm:text-sm font-semibold text-white line-clamp-1 group-hover:text-pink-400 transition-colors truncate">
          {{ comic.name || comic.title || 'Unknown' }}
        </h3>
        
        <!-- Author or Collection Date - always present -->
        <p class="text-[10px] sm:text-xs text-gray-400 mt-0.5 truncate min-h-[1rem]">
          <template v-if="showCollectionDate && comic.created_at">
            收藏于 {{ formatDate(comic.created_at) }}
          </template>
          <template v-else-if="showAuthor">
            {{ getAuthor() || 'N/A' }}
          </template>
          <template v-else>
            &nbsp;
          </template>
        </p>
        
        <!-- Description (for certain views) - always takes space when enabled -->
        <p v-if="showDescription" class="text-[10px] sm:text-xs text-gray-500 mt-1 line-clamp-2 hidden sm:block min-h-[2rem]">
          {{ comic.description ? stripHtml(comic.description) : 'N/A' }}
        </p>
        
        <!-- Tags - always takes space when enabled -->
        <div v-if="showTags" class="hidden sm:flex flex-wrap gap-1 mt-1 min-h-[1.25rem]">
          <span
            v-for="tag in (comic.tags && comic.tags.length ? comic.tags.slice(0, 2) : ['N/A'])"
            :key="tag"
            class="px-1.5 py-0.5 text-[10px] bg-gray-800/70 backdrop-blur-sm border border-white/10 text-gray-300 rounded-full"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { formatNumber } from '@/utils/format'
import { getImageServer } from '@/utils/imageServer'

const props = defineProps({
  comic: {
    type: Object,
    required: true
  },
  // Display options
  showCategory: {
    type: Boolean,
    default: true
  },
  showEpisode: {
    type: Boolean,
    default: false
  },
  showStats: {
    type: Boolean,
    default: true
  },
  showAuthor: {
    type: Boolean,
    default: true
  },
  showDescription: {
    type: Boolean,
    default: false
  },
  showTags: {
    type: Boolean,
    default: false
  },
  showCollectionDate: {
    type: Boolean,
    default: false
  },
  showUpdateDate: {
    type: Boolean,
    default: false
  },
  lazyLoad: {
    type: Boolean,
    default: true
  }
})

const getComicImage = () => {
  // If image URL is provided directly, use it
  if (props.comic.image) {
    return props.comic.image
  }
  // Otherwise, construct the standard album cover URL
  const server = getImageServer()
  return `${server}/media/albums/${props.comic.id}_3x4.jpg`
}

const handleImageError = (e) => {
  e.target.src = '/default.jpeg'
}

const getCategory = () => {
  if (!props.comic.category) return ''
  if (typeof props.comic.category === 'object') {
    return props.comic.category.title || props.comic.category.name || ''
  }
  return props.comic.category
}

const getAuthor = () => {
  if (props.comic.author) {
    return Array.isArray(props.comic.author) ? props.comic.author.join(', ') : props.comic.author
  }
  if (props.comic.authors) {
    return Array.isArray(props.comic.authors) ? props.comic.authors.join(', ') : props.comic.authors
  }
  return ''
}

const stripHtml = (html) => {
  const tmp = document.createElement('DIV')
  tmp.innerHTML = html || ''
  return tmp.textContent || tmp.innerText || ''
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now - date
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) {
    return '今天'
  } else if (diffInDays === 1) {
    return '昨天'
  } else if (diffInDays < 7) {
    return `${diffInDays}天前`
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    return `${weeks}周前`
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30)
    return `${months}个月前`
  } else {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }
}

const formatUpdateDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now - date
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInHours < 1) {
    return '刚刚更新'
  } else if (diffInHours < 24) {
    return `${diffInHours}小时前`
  } else if (diffInDays === 1) {
    return '昨天'
  } else if (diffInDays < 7) {
    return `${diffInDays}天前`
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }
}
</script>

<style scoped>
/* Line clamp utilities */
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>