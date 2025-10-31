<template>
  <VideoLayout title="我的收藏">
    <div class="container mx-auto px-4 py-6">
      <!-- Header with count -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-white mb-2">我的视频收藏</h1>
        <p class="text-gray-400">
          共 <span class="text-pink-500 font-medium">{{ totalCollections }}</span> 个视频
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-20">
        <LoadingSpinner />
      </div>

      <!-- Empty State -->
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

      <!-- Video Grid -->
      <div v-else>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <router-link
            v-for="video in collections"
            :key="video.video_id"
            :to="`/video/${video.video_id}`"
            class="block group"
          >
            <!-- Video Card -->
            <div class="relative bg-gray-900/60 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden group-hover:border-pink-500/30 transition-all">
              <!-- Cover Image -->
              <div class="relative overflow-hidden bg-gray-800/50 aspect-video">
                <img
                  :src="getCoverUrl(video.cover)"
                  :alt="video.name"
                  class="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                  @error="handleImageError"
                  loading="lazy"
                />

                <!-- Play Icon Overlay -->
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div class="w-12 h-12 sm:w-14 sm:h-14 bg-black/60 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Video Name -->
              <div class="p-2">
                <h3 class="text-xs sm:text-sm font-semibold text-white line-clamp-2 group-hover:text-pink-400 transition-colors">
                  {{ video.name }}
                </h3>
              </div>
            </div>
          </router-link>
        </div>

        <!-- Pagination - Always show even with 1 page -->
        <div class="mt-8">
          <Pagination
            :current-page="currentPage"
            :total-pages="Math.max(totalPages, 2)"
            @change="handlePageChange"
          />
        </div>
      </div>
    </div>
  </VideoLayout>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getVideoCollections } from '@/api/videoCollection'
import { getVideoSettings } from '@/api/video'
import { useNotification } from '@/composables/useNotification'
import VideoLayout from '@/components/onlinevideo/VideoLayout.vue'
import Pagination from '@/components/Pagination.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

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

// Load collections
const loadCollections = async (page = 1) => {
  loading.value = true
  try {
    const response = await getVideoCollections(page, perPage)
    collections.value = response.data || []
    currentPage.value = response.current_page || 1
    // Ensure totalPages is at least 1 even if there's no data
    totalPages.value = Math.max(response.last_page || 1, 1)
    totalCollections.value = response.total || 0
  } catch (error) {
    console.error('Failed to load video collections:', error)
    notification.error('加载收藏列表失败')
    // Set totalPages to 1 on error so pagination still shows
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

// Handle page change
const handlePageChange = (page) => {
  loadCollections(page)
  window.scrollTo(0, 0)
}

// Check login and load
const checkLoginAndLoad = () => {
  // Check if user is logged in
  if (!authStore.isAuthenticated) {
    router.push({
      path: '/login',
      query: { redirect: '/video/favorites' }
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
