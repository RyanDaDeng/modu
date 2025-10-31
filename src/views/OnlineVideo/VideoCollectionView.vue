<template>
  <VideoLayout title="我的收藏">
    <div class="container mx-auto px-4 py-6">
      <!-- Header with count -->
      <div class="mb-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-white mb-2">我的视频收藏</h1>
            <p class="text-gray-400">
              共 <span class="text-pink-500 font-medium">{{ totalCollections }}</span> 个视频
            </p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-20">
        <LoadingSpinner />
      </div>

      <div v-else-if="!collections.length" class="text-center py-12">
        <svg class="w-24 h-24 text-gray-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <p class="text-gray-400 mb-4">还没有收藏任何视频</p>
        <router-link
          to="/video"
          class="inline-block px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-lg transition-all cursor-pointer shadow-lg hover:shadow-xl"
        >
          去看看在线视频
        </router-link>
      </div>

      <div v-else>
        <!-- Collection Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <div
            v-for="video in collections"
            :key="video.video_id || video.id"
            class="relative group"
            @click.stop
          >
            <!-- Card wrapper -->
            <div class="relative">
              <!-- Video Card -->
              <router-link
                :to="`/video/${video.video_id}`"
                class="block relative"
              >
                <!-- Gradient border effect on hover -->
                <div class="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-lg opacity-0 group-hover:opacity-50 blur-sm transition-opacity"></div>

                <!-- Main card -->
                <div class="relative bg-gray-900/60 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden group-hover:border-pink-500/30 transition-all">
                  <!-- 视频封面 -->
                  <div class="relative overflow-hidden bg-gray-800/50 aspect-video">
                    <img
                      :src="getCoverUrl(video.cover)"
                      :alt="video.name"
                      class="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                      @error="handleImageError"
                      loading="lazy"
                    />

                    <!-- 播放图标覆盖层 -->
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div class="w-12 h-12 sm:w-14 sm:h-14 bg-black/60 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <!-- 视频信息 -->
                  <div class="p-1.5 sm:p-2">
                    <h3 class="text-xs sm:text-sm font-semibold text-white line-clamp-2 mb-1.5 h-8 sm:h-10">
                      {{ video.name }}
                    </h3>

                    <div class="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-400">
                      <span class="truncate">{{ formatTime(video.created_at) }}</span>
                    </div>
                  </div>
                </div>
              </router-link>

              <!-- Remove Button -->
              <button
                type="button"
                @click.stop.prevent="handleRemoveClick(video)"
                class="absolute top-2 right-2 p-2 bg-red-600 sm:bg-gray-900/90 hover:bg-red-600 text-white rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 shadow-lg z-50 cursor-pointer"
                title="移除收藏"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="mt-8">
          <Pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            @change="handlePageChange"
          />
        </div>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <ConfirmationDialog
      v-model="showRemoveConfirm"
      :title="'移除收藏'"
      :message="`确定要移除《${videoToRemove?.name || ''}》吗？`"
      confirm-text="移除"
      cancel-text="取消"
      confirm-button-class="bg-red-600 hover:bg-red-700 text-white"
      @confirm="confirmRemove"
      @cancel="cancelRemove"
    />
  </VideoLayout>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getVideoCollections, toggleVideoCollection } from '@/api/videoCollection'
import { getVideoSettings } from '@/api/video'
import { useNotification } from '@/composables/useNotification'
import VideoLayout from '@/components/onlinevideo/VideoLayout.vue'
import Pagination from '@/components/Pagination.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'

const router = useRouter()
const authStore = useAuthStore()
const notification = useNotification()

// Data
const collections = ref([])
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const totalCollections = ref(0)
const perPage = 24
const cdnDomain = ref('')

// Confirmation dialog
const showRemoveConfirm = ref(false)
const videoToRemove = ref(null)

// Get CDN domain
const fetchCdnDomain = async () => {
  try {
    const response = await getVideoSettings()
    const data = response.data || response
    if (data.cdn_domain) {
      cdnDomain.value = data.cdn_domain
    }
  } catch (error) {
    console.error('获取 CDN 域名失败:', error)
  }
}

// Get full cover URL
const getCoverUrl = (cover) => {
  if (!cover || !cdnDomain.value) return cover || '/img_6.png'

  // If already a full URL, return it
  if (cover.startsWith('http://') || cover.startsWith('https://')) {
    return cover
  }

  // Concatenate CDN domain + cover
  return cdnDomain.value + cover
}

// Handle image error
const handleImageError = (e) => {
  e.target.src = '/img_6.png'
}

// Format time
const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  if (days < 30) return `${Math.floor(days / 7)}周前`
  if (days < 365) return `${Math.floor(days / 30)}月前`
  return `${Math.floor(days / 365)}年前`
}

// Methods
const loadCollections = async (page = 1) => {
  loading.value = true
  try {
    const response = await getVideoCollections(page, perPage)
    collections.value = response.data || []
    currentPage.value = response.current_page || 1
    totalPages.value = response.last_page || 1
    totalCollections.value = response.total || 0
  } catch (error) {
    console.error('Failed to load video collections:', error)
    notification.error('加载收藏列表失败')
  } finally {
    loading.value = false
  }
}

// Handle remove button click
const handleRemoveClick = (video) => {
  videoToRemove.value = video
  showRemoveConfirm.value = true
}

const confirmRemove = async () => {
  if (!videoToRemove.value) return

  const video = videoToRemove.value
  const videoId = video.video_id || video.id

  try {
    // Use toggle API - passing the video object
    const response = await toggleVideoCollection({
      id: videoId,
      vod_id: videoId,
      name: video.name,
      cover: video.cover || null
    })

    // Check if it was actually removed
    if (response.is_collected === false) {
      // Remove from local list
      const index = collections.value.findIndex(v => (v.video_id || v.id) === videoId)
      if (index > -1) {
        collections.value.splice(index, 1)
        totalCollections.value--
      }

      // Show success notification
      notification.success('已移除收藏')

      // If no more items and not on first page, go to previous page
      if (collections.value.length === 0 && currentPage.value > 1) {
        handlePageChange(currentPage.value - 1)
      }
    }

    showRemoveConfirm.value = false
    videoToRemove.value = null
  } catch (error) {
    console.error('Failed to toggle video collection:', error)
    notification.error(error.response?.data?.message || '移除失败，请稍后重试')
    showRemoveConfirm.value = false
    videoToRemove.value = null
  }
}

const cancelRemove = () => {
  showRemoveConfirm.value = false
  videoToRemove.value = null
}

const handlePageChange = (page) => {
  loadCollections(page)
  window.scrollTo(0, 0)
}

const checkLoginAndLoad = () => {
  // Check if user is logged in
  if (!authStore.isAuthenticated) {
    router.push({
      path: '/login',
      query: { redirect: '/video-collection' }
    })
    return
  }

  // Always reload collections when entering the page
  loadCollections()
}

onMounted(async () => {
  await fetchCdnDomain()
  checkLoginAndLoad()
})

// Reload collections when navigating back to this view
onActivated(() => {
  checkLoginAndLoad()
})
</script>
