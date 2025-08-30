<template>
  <AppLayout title="我的收藏">
    <div class="container mx-auto px-4 py-6">
      <div class="mb-6">
        <p class="text-gray-400 mt-1">共 {{ totalCollections }} 部作品</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-20">
        <LoadingSpinner />
      </div>

      <div v-else-if="!collections.length" class="text-center py-12">
        <svg class="w-24 h-24 text-gray-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
        </svg>
        <p class="text-gray-400 mb-4">还没有收藏任何漫画</p>
        <router-link
          to="/latest"
          class="inline-block px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-lg transition-all cursor-pointer shadow-lg hover:shadow-xl"
        >
          去看看最新漫画
        </router-link>
      </div>

      <div v-else>
        <!-- Collection Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <div
            v-for="comic in collections"
            :key="comic.comic_id || comic.id"
            class="relative group"
            @click.stop
          >
            <!-- Card wrapper to prevent navigation on button click -->
            <div class="relative">
              <UnifiedComicCard 
                :comic="formatComicForCard(comic)" 
                :show-collection-date="true"
                :show-category="false"
                :show-episode="false"
                :show-stats="false"
                :show-author="false"
                :show-description="false"
                :show-tags="false"
              />
              
              <!-- Remove Button - Always visible on mobile, hover on desktop -->
              <button
                type="button"
                @click.stop.prevent="handleRemoveClick(comic)"
                class="absolute top-2 right-2 p-2 bg-red-600 sm:bg-gray-900/90 hover:bg-red-600 text-white rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 shadow-lg z-50 cursor-pointer"
                title="移除收藏"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Pagination -->
        <div class="mt-8">
          <Pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            @change="handlePageChange"
          />
        </div>
      </div>

    </div>
    
    <!-- Confirmation Dialog -->
    <ConfirmationDialog
      :show="showRemoveConfirm"
      :title="'移除收藏'"
      :message="`确定要移除《${comicToRemove?.name || ''}》吗？`"
      confirm-text="移除"
      cancel-text="取消"
      confirm-button-class="bg-red-600 hover:bg-red-700 text-white"
      @confirm="confirmRemove"
      @cancel="cancelRemove"
    />
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { getCollections, removeFromCollection } from '@/api/collection'
import { useNotification } from '@/composables/useNotification'
import AppLayout from '@/components/AppLayout.vue'
import UnifiedComicCard from '@/components/UnifiedComicCard.vue'
import Pagination from '@/components/Pagination.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'

const router = useRouter()
const appStore = useAppStore()
const notification = useNotification()

// Data
const collections = ref([])
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const totalCollections = ref(0)
const perPage = 24

// Confirmation dialog
const showRemoveConfirm = ref(false)
const comicToRemove = ref(null)

// Format comic data for UnifiedComicCard
const formatComicForCard = (comic) => {
  // UnifiedComicCard will construct the image URL from the ID if no image is provided
  return {
    id: comic.comic_id || comic.id,
    name: comic.name || comic.title,
    title: comic.name || comic.title,
    created_at: comic.created_at
  }
}

// Methods
const loadCollections = async (page = 1) => {
  loading.value = true
  try {
    const response = await getCollections(page, perPage)
    // Map comic_id to id for ComicCard component
    collections.value = (response.data || []).map(item => ({
      ...item,
      id: item.comic_id || item.id,
      title: item.name || item.title
    }))
    currentPage.value = response.current_page || 1
    totalPages.value = response.last_page || 1
    totalCollections.value = response.total || 0
    
    // Update app store for first page
    if (page === 1) {
      appStore.collectedComics = collections.value
    }
  } catch (error) {
    console.error('Failed to load collections:', error)
  } finally {
    loading.value = false
  }
}

// Handle remove button click
const handleRemoveClick = (comic) => {
  console.log('Remove button clicked for comic:', comic)
  removeFromCollectionHandler(comic)
}

const removeFromCollectionHandler = (comic) => {
  console.log('Remove handler called for comic:', comic)
  comicToRemove.value = comic
  showRemoveConfirm.value = true
}

const confirmRemove = async () => {
  if (!comicToRemove.value) return
  
  const comicId = comicToRemove.value.comic_id || comicToRemove.value.id
  console.log('Removing comic with ID:', comicId)
  
  try {
    const response = await removeFromCollection(comicId)
    console.log('Remove response:', response)
    
    // Remove from local list
    const index = collections.value.findIndex(c => (c.comic_id || c.id) === comicId)
    if (index > -1) {
      collections.value.splice(index, 1)
      totalCollections.value--
    }
    
    // Update app store
    const storeIndex = appStore.collectedComics.findIndex(c => (c.comic_id || c.id) === comicId)
    if (storeIndex > -1) {
      appStore.collectedComics.splice(storeIndex, 1)
    }
    
    // Show success notification
    notification.success('已移除收藏')
    
    showRemoveConfirm.value = false
    comicToRemove.value = null
    
    // If no more items and not on first page, go to previous page
    if (collections.value.length === 0 && currentPage.value > 1) {
      handlePageChange(currentPage.value - 1)
    }
  } catch (error) {
    console.error('Failed to remove collection:', error)
    console.error('Error details:', error.response?.data)
    notification.error(error.response?.data?.message || '移除失败，请稍后重试')
    showRemoveConfirm.value = false
    comicToRemove.value = null
  }
}

const cancelRemove = () => {
  showRemoveConfirm.value = false
  comicToRemove.value = null
}

const handlePageChange = (page) => {
  loadCollections(page)
  window.scrollTo(0, 0)
}


const checkLoginAndLoad = () => {
  // Check if user is logged in
  if (!appStore.isLoggedIn) {
    router.push({
      path: '/login',
      query: { redirect: '/collection' }
    })
    return
  }
  
  // Always reload collections when entering the page
  loadCollections()
}

onMounted(() => {
  checkLoginAndLoad()
})

// Reload collections when navigating back to this view (if using keep-alive)
onActivated(() => {
  checkLoginAndLoad()
})
</script>