<template>
  <header class="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 shadow-xl">
    <div class="relative">
      <!-- Gradient accent line -->
      <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>

      <nav class="relative z-40 pt-safe">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-between h-16 sm:h-20">
            <!-- Left Section: Logo -->
            <div class="flex items-center gap-6">
              <!-- Logo -->
              <router-link to="/" class="flex items-center">
                <div class="flex items-center space-x-2">
                  <div class="logo-container">
                    <img
                      src="/logo.png"
                      alt="魔都"
                      class="w-10 h-10 object-contain logo-enhanced"
                    />
                  </div>
                  <div class="flex items-baseline">
                    <span
                      class="text-pink-500 font-extrabold tracking-wider text-lg"
                      style="font-family: 'Pacifico', 'Dancing Script', 'Satisfy', 'Kaushan Script', 'Permanent Marker', fantasy; text-shadow: 2px 2px 0 rgba(31, 41, 55, 0.8), 3px 3px 0 rgba(219, 39, 119, 0.5); letter-spacing: 0.05em;"
                    >
                      魔都
                    </span>
                    <span class="text-pink-400 mx-0.5 text-xs">♥</span>
                  </div>
                </div>
              </router-link>
            </div>

            <!-- Right Section: User Actions -->
            <div class="flex items-center gap-3">
              <!-- VIP Button - Desktop -->
              <div class="hidden md:flex items-center gap-2">
                <!-- VIP Button -->
                <router-link
                  v-if="!authStore.isLoggedIn || !isUserVip"
                  to="/vip"
                  class="relative group"
                >
                  <!-- Animated gradient glow effect -->
                  <div class="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-full blur-sm opacity-70 group-hover:opacity-100 animate-pulse"></div>

                  <!-- Main button with glassmorphism -->
                  <div class="relative px-3 py-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-400/50 text-yellow-300 text-sm font-medium rounded-full transition-all group-hover:scale-105 group-hover:border-yellow-300 group-hover:text-yellow-200 cursor-pointer">
                    <div class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      充值
                    </div>
                  </div>
                </router-link>
              </div>

              <!-- Mobile Icons -->
              <div class="flex md:hidden items-center gap-1">
                <!-- VIP Button - Mobile -->
                <router-link
                  v-if="!authStore.isLoggedIn || !isUserVip"
                  to="/vip"
                  class="relative group"
                >
                  <!-- Animated glow for mobile -->
                  <div class="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-sm opacity-60 group-hover:opacity-90"></div>

                  <!-- Mobile VIP button -->
                  <div class="relative px-2 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-400/40 text-yellow-300 text-xs font-medium rounded-full transition-all cursor-pointer">
                    充值
                  </div>
                </router-link>
              </div>

              <!-- User Avatar / Login Button -->
              <div v-if="authStore.isLoggedIn" class="relative user-dropdown-container">
                <button
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
                  @click="showUserMenu = false"
                  class="fixed inset-0 z-40 sm:hidden"
                ></div>

                <!-- User Dropdown Menu -->
                <div
                  v-if="showUserMenu"
                  class="absolute right-0 mt-2 w-48 z-50"
                >
                  <!-- Glassmorphism dropdown with gradient border -->
                  <div class="relative">
                    <!-- Gradient border effect -->
                    <div class="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-lg blur-sm opacity-50"></div>

                    <!-- Main dropdown content -->
                    <div class="relative bg-gray-900/95 backdrop-blur-xl rounded-lg border border-white/10 overflow-hidden">
                      <div class="py-2">
                        <!-- VIP Status / Upgrade Section -->
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
                        <router-link
                          v-else
                          to="/vip"
                          @click="handleDropdownClick"
                          class="block px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/20 hover:to-orange-500/20 border-b border-white/10 transition-colors cursor-pointer"
                        >
                          <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                              <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span class="text-yellow-400 font-medium">充值</span>
                            </div>
                            <svg class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </router-link>
                        <router-link
                          to="/vip"
                          @click="handleDropdownClick"
                          class="block px-4 py-2 text-gray-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        >
                          <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            我要充值
                          </div>
                        </router-link>
                        <router-link
                          to="/profile"
                          @click="handleDropdownClick"
                          class="block px-4 py-2 text-gray-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        >
                          <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            个人中心
                          </div>
                        </router-link>
                        <router-link
                          to="/collection"
                          @click="handleDropdownClick"
                          class="block px-4 py-2 text-gray-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        >
                          <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            我的收藏
                          </div>
                        </router-link>
                        <router-link
                          to="/bookmarks"
                          @click="handleDropdownClick"
                          class="block px-4 py-2 text-gray-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        >
                          <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            我的书签
                          </div>
                        </router-link>
                        <router-link
                          to="/reading-history"
                          @click="handleDropdownClick"
                          class="block px-4 py-2 text-gray-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        >
                          <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                            </svg>
                            阅读历史
                          </div>
                        </router-link>
                        <router-link
                          to="/recharge-history"
                          @click="handleDropdownClick"
                          class="block px-4 py-2 text-gray-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        >
                          <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            充值记录
                          </div>
                        </router-link>
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

              <!-- Login Button -->
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
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SiteLogo from '@/components/SiteLogo.vue'

const router = useRouter()
const authStore = useAuthStore()

const showUserMenu = ref(false)

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
  showUserMenu.value = false
}

// Handle logout
const handleLogout = async () => {
  await authStore.logout()
  showUserMenu.value = false
  router.push('/comic')
}
</script>

<style scoped>
/* Safe area for mobile devices */
.pt-safe {
  padding-top: env(safe-area-inset-top);
}
</style>
