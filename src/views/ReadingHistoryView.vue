<template>
  <AppLayout title="阅读历史">
    <div class="container mx-auto px-4 py-6">
      <!-- Header with count -->
      <div class="mb-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-white mb-2">阅读历史</h1>
            <p class="text-gray-400">
              共 <span class="text-pink-500 font-medium">{{ historyItems.length }}</span> 条记录
            </p>
          </div>
          <button 
            v-if="historyItems.length > 0"
            @click="clearAllHistory"
            class="text-sm text-gray-400 hover:text-red-400 transition-colors cursor-pointer flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            清空历史
          </button>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="historyItems.length === 0 && !loading" class="text-center py-16">
        <svg class="w-24 h-24 text-gray-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.669 0-3.218.51-4.5 1.385V4.804z" />
        </svg>
        <h3 class="text-lg font-medium text-white mb-2">暂无阅读历史</h3>
        <p class="text-gray-400 mb-6">您还没有阅读过任何漫画</p>
        <router-link 
          to="/" 
          class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 cursor-pointer"
        >
          去探索漫画
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-else-if="loading" class="flex justify-center py-12">
        <LoadingSpinner />
      </div>

      <!-- History Grid -->
      <div v-else>

        <!-- History Cards Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <div 
            v-for="item in historyItems" 
            :key="item.comicId"
            class="relative group"
          >
            <!-- Use UnifiedComicCard with custom overlay -->
            <div class="relative">
              <UnifiedComicCard
                :comic="formatComicForCard(item)"
                :show-category="false"
                :show-episode="false"
                :show-stats="false"
                :show-author="false"
                :show-description="false"
                :show-tags="false"
              />
              
              <!-- Custom Overlay for Reading History -->
              <div class="absolute inset-0 pointer-events-none rounded-lg overflow-hidden">
                <!-- Continue Reading Badge -->
                <div class="absolute top-2 left-2 z-20 pointer-events-auto">
                  <span class="inline-flex items-center px-2 py-1 text-xs font-bold bg-gradient-to-r from-pink-500/80 to-purple-600/80 backdrop-blur-sm text-white rounded-full shadow-lg border border-pink-400/30">
                    继续阅读
                  </span>
                </div>
                
                <!-- Delete Button -->
                <button
                  @click.stop="removeItem(item.comicId)"
                  class="absolute top-2 right-2 z-20 p-1.5 bg-red-600/80 sm:bg-gray-900/80 hover:bg-red-600/90 rounded-full sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm cursor-pointer shadow-lg pointer-events-auto"
                  title="删除记录"
                >
                  <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <!-- Chapter Progress Badge -->
                <div class="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2 pointer-events-auto">
                  <!-- Chapter Badge -->
                  <span class="inline-flex items-center px-2 py-1 text-[10px] sm:text-xs font-medium bg-gray-900/70 backdrop-blur-sm border border-gray-600/50 text-gray-200 rounded-full">
                    <svg class="w-3 h-3 mr-1 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.669 0-3.218.51-4.5 1.385V4.804z" />
                    </svg>
                    <span class="truncate max-w-[100px]">{{ item.chapterTitle || '未知章节' }}</span>
                  </span>
                  
                  <!-- Time Badge -->
                  <span class="inline-flex items-center px-2 py-1 text-[10px] font-medium bg-gray-900/70 backdrop-blur-sm border border-gray-600/50 text-gray-300 rounded-full whitespace-nowrap">
                    {{ formatLastRead(item.lastRead) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import readingHistoryService from '@/services/readingHistory'
import AppLayout from '@/components/AppLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import UnifiedComicCard from '@/components/UnifiedComicCard.vue'
import { useNotification } from '@/composables/useNotification'

const router = useRouter()
const notification = useNotification()
const historyItems = ref([])
const loading = ref(true)

// Load reading history
const loadHistory = async () => {
  loading.value = true
  try {
    const history = await readingHistoryService.getAll()
    historyItems.value = history
  } catch (error) {
    console.error('Failed to load history:', error)
    notification.error('加载阅读历史失败')
  } finally {
    loading.value = false
  }
}

// Format comic data for UnifiedComicCard
const formatComicForCard = (item) => {
  return {
    id: item.comicId,
    name: item.comicTitle,
    title: item.comicTitle,
    image: item.coverImage,
    cover: item.coverImage
  }
}

// Format last read time
const formatLastRead = (dateString) => {
  return readingHistoryService.formatLastRead(dateString)
}

// Navigate to comic detail page
const goToComic = (comicId) => {
  router.push(`/chapter/${comicId}`)
}

// Navigate to specific chapter (continue reading)
const goToChapter = (item) => {
  // If we have chapter info, go directly to that chapter
  // Otherwise go to comic detail page
  if (item.chapterId) {
    router.push(`/chapter/${item.comicId}`)
  } else {
    router.push(`/chapter/${item.comicId}`)
  }
}

// Remove single item
const removeItem = async (comicId) => {
  try {
    await readingHistoryService.remove(comicId)
    historyItems.value = historyItems.value.filter(item => item.comicId !== comicId)
    notification.success('已删除阅读记录')
  } catch (error) {
    console.error('Failed to remove item:', error)
    notification.error('删除失败')
  }
}

// Clear all history
const clearAllHistory = async () => {
  if (!confirm('确定要清空所有阅读历史吗？此操作不可恢复。')) {
    return
  }
  
  try {
    await readingHistoryService.clearAll()
    historyItems.value = []
    notification.success('已清空所有阅读历史')
  } catch (error) {
    console.error('Failed to clear history:', error)
    notification.error('清空失败')
  }
}

// Handle image error
const handleImageError = (event) => {
  event.target.src = '/default.jpeg'
}

onMounted(() => {
  loadHistory()
})
</script>