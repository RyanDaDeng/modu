<template>
  <AppLayout title="我的书签">
    <div class="container mx-auto px-4 py-6">
      <!-- Header with count -->
      <div class="mb-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-white mb-2">我的书签</h1>
            <p class="text-gray-400">
              共 <span class="text-pink-500 font-medium">{{ bookmarks.length }}</span> 个书签
            </p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner />
      </div>

      <!-- Empty State -->
      <div v-else-if="!bookmarks.length" class="text-center py-12">
        <div class="max-w-md mx-auto">
          <svg class="w-24 h-24 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <h2 class="text-xl font-bold text-white mb-2">还没有书签</h2>
          <p class="text-gray-400 mb-6">在阅读漫画时点击书签按钮，即可保存当前章节位置</p>
          <router-link
            to="/latest"
            class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 cursor-pointer"
          >
            浏览漫画
          </router-link>
        </div>
      </div>

      <!-- Bookmarks Grid -->
      <div v-else class="grid gap-4">
        <div
          v-for="bookmark in bookmarks"
          :key="bookmark.id"
          class="relative group bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-gray-700/50 hover:border-white/20 transition-all"
        >
          <div class="flex items-start gap-4">
            <!-- Comic Cover -->
            <router-link
              :to="`/chapter/${bookmark.comic_id}?chapter=${bookmark.chapter_id}`"
              class="flex-shrink-0 w-24 h-32 rounded-lg overflow-hidden bg-gray-900"
            >
              <img
                :src="getComicCover(bookmark.comic_id)"
                :alt="bookmark.comic_name"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
            </router-link>

            <!-- Bookmark Info -->
            <div class="flex-1 min-w-0">
              <router-link
                :to="`/chapter/${bookmark.comic_id}?chapter=${bookmark.chapter_id}`"
                class="block group/title"
              >
                <h3 class="text-lg font-bold text-white mb-1 group-hover/title:text-pink-400 transition-colors">
                  {{ bookmark.comic_name }}
                </h3>
                <p class="text-sm text-gray-400 mb-2">
                  章节 {{ bookmark.chapter_id }}
                </p>
              </router-link>
              
              <!-- Metadata -->
              <div class="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <div class="flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                  <span>{{ formatDate(bookmark.created_at) }}</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2 mt-3">
                <router-link
                  :to="`/chapter/${bookmark.comic_id}?chapter=${bookmark.chapter_id}`"
                  class="inline-flex items-center px-3 py-1.5 bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  继续阅读
                </router-link>
                <button
                  @click="deleteBookmark(bookmark.id)"
                  class="inline-flex items-center px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotification } from '@/composables/useNotification'
import { getBookmarks, removeBookmark } from '@/api/bookmark'
import { getImageServer } from '@/utils/imageServer'
import AppLayout from '@/components/AppLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import Pagination from '@/components/Pagination.vue'

const router = useRouter()
const authStore = useAuthStore()
const notification = useNotification()

const bookmarks = ref([])
const loading = ref(false)

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60))
      return minutes === 0 ? '刚刚' : `${minutes}分钟前`
    }
    return `${hours}小时前`
  } else if (days === 1) {
    return '昨天'
  } else if (days < 7) {
    return `${days}天前`
  } else if (days < 30) {
    return `${Math.floor(days / 7)}周前`
  } else if (days < 365) {
    return `${Math.floor(days / 30)}个月前`
  }
  return `${Math.floor(days / 365)}年前`
}

// Get comic cover URL
const getComicCover = (comicId) => {
  const server = getImageServer()
  return `${server}/media/albums/${comicId}_3x4.jpg`
}

// Handle image error
const handleImageError = (event) => {
  event.target.src = '/default.jpeg'
}

// Load bookmarks
const loadBookmarks = async () => {
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  loading.value = true
  try {
    const data = await getBookmarks()
    bookmarks.value = data.data || []
  } catch (error) {
    console.error('Failed to load bookmarks:', error)
    if (error.response?.status === 401) {
      router.push('/login')
    } else {
      notification.error('加载书签失败')
    }
  } finally {
    loading.value = false
  }
}

// Delete bookmark
const deleteBookmark = async (bookmarkId) => {
  if (!confirm('确定要删除这个书签吗？')) {
    return
  }
  
  try {
    await removeBookmark(bookmarkId)
    bookmarks.value = bookmarks.value.filter(b => b.id !== bookmarkId)
    notification.success('书签已删除')
  } catch (error) {
    console.error('Failed to remove bookmark:', error)
    notification.error('删除失败')
  }
}


onMounted(() => {
  loadBookmarks()
})
</script>