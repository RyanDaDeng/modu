<template>
  <AppLayout title="充值记录">
    <div class="container mx-auto px-4 py-6">
      <!-- Header with count -->
      <div class="mb-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-white mb-2">充值记录</h1>
            <p class="text-gray-400">
              共 <span class="text-pink-500 font-medium">{{ totalOrders }}</span> 条记录
            </p>
          </div>
        </div>
      </div>
      
      <!-- Order List -->
      <div class="max-w-4xl">
      <!-- Loading State -->
      <div v-if="loading && !orders.length" class="flex justify-center py-20">
        <LoadingSpinner />
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && !orders.length" class="text-center py-20">
        <div class="text-gray-400">
          <svg class="w-20 h-20 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="text-lg mb-4">暂无充值记录</p>
        </div>
        <router-link to="/vip" class="inline-block px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-lg transition-all cursor-pointer shadow-lg hover:shadow-xl">
          立即充值
        </router-link>
      </div>
        
      <!-- Orders List -->
      <div v-else class="space-y-4">
        <div 
          v-for="order in orders" 
          :key="order.id"
          class="bg-gray-900/60 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-pink-500/30 transition-all"
        >
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="text-white font-medium">{{ order.product_name }}</h3>
              <p class="text-gray-400 text-sm mt-1">订单号：{{ order.order_reference }}</p>
            </div>
            <span 
              :class="[
                'px-2 py-1 text-xs rounded font-medium',
                order.status_code === 'success' 
                  ? 'bg-green-900/50 text-green-400 border border-green-800' 
                  : order.status_code === 'pending'
                  ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-800'
                  : 'bg-red-900/50 text-red-400 border border-red-800'
              ]"
            >
              {{ order.status }}
            </span>
          </div>
          
          <div class="flex justify-between items-end">
            <div class="text-sm text-gray-400">
              <p>支付方式：{{ order.payment_method }}</p>
              <p>创建时间：{{ order.created_at }}</p>
              <p v-if="order.completed_at">完成时间：{{ order.completed_at }}</p>
            </div>
            <div class="text-right">
              <span class="text-pink-500 text-xl font-bold">¥{{ order.product_price }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <div v-if="pagination && pagination.last_page > 1" class="mt-6 flex justify-center">
        <div class="flex gap-2">
          <button
            @click="changePage(pagination.current_page - 1)"
            :disabled="pagination.current_page === 1"
            class="px-3 py-1 bg-gray-800/50 backdrop-blur-sm text-gray-400 rounded border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 hover:border-white/20 transition-all cursor-pointer"
          >
            上一页
          </button>
          
          <div class="flex items-center gap-2">
            <span class="text-gray-400 text-sm">
              第 {{ pagination.current_page }} / {{ pagination.last_page }} 页
            </span>
          </div>
          
          <button
            @click="changePage(pagination.current_page + 1)"
            :disabled="pagination.current_page === pagination.last_page"
            class="px-3 py-1 bg-gray-800/50 backdrop-blur-sm text-gray-400 rounded border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 hover:border-white/20 transition-all cursor-pointer"
          >
            下一页
          </button>
        </div>
      </div>

      <!-- Load More for Mobile -->
      <div v-if="pagination && pagination.current_page < pagination.last_page && !loadingMore" 
        class="mt-6 text-center sm:hidden">
        <button
          @click="loadMore"
          class="px-6 py-2 bg-gray-800/50 backdrop-blur-sm text-gray-300 rounded-lg border border-white/10 hover:bg-gray-700/50 hover:border-white/20 transition-all cursor-pointer"
        >
          加载更多
        </button>
      </div>

        <!-- Loading More Indicator -->
        <div v-if="loadingMore" class="mt-6 flex justify-center">
          <LoadingSpinner size="small" />
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getRechargeHistory } from '@/api/vip'
import AppLayout from '@/components/AppLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const router = useRouter()
const authStore = useAuthStore()

// State
const orders = ref([])
const pagination = ref(null)
const loading = ref(false)
const loadingMore = ref(false)

// Computed
const totalOrders = computed(() => orders.value.length)

// Load orders
const loadOrders = async (page = 1, append = false) => {
  if (append) {
    loadingMore.value = true
  } else {
    loading.value = true
  }
  
  try {
    const response = await getRechargeHistory(page, 10)
    
    if (response.success) {
      if (append) {
        orders.value = [...orders.value, ...response.data]
      } else {
        orders.value = response.data
      }
      pagination.value = response.pagination
    }
  } catch (error) {
    console.error('Failed to load recharge history:', error)
    // If 401, redirect to login
    if (error.response?.status === 401) {
      router.push({
        path: '/login',
        query: { redirect: '/recharge-history' }
      })
    }
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// Change page
const changePage = (page) => {
  if (page < 1 || page > pagination.value.last_page) return
  loadOrders(page)
  window.scrollTo(0, 0)
}

// Load more for mobile
const loadMore = () => {
  if (pagination.value && pagination.value.current_page < pagination.value.last_page) {
    loadOrders(pagination.value.current_page + 1, true)
  }
}

onMounted(() => {
  // Check if user is logged in
  if (!authStore.isLoggedIn) {
    router.push({
      path: '/login',
      query: { redirect: '/recharge-history' }
    })
    return
  }
  
  loadOrders()
})
</script>