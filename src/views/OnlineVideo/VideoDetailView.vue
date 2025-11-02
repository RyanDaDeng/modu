<template>
  <VideoLayout
    :title="videoData?.name || '视频详情'"
    :page-loading="loading"
    :show-top-nav="true"
    :custom-breadcrumbs="breadcrumbs"
  >
    <div v-if="videoData" class="container mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧：视频播放区域 -->
        <div class="lg:col-span-2 space-y-4">
          <!-- 浏览器推荐提示 -->
          <div class="flex items-start bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg p-3">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>
            <div class="ml-3 flex-1">
              <p class="text-sm text-gray-700 dark:text-gray-300">
                <span class="font-medium">说明：</span>如果遇到无法观看的情况，推荐使用谷歌浏览器（Chrome）获得最佳体验。
                <a href="https://www.google.cn/chrome/" target="_blank" rel="noopener noreferrer"
                   class="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline ml-1">
                  <span>下载谷歌浏览器</span>
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                </a>
              </p>
            </div>
          </div>

          <!-- 视频播放器 -->
          <VideoPlayer
            :video-url="videoData.video_url || videoData.url"
            :cover-image="getCoverUrl(videoData.cover_img)"
            :source="videoData.source"
          />

          <!-- 温馨提醒 -->
          <div class="flex items-center bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-lg p-3">
            <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <p class="ml-3 text-sm text-gray-700 dark:text-gray-300">
              <span class="font-medium">温馨提醒：</span>请勿相信任何视频内的广告信息，谨防上当受骗！
            </p>
          </div>

          <!-- 视频信息 -->
          <div class="bg-white/95 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 rounded-lg p-4 sm:p-6">
            <!-- 桌面版：大标题区域 -->
            <div class="hidden sm:block">
              <!-- 分类标签 -->
              <div class="mb-3">
                <span class="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm px-3 py-1 rounded-full">
                  {{ videoData.type_name }}
                </span>
              </div>

              <!-- 标题和收藏按钮 -->
              <div class="flex items-start justify-between gap-4 mb-4">
                <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white flex-1">
                  {{ videoData.name }}
                </h1>
                <!-- 收藏按钮 -->
                <button
                  v-if="isAuthenticated"
                  @click="handleToggleCollection"
                  :disabled="collectionLoading"
                  class="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer"
                  :class="[
                    isCollected
                      ? 'bg-pink-500 hover:bg-pink-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300',
                    collectionLoading && 'opacity-50 cursor-not-allowed'
                  ]"
                >
                  <!-- Loading spinner -->
                  <svg v-if="collectionLoading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <!-- Bookmark icon -->
                  <svg v-else class="w-5 h-5" :fill="isCollected ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span class="text-sm">{{ collectionLoading ? '处理中...' : (isCollected ? '已收藏' : '收藏') }}</span>
                </button>
              </div>

              <!-- 统计信息 -->
              <div class="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                  </svg>
                  <span>{{ formatCount(videoData.views) }} 观看</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                  <span>{{ formatCount(videoData.favorites_count) }} 收藏</span>
                </div>
              </div>

              <!-- 永久链接和TG群组 -->
              <div class="pt-4 border-t border-gray-200/50 dark:border-gray-700 space-y-3">
                <!-- 永久链接 -->
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <svg class="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">永久链接：</span>
                  </div>
                  <div class="flex flex-wrap gap-2 text-sm">
                    <a
                      href="https://modu18.vip"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors"
                    >
                      https://modu18.vip
                    </a>
                    <span class="text-gray-400">|</span>
                    <a
                      href="https://18modu.vip"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors"
                    >
                      https://18modu.vip
                    </a>
                  </div>
                </div>

                <!-- Telegram 群组 -->
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <svg class="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.14.121.099.154.232.17.326.016.094.036.308.02.475z"/>
                    </svg>
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">社群：</span>
                  </div>
                  <a
                    href="https://t.me/+frktRDVHynY3OTA1"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    加入 Telegram 社群
                  </a>
                </div>
              </div>
            </div>

            <!-- 移动版：紧凑信息 -->
            <div class="sm:hidden">
              <div class="flex items-start justify-between gap-2 mb-3">
                <h1 class="text-lg font-bold text-gray-900 dark:text-white flex-1">
                  {{ videoData.name }}
                </h1>
                <!-- 收藏按钮 -->
                <button
                  v-if="isAuthenticated"
                  @click="handleToggleCollection"
                  :disabled="collectionLoading"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 flex-shrink-0 cursor-pointer"
                  :class="[
                    isCollected
                      ? 'bg-pink-500 hover:bg-pink-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300',
                    collectionLoading && 'opacity-50 cursor-not-allowed'
                  ]"
                >
                  <!-- Loading spinner -->
                  <svg v-if="collectionLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <!-- Bookmark icon -->
                  <svg v-else class="w-4 h-4" :fill="isCollected ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span class="text-xs">{{ collectionLoading ? '处理中' : (isCollected ? '已收藏' : '收藏') }}</span>
                </button>
              </div>
              <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">
                  {{ videoData.type_name }}
                </span>
                <span>{{ formatCount(videoData.views) }} 观看</span>
                <span>{{ formatCount(videoData.favorites_count) }} 收藏</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：推荐视频列表 -->
        <div class="lg:col-span-1">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">相关推荐</h2>

          <!-- 加载状态 -->
          <div v-if="loadingRecommendations" class="grid grid-cols-2 gap-3">
            <div v-for="i in 10" :key="i" class="animate-pulse">
              <div class="bg-gray-700 rounded-lg aspect-video"></div>
            </div>
          </div>

          <!-- 推荐列表 - 2列网格布局 -->
          <div v-else-if="recommendations.length > 0" class="grid grid-cols-2 gap-x-4 gap-y-5">
            <router-link
              v-for="video in recommendations"
              :key="video.id"
              :to="`/video/${video.id}`"
              class="block group cursor-pointer"
            >
              <!-- 封面 -->
              <div class="relative bg-gray-900 rounded-lg overflow-hidden mb-2" style="aspect-ratio: 16/10;">
                <img
                  :src="getCoverUrl(video.cover_img)"
                  :alt="video.name"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  @error="handleImageError"
                  loading="lazy"
                />
                <!-- 播放图标覆盖层 -->
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
                <!-- 观看次数 - 右下角 -->
                <div class="absolute bottom-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs text-white">
                  {{ formatCount(video.views) }} 观看
                </div>
              </div>
              <!-- 标题 -->
              <div>
                <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-pink-500 transition-colors">
                  {{ video.name }}
                </h3>
              </div>
            </router-link>
          </div>

          <!-- 空状态 -->
          <div v-else class="text-center text-gray-500 dark:text-gray-400 py-8">
            暂无推荐视频
          </div>
        </div>
      </div>
    </div>
  </VideoLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VideoLayout from '@/components/onlinevideo/VideoLayout.vue'
import VideoPlayer from '@/components/onlinevideo/VideoPlayer.vue'
import { getVideoDetail, getHotRecommendations, getVideoSettings } from '@/api/video'
import { toggleVideoCollection, checkVideoCollection } from '@/api/videoCollection'
import { useAuthStore } from '@/stores/auth'
import { useNotification } from '@/composables/useNotification'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const notification = useNotification()

const videoData = ref(null)
const recommendations = ref([])
const cdnDomain = ref('')
const loading = ref(true)
const loadingRecommendations = ref(true)

// 收藏相关状态
const isCollected = ref(false)
const collectionLoading = ref(false)

// 是否已登录
const isAuthenticated = computed(() => authStore.isAuthenticated)

// 面包屑
const breadcrumbs = computed(() => {
  if (videoData.value) {
    return [{ name: videoData.value.name, path: null }]
  }
  return []
})

// 来源标签
const sourceLabel = computed(() => {
  if (!videoData.value) return ''
  const sourceMap = {
    'lebo': '乐播',
    'lajiao': '辣椒',
    'senlin': '森林'
  }
  return sourceMap[videoData.value.source] || videoData.value.source
})

// 获取完整的封面 URL
const getCoverUrl = (coverImg) => {
  if (!coverImg || !cdnDomain.value) return coverImg || ''

  // 如果已经是完整 URL，直接返回
  if (coverImg.startsWith('http://') || coverImg.startsWith('https://')) {
    return coverImg
  }

  // 直接拼接 CDN 域名 + cover_img
  return cdnDomain.value + coverImg
}

// 格式化数字
const formatCount = (count) => {
  if (!count) return '0'
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + 'w'
  }
  return count.toString()
}

// 图片加载失败处理
const handleImageError = (e) => {
  e.target.src = '/img_6.png'
}

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

// 加载视频详情
const loadVideoDetail = async (id) => {
  loading.value = true
  try {
    const response = await getVideoDetail(id)
    videoData.value = response.data
    // 非VIP用户：后端会移除 url/video_url 字段
    // VIP用户：正常包含 url/video_url 字段
    // VideoPlayer 组件会根据是否有 URL 来显示相应的界面
  } catch (error) {
    console.error('加载视频详情失败:', error)
    notification.error('加载视频详情失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 加载推荐视频
const loadRecommendations = async () => {
  loadingRecommendations.value = true
  try {
    const response = await getHotRecommendations({
      limit: 10,
      type_name: videoData.value?.type_name
    })
    recommendations.value = response.data || []
  } catch (error) {
    console.error('加载推荐视频失败:', error)
    recommendations.value = []
  } finally {
    loadingRecommendations.value = false
  }
}

// 检查视频收藏状态
const checkCollectionStatus = async (videoId) => {
  if (!isAuthenticated.value || !videoId) return

  try {
    const response = await checkVideoCollection(videoId)
    isCollected.value = response.is_collected || false
  } catch (error) {
    console.error('检查收藏状态失败:', error)
    isCollected.value = false
  }
}

// 切换收藏状态
const handleToggleCollection = async () => {
  if (!isAuthenticated.value) {
    notification.warning('请先登录')
    router.push('/login')
    return
  }

  if (!videoData.value) return

  collectionLoading.value = true
  try {
    const response = await toggleVideoCollection({
      id: videoData.value.id || videoData.value.vod_id,
      vod_id: videoData.value.id || videoData.value.vod_id,
      name: videoData.value.name || videoData.value.vod_name,
      cover: videoData.value.cover_img || videoData.value.vod_pic,
      vod_name: videoData.value.name || videoData.value.vod_name,
      vod_pic: videoData.value.cover_img || videoData.value.vod_pic
    })

    isCollected.value = response.is_collected

    if (isCollected.value) {
      notification.success('收藏成功')
    } else {
      notification.success('取消收藏成功')
    }
  } catch (error) {
    console.error('切换收藏状态失败:', error)
    notification.error(error.response?.data?.message || '操作失败，请稍后重试')
  } finally {
    collectionLoading.value = false
  }
}

// 监听路由变化
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadVideoDetail(newId).then(() => {
      loadRecommendations()
      checkCollectionStatus(newId)
    })
    // 滚动到顶部
    window.scrollTo(0, 0)
  }
}, { immediate: true })

onMounted(async () => {
  // 获取 CDN 域名
  await fetchCdnDomain()

  const videoId = route.params.id
  if (videoId) {
    loadVideoDetail(videoId).then(() => {
      loadRecommendations()
      checkCollectionStatus(videoId)
    })
  }
})
</script>
