<template>
  <AppLayout :title="searchQuery ? `搜索结果: ${searchQuery}` : '搜索'">
    <!-- Action slot with search icon -->
    <template #action>
      <button
        @click="handleSearchClick"
        class="lg:hidden p-2 text-gray-400 hover:text-pink-400 transition-colors"
        title="搜索"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </template>
    
    <!-- Mobile Search Bar -->
    <MobileSearchBar
        v-if="authStore.isLoggedIn"
        v-model="searchQuery"
        :show-bar="true"
        :show-current-query="true"
        @click="handleSearchClick"
        @clear="handleClear"
    />

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

      <div v-else-if="!searchQuery">
        <!-- Categories Tags Display -->
        <div v-if="categoryBlocks.length > 0" class="space-y-6 max-w-5xl mx-auto">
          <div class="text-center mb-8">
            <h2 class="text-2xl sm:text-3xl font-bold text-white mb-3 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">热门标签</h2>
            <p class="text-gray-400">点击标签快速搜索相关漫画</p>
          </div>
          
          <div class="grid gap-6 md:grid-cols-2">
            <div v-for="block in categoryBlocks" :key="block.title" 
                 class="group bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-pink-500/30 transition-all duration-300">
              <h3 class="text-lg font-bold text-white mb-4 flex items-center">
                <span class="w-1.5 h-6 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full mr-3 group-hover:h-7 transition-all"></span>
                {{ block.title }}
              </h3>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="tag in block.content"
                  :key="tag"
                  @click="searchByTag(tag)"
                  class="group/tag px-3 py-1.5 bg-gray-800/50 hover:bg-gradient-to-r hover:from-pink-500/30 hover:to-purple-600/30 border border-white/10 hover:border-pink-500/40 text-gray-300 hover:text-white rounded-lg text-sm transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-pink-500/20 hover:scale-105 active:scale-95"
                >
                  <span class="relative">
                    {{ tag }}
                    <span class="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 group-hover/tag:opacity-20 blur transition-opacity"></span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Loading Categories -->
        <div v-else-if="loadingCategories" class="flex justify-center py-12">
          <LoadingSpinner />
        </div>
        
        <!-- Fallback if no categories -->
        <div v-else class="text-center py-12">
          <svg class="w-24 h-24 text-gray-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
          <p class="text-gray-400">请输入搜索关键词</p>
        </div>
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
    
    <!-- Fullscreen Search Modal -->
    <FullscreenSearch 
      v-model="showFullscreenSearch" 
      @search="handleDirectSearch"
    />
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
import { getSearchResults, getCategories } from '@/api/request'
import AppLayout from '@/components/AppLayout.vue'
import ComicCard from '@/components/ComicCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import FullscreenSearch from '@/components/FullscreenSearch.vue'
import MobileSearchBar from '@/components/MobileSearchBar.vue'

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
const showFullscreenSearch = ref(false)
const categoryBlocks = ref([])
const loadingCategories = ref(false)

let observer = null

// Handle search click
const handleSearchClick = () => {
  showFullscreenSearch.value = true
}

// Handle direct search (from FullscreenSearch component when already on search page)
const handleDirectSearch = (query) => {
  searchQuery.value = query
  // Clear previous results
  comics.value = []
  currentPage.value = 1
  hasMore.value = true
  // Clear saved state
  sessionStorage.removeItem(SEARCH_STATE_KEY)
  sessionStorage.removeItem(SEARCH_SCROLL_KEY)
  // Search directly without changing URL
  searchComics(true)
}

// Handle clear
const handleClear = () => {
  searchQuery.value = ''
  comics.value = []
  hasMore.value = true
  currentPage.value = 1
  // Clear saved state
  sessionStorage.removeItem(SEARCH_STATE_KEY)
  sessionStorage.removeItem(SEARCH_SCROLL_KEY)
  // Navigate to search without query
  router.push('/search')
  // Load categories if not already loaded
  loadCategories()
}

// Load categories
const loadCategories = async () => {
  if (!authStore.isLoggedIn || categoryBlocks.value.length > 0) return
  
  loadingCategories.value = true
  try {
    const response = await getCategories()
    if (response && response.blocks) {
      categoryBlocks.value = response.blocks
    }
  } catch (error) {
    console.error('Failed to load categories:', error)
  } finally {
    loadingCategories.value = false
  }
}

// Search by tag
const searchByTag = (tag) => {
  console.log('Searching by tag:', tag)
  searchQuery.value = tag
  
  // Show loading immediately
  loading.value = true
  
  // Scroll to top of page
  window.scrollTo({ top: 0, behavior: 'smooth' })
  
  // Clear previous search results and state
  comics.value = []
  currentPage.value = 1
  hasMore.value = true
  sessionStorage.removeItem(SEARCH_STATE_KEY)
  sessionStorage.removeItem(SEARCH_SCROLL_KEY)
  
  // Add to search history
  appStore.addSearchHistory(tag)
  
  // Search directly without changing URL
  searchComics(true)
}

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
    
    console.log('Parsed search results:', searchResults)
    console.log('Number of results:', searchResults.length)
    
    if (!searchResults || searchResults.length === 0) {
      hasMore.value = false
    } else {
      const comicsWithPage = searchResults.map(comic => ({
        ...comic,
        page: currentPage.value
      }))
      comics.value.push(...comicsWithPage)
      console.log('Comics array after update:', comics.value)
      console.log('Total comics loaded:', comics.value.length)
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

watch(() => route.query.wd, (newQuery) => {
  console.log('Search query changed:', newQuery, 'Current:', searchQuery.value)
  // Only update if there's an actual change and newQuery is not undefined
  if (newQuery !== undefined && newQuery !== searchQuery.value) {
    searchQuery.value = newQuery || ''
    if (searchQuery.value && authStore.isLoggedIn) {
      // Only search if user is logged in
      // Try to restore previous state first
      const restored = restoreSearchState()
      if (!restored) {
        // Only search if state wasn't restored
        searchComics(true)
      }
    } else if (!searchQuery.value && authStore.isLoggedIn) {
      // Load categories when search query is empty
      loadCategories()
    }
  }
}, { immediate: true })

onMounted(() => {
  setupInfiniteScroll()
  
  // Load categories if no search query
  if (!searchQuery.value) {
    loadCategories()
  }
  
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
