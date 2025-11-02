<template>
  <div id="app" class="min-h-screen flex flex-col">
    <!-- Initial Loading Screen -->
    <transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-500"
      enter-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="initialLoading" class="fixed inset-0 z-[200] flex items-center justify-center">
        <!-- Background image -->
        <div class="absolute inset-0">
          <img src="/img.png" alt="" class="w-full h-full object-cover" />
        </div>
        <!-- Dark overlay for better spinner visibility -->
        <div class="absolute inset-0 bg-black/50"></div>
        <!-- Loading spinner -->
        <div class="relative z-10">
          <LoadingSpinner />
        </div>
      </div>
    </transition>
    
    <!-- Main Content - Hidden during initial load -->
    <template v-if="!initialLoading">
      <main class="flex-grow">
        <router-view v-slot="{ Component, route }">
          <keep-alive :include="cachedViews">
            <component :is="Component" :key="cachedViews.includes(Component?.name) ? Component?.name : route.path" />
          </keep-alive>
        </router-view>
      </main>
      <AppFooter v-if="!isChapterView" />
      <BackToTop />
      <AgeWarning />
      <ToastNotification />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import AppFooter from '@/components/AppFooter.vue'
import BackToTop from '@/components/BackToTop.vue'
import AgeWarning from '@/components/AgeWarning.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()
const appStore = useAppStore()
const authStore = useAuthStore()

const initialLoading = ref(true)
const isChapterView = computed(() => false) // Always show header and nav

// Define which views should be cached
const cachedViews = [
  'HomeView',
  'CatalogView',
  'UpdatesView',
  'LatestView',
  'CollectionView',
  'SearchView',
  'VideoHomeView'
]

onMounted(async () => {
  try {
    // Check for referral ID in URL
    const urlParams = new URLSearchParams(window.location.search)
    const fromId = urlParams.get('fromid')
    if (fromId) {
      // Store referral ID in localStorage
      localStorage.setItem('referral_from_id', fromId)
      // Remove fromid from URL to clean it up
      const cleanUrl = window.location.pathname + window.location.hash
      window.history.replaceState({}, document.title, cleanUrl)
    }
    
    // 初始化应用
    appStore.initializeApp()
    
    // 初始化认证状态（页面刷新时恢复登录状态）
    await authStore.initAuth()
    
    // Wait for next DOM update cycle
    await nextTick()
    
    // Add a small delay to ensure smooth transition
    setTimeout(() => {
      initialLoading.value = false
    }, 800)
  } catch (error) {
    console.error('App initialization error:', error)
    // Hide loading even on error
    initialLoading.value = false
  }
})
</script>

<style>
@import './app.css';
</style>
