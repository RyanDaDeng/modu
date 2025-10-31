<template>
  <VideoLayout
    title="在线视频"
    :page-loading="initialLoading"
    :show-top-nav="true"
    :no-header="true"
  >
    <div class="container mx-auto px-4 py-4 space-y-3">
      <!-- 移动端搜索栏 -->
      <div class="lg:hidden">
        <div class="relative">
          <input
            v-model="mobileSearchQuery"
            @keyup.enter="handleMobileSearch"
            type="text"
            placeholder="搜索视频..."
            class="w-full px-3 py-2 pr-20 bg-gray-900/60 backdrop-blur-sm border border-white/10 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-pink-500/50 transition-all"
          />
          <button
            v-if="mobileSearchQuery"
            @click="mobileSearchQuery = ''"
            class="absolute right-16 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </button>
          <button
            @click="handleMobileSearch"
            class="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 text-sm bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-md transition-all cursor-pointer"
          >
            搜索
          </button>
        </div>
      </div>

      <!-- 筛选栏 - 移动端可折叠 -->
      <div>
        <!-- 移动端：折叠按钮 -->
        <div class="lg:hidden mb-3">
          <button
            @click="showFilters = !showFilters"
            class="w-full flex items-center justify-between px-3 py-2 bg-gray-900/60 backdrop-blur-sm border border-white/10 rounded-lg hover:border-pink-500/30 transition-all"
          >
            <span class="text-sm font-medium text-white">
              筛选条件
            </span>
            <svg
              class="w-4 h-4 text-gray-400 transition-transform"
              :class="{ 'rotate-180': showFilters }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <!-- 筛选器 -->
        <div
          class="transition-all duration-300"
          :class="showFilters ? 'block' : 'hidden lg:block'"
        >
          <VideoFilter
            :categories="categories"
            :selected-type="filters.type"
            :selected-sort-filter="filters.sortFilter"
            :selected-source="filters.source"
            @update:type="handleFilterUpdate('type', $event)"
            @update:sortFilter="handleFilterUpdate('sortFilter', $event)"
            @update:source="handleFilterUpdate('source', $event)"
            @reset="handleResetFilters"
          />
        </div>
      </div>

      <!-- 当前筛选状态显示 -->
      <div v-if="hasActiveFilters" class="flex items-center gap-2 flex-wrap">
        <span class="text-sm text-gray-500 dark:text-gray-400">当前筛选：</span>
        <!-- 分类 -->
        <span
          v-if="filters.type"
          class="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-sm cursor-pointer"
        >
          {{ currentCategoryName }}
          <button @click="handleFilterUpdate('type', null)" class="hover:text-pink-900 dark:hover:text-pink-100">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </span>
        <!-- 排序 -->
        <span
          v-if="filters.sortFilter !== 'latest'"
          class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm cursor-pointer"
        >
          {{ currentSortName }}
          <button @click="handleFilterUpdate('sortFilter', 'latest')" class="hover:text-blue-900 dark:hover:text-blue-100">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </span>
        <!-- 来源 -->
        <span
          v-if="filters.source"
          class="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm cursor-pointer"
        >
          {{ currentSourceName }}
          <button @click="handleFilterUpdate('source', null)" class="hover:text-purple-900 dark:hover:text-purple-100">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </span>
        <!-- 搜索关键词 -->
        <span
          v-if="filters.searchText"
          class="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm cursor-pointer"
        >
          搜索: {{ filters.searchText }}
          <button @click="handleFilterUpdate('searchText', null)" class="hover:text-green-900 dark:hover:text-green-100">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </span>
        <button
          @click="handleResetFilters"
          class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline cursor-pointer"
        >
          清空筛选
        </button>
      </div>

      <!-- 顶部分页 -->
      <div ref="topPaginationRef" v-if="videos.length > 0 && pagination.total > 0" class="flex justify-center mb-6">
        <Pagination
          :current-page="pagination.currentPage"
          :total-pages="pagination.lastPage"
          @change="handlePageChange"
        />
      </div>

      <!-- 视频网格 -->
      <VideoGrid
        :videos="videos"
        :loading="loading"
        :empty-message="getEmptyMessage"
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
  </VideoLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getVideos, getVideoSettings } from '@/api/video'

const route = useRoute()
const router = useRouter()
import VideoLayout from '@/components/onlinevideo/VideoLayout.vue'
import VideoFilter from '@/components/onlinevideo/VideoFilter.vue'
import VideoGrid from '@/components/onlinevideo/VideoGrid.vue'
import Pagination from '@/components/Pagination.vue'

// 状态
const videos = ref([])
const categories = ref([])
const cdnDomain = ref('')
const loading = ref(false)
const initialLoading = ref(true)
const showFilters = ref(false)
const mobileSearchQuery = ref('') // 移动端搜索输入框
const topPaginationRef = ref(null) // 顶部分页元素引用

// 筛选条件
const filters = ref({
  type: null,
  sortFilter: 'latest',
  source: null,
  searchText: null // 搜索关键词
})

// 分页信息
const pagination = ref({
  currentPage: 1,
  perPage: 32,
  total: 0,
  lastPage: 1
})

// 是否有激活的筛选条件
const hasActiveFilters = computed(() => {
  return filters.value.type !== null ||
         filters.value.sortFilter !== 'latest' ||
         filters.value.source !== null ||
         filters.value.searchText !== null
})

// 当前分类名称
const currentCategoryName = computed(() => {
  if (!filters.value.type) return '全部'
  const category = categories.value.find(cat => cat.value === filters.value.type)
  return category ? category.label : filters.value.type
})

// 当前排序名称
const currentSortName = computed(() => {
  const sortMap = {
    'latest': '最新',
    'hot': '最热',
    'favorites': '最多收藏'
  }
  return sortMap[filters.value.sortFilter] || filters.value.sortFilter
})

// 当前来源名称
const currentSourceName = computed(() => {
  const sourceMap = {
    'lebo': '1号资源',
    'lajiao': '2号资源',
    'senlin': '3号资源'
  }
  return sourceMap[filters.value.source] || filters.value.source
})

// 空状态消息
const getEmptyMessage = computed(() => {
  if (filters.value.type) {
    return `暂无「${currentCategoryName.value}」分类的视频`
  }
  return '暂无视频，试试换个筛选条件吧'
})

// 获取视频列表
const fetchVideos = async (page = 1) => {
  loading.value = true

  try {
    const params = {
      type: filters.value.type,
      sort_filter: filters.value.sortFilter,
      source: filters.value.source,
      text: filters.value.searchText, // 添加搜索关键词
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
    console.error('获取视频列表失败:', error)
    videos.value = []
  } finally {
    loading.value = false
  }
}

// 获取分类列表
const fetchCategories = async () => {
  try {
    const response = await getVideoSettings()
    const data = response.data || response

    categories.value = Array.isArray(data) ? data : (data.categories || data.data || [])

    // 保存 CDN 域名
    if (data.cdn_domain) {
      cdnDomain.value = data.cdn_domain
    }
  } catch (error) {
    console.error('获取分类列表失败:', error)
    categories.value = []
  }
}

// 处理筛选更新
const handleFilterUpdate = (key, value) => {
  filters.value[key] = value

  // 如果清除搜索关键词，同时清除URL参数
  if (key === 'searchText' && value === null) {
    router.push({ name: 'video-home' })
  }

  fetchVideos(1)

  // 移动端自动收起筛选器
  if (window.innerWidth < 1024) {
    showFilters.value = false
  }
}

// 重置筛选
const handleResetFilters = () => {
  filters.value = {
    type: null,
    sortFilter: 'latest',
    source: null,
    searchText: null
  }

  // 清除URL中的查询参数
  router.push({ name: 'video-home' })

  fetchVideos(1)

  // 移动端自动收起筛选器
  if (window.innerWidth < 1024) {
    showFilters.value = false
  }
}

// 处理分页
const handlePageChange = (page) => {
  fetchVideos(page)

  // 直接跳转到顶部pagination的位置
  if (topPaginationRef.value) {
    const element = topPaginationRef.value
    const offsetTop = element.offsetTop
    // 减去一些padding，让pagination不要紧贴顶部
    const scrollPosition = offsetTop - 20

    window.scrollTo(0, scrollPosition)
  } else {
    // 如果ref不存在，回退到跳转到顶部
    window.scrollTo(0, 0)
  }
}

// 处理移动端搜索
const handleMobileSearch = () => {
  const query = mobileSearchQuery.value.trim()
  if (query) {
    router.push({
      name: 'video-home',
      query: { q: query }
    })
    // 清空输入框
    mobileSearchQuery.value = ''
  }
}

// 监听 URL query 变化
watch(() => route.query.q, (newQuery) => {
  filters.value.searchText = newQuery || null
  fetchVideos(1)
})

// 初始化
onMounted(async () => {
  try {
    // 从 URL 读取搜索关键词
    const searchQuery = route.query.q
    if (searchQuery) {
      filters.value.searchText = searchQuery
    }

    // 并行加载分类和视频列表
    await Promise.all([
      fetchCategories(),
      fetchVideos(1)
    ])
  } catch (error) {
    console.error('初始化失败:', error)
  } finally {
    initialLoading.value = false
  }
})
</script>
