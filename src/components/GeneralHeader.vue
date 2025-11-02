<template>
  <header class="relative">
    <!-- Banner Background -->
    <div class="relative h-40 sm:h-48 lg:h-56">
      <!-- Banner Image -->
      <div
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: 'url(/img_1.png)' }"
      >
        <!-- Multi-layer gradient for smooth transition -->
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40"></div>
        <!-- Very subtle top gradient for nav text -->
        <div class="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/5 to-transparent"></div>
      </div>

      <!-- Top Navigation Bar -->
      <nav class="relative z-50 pt-safe">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-between h-16 sm:h-20">
            <!-- Left Section: Logo and Module Links -->
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

              <!-- Module Links -->
              <div class="hidden md:flex items-center gap-4">
                <router-link
                  to="/comic"
                  class="text-gray-300 hover:text-pink-400 text-sm font-medium transition-colors"
                >
                  漫画
                </router-link>
                <router-link
                  to="/video"
                  class="text-gray-300 hover:text-purple-400 text-sm font-medium transition-colors"
                >
                  视频
                </router-link>
              </div>
            </div>

            <!-- Right Section: User Actions -->
            <div class="flex items-center gap-2 sm:gap-4">
              <!-- APP Install Button - Mobile and Desktop -->
              <router-link
                v-if="appStore.shouldShowAppDownload"
                to="/app-download"
                class="flex items-center gap-1 px-2.5 py-1 bg-gray-700/40 backdrop-blur-sm border border-gray-500/40 hover:bg-gray-600/50 hover:border-pink-500/30 text-gray-300 hover:text-pink-300 rounded-lg transition-all cursor-pointer"
                title="安装 APP"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span class="text-xs font-medium">APP</span>
              </router-link>

              <!-- Quick Links - Desktop -->
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

              <!-- User Profile Dropdown -->
              <UserDropdown />
            </div>
          </div>
        </div>
      </nav>

      <!-- Secondary Navigation Bar -->
      <div class="absolute bottom-0 left-0 right-0">
        <div class="container mx-auto px-4">
          <div class="flex items-center gap-4 sm:gap-6 h-12">
            <!-- 魔都漫画 Link -->
            <router-link
              to="/comic"
              class="flex-shrink-0 px-3 py-1 whitespace-nowrap"
              title="魔都漫画"
            >
              <span class="text-sm font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                魔都漫画
              </span>
            </router-link>

            <!-- 魔都视频 Link -->
            <router-link
              to="/video"
              class="flex-shrink-0 px-3 py-1 whitespace-nowrap"
              title="魔都视频"
            >
              <span class="text-sm font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                魔都视频
              </span>
            </router-link>

            <!-- Permanent Link Button -->
            <button
              @click="showPermanentLinkModal = true"
              class="flex-shrink-0 px-3 py-1 text-white/80 hover:text-white text-sm font-medium hover:bg-white/10 rounded-lg transition-all whitespace-nowrap cursor-pointer"
              title="永久链接"
            >
              永久链接
            </button>

            <!-- Join Community Link -->
            <a
              href="https://t.me/+frktRDVHynY3OTA1"
              target="_blank"
              rel="noopener noreferrer"
              class="flex-shrink-0 px-3 py-1 text-pink-300 hover:text-pink-200 text-sm font-bold hover:bg-white/10 rounded-lg transition-all whitespace-nowrap"
              title="加入社群"
            >
              加入社群
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Permanent Link Modal -->
    <PermanentLinksModal v-model="showPermanentLinkModal" />
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import UserDropdown from '@/components/UserDropdown.vue'
import PermanentLinksModal from '@/components/PermanentLinksModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()
const showUserMenu = ref(false)
const showPermanentLinkModal = ref(false)

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

// 用户名首字母
const userInitial = computed(() => {
  if (!authStore.user?.name) return 'U'
  return authStore.user.name.charAt(0).toUpperCase()
})

// 切换用户菜单
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// 关闭用户菜单
const closeUserMenu = () => {
  showUserMenu.value = false
}

// 处理登出
const handleLogout = async () => {
  await authStore.logout()
  closeUserMenu()
  router.push('/comic')
}

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>

<style scoped>
/* Logo enhanced effects */
.logo-enhanced {
  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.3))
          drop-shadow(0 0 4px rgba(255, 255, 255, 0.2));
}

.logo-container {
  position: relative;
}

.logo-container::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  z-index: -1;
}

.logo-container:hover .logo-enhanced {
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.4))
          drop-shadow(0 0 6px rgba(255, 255, 255, 0.3))
          brightness(1.1);
  transition: filter 0.3s ease;
}

@keyframes gradient {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

/* Hide scrollbar for secondary nav */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}
</style>
