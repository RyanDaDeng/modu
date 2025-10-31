<template>
  <div>
    <!-- 加载状态 - 优先显示 -->
    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
      <div
        v-for="i in skeletonCount"
        :key="i"
        class="animate-pulse"
      >
        <div class="bg-gray-700 rounded-lg aspect-video"></div>
        <div class="p-4 space-y-3">
          <div class="h-5 bg-gray-700 rounded"></div>
          <div class="h-5 bg-gray-700 rounded w-3/4"></div>
          <div class="flex gap-4 mt-3">
            <div class="h-4 bg-gray-700 rounded w-20"></div>
            <div class="h-4 bg-gray-700 rounded w-20"></div>
            <div class="h-4 bg-gray-700 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 视频网格 - 手机2个，平板3个，桌面4个 -->
    <div v-else-if="videos.length > 0" class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
      <VideoCard
        v-for="video in videos"
        :key="video.id"
        :video="video"
        :cdn-domain="cdnDomain"
      />
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-16">
      <svg class="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      <h3 class="text-lg font-semibold text-gray-300 mb-2">暂无视频</h3>
      <p class="text-sm text-gray-500">{{ emptyMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import VideoCard from './VideoCard.vue'

defineProps({
  videos: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  emptyMessage: {
    type: String,
    default: '试试换个筛选条件吧'
  },
  cdnDomain: {
    type: String,
    default: ''
  },
  skeletonCount: {
    type: Number,
    default: 10
  }
})
</script>
