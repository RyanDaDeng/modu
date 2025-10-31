<template>
  <router-link
    :to="`/video/${video.id}`"
    class="block relative group"
  >
    <!-- Gradient border effect on hover -->
    <div class="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-lg opacity-0 group-hover:opacity-50 blur-sm transition-opacity"></div>

    <!-- Main card with glassmorphism -->
    <div class="relative bg-gray-900/60 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden group-hover:border-pink-500/30 transition-all">
      <!-- 视频封面 -->
      <div class="relative overflow-hidden bg-gray-800/50 aspect-video">
        <img
          :src="coverUrl"
          :alt="video.name"
          class="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
          @error="handleImageError"
          loading="lazy"
        />

        <!-- 播放图标覆盖层 -->
        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div class="w-12 h-12 sm:w-14 sm:h-14 bg-black/60 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- 视频信息 -->
      <div class="p-1.5 sm:p-2">
        <!-- 标题 -->
        <h3 class="text-xs sm:text-sm font-semibold text-white line-clamp-2 mb-1.5 sm:mb-2 h-8 sm:h-10">
          {{ video.name }}
        </h3>

        <!-- 移动端布局 -->
        <div class="sm:hidden">
          <!-- 统计信息 -->
          <div class="flex items-center gap-1 text-[10px] text-gray-400 mb-1">
            <!-- 浏览量 -->
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
            </svg>
            <span>{{ formatViews(video.views) }}</span>
            <span class="mx-0.5 text-gray-600">·</span>
            <!-- 收藏数 -->
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
            <span>{{ formatCount(video.favorites_count || 0) }}</span>
          </div>
          <!-- 分类和时间 - 固定在底部 -->
          <div class="flex items-center gap-1.5 text-[10px] text-gray-400">
            <span class="text-pink-400 truncate max-w-[60px]">{{ video.type_name }}</span>
            <span class="text-gray-600">·</span>
            <span class="truncate">{{ formatTime(video.created_at) }}</span>
          </div>
        </div>

        <!-- 桌面端布局 -->
        <div class="hidden sm:flex items-center justify-between text-xs text-gray-400">
          <div class="flex items-center gap-2">
            <span class="text-pink-400">{{ video.type_name }}</span>
            <span>{{ formatTime(video.created_at) }}</span>
          </div>
          <div class="flex items-center gap-1">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
            </svg>
            <span>{{ formatViews(video.views) }}</span>
            <span class="mx-0.5 text-gray-600">·</span>
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
            <span>{{ formatCount(video.favorites_count || 0) }}</span>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  video: {
    type: Object,
    required: true
  },
  cdnDomain: {
    type: String,
    default: ''
  }
})

// 来源标签映射
const sourceLabel = computed(() => {
  const sourceMap = {
    'lebo': '乐播',
    'lajiao': '辣椒',
    'senlin': '森林'
  }
  return sourceMap[props.video.source] || props.video.source
})

// 完整的封面 URL
const coverUrl = computed(() => {
  const coverImg = props.video.cover_img
  if (!coverImg || !props.cdnDomain) return coverImg || ''

  // 如果已经是完整 URL，直接返回
  if (coverImg.startsWith('http://') || coverImg.startsWith('https://')) {
    return coverImg
  }

  // 直接拼接 CDN 域名 + cover_img
  return props.cdnDomain + coverImg
})

// 格式化观看数
const formatViews = (views) => {
  if (!views) return '0'
  if (views >= 10000) {
    return (views / 10000).toFixed(1) + 'w'
  }
  return views.toString()
}

// 格式化收藏数/评论数
const formatCount = (count) => {
  if (!count) return '0'
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + 'w'
  }
  return count.toString()
}

// 格式化时间
const formatTime = (dateString) => {
  if (!dateString) return ''

  const date = new Date(dateString)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000) // 秒

  if (diff < 60) return '刚刚'
  if (diff < 3600) return Math.floor(diff / 60) + '分钟前'
  if (diff < 86400) return Math.floor(diff / 3600) + '小时前'
  if (diff < 2592000) return Math.floor(diff / 86400) + '天前'
  if (diff < 31536000) return Math.floor(diff / 2592000) + '个月前'
  return Math.floor(diff / 31536000) + '年前'
}

// 图片加载失败处理
const handleImageError = (e) => {
  e.target.src = '/img_6.png' // 使用默认背景图
}
</script>
