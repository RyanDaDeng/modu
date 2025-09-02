<template>
  <AppLayout title="分类浏览" :page-loading="pageLoading">
    <!-- Filter Bar Container -->
    <div class="container mx-auto px-4 py-6">

      <!-- Loading Categories -->
      <div v-if="loadingCategories" class="relative">
        <!-- Gradient border effect -->
        <div class="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-lg blur-xl"></div>
        <div class="relative bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-lg p-4">
          <div class="flex flex-col items-center">
            <LoadingSpinner />
            <span class="mt-3 text-gray-400 text-sm">加载分类中...</span>
          </div>
        </div>
      </div>

      <!-- Mobile Filter Bar -->
      <div v-if="categories.length > 0" class="sm:hidden mb-4">
        <div class="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl p-[1px]">
          <div class="bg-gray-900/90 backdrop-blur-xl rounded-xl p-3">
            <!-- Main filter button with better visual cues -->
            <button 
              @click="showFilterModal = true"
              class="w-full mb-3 relative group"
            >
              <!-- Animated gradient background -->
              <div class="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl blur group-active:blur-xl transition-all"></div>
              
              <!-- Button content -->
              <div class="relative flex items-center justify-between bg-gray-800/90 backdrop-blur rounded-xl px-4 py-3 border border-gray-700 group-hover:border-pink-500/50 group-active:scale-[0.98] transition-all">
                <div class="flex items-center gap-3">
                  <!-- Animated filter icon -->
                  <div class="relative">
                    <svg class="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    <div class="absolute inset-0 bg-pink-400 blur-lg opacity-50 animate-pulse"></div>
                  </div>
                  
                  <div class="text-left">
                    <div class="text-xs text-gray-400 mb-0.5">当前筛选</div>
                    <div class="text-sm font-medium text-white">
                      {{ selectedCategory?.name || '全部' }} · {{ sortOptions.find(s => s.value === selectedSort)?.label || '最新' }}
                    </div>
                  </div>
                </div>
                
                <!-- Action indicator -->
                <div class="flex items-center gap-2">
                  <span class="text-xs text-pink-400 font-medium">点击修改</span>
                  <div class="bg-pink-500/20 rounded-lg p-1.5 group-hover:bg-pink-500/30 transition-colors">
                    <svg class="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          
          <!-- Quick sort buttons -->
          <div class="flex gap-2 overflow-x-auto pb-1">
            <button
              v-for="sort in quickSortOptions"
              :key="sort.value"
              @click="selectSort(sort.value)"
              :class="[
                'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                selectedSort === sort.value
                  ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50'
                  : 'bg-gray-800 text-gray-400 border border-gray-700'
              ]"
            >
              {{ sort.label }}
            </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop Filter Bar -->
      <div v-if="categories.length > 0" class="hidden sm:block relative">
        <!-- Gradient border effect -->
        <div class="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 rounded-lg blur-xl"></div>
        <div class="relative bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-lg p-4 space-y-4">
          <!-- Category Selection -->
          <div>
            <label class="text-sm text-gray-400 mb-2 block">分类</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="category in categories"
                :key="category.id"
                @click="selectCategory(category)"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                  selectedCategory?.id === category.id
                    ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700'
                ]"
              >
                {{ category.name }}
                <span v-if="category.total_albums > 0" class="ml-1 text-xs opacity-70">
                  ({{ formatNumber(category.total_albums) }})
                </span>
              </button>
            </div>
          </div>

          <!-- Sort Options -->
          <div>
            <label class="text-sm text-gray-400 mb-2 block">排序</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="sort in sortOptions"
                :key="sort.value"
                @click="selectSort(sort.value)"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                  selectedSort === sort.value
                    ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700'
                ]"
              >
                {{ sort.label }}
              </button>
            </div>
          </div>

          <!-- Sub Categories (hide for 最新A漫) -->
          <div v-if="selectedCategory?.sub_categories?.length && selectedCategory.id !== 0">
            <label class="text-sm text-gray-400 mb-2 block">子分类</label>
            <div class="flex flex-wrap gap-2">
              <button
                @click="selectSubCategory(null)"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                  !selectedSubCategory
                    ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700'
                ]"
              >
                全部
              </button>
              <button
                v-for="sub in selectedCategory.sub_categories"
                :key="sub.CID"
                @click="selectSubCategory(sub)"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                  selectedSubCategory?.CID === sub.CID
                    ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700'
                ]"
              >
                {{ sub.name }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Pagination -->
      <div v-if="hasSearched && totalPages > 1 && comics.length > 0" class="mt-4 mb-4">
        <Pagination
          :current-page="displayPage"
          :total-pages="totalPages"
          @change="handlePageChange"
        />
      </div>

      <!-- Theme Tags Section (only show when no category selected or showing default) -->
      <div v-if="!hasSearched" class="relative mt-2 sm:mt-4 mb-4 sm:mb-6">
        <!-- Gradient border effect -->
        <div class="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 rounded-lg blur-xl"></div>
        <div class="relative bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-lg p-3 sm:p-4">
        <div
          v-for="block in themeBlocks"
          :key="block.title"
          class="mb-3 sm:mb-4 last:mb-0"
        >
          <h3 class="text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">{{ block.title }}</h3>
          <div class="flex flex-wrap gap-1.5 sm:gap-2">
            <button
              v-for="tag in block.content"
              :key="tag"
              @click="searchTag(tag)"
              class="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-800/50 hover:bg-pink-500/20 text-gray-300 hover:text-pink-400 border border-gray-700 hover:border-pink-500/50 rounded-full text-xs sm:text-sm transition-colors cursor-pointer"
            >
              {{ tag }}
            </button>
          </div>
        </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-8 sm:py-12">
        <LoadingSpinner />
      </div>

      <!-- Comics Grid -->
      <div v-if="!loading && comics.length > 0" class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-3 md:gap-4 mt-4">
        <ComicCard
          v-for="comic in comics"
          :key="comic.id"
          :comic="comic"
        />
      </div>

      <!-- Empty State -->
      <div v-if="!loading && hasSearched && comics.length === 0" class="text-center py-8 sm:py-12">
        <p class="text-gray-400 text-sm">暂无相关漫画</p>
      </div>

      <!-- Load More Button -->
      <div
        v-if="hasMore && !loading && !loadingMore && comics.length"
        class="flex justify-center py-6 sm:py-8"
      >
        <button
          @click="loadComics()"
          class="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
        >
          加载更多
        </button>
      </div>

      <!-- Loading More Indicator -->
      <div v-if="loadingMore" class="flex justify-center py-6 sm:py-8">
        <LoadingSpinner />
      </div>
      
      <!-- Pagination -->
      <div v-if="hasSearched && totalPages > 1 && comics.length > 0" class="mt-8">
        <Pagination
          :current-page="displayPage"
          :total-pages="totalPages"
          @change="handlePageChange"
        />
      </div>
      
      <!-- Mobile Filter Drawer -->
      <BottomDrawer 
        v-model="showFilterModal"
        title="选择筛选条件"
        max-height="90vh"
      >
        <!-- Category Selection -->
        <div class="px-4 pb-4">
          <div class="text-sm text-gray-400 mb-3">分类</div>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="category in categories"
              :key="category.id"
              @click="selectCategoryAndClose(category)"
              :class="[
                'py-3 rounded-lg text-sm font-medium transition-colors',
                selectedCategory?.id === category.id
                  ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50'
                  : 'bg-gray-800 text-gray-300 border border-gray-700'
              ]"
            >
              {{ category.name }}
              <span v-if="category.total_albums > 0" class="block text-xs opacity-70 mt-1">
                ({{ formatNumber(category.total_albums) }})
              </span>
            </button>
          </div>
        </div>
        
        <!-- Sort Options -->
        <div class="px-4 pb-4">
          <div class="text-sm text-gray-400 mb-3">排序方式</div>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="sort in sortOptions"
              :key="sort.value"
              @click="selectSortAndClose(sort.value)"
              :class="[
                'py-3 rounded-lg text-sm font-medium transition-colors',
                selectedSort === sort.value
                  ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50'
                  : 'bg-gray-800 text-gray-300 border border-gray-700'
              ]"
            >
              {{ sort.label }}
            </button>
          </div>
        </div>
        
        <!-- Sub Categories -->
        <div v-if="selectedCategory?.sub_categories?.length && selectedCategory.id !== 0" class="px-4 pb-6">
          <div class="text-sm text-gray-400 mb-3">子分类</div>
          <div class="grid grid-cols-2 gap-2">
            <button
              @click="selectSubCategoryAndClose(null)"
              :class="[
                'py-3 rounded-lg text-sm font-medium transition-colors',
                !selectedSubCategory
                  ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50'
                  : 'bg-gray-800 text-gray-300 border border-gray-700'
              ]"
            >
              全部
            </button>
            <button
              v-for="sub in selectedCategory.sub_categories"
              :key="sub.CID"
              @click="selectSubCategoryAndClose(sub)"
              :class="[
                'py-3 rounded-lg text-sm font-medium transition-colors',
                selectedSubCategory?.CID === sub.CID
                  ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50'
                  : 'bg-gray-800 text-gray-300 border border-gray-700'
              ]"
            >
              {{ sub.name }}
            </button>
          </div>
        </div>
      </BottomDrawer>
    </div>
  </AppLayout>
</template>

<script>
export default {
  name: 'CatalogView'
}
</script>

<script setup>
import { ref, onMounted, onBeforeUnmount, onActivated, onDeactivated, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getCategoriesFilter, getCategories } from '@/api/request'
import AppLayout from '@/components/AppLayout.vue'
import ComicCard from '@/components/ComicCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import Pagination from '@/components/Pagination.vue'
import BottomDrawer from '@/components/BottomDrawer.vue'
import { formatNumber } from '@/utils/format'

const router = useRouter()
const route = useRoute()

// Key for storing state in sessionStorage
const CATALOG_STATE_KEY = 'catalogPageState'

// Categories data
const categories = ref([])
const themeBlocks = ref([])

// Filter states
const selectedCategory = ref(null)
const selectedSubCategory = ref(null)
const selectedSort = ref('mv') // Default to 总排名
const showFilterModal = ref(false)

// Sort options
const sortOptions = [
  { label: '最新', value: '' },
  { label: '最多爱心', value: 'tf' },
  { label: '总排名', value: 'mv' },
  { label: '月排名', value: 'mv_m' },
  { label: '周排名', value: 'mp_w' }
]

// Quick sort options for mobile (top 3)
const quickSortOptions = computed(() => [
  { label: '最新', value: '' },
  { label: '总榜', value: 'mv' },
  { label: '月榜', value: 'mv_m' },
  { label: '周榜', value: 'mp_w' }
])

// Comics data
const comics = ref([])
const loading = ref(false)
const pageLoading = ref(true) // Page loading state for AppLayout
const loadingCategories = ref(true)
const loadingMore = ref(false) // Separate loading state for load more
const currentPage = ref(0) // Start at 0 to detect if initialized
const hasMore = ref(true)
const hasSearched = ref(false)

// Pagination data
const totalItems = ref(0)
const itemsPerPage = ref(0)
const totalPages = ref(1)
const displayPage = ref(1) // For pagination display

// Parse query parameters
const parseQueryParams = () => {
  const query = route.query
  
  // Parse page parameter
  if (query.page) {
    const page = parseInt(query.page)
    if (!isNaN(page) && page > 0) {
      currentPage.value = page
      displayPage.value = page
    }
  } else if (currentPage.value === 0) {
    // Only set to 1 if not initialized yet
    currentPage.value = 1
    displayPage.value = 1
  }
  
  // Parse sort parameter (o parameter)
  if (query.o) {
    const sortValue = query.o
    const sortOption = sortOptions.find(opt => opt.value === sortValue)
    if (sortOption) {
      selectedSort.value = sortValue
    }
  }
  
  // Parse category parameter (c parameter)
  if (query.c && categories.value.length > 0) {
    // Check if it contains underscore for subcategory
    if (query.c.includes('_')) {
      const [mainSlug, subSlug] = query.c.split('_')
      const mainCategory = categories.value.find(cat => cat.slug === mainSlug)
      if (mainCategory) {
        selectedCategory.value = mainCategory
        if (mainCategory.sub_categories) {
          const subCategory = mainCategory.sub_categories.find(sub => sub.slug === subSlug)
          if (subCategory) {
            selectedSubCategory.value = subCategory
          }
        }
      }
    } else {
      // Just main category - try matching by slug, id (string or number)
      const mainCategory = categories.value.find(cat => {
        // Check if query.c matches slug
        if (cat.slug && cat.slug === query.c) return true
        // Check if query.c matches id (as string)
        if (cat.id && String(cat.id) === query.c) return true
        // Check if query.c is a number and matches id
        if (!isNaN(query.c) && cat.id === parseInt(query.c)) return true
        return false
      })
      if (mainCategory) {
        selectedCategory.value = mainCategory
        selectedSubCategory.value = null
      }
    }
  }
}

// Update URL with current filters
const updateURL = (usePush = false) => {
  const query = {}
  
  // Always include page in URL
  query.page = displayPage.value
  
  // Add sort if not default
  if (selectedSort.value && selectedSort.value !== 'mv') {
    query.o = selectedSort.value
  }
  
  // Add category
  if (selectedCategory.value) {
    // Use slug if available, otherwise use id
    let categoryParam = selectedCategory.value.slug || selectedCategory.value.id
    if (selectedSubCategory.value) {
      const subSlug = selectedSubCategory.value.slug || selectedSubCategory.value.CID
      categoryParam = `${categoryParam}_${subSlug}`
    }
    if (categoryParam) {
      query.c = categoryParam
    }
  }
  
  // Set flag to prevent watch handler from reacting to our own updates
  isUpdatingUrl.value = true
  
  // Use replace to avoid creating multiple history entries when filtering
  // Only use push for initial navigation or explicit page changes
  if (usePush) {
    router.push({ query })
  } else {
    router.replace({ query })
  }
}

// Save state to sessionStorage
const saveState = () => {
  const state = {
    categories: categories.value,
    themeBlocks: themeBlocks.value,
    selectedCategory: selectedCategory.value,
    selectedSubCategory: selectedSubCategory.value,
    selectedSort: selectedSort.value,
    comics: comics.value,
    currentPage: currentPage.value,
    displayPage: displayPage.value,
    hasMore: hasMore.value,
    totalItems: totalItems.value,
    totalPages: totalPages.value,
    itemsPerPage: itemsPerPage.value,
    hasSearched: hasSearched.value,
    timestamp: Date.now()
  }
  sessionStorage.setItem(CATALOG_STATE_KEY, JSON.stringify(state))
}

// Restore state from sessionStorage
const restoreState = () => {
  try {
    const savedState = sessionStorage.getItem(CATALOG_STATE_KEY)
    if (!savedState) return false
    
    const state = JSON.parse(savedState)
    
    // Check if state is not too old (5 minutes)
    if (Date.now() - state.timestamp > 5 * 60 * 1000) {
      sessionStorage.removeItem(CATALOG_STATE_KEY)
      return false
    }
    
    // Restore all state
    categories.value = state.categories || []
    themeBlocks.value = state.themeBlocks || []
    selectedCategory.value = state.selectedCategory
    selectedSubCategory.value = state.selectedSubCategory
    selectedSort.value = state.selectedSort || 'mv'
    comics.value = state.comics || []
    currentPage.value = state.currentPage || 1
    displayPage.value = state.displayPage || 1
    hasMore.value = state.hasMore ?? true
    totalItems.value = state.totalItems || 0
    totalPages.value = state.totalPages || 1
    itemsPerPage.value = state.itemsPerPage || 0
    hasSearched.value = state.hasSearched ?? false
    
    // Make sure loading states are false when restoring
    loading.value = false
    loadingMore.value = false
    loadingCategories.value = false
    pageLoading.value = false
    
    return true
  } catch (error) {
    console.error('Failed to restore state:', error)
    sessionStorage.removeItem(CATALOG_STATE_KEY)
    return false
  }
}

// Load categories
const loadCategories = async () => {
  loadingCategories.value = true
  try {
    const data = await getCategories()
    
    if (data) {
      categories.value = data.categories || []
      themeBlocks.value = data.blocks || []

      // Parse query params after categories are loaded
      parseQueryParams()
      
      // If no category selected from query, select first category by default
      if (!selectedCategory.value && categories.value.length > 0) {
        selectedCategory.value = categories.value[0]
      }
      
      // Load comics with current settings
      if (selectedCategory.value) {
        applyFilter(false) // Don't reset page on initial load
      }
    }
  } catch (error) {
    console.error('Failed to load categories:', error)
  } finally {
    loadingCategories.value = false
    pageLoading.value = false // Hide page loading after initial load
  }
}

// Load comics
const loadComics = async (reset = false) => {
  if ((reset && loading.value) || (!reset && loadingMore.value) || (!hasMore.value && !reset)) return

  // Use different loading states for reset vs append
  if (reset) {
    loading.value = true
  } else {
    loadingMore.value = true
  }

  try {
    // Build category parameter
    let categoryParam = selectedCategory.value?.slug || ''
    if (selectedSubCategory.value && categoryParam) {
      categoryParam = `${categoryParam}_${selectedSubCategory.value.slug}`
    }

    const data = await getCategoriesFilter(
      currentPage.value,
      selectedSort.value,
      categoryParam
    )

    if (data?.content) {
      if (reset) {
        comics.value = data.content
      } else {
        comics.value.push(...data.content)
      }

      // Set pagination data from response
      if (data.total !== undefined) {
        totalItems.value = data.total
      }
      
      // Calculate items per page from first page response
      if (itemsPerPage.value === 0 && data.content.length > 0) {
        itemsPerPage.value = data.content.length
      }
      
      // Calculate total pages
      if (totalItems.value > 0 && itemsPerPage.value > 0) {
        totalPages.value = Math.ceil(totalItems.value / itemsPerPage.value)
      } else {
        // If no total in response, estimate based on content length
        totalPages.value = currentPage.value + (data.content.length >= 80 ? 1 : 0)
      }

      // Update display page for pagination component
      displayPage.value = currentPage.value
      
      // Only increment currentPage if not using reset (for load more functionality)
      if (!reset) {
        currentPage.value++
      }
      hasMore.value = data.content.length >= 80
    } else {
      hasMore.value = false
      if (reset) {
        totalPages.value = 0
      }
    }
  } catch (error) {
    console.error('Failed to load comics:', error)
    hasMore.value = false
  } finally {
    if (reset) {
      loading.value = false
    } else {
      loadingMore.value = false
    }
  }
}

// Apply filter immediately
const applyFilter = (resetPage = true) => {
  comics.value = []
  if (resetPage) {
    currentPage.value = 1
    displayPage.value = 1
  }
  hasMore.value = true
  hasSearched.value = true
  totalItems.value = 0
  itemsPerPage.value = 0
  totalPages.value = 1
  updateURL()
  loadComics(true)
}

// Search tag
const searchTag = (tag) => {
  router.push({
    path: '/search',
    query: { wd: tag }
  })
}

// Select category
const selectCategory = (category) => {
  selectedCategory.value = category
  selectedSubCategory.value = null
  applyFilter(true) // Reset page when changing category
}

// Select sort
const selectSort = (sort) => {
  selectedSort.value = sort
  applyFilter(true) // Reset page when changing sort
}

// Select sub category
const selectSubCategory = (subCategory) => {
  selectedSubCategory.value = subCategory
  applyFilter(true) // Reset page when changing sub category
}

// Mobile methods with drawer close
const selectCategoryAndClose = (category) => {
  selectedCategory.value = category
  selectedSubCategory.value = null
  showFilterModal.value = false
  applyFilter(true)
}

const selectSortAndClose = (sort) => {
  selectedSort.value = sort
  showFilterModal.value = false
  applyFilter(true)
}

const selectSubCategoryAndClose = (subCategory) => {
  selectedSubCategory.value = subCategory
  showFilterModal.value = false
  applyFilter(true)
}

// Handle pagination
const handlePageChange = (page) => {
  // Reset for new page
  comics.value = []
  currentPage.value = page
  displayPage.value = page
  hasMore.value = true
  updateURL()
  loadComics(true)
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Flag to prevent recursive updates
const isUpdatingUrl = ref(false)
// Flag to prevent watch from firing on mount
const isMounted = ref(false)

// Watch for route changes  
watch(() => route.query, (newQuery, oldQuery) => {
  console.log('Route query watch triggered', { 
    isMounted: isMounted.value, 
    routeName: route.name,
    isUpdatingUrl: isUpdatingUrl.value,
    newQuery,
    oldQuery 
  })
  
  // Skip if not mounted yet
  if (!isMounted.value) {
    console.log('Skipping - not mounted')
    return
  }
  
  // Only process if we're on the catalog page
  if (route.name !== 'catalog') {
    console.log('Skipping - not on catalog page')
    return
  }
  
  // Skip if we're the ones updating the URL
  if (isUpdatingUrl.value) {
    console.log('Skipping - we are updating URL')
    isUpdatingUrl.value = false
    return
  }
  
  // Skip if coming back to the same page (activated from keep-alive)
  if (!isFirstActivation.value && JSON.stringify(newQuery) === JSON.stringify(oldQuery)) {
    console.log('Skipping - same query, just activated from keep-alive')
    return
  }
  
  console.log('Processing route change in watch')
  
  // Only react to route changes if categories are loaded
  if (categories.value.length > 0) {
    parseQueryParams()
    
    // If no category selected from query, select first category by default
    if (!selectedCategory.value && categories.value.length > 0) {
      selectedCategory.value = categories.value[0]
    }
    
    // Load comics with new settings
    if (selectedCategory.value) {
      // Don't call applyFilter here as it will update URL again
      // Just load comics directly
      comics.value = []
      hasMore.value = true
      hasSearched.value = true
      totalItems.value = 0
      itemsPerPage.value = 0
      totalPages.value = 1
      console.log('Watch is calling loadComics')
      loadComics(true)
    }
  }
}, { deep: true })

// Flag to track if this is the first activation
const isFirstActivation = ref(true)

onMounted(() => {
  console.log('CatalogView mounted (first time)')
  // Initial mount - load data
  const stateRestored = restoreState()
  
  if (!stateRestored) {
    // Parse initial query params
    parseQueryParams()
    
    // Initialize page if not set
    if (currentPage.value === 0) {
      currentPage.value = 1
      displayPage.value = 1
    }
    
    // Load categories
    loadCategories()
  } else {
    pageLoading.value = false
  }
  
  // Set mounted flag after initial load
  setTimeout(() => {
    isMounted.value = true
  }, 100)
})

// Called when keep-alive component is activated (navigating back to this page)
onActivated(() => {
  console.log('CatalogView activated, isFirstActivation:', isFirstActivation.value)
  if (!isFirstActivation.value) {
    // Not the first activation, we're coming back to this page
    // State is already in memory, no need to reload
    pageLoading.value = false
    loadingCategories.value = false  // Make sure loading state is false
    console.log('Reusing existing state, no API call')
  }
  isFirstActivation.value = false
})

// Called when keep-alive component is deactivated (navigating away)
onDeactivated(() => {
  console.log('CatalogView deactivated, saving state')
  saveState()
})

// Still keep onBeforeUnmount for cases where the component is actually destroyed
onBeforeUnmount(() => {
  console.log('CatalogView unmounting')
  saveState()
})
</script>

<style scoped>
/* Hide scrollbar for horizontal scroll areas on mobile */
.no-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}
.no-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
</style>
