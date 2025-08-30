<template>
  <AppLayout :title="searchQuery ? `搜索结果: ${searchQuery}` : '搜索'">
    <div class="container mx-auto px-4 py-6">

      <!-- Login prompt for non-logged users -->
      <div v-if="!authStore.isLoggedIn" class="text-center py-12">
        <div class="max-w-md mx-auto">
          <svg class="w-24 h-24 text-gray-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
          <h2 class="text-xl font-bold text-white mb-2">需要登录才能使用搜索</h2>
          <p class="text-gray-400 mb-6">登录后即可搜索海量漫画资源</p>
          <div class="space-y-3">
            <button
              @click="router.push('/login')"
              class="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 cursor-pointer"
            >
              立即登录
            </button>
            <button
              @click="router.push('/register')"
              class="w-full px-6 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-gray-300 rounded-xl font-medium hover:bg-gray-700/50 transition-all cursor-pointer"
            >
              注册新账号
            </button>
          </div>
        </div>
      </div>

      <div v-else-if="!searchQuery" class="text-center py-12">
        <svg class="w-24 h-24 text-gray-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
        </svg>
        <p class="text-gray-400">请输入搜索关键词</p>
      </div>

      <div v-else>
        <div v-if="loading && !comics.length" class="flex justify-center py-12">
          <LoadingSpinner />
        </div>

        <div v-else-if="!comics.length && !loading" class="text-center py-12">
          <svg class="w-24 h-24 text-gray-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <p class="text-gray-400">没有找到相关结果</p>
        </div>

        <div v-else class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
          <ComicCard
            v-for="comic in comics"
            :key="`${comic.id}-${comic.page}`"
            :comic="comic"
          />
        </div>

        <div v-if="loading && comics.length" class="flex justify-center py-8">
          <LoadingSpinner />
        </div>

        <div v-if="!hasMore && comics.length" class="text-center py-8 text-gray-400">
          没有更多结果了
        </div>

        <div ref="loadMoreTrigger" class="h-20"></div>
      </div>
    </div>
  </AppLayout>
</template>

<script>
export default {
  name: 'SearchView'
}
</script>

<script setup>
import { ref, watch, onMounted, onUnmounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { getSearchResults } from '@/api/request'
import AppLayout from '@/components/AppLayout.vue'
import ComicCard from '@/components/ComicCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const comics = ref([])
const loading = ref(false)
const currentPage = ref(1)
const hasMore = ref(true)
const loadMoreTrigger = ref(null)

let observer = null

// Session storage keys for state persistence
const SEARCH_STATE_KEY = 'searchPageState'
const SEARCH_SCROLL_KEY = 'searchPageScroll'

// Save search state to session storage
const saveSearchState = () => {
  const state = {
    searchQuery: searchQuery.value,
    comics: comics.value,
    currentPage: currentPage.value,
    hasMore: hasMore.value,
    timestamp: Date.now()
  }
  sessionStorage.setItem(SEARCH_STATE_KEY, JSON.stringify(state))
}

// Restore search state from session storage
const restoreSearchState = () => {
  const savedState = sessionStorage.getItem(SEARCH_STATE_KEY)
  if (savedState) {
    try {
      const state = JSON.parse(savedState)
      // Only restore if it's the same search query and within 30 minutes
      if (state.searchQuery === searchQuery.value && 
          (Date.now() - state.timestamp) < 30 * 60 * 1000) {
        comics.value = state.comics || []
        currentPage.value = state.currentPage || 1
        hasMore.value = state.hasMore !== undefined ? state.hasMore : true
        
        // Restore scroll position after DOM update
        setTimeout(() => {
          const scrollPosition = sessionStorage.getItem(SEARCH_SCROLL_KEY)
          if (scrollPosition) {
            window.scrollTo(0, parseInt(scrollPosition))
          }
        }, 100)
        return true
      }
    } catch (error) {
      console.error('Failed to restore search state:', error)
    }
  }
  return false
}

const searchComics = async (reset = false) => {
  // Check if user is logged in first
  if (!authStore.isLoggedIn) {
    console.log('User not logged in, skipping search')
    return
  }
  
  if (!searchQuery.value || (loading.value && !reset)) return
  
  if (reset) {
    comics.value = []
    currentPage.value = 1
    hasMore.value = true
    // Add search query to history when it's a new search
    appStore.addSearchHistory(searchQuery.value)
    // Clear saved state for new search
    sessionStorage.removeItem(SEARCH_STATE_KEY)
    sessionStorage.removeItem(SEARCH_SCROLL_KEY)
  }
  
  if (!hasMore.value) return
  
  loading.value = true
  
  try {
    const data = await getSearchResults(searchQuery.value, currentPage.value)
    console.log('Search API response:', data)
    
    // Handle both possible response formats
    const searchResults = Array.isArray(data) ? data : (data?.content || [])
    
    if (!searchResults || searchResults.length === 0) {
      hasMore.value = false
    } else {
      const comicsWithPage = searchResults.map(comic => ({
        ...comic,
        page: currentPage.value
      }))
      comics.value.push(...comicsWithPage)
      currentPage.value++
      
      // Check if we got less than expected results (indicating last page)
      if (searchResults.length < 80) {
        hasMore.value = false
      }
    }
    
    // Save state after successful load
    saveSearchState()
  } catch (error) {
    console.error('Search failed:', error)
    hasMore.value = false
  } finally {
    loading.value = false
  }
}

const setupInfiniteScroll = () => {
  if (observer) {
    observer.disconnect()
  }
  
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !loading.value && hasMore.value && searchQuery.value && authStore.isLoggedIn) {
        searchComics()
      }
    },
    { rootMargin: '100px' }
  )
  
  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value)
  }
}

// Save scroll position before leaving
const saveScrollPosition = () => {
  sessionStorage.setItem(SEARCH_SCROLL_KEY, window.scrollY.toString())
}

watch(() => route.query.wd || route.query.q, (newQuery) => {
  console.log('Search query changed:', newQuery, 'Current:', searchQuery.value)
  if (newQuery !== searchQuery.value) {
    searchQuery.value = newQuery || ''
    if (searchQuery.value && authStore.isLoggedIn) {
      // Only search if user is logged in
      // Try to restore previous state first
      const restored = restoreSearchState()
      if (!restored) {
        // Only search if state wasn't restored
        searchComics(true)
      }
    }
  }
}, { immediate: true })

onMounted(() => {
  setupInfiniteScroll()
  
  // Save scroll position when navigating away
  window.addEventListener('beforeunload', saveScrollPosition)
  
  // Also save state before route change
  router.beforeEach((to, from, next) => {
    if (from.name === 'search' && comics.value.length > 0) {
      saveScrollPosition()
      saveSearchState()
    }
    next()
  })
})

onBeforeUnmount(() => {
  // Save state when component is unmounted
  if (comics.value.length > 0) {
    saveScrollPosition()
    saveSearchState()
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
  window.removeEventListener('beforeunload', saveScrollPosition)
})
</script>