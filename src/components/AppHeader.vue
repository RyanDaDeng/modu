<template>
  <header class="relative">
    <!-- Banner Background -->
    <div class="relative h-40 sm:h-48 lg:h-56">
      <!-- Banner Image -->
      <div 
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: 'url(/img_1.png)' }"
      >
        <!-- Multi-layer gradient for smooth transition - brightened -->
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40"></div>
        <!-- Very subtle top gradient for nav text -->
        <div class="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/5 to-transparent"></div>
      </div>
      
      <!-- Top Navigation Bar -->
      <nav class="relative z-40">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-between h-16 sm:h-20">
            <!-- Left Section: Logo and Main Nav -->
            <div class="flex items-center gap-6">
              <!-- Logo -->
              <router-link to="/" class="flex items-center">
                <SiteLogo :size="'small'" />
              </router-link>
              
              <!-- Main Navigation Links - Desktop -->
              <div class="hidden lg:flex items-center gap-1">
                <router-link
                  v-for="item in mainNavItems"
                  :key="item.path"
                  :to="item.path"
                  class="px-3 py-2 text-white hover:text-white text-sm font-medium hover:bg-white/20 rounded-lg transition-all shadow-text"
                  :class="{ 'bg-white/30': $route.path === item.path }"
                >
                  {{ item.name }}
                </router-link>
              </div>
            </div>

            <!-- Center Section: Search Bar -->
            <div class="flex-1 max-w-xl mx-4 hidden sm:block">
              <div class="relative">
                <input
                  v-model="searchQuery"
                  @click="showFullscreenSearch = true"
                  @focus="showFullscreenSearch = true"
                  type="text"
                  placeholder="搜索漫画..."
                  class="w-full px-4 py-2 pl-10 bg-white/90 backdrop-blur-sm rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-pink-400 transition-all cursor-pointer"
                  readonly
                />
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <button
                  @click="showFullscreenSearch = true"
                  class="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1 bg-pink-500 hover:bg-pink-600 text-white text-sm rounded-full transition-colors"
                >
                  搜索
                </button>
              </div>
            </div>

            <!-- Right Section: User Actions -->
            <div class="flex items-center gap-2 sm:gap-4">
              <!-- Quick Links - Desktop -->
              <div class="hidden md:flex items-center gap-2">
                <button
                  @click="showImageServerModal = true"
                  class="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer"
                  title="图片服务器设置"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                
                <router-link
                  to="/collection"
                  class="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  title="我的收藏"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </router-link>
                
                <router-link
                  to="/vip"
                  class="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-medium rounded-full hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  开通VIP
                </router-link>
              </div>
              
              <!-- Mobile Icons - Show on mobile only -->
              <div class="flex md:hidden items-center gap-1">
                <!-- Settings Icon -->
                <button
                  @click="showImageServerModal = true"
                  class="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer"
                  title="图片服务器设置"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                
                <!-- Collection Icon -->
                <router-link
                  to="/collection"
                  class="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  title="我的收藏"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </router-link>
                
                <!-- VIP Button -->
                <router-link
                  to="/vip"
                  class="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-medium rounded-full hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  VIP
                </router-link>
              </div>

              <!-- User Avatar / Login Button -->
              <div v-if="authStore.isLoggedIn" class="relative user-dropdown-container">
                <button
                  @click="showUserMenu = !showUserMenu"
                  class="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                >
                  <div class="w-7 h-7 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {{ userInitial }}
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
                  class="fixed inset-0 z-[99] sm:hidden"
                ></div>
                
                <!-- User Dropdown Menu -->
                <div
                  v-if="showUserMenu"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-[100]"
                >
                  <router-link
                    to="/profile"
                    @click="showUserMenu = false"
                    class="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    个人中心
                  </router-link>
                  <router-link
                    to="/collection"
                    @click="showUserMenu = false"
                    class="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    我的收藏
                  </router-link>
                  <hr class="my-2 border-gray-200" />
                  <button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    退出登录
                  </button>
                </div>
              </div>
              <router-link
                v-else
                to="/login"
                class="px-4 py-1.5 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-full transition-all"
              >
                登录
              </router-link>
            </div>
          </div>
        </div>
      </nav>

      <!-- Secondary Navigation Bar -->
      <div class="absolute bottom-0 left-0 right-0">
        <div class="container mx-auto px-4">
          <div class="flex items-center gap-4 sm:gap-6 h-12 overflow-x-auto scrollbar-hide">
            <router-link
              v-for="(item, index) in categoryItems"
              :key="`cat-${index}-${item.name}`"
              :to="item.path"
              class="flex-shrink-0 px-3 py-1 text-white/80 hover:text-white text-sm font-medium hover:bg-white/10 rounded-lg transition-all whitespace-nowrap"
              :class="{ 'text-pink-400 bg-white/10': $route.path === item.path }"
            >
              {{ item.name }}
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Server Settings Modal -->
    <ServerSettings v-model="showServerSettings" />
    
    <!-- Image Server Modal -->
    <ImageServerModal v-model="showImageServerModal" />
    
    <!-- Fullscreen Search Modal -->
    <FullscreenSearch v-model="showFullscreenSearch" />

  </header>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import SiteLogo from '@/components/SiteLogo.vue'
import ServerSettings from '@/components/ServerSettings.vue'
import FullscreenSearch from '@/components/FullscreenSearch.vue'
import ImageServerModal from '@/components/ImageServerModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

// State
const searchQuery = ref('')
const showUserMenu = ref(false)
const showServerSettings = ref(false)
const showFullscreenSearch = ref(false)
const showImageServerModal = ref(false)

// Navigation Items
const mainNavItems = [
  { name: '首页', path: '/' },
  { name: '最新', path: '/latest' },
  { name: '分类', path: '/catalog' },
  { name: '更新', path: '/updates' },
]

// Dynamic categories from store only
const categoryItems = computed(() => {
  const storeCategories = appStore.navCategories
  
  // Always include home as first item
  const items = [{ name: '热门推荐', path: '/' }]
  
  // If we have categories from API, use them
  if (storeCategories && storeCategories.length > 0) {
    // Take first 6 categories and format them
    const apiCategories = storeCategories.slice(0, 6).map((cat, index) => ({
      name: cat.name || cat.title,
      // First category (index 0) doesn't need c= parameter as it's the default
      path: index === 0 ? '/catalog' : `/catalog?c=${cat.slug || cat.id}`
    }))
    items.push(...apiCategories)
  }
  
  return items
})

// Computed
const userInitial = computed(() => {
  return authStore.user?.name?.charAt(0).toUpperCase() || 'U'
})

// Methods
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`)
    searchQuery.value = ''
  }
}

const handleLogout = async () => {
  showUserMenu.value = false
  await authStore.logout()
  router.push('/')
}
</script>

<style scoped>
/* Hide scrollbar for category items */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Slide transition for mobile menu */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from .absolute.right-0,
.slide-leave-to .absolute.right-0 {
  transform: translateX(100%);
}

.slide-enter-from .absolute.inset-0,
.slide-leave-to .absolute.inset-0 {
  opacity: 0;
}
</style>