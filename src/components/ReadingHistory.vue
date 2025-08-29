<template>
  <div v-if="historyItems.length > 0" class="mb-8">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-bold text-white flex items-center">
        <svg class="w-5 h-5 mr-2 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
        上次阅读
      </h2>
      <button 
        @click="clearHistory"
        class="text-sm text-gray-400 hover:text-pink-500 transition-colors"
      >
        清除历史
      </button>
    </div>
    
    <!-- History Slider -->
    <HorizontalSlider>
      <div 
        v-for="item in historyItems" 
        :key="item.comicId"
        class="flex-shrink-0 w-36 sm:w-40 group"
      >
        <div class="relative overflow-hidden rounded-lg">
          <!-- Comic Cover (clickable) -->
          <img 
            :src="item.coverImage" 
            :alt="item.comicTitle"
            @click="goToComic(item.comicId)"
            class="w-full h-48 sm:h-52 object-cover cursor-pointer"
            @error="handleImageError"
          />
          
          <!-- Progress Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div class="absolute bottom-0 left-0 right-0 p-3">
              <div class="text-xs text-pink-400 font-semibold">
                {{ item.chapterTitle }}
              </div>
            </div>
          </div>
          
          <!-- Delete Button (top left) - Always visible on mobile -->
          <button
            @click.stop="removeItem(item.comicId)"
            class="absolute top-2 left-2 p-1.5 bg-red-600/80 sm:bg-gray-900/80 hover:bg-red-700 sm:hover:bg-red-600/90 rounded-full sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm cursor-pointer shadow-lg"
            title="删除记录"
          >
            <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <!-- Last Read Badge -->
          <div class="absolute top-2 right-2">
            <span class="inline-flex items-center px-2 py-1 text-xs font-bold bg-pink-500/90 text-white rounded-full backdrop-blur-sm">
              继续
            </span>
          </div>
        </div>
        
        <!-- Comic Info (clickable) -->
        <div class="mt-2" @click="goToComic(item.comicId)" style="cursor: pointer;">
          <h3 class="text-white font-semibold text-sm line-clamp-1 group-hover:text-pink-400 transition-colors">
            {{ item.comicTitle }}
          </h3>
          <div class="flex items-center justify-between mt-1">
            <span class="text-xs text-gray-500">
              {{ formatLastRead(item.lastRead) }}
            </span>
            <span class="text-xs text-pink-400">
              {{ item.chapterTitle }}
            </span>
          </div>
        </div>
      </div>
    </HorizontalSlider>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import readingHistoryService from '@/services/readingHistory'
import HorizontalSlider from '@/components/HorizontalSlider.vue'

const router = useRouter()
const historyItems = ref([])

// Load reading history
const loadHistory = async () => {
  const history = await readingHistoryService.getAll()
  historyItems.value = history
}

// Format last read time
const formatLastRead = (dateString) => {
  return readingHistoryService.formatLastRead(dateString)
}

// Navigate to comic
const goToComic = (comicId) => {
  router.push(`/chapter/${comicId}`)
}

// Remove single item
const removeItem = async (comicId) => {
  await readingHistoryService.remove(comicId)
  historyItems.value = historyItems.value.filter(item => item.comicId !== comicId)
}

// Clear all history
const clearHistory = async () => {
  if (confirm('确定要清除所有阅读历史吗？')) {
    await readingHistoryService.clearAll()
    historyItems.value = []
  }
}

// Handle image error
const handleImageError = (event) => {
  event.target.src = '/placeholder.png'
}

onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>