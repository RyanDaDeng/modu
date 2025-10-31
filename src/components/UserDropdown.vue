<template>
  <!-- User Avatar / Login Button -->
  <div v-if="authStore.isLoggedIn" class="relative">
    <button
      v-if="!hideButton"
      @click="showUserMenu = !showUserMenu"
      class="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-all cursor-pointer"
    >
      <!-- VIP Badge integrated with Avatar -->
      <div class="relative">
        <div class="w-7 h-7 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {{ userInitial }}
        </div>
        <!-- VIP Crown Badge -->
        <div v-if="isUserVip" class="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
          <svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      </div>
      <span class="text-white text-sm hidden sm:block">{{ authStore.user?.name }}</span>
      <svg class="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Backdrop for mobile -->
    <div
      v-if="showUserMenu"
      @click="closeUserMenu"
      class="fixed inset-0 z-[999] sm:hidden"
    ></div>

    <!-- User Dropdown Menu -->
    <div
      v-if="showUserMenu"
      class="fixed sm:absolute left-0 right-0 sm:left-auto sm:right-0 bottom-0 sm:bottom-auto sm:top-auto mt-0 sm:mt-2 w-full sm:w-auto sm:min-w-[400px] z-[1000]"
    >
      <!-- Glassmorphism dropdown with gradient border -->
      <div class="relative">
        <!-- Gradient border effect -->
        <div class="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-t-2xl sm:rounded-lg blur-sm opacity-50"></div>

        <!-- Main dropdown content -->
        <div class="relative bg-gray-900/95 backdrop-blur-xl rounded-t-2xl sm:rounded-lg border border-white/10 overflow-hidden max-h-[80vh] sm:max-h-[600px] overflow-y-auto">
          <!-- Mobile header with drag indicator -->
          <div class="sm:hidden sticky top-0 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 z-10">
            <div class="flex justify-center pt-2 pb-1">
              <div class="w-12 h-1 bg-gray-600 rounded-full"></div>
            </div>
            <div class="px-4 pb-3 flex items-center justify-between">
              <h3 class="text-white font-semibold">菜单</h3>
              <button @click="closeUserMenu" class="text-gray-400 hover:text-white">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div class="py-2 pb-safe">
            <!-- VIP Status Section -->
            <div v-if="isUserVip" class="px-4 py-2 border-b border-white/10">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span class="text-yellow-400 font-medium text-sm">通行证</span>
                </div>
                <span class="text-gray-400 text-xs">{{ vipExpireText }}</span>
              </div>
            </div>

            <!-- 两列网格布局 -->
            <div class="grid grid-cols-2 gap-1 px-2">
              <!-- 魔都漫画 -->
              <router-link
                to="/comic"
                @click="handleDropdownClick"
                class="flex px-3 py-2.5 text-pink-400 hover:bg-pink-500/10 hover:text-pink-300 transition-colors cursor-pointer rounded"
              >
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                  <span class="text-sm font-semibold">魔都漫画</span>
                </div>
              </router-link>

              <!-- 魔都视频 -->
              <router-link
                to="/video"
                @click="handleDropdownClick"
                class="flex px-3 py-2.5 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 transition-colors cursor-pointer rounded"
              >
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                  <span class="text-sm font-semibold">魔都视频</span>
                </div>
              </router-link>

              <!-- 个人中心 -->
              <router-link
                to="/profile"
                @click="handleDropdownClick"
                class="flex px-3 py-2.5 text-gray-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer rounded"
              >
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span class="text-sm">个人中心</span>
                </div>
              </router-link>

              <!-- 充值 -->
              <router-link
                to="/vip"
                @click="handleDropdownClick"
                class="flex px-3 py-2.5 text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300 transition-colors cursor-pointer rounded"
              >
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-sm">充值</span>
                </div>
              </router-link>

              <!-- 漫画收藏 -->
              <router-link
                to="/collection"
                @click="handleDropdownClick"
                class="flex px-3 py-2.5 text-gray-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer rounded"
              >
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span class="text-sm">漫画收藏</span>
                </div>
              </router-link>

              <!-- 视频收藏 -->
              <router-link
                to="/video-collection"
                @click="handleDropdownClick"
                class="flex px-3 py-2.5 text-gray-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer rounded"
              >
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span class="text-sm">视频收藏</span>
                </div>
              </router-link>

              <!-- 漫画书签 -->
              <router-link
                to="/bookmarks"
                @click="handleDropdownClick"
                class="flex px-3 py-2.5 text-gray-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer rounded"
              >
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span class="text-sm">漫画书签</span>
                </div>
              </router-link>

              <!-- 观漫历史 -->
              <router-link
                to="/reading-history"
                @click="handleDropdownClick"
                class="flex px-3 py-2.5 text-gray-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer rounded"
              >
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span class="text-sm">观漫历史</span>
                </div>
              </router-link>

              <!-- 充值记录 -->
              <router-link
                to="/recharge-history"
                @click="handleDropdownClick"
                class="flex px-3 py-2.5 text-gray-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer rounded"
              >
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <span class="text-sm">充值记录</span>
                </div>
              </router-link>

              <!-- 推广中心 -->
              <router-link
                to="/affiliate"
                @click="handleDropdownClick"
                class="flex px-3 py-2.5 text-gray-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer rounded"
              >
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span class="text-sm">推广中心</span>
                </div>
              </router-link>

              <!-- APP安装 -->
              <router-link
                v-if="appStore.shouldShowAppDownload"
                to="/app-download"
                @click="handleDropdownClick"
                class="flex px-3 py-2.5 text-gray-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer rounded"
              >
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span class="text-sm">APP</span>
                </div>
              </router-link>
            </div>
            <!-- Admin Section -->
            <div v-if="authStore.user?.is_admin">
              <div class="my-2 border-t border-white/10"></div>
              <div class="px-4 py-1 text-xs text-gray-500 uppercase tracking-wider">管理</div>
              <router-link
                to="/admin/payment-analysis"
                @click="handleDropdownClick"
                class="block px-4 py-2 text-gray-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  支付分析
                </div>
              </router-link>
            </div>
            <div class="my-2 border-t border-white/10"></div>
            <button
              @click="handleLogout"
              class="block w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors cursor-pointer"
            >
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                退出登录
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <router-link
    v-else
    to="/login"
    class="relative group"
  >
    <!-- Animated gradient glow effect -->
    <div class="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full blur-sm opacity-50 group-hover:opacity-80 animate-pulse"></div>

    <!-- Main button with glassmorphism -->
    <div class="relative px-4 py-1.5 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm border border-pink-400/50 text-pink-200 text-sm font-medium rounded-full transition-all group-hover:scale-105 group-hover:border-pink-300 group-hover:text-white cursor-pointer">
      登录
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { useUserMenu } from '@/composables/useUserMenu'

const props = defineProps({
  hideButton: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

const { isUserMenuOpen: showUserMenu, close: closeUserMenu } = useUserMenu()

// User initial for avatar
const userInitial = computed(() => {
  if (!authStore.user?.name) return '?'
  return authStore.user.name.charAt(0).toUpperCase()
})

// Check if user is VIP
const isUserVip = computed(() => {
  if (!authStore.user?.expired_at) return false
  const expiredDate = new Date(authStore.user.expired_at)
  return expiredDate > new Date()
})

// VIP expire text
const vipExpireText = computed(() => {
  if (!authStore.user?.expired_at) return ''
  const expiredDate = new Date(authStore.user.expired_at)
  const now = new Date()
  const diffDays = Math.ceil((expiredDate - now) / (1000 * 60 * 60 * 24))
  if (diffDays > 0) {
    return `${diffDays}天`
  }
  return '已过期'
})

// Handle dropdown click
const handleDropdownClick = () => {
  closeUserMenu()
}

// Handle logout
const handleLogout = async () => {
  await authStore.logout()
  closeUserMenu()
  router.push('/')
}
</script>
