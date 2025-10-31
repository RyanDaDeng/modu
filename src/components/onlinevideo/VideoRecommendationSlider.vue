<template>
  <div class="relative bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
    <!-- 加载状态 -->
    <div v-if="loading" class="aspect-video bg-gray-700 animate-pulse flex items-center justify-center">
      <LoadingSpinner />
    </div>

    <!-- 轮播内容 -->
    <div v-else-if="videos.length > 0" class="relative">
      <!-- 当前视频 -->
      <div class="aspect-video relative group cursor-pointer" @click="goToVideo(currentVideo)">
        <!-- 背景图片 -->
        <img
          :src="getCoverUrl(currentVideo.cover_img)"
          :alt="currentVideo.name"
          class="w-full h-full object-cover"
          @error="handleImageError"
        />

        <!-- 渐变遮罩 -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        <!-- 播放按钮 -->
        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div class="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        </div>

        <!-- 视频信息 -->
        <div class="absolute bottom-0 left-0 right-0 p-6">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <h3 class="text-white text-xl font-bold mb-2 line-clamp-2">
                {{ currentVideo.name }}
              </h3>
              <div class="flex items-center gap-4 text-sm text-gray-300">
                <span class="px-2 py-1 bg-pink-500/80 backdrop-blur-sm rounded">
                  {{ currentVideo.type_name }}
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                  </svg>
                  {{ formatViews(currentVideo.views) }}
                </span>
              </div>
            </div>

            <!-- 导航按钮 -->
            <div class="flex items-center gap-2">
              <button
                @click.stop="prevVideo"
                class="p-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-all"
                :disabled="videos.length <= 1"
              >
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                @click.stop="nextVideo"
                class="p-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-all"
                :disabled="videos.length <= 1"
              >
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 指示器 -->
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
        <button
          v-for="(video, index) in videos"
          :key="video.id"
          @click="currentIndex = index"
          class="transition-all"
          :class="index === currentIndex
            ? 'w-8 h-2 bg-pink-500'
            : 'w-2 h-2 bg-white/50 hover:bg-white/80'"
          style="border-radius: 9999px;"
        ></button>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="aspect-video bg-gray-700 flex items-center justify-center">
      <div class="text-center text-gray-400">
        <svg class="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <p>暂无推荐视频</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getHotRecommendations } from '@/api/video'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const props = defineProps({
  typeName: {
    type: String,
    default: null
  },
  cdnDomain: {
    type: String,
    default: ''
  },
  autoPlay: {
    type: Boolean,
    default: true
  },
  interval: {
    type: Number,
    default: 5000
  }
})

const router = useRouter()
const videos = ref([])
const currentIndex = ref(0)
const loading = ref(true)
let timer = null

const currentVideo = computed(() => videos.value[currentIndex.value])

// 获取完整的封面 URL
const getCoverUrl = (coverImg) => {
  if (!coverImg || !props.cdnDomain) return coverImg || ''

  // 如果已经是完整 URL，直接返回
  if (coverImg.startsWith('http://') || coverImg.startsWith('https://')) {
    return coverImg
  }

  // 直接拼接 CDN 域名 + cover_img
  return props.cdnDomain + coverImg
}

// 加载推荐视频
const loadVideos = async () => {
  loading.value = true
  try {
    const response = await getHotRecommendations({
      limit: 8,
      type_name: props.typeName
    })
    videos.value = response.data || []
  } catch (error) {
    console.error('加载推荐视频失败:', error)
    videos.value = []
  } finally {
    loading.value = false
  }
}

// 上一个视频
const prevVideo = () => {
  if (videos.value.length <= 1) return
  currentIndex.value = (currentIndex.value - 1 + videos.value.length) % videos.value.length
  resetTimer()
}

// 下一个视频
const nextVideo = () => {
  if (videos.value.length <= 1) return
  currentIndex.value = (currentIndex.value + 1) % videos.value.length
  resetTimer()
}

// 跳转到视频详情
const goToVideo = (video) => {
  router.push(`/video/${video.id}`)
}

// 格式化观看数
const formatViews = (views) => {
  if (!views) return '0'
  if (views >= 10000) {
    return (views / 10000).toFixed(1) + 'w'
  }
  return views.toString()
}

// 图片加载失败处理
const handleImageError = (e) => {
  e.target.src = '/img_6.png'
}

// 开始自动播放
const startAutoPlay = () => {
  if (!props.autoPlay || videos.value.length <= 1) return
  timer = setInterval(() => {
    nextVideo()
  }, props.interval)
}

// 停止自动播放
const stopAutoPlay = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// 重置定时器
const resetTimer = () => {
  stopAutoPlay()
  startAutoPlay()
}

onMounted(() => {
  loadVideos().then(() => {
    startAutoPlay()
  })
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>
