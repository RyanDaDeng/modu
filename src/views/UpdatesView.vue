<template>
  <AppLayout title="更新">
    <div class="container mx-auto px-4 py-6">
      
      <!-- Mobile Filter Bar -->
      <div class="sm:hidden mb-4">
        <div class="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl p-[1px]">
          <div class="bg-gray-900/90 backdrop-blur-xl rounded-xl p-3">
            <!-- Main filter button with better visual cues -->
            <button 
              @click="showFilterModal = true"
              class="w-full mb-3 relative group"
            >
              <!-- Animated gradient background -->
              <div class="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl blur group-active:blur-xl transition-all"></div>
              
              <!-- Button content -->
              <div class="relative flex items-center justify-between bg-gray-800/90 backdrop-blur rounded-xl px-4 py-3 border border-gray-700 group-hover:border-pink-500/50 group-active:scale-[0.98] transition-all">
                <div class="flex items-center gap-3">
                  <!-- Animated filter icon -->
                  <div class="relative">
                    <svg class="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    <div class="absolute inset-0 bg-pink-400 blur-lg opacity-50 animate-pulse"></div>
                  </div>
                  
                  <div class="text-left">
                    <div class="text-xs text-gray-400 mb-0.5">当前筛选</div>
                    <div class="text-sm font-medium text-white">
                      {{ typeTabs.find(t => t.value === selectedType)?.label }} · {{ weekdayTabs.find(d => d.value === selectedDate)?.label }}
                    </div>
                  </div>
                </div>
                
                <!-- Action indicator -->
                <div class="flex items-center gap-2">
                  <span class="text-xs text-pink-400 font-medium">点击修改</span>
                  <div class="bg-pink-500/20 rounded-lg p-1.5 group-hover:bg-pink-500/30 transition-colors">
                    <svg class="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>
            
            <!-- Quick select buttons for current week -->
            <div class="flex gap-2 overflow-x-auto pb-1">
              <button
              v-for="day in quickDayTabs"
              :key="day.value"
              @click="selectDate(day.value)"
              :class="[
                'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                selectedDate === day.value
                  ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50'
                  : day.value === currentWeekday
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                  : 'bg-gray-800 text-gray-400 border border-gray-700'
              ]"
            >
              {{ day.label }}
              <span v-if="day.value === currentWeekday" class="ml-1">(今)</span>
            </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Desktop Tab Navigation -->
      <div class="hidden sm:block relative mb-4">
        <!-- Gradient border effect -->
        <div class="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 rounded-lg blur-xl"></div>
        <div class="relative bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-lg p-4">
          <!-- Type Tabs -->
          <div class="flex gap-2 mb-4">
            <button
              v-for="tab in typeTabs"
              :key="tab.value"
              @click="selectType(tab.value)"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                selectedType === tab.value
                  ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
          
          <!-- Weekday Tabs -->
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="day in weekdayTabs"
              :key="day.value"
              @click="selectDate(day.value)"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                selectedDate === day.value
                  ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50'
                  : day.value === currentWeekday
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700'
              ]"
            >
              {{ day.label }}
              <span v-if="day.value === currentWeekday" class="ml-1 text-xs">
                (今日)
              </span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mobile Filter Drawer -->
      <BottomDrawer 
        v-model="showFilterModal"
        title="选择筛选条件"
      >
        <!-- Type Selection -->
        <div class="px-4 pb-4">
          <div class="text-sm text-gray-400 mb-3">类型</div>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="tab in typeTabs"
              :key="tab.value"
              @click="selectTypeAndClose(tab.value)"
              :class="[
                'py-3 rounded-lg text-sm font-medium transition-colors',
                selectedType === tab.value
                  ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50'
                  : 'bg-gray-800 text-gray-300 border border-gray-700'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
        
        <!-- Weekday Selection -->
        <div class="px-4 pb-6">
          <div class="text-sm text-gray-400 mb-3">更新日期</div>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="day in weekdayTabs"
              :key="day.value"
              @click="selectDateAndClose(day.value)"
              :class="[
                'py-3 rounded-lg text-sm font-medium transition-colors relative',
                selectedDate === day.value
                  ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50'
                  : day.value === currentWeekday
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                  : 'bg-gray-800 text-gray-300 border border-gray-700',
                day.value === 0 ? 'col-span-4' : ''
              ]"
            >
              {{ day.label }}
              <span v-if="day.value === currentWeekday" class="ml-1 text-xs">(今)</span>
            </button>
          </div>
        </div>
      </BottomDrawer>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner />
      </div>
      
      <!-- Comics Grid -->
      <div v-else-if="comics.length > 0">
        <h2 class="text-lg sm:text-xl font-semibold text-white mb-3">
          {{ weekdayTabs.find(d => d.value === selectedDate)?.label }}更新
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-3 md:gap-4">
          <ComicCard
            v-for="comic in comics"
            :key="comic.id"
            :comic="formatComic(comic)"
          />
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="!loading" class="text-center py-12">
        <p class="text-gray-400">暂无更新</p>
      </div>
      
    </div>
  </AppLayout>
</template>

<script>
export default {
  name: 'UpdatesView'
}
</script>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getSerialization } from '@/api/request'
import ComicCard from '@/components/ComicCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import AppLayout from '@/components/AppLayout.vue'
import BottomDrawer from '@/components/BottomDrawer.vue'

// Type tabs
const typeTabs = [
  { label: '全部', value: 'all' },
  { label: '日漫', value: 'manga' },
  { label: '韩漫', value: 'hanman' }
]

// Weekday tabs
const weekdayTabs = [
  { label: '周一', value: 1 },
  { label: '周二', value: 2 },
  { label: '周三', value: 3 },
  { label: '周四', value: 4 },
  { label: '周五', value: 5 },
  { label: '周六', value: 6 },
  { label: '周日', value: 7 },
  { label: '已完结', value: 0 }
]

// Current weekday (1-7, 0 for Sunday -> convert to 7)
const currentWeekday = computed(() => {
  const day = new Date().getDay()
  return day === 0 ? 7 : day
})

// States
const selectedType = ref('all')
const selectedDate = ref(currentWeekday.value)
const comics = ref([])
const loading = ref(false)
const showFilterModal = ref(false)

// Quick day tabs for mobile (shows nearby days)
const quickDayTabs = computed(() => {
  const today = currentWeekday.value
  const days = []
  
  // Add previous day, today, and next 2 days
  for (let i = -1; i <= 2; i++) {
    let dayValue = today + i
    if (dayValue <= 0) dayValue = 7 + dayValue
    if (dayValue > 7) dayValue = dayValue - 7
    
    const dayTab = weekdayTabs.find(d => d.value === dayValue)
    if (dayTab) days.push(dayTab)
  }
  
  // Add completed option
  days.push({ label: '完结', value: 0 })
  
  return days
})

// Format comic data to match ComicCard expectations
const formatComic = (comic) => {
  // Handle image URL - if it's a relative path, don't set it (let ComicCard handle it)
  // If it's empty or just a path, let ComicCard use the default URL construction
  let imageUrl = null
  if (comic.image && comic.image.startsWith('/media/')) {
    // Don't set image, let ComicCard construct the URL using comic.id
    imageUrl = null
  } else if (comic.image && comic.image.startsWith('http')) {
    // Full URL provided
    imageUrl = comic.image
  }
  
  return {
    id: comic.id,
    name: comic.name,
    title: comic.name,
    author: comic.author,
    image: imageUrl, // Let ComicCard handle the image URL construction
    category: comic.category?.title || '',
    description: comic.description,
    watched: comic.liked ? 1 : 0,
    liked: comic.liked ? 1 : 0,
    tags: []
  }
}

// Load comics
const loadComics = async () => {
  if (loading.value) return
  
  loading.value = true
  comics.value = []
  
  try {
    const data = await getSerialization(
      selectedType.value,
      selectedDate.value,
      1 // Always page 1 since we load all data at once
    )
    
    if (data?.list) {
      comics.value = data.list
    }
  } catch (error) {
    console.error('Failed to load comics:', error)
  } finally {
    loading.value = false
  }
}

// Select type
const selectType = (type) => {
  selectedType.value = type
  loadComics()
}

// Select date
const selectDate = (date) => {
  selectedDate.value = date
  loadComics()
}

// Select type and close modal (for mobile)
const selectTypeAndClose = (type) => {
  selectedType.value = type
  showFilterModal.value = false
  loadComics()
}

// Select date and close modal (for mobile)
const selectDateAndClose = (date) => {
  selectedDate.value = date
  showFilterModal.value = false
  loadComics()
}

onMounted(() => {
  loadComics()
})
</script>

<style scoped>
/* Remove scrollbar for quick select buttons */
.overflow-x-auto {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.overflow-x-auto::-webkit-scrollbar {
  display: none;
}
</style>