<template>
  <div class="bg-gradient-to-r from-yellow-50 via-orange-50 to-yellow-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 rounded-xl shadow-lg border-2 border-yellow-300 dark:border-yellow-700 p-4 sm:p-6">
    <!-- 会员状态显示 -->
    <div class="text-center mb-4">
      <h3 class="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
        🎬 视频通行证充值
      </h3>
      <div class="text-sm sm:text-base">
        <span class="text-gray-600 dark:text-gray-400">当前状态：</span>
        <span v-if="videoExpiredAt" class="ml-1 text-base sm:text-lg font-semibold text-green-600 dark:text-green-400">
          有效至 {{ formatDate(videoExpiredAt) }}
        </span>
        <span v-else class="ml-1 text-base sm:text-lg font-semibold text-red-600 dark:text-red-400">
          未开通
        </span>
      </div>
      <!-- 如果是从简洁模式展开的，显示收起按钮 -->
      <button
        v-if="videoExpiredAt && showDetails"
        @click="$emit('toggle')"
        class="mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        收起 ↑
      </button>
    </div>

    <!-- 充值选项 - 大号按钮，清晰价格 -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      <!-- 月卡 -->
      <button
        @click="handleQuickPay('video-1')"
        class="relative bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl p-4 transition-all duration-200 transform hover:scale-105 hover:shadow-xl group"
      >
        <div class="flex flex-col items-center">
          <span class="text-gray-600 dark:text-gray-400 text-sm mb-1">月卡</span>
          <span class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">¥50</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">30天</span>
        </div>
      </button>

      <!-- 季卡 -->
      <button
        @click="handleQuickPay('video-3')"
        class="relative bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl p-4 transition-all duration-200 transform hover:scale-105 hover:shadow-xl group"
      >
        <div class="flex flex-col items-center">
          <span class="text-gray-600 dark:text-gray-400 text-sm mb-1">季卡</span>
          <span class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">¥100</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">90天</span>
          <span class="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">省¥50</span>
        </div>
      </button>

      <!-- 半年卡 - 推荐 -->
      <button
        @click="handleQuickPay('video-6')"
        class="relative bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-800/40 dark:hover:to-pink-800/40 border-2 border-purple-400 dark:border-purple-600 rounded-xl p-4 transition-all duration-200 transform hover:scale-105 hover:shadow-xl group"
      >
        <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse">
          推荐
        </div>
        <div class="flex flex-col items-center">
          <span class="text-purple-700 dark:text-purple-300 text-sm mb-1 font-semibold">半年卡</span>
          <span class="text-2xl sm:text-3xl font-bold text-purple-800 dark:text-purple-200 mb-1">¥150</span>
          <span class="text-xs text-purple-600 dark:text-purple-400">180天</span>
          <span class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">省¥150</span>
        </div>
      </button>

      <!-- 年卡 -->
      <button
        @click="handleQuickPay('video-7')"
        class="relative bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl p-4 transition-all duration-200 transform hover:scale-105 hover:shadow-xl group"
      >
        <div class="flex flex-col items-center">
          <span class="text-gray-600 dark:text-gray-400 text-sm mb-1">年卡</span>
          <span class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">¥280</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">365天</span>
          <span class="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">省¥320</span>
        </div>
      </button>
    </div>

    <!-- 温馨提示 -->
    <div class="mt-4 text-center">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        💡 提示：点击即可快速充值，支持支付宝/微信支付
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  videoExpiredAt: {
    type: String,
    default: null
  },
  showDetails: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle'])

const router = useRouter()

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 快速充值
const handleQuickPay = (planCode) => {
  // 跳转到视频 VIP 页面并传递计划代码
  router.push({
    name: 'vip', query: { tab: 'video' },
    query: { plan: planCode }
  })
}
</script>
