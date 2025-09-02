<template>
  <div class="min-h-screen" :style="backgroundStyle">
    <!-- AppHeader - Show on desktop always, show on mobile when showTopNav is true -->
    <AppHeader v-if="!hideAppHeader" :class="showTopNav ? '' : 'hidden lg:block'" />

    <!-- Mobile Header with back button - Show on mobile when showTopNav is false -->
    <div v-if="!showTopNav && !noHeader" class="lg:hidden sticky top-0 left-0 right-0 z-20">
      <!-- Glassmorphism background -->
      <div class="absolute inset-0 bg-gray-900/80 backdrop-blur-xl border-b border-white/10"></div>
      
      <!-- Gradient bottom border -->
      <div class="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>
      
      <div class="relative container mx-auto px-4 pt-safe">
        <div class="flex items-center justify-between h-14">
          <!-- Back Button -->
          <button
            v-if="shouldShowBack"
            @click.prevent="handleBack"
            class="group flex items-center space-x-1 text-gray-300 hover:text-pink-400 transition-all duration-300 flex-shrink-0 cursor-pointer relative z-10"
          >
            <!-- Glow effect on hover -->
            <div class="absolute -inset-2 bg-pink-500/0 group-hover:bg-pink-500/10 rounded-lg transition-all duration-300 pointer-events-none"></div>
            <svg class="w-5 h-5 relative transition-transform group-active:scale-95" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span class="text-sm font-medium relative">{{ backText }}</span>
          </button>
          <div v-else class="w-16"></div>
          
          <!-- Title with gradient text on hover -->
          <div class="flex-1 min-w-0 px-2">
            <slot name="title">
              <h1 class="text-gray-100 font-semibold text-base truncate text-center transition-all duration-300 hover:bg-gradient-to-r hover:from-pink-400 hover:to-purple-400 hover:bg-clip-text hover:text-transparent">
                {{ title }}
              </h1>
            </slot>
          </div>
          
          <!-- Right Action Slot -->
          <div class="flex-shrink-0 w-16 flex justify-end">
            <slot name="action"></slot>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Main Content Area with customizable background -->
    <div 
      class="min-h-screen"
      :class="{ 
        'relative': hasBackgroundImage
      }"
    >
      <!-- Background overlay if needed -->
      <div v-if="hasBackgroundImage && backgroundOverlay" 
        class="absolute inset-0 pointer-events-none"
        :class="backgroundOverlay"
      ></div>
      
      <!-- Content -->
      <div :class="{ 'relative': hasBackgroundImage }">
        <!-- Breadcrumbs - Show on all pages except home, hidden on mobile -->
        <div v-if="route.path !== '/' && !hideBreadcrumbs" class="hidden lg:block">
          <div class="container mx-auto px-4 py-2">
            <nav class="flex items-center space-x-2 text-sm">
              <router-link 
                to="/" 
                class="text-gray-500 hover:text-pink-400 transition-colors flex items-center"
              >
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                首页
              </router-link>
              
              <template v-for="(crumb, index) in breadcrumbs" :key="index">
                <svg class="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                
                <router-link 
                  v-if="crumb.path && index < breadcrumbs.length - 1"
                  :to="crumb.path"
                  class="text-gray-500 hover:text-pink-400 transition-colors"
                >
                  {{ crumb.name }}
                </router-link>
                
                <span 
                  v-else
                  class="text-gray-300"
                >
                  {{ crumb.name }}
                </span>
              </template>
            </nav>
          </div>
        </div>
        
        <!-- Page Loading Overlay -->
        <div v-if="pageLoading" class="min-h-[60vh] flex items-center justify-center">
          <LoadingSpinner />
        </div>
        
        <!-- Page Content -->
        <div v-show="!pageLoading">
          <slot></slot>
        </div>
      </div>
    </div>
    
    <!-- Mobile Bottom Navigation (if needed) -->
    <MobileBottomNav v-if="showBottomNav" />
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import MobileBottomNav from '@/components/MobileBottomNav.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showBack: {
    type: Boolean,
    default: true
  },
  backText: {
    type: String,
    default: '返回'
  },
  backTo: {
    type: String,
    default: null
  },
  showBottomNav: {
    type: Boolean,
    default: true
  },
  noHeader: {
    type: Boolean,
    default: false
  },
  hideAppHeader: {
    type: Boolean,
    default: false
  },
  showTopNav: {
    type: Boolean,
    default: false
  },
  hideBreadcrumbs: {
    type: Boolean,
    default: false
  },
  customBreadcrumbs: {
    type: Array,
    default: null
  },
  // Page loading state
  pageLoading: {
    type: Boolean,
    default: false
  },
  // Background customization
  backgroundColor: {
    type: String,
    default: 'bg-gray-900'
  },
  backgroundImage: {
    type: String,
    default: '/img_6.png'
  },
  backgroundOverlay: {
    type: String,
    default: 'bg-black/80'
  }
})

const router = useRouter()
const route = useRoute()

// Don't show back button on home page
const shouldShowBack = computed(() => {
  return props.showBack && route.path !== '/'
})

// Generate breadcrumbs based on current route
const breadcrumbs = computed(() => {
  // If custom breadcrumbs provided, use them
  if (props.customBreadcrumbs) {
    return props.customBreadcrumbs
  }
  
  // Auto-generate breadcrumbs based on route
  const crumbs = []
  const path = route.path
  const query = route.query
  
  // Define route mappings for breadcrumbs
  if (path === '/latest') {
    crumbs.push({ name: '最新更新', path: null })
  } else if (path === '/catalog') {
    crumbs.push({ name: '分类浏览', path: null })
  } else if (path === '/updates') {
    crumbs.push({ name: '更新', path: null })
  } else if (path === '/collection') {
    crumbs.push({ name: '我的收藏', path: null })
  } else if (path === '/search') {
    const searchQuery = query.wd || query.q
    if (searchQuery) {
      crumbs.push({ name: `搜索: ${searchQuery}`, path: null })
    } else {
      crumbs.push({ name: '搜索', path: null })
    }
  } else if (path.startsWith('/chapter/')) {
    crumbs.push({ name: '漫画详情', path: null })
  } else if (path === '/vip') {
    crumbs.push({ name: 'VIP会员', path: null })
  } else if (path === '/profile') {
    crumbs.push({ name: '个人中心', path: null })
  } else if (path === '/recharge-history') {
    crumbs.push({ name: '充值记录', path: null })
  } else if (path === '/login') {
    crumbs.push({ name: '登录', path: null })
  } else if (path === '/register') {
    crumbs.push({ name: '注册', path: null })
  } else if (path === '/terms') {
    crumbs.push({ name: '服务条款', path: null })
  } else if (path === '/privacy') {
    crumbs.push({ name: '隐私政策', path: null })
  }
  
  return crumbs
})

// Background style
const hasBackgroundImage = computed(() => !!props.backgroundImage)

const backgroundStyle = computed(() => {
  if (props.backgroundImage) {
    return {
      backgroundImage: `url('${props.backgroundImage}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }
  }
  return {}
})

// Handle back button click
const handleBack = () => {
  if (props.backTo) {
    router.push(props.backTo)
  } else {
    router.back()
  }
}
</script>

<style scoped>
/* Ensure proper spacing for fixed header */
.pt-14 {
  padding-top: 3.5rem;
}
</style>
