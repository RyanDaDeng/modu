<template>
  <VideoLayout
    title="视频搜索"
    :breadcrumbs="breadcrumbs"
    :show-top-nav="true"
  >
    <div class="container mx-auto px-4 py-6 space-y-6">
      <!-- 搜索框 -->
      <div class="max-w-2xl mx-auto">
        <div class="relative">
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="搜索视频..."
            class="w-full px-4 py-3 pr-24 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            v-if="currentSearchQuery"
            @click="clearSearch"
            class="absolute right-20 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </button>
          <button
            @click="handleSearch"
            class="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-pink-500 hover:bg-pink-600 text-white rounded-md transition-colors"
          >
            搜索
          </button>
        </div>
      </div>

      <!-- 搜索结果 -->
      <div v-if="hasSearched">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          搜索结果: "{{ currentSearchQuery }}"
          <span v-if="!loading && videos.length > 0" class="text-sm text-gray-500 dark:text-gray-400 ml-2">
            (共 {{ pagination.total }} 个结果)
          </span>
        </h2>

        <!-- 顶部分页 -->
        <div v-if="videos.length > 0 && pagination.total > 0" class="flex justify-center mb-6">
          <Pagination
            :current-page="pagination.currentPage"
            :total-pages="pagination.lastPage"
            @change="handlePageChange"
          />
        </div>

        <VideoGrid
          :videos="videos"
          :loading="loading"
          :empty-message="`没有找到「${currentSearchQuery}」相关的视频`"
          :cdn-domain="cdnDomain"
        />

        <!-- 底部分页 -->
        <div v-if="videos.length > 0 && pagination.total > 0" class="flex justify-center mt-8">
          <Pagination
            :current-page="pagination.currentPage"
            :total-pages="pagination.lastPage"
            @change="handlePageChange"
          />
        </div>
      </div>

      <!-- 热门推荐 - 未搜索或无结果时显示 -->
      <div v-if="!hasSearched || (!loading && !videos.length)">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {{ hasSearched ? '试试这些热门视频' : '热门推荐' }}
        </h2>
        <VideoRecommendationSlider :cdn-domain="cdnDomain" />
      </div>
    </div>
  </VideoLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getVideos, getVideoSettings } from '@/api/video'
import VideoLayout from '@/components/onlinevideo/VideoLayout.vue'
import VideoGrid from '@/components/onlinevideo/VideoGrid.vue'
import VideoRecommendationSlider from '@/components/onlinevideo/VideoRecommendationSlider.vue'
import Pagination from '@/components/Pagination.vue'

const route = useRoute()
const router = useRouter()

const videos = ref([])
const cdnDomain = ref('')
const loading = ref(false)
const searchQuery = ref('')
const currentSearchQuery = ref('')
const hasSearched = ref(false)

// 分页信息
const pagination = ref({
  currentPage: 1,
  perPage: 30,
  total: 0,
  lastPage: 1
})

// 面包屑
const breadcrumbs = computed(() => {
  if (currentSearchQuery.value) {
    return [{ name: `搜索: ${currentSearchQuery.value}`, path: null }]
  }
  return [{ name: '搜索', path: null }]
})

// 获取 CDN 域名
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

// 搜索视频
const searchVideos = async (text, page = 1) => {
  loading.value = true

  try {
    const params = {
      text,
      page,
      per_page: pagination.value.perPage
    }

    const response = await getVideos(params)
    const apiData = response.data || response

    videos.value = apiData.data || []
    pagination.value = {
      currentPage: apiData.current_page || 1,
      perPage: apiData.per_page || 30,
      total: apiData.total || 0,
      lastPage: apiData.last_page || 1
    }
  } catch (error) {
    console.error('搜索视频失败:', error)
    videos.value = []
  } finally {
    loading.value = false
  }
}

// 执行搜索
const handleSearch = async () => {
  const query = searchQuery.value.trim()
  if (!query) return

  currentSearchQuery.value = query
  hasSearched.value = true

  // 更新 URL 查询参数
  router.push({
    name: 'video-search',
    query: { q: query }
  })

  // 执行搜索
  await searchVideos(query, 1)
}

// 清空搜索
const clearSearch = () => {
  searchQuery.value = ''
  currentSearchQuery.value = ''
  hasSearched.value = false
  videos.value = []

  // 清除 URL 查询参数
  router.push({ name: 'video-search' })
}

// 处理分页
const handlePageChange = (page) => {
  if (currentSearchQuery.value) {
    searchVideos(currentSearchQuery.value, page)
    // 直接跳转到顶部
    window.scrollTo(0, 0)
  }
}

// 初始化
onMounted(async () => {
  // 获取 CDN 域名
  await fetchCdnDomain()

  // 从 URL 读取搜索关键词
  const query = route.query.q
  if (query) {
    searchQuery.value = query
    handleSearch()
  }
})
</script>
