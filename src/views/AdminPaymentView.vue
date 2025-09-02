<template>
  <AppLayout title="支付分析" :show-back="true">
    <div class="container mx-auto px-4 py-6 pb-20 md:pb-6">
      <!-- Filters -->
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4 mb-6">
        <h3 class="text-lg font-semibold mb-4 text-white">筛选条件</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">开始日期</label>
            <input 
              v-model="filters.startDate" 
              type="date" 
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">结束日期</label>
            <input 
              v-model="filters.endDate" 
              type="date" 
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">支付方式</label>
            <select 
              v-model="filters.paymentMethod" 
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="">全部</option>
              <option value="wechat">微信</option>
              <option value="alipay">支付宝</option>
            </select>
          </div>
          <div class="flex items-end">
            <button 
              @click="fetchData(1)" 
              class="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-md hover:from-pink-600 hover:to-purple-700 transition-all"
            >
              查询
            </button>
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4">
          <div class="text-sm text-gray-400">总收入</div>
          <div class="text-2xl font-bold text-white">¥{{ formatAmount(summary.total_revenue) }}</div>
        </div>
        <div class="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4">
          <div class="text-sm text-gray-400">总订单数</div>
          <div class="text-2xl font-bold text-white">{{ summary.total_orders }}</div>
        </div>
        <div class="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4">
          <div class="text-sm text-gray-400">平均订单金额</div>
          <div class="text-2xl font-bold text-white">¥{{ formatAmount(summary.average_order_value) }}</div>
        </div>
        <div class="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4">
          <div class="text-sm text-gray-400">付费用户数</div>
          <div class="text-2xl font-bold text-white">{{ summary.unique_users }}</div>
        </div>
      </div>

      <!-- Product Breakdown -->
      <div class="mb-6">
        <div class="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4">
          <h3 class="text-lg font-semibold mb-4 text-white">产品销售分布</h3>
          <div class="space-y-3">
            <div v-for="product in productBreakdown" :key="product.product_key" class="flex items-center justify-between">
              <div class="flex-1">
                <div class="text-sm font-medium text-white">{{ product.product_name }}</div>
                <div class="text-xs text-gray-400">{{ product.orders }} 笔订单</div>
              </div>
              <div class="text-sm font-semibold text-pink-400">¥{{ formatAmount(product.revenue) }}</div>
            </div>
            <div v-if="productBreakdown.length === 0" class="text-center text-gray-400 py-8">
              暂无数据
            </div>
          </div>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50">
        <div class="px-4 py-3 border-b border-gray-700">
          <h3 class="text-lg font-semibold text-white">订单列表</h3>
        </div>
        
        <!-- Desktop Table View -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-700/50 border-b border-gray-700">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">订单号</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">用户ID</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">产品</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">金额</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">支付方式</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">时间</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-700/30">
                <td class="px-4 py-3 text-sm text-gray-300">{{ order.mch_order_no }}</td>
                <td class="px-4 py-3 text-sm text-gray-300">{{ order.user_id }}</td>
                <td class="px-4 py-3 text-sm text-gray-300">{{ order.product_name }}</td>
                <td class="px-4 py-3 text-sm font-medium text-pink-400">¥{{ order.receive_amount }}</td>
                <td class="px-4 py-3 text-sm">
                  <span v-if="order.payment_method === 'wechat'" class="text-green-400">微信</span>
                  <span v-else-if="order.payment_method === 'alipay'" class="text-blue-400">支付宝</span>
                  <span v-else class="text-gray-400">{{ order.payment_method }}</span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-400">{{ formatDate(order.created_at) }}</td>
                <td class="px-4 py-3 text-sm">
                  <button 
                    @click="viewOrder(order.id)" 
                    class="text-pink-400 hover:text-pink-300"
                  >
                    查看
                  </button>
                </td>
              </tr>
              <tr v-if="orders.length === 0">
                <td colspan="7" class="px-4 py-8 text-center text-gray-400">暂无订单数据</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Mobile Card View -->
        <div class="md:hidden">
          <div v-if="orders.length > 0" class="divide-y divide-gray-700">
            <div 
              v-for="order in orders" 
              :key="order.id" 
              class="p-4"
            >
              <!-- Order Header with Price -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex-1">
                  <div class="text-xs text-gray-500 mb-0.5">订单号</div>
                  <div class="text-sm text-gray-300 font-mono break-all pr-2">{{ order.mch_order_no }}</div>
                </div>
                <div class="flex-shrink-0 text-right">
                  <div class="text-xl font-bold text-pink-400">¥{{ formatAmount(order.receive_amount) }}</div>
                </div>
              </div>
              
              <!-- Order Info Grid -->
              <div class="grid grid-cols-2 gap-3 text-sm mb-2">
                <div>
                  <div class="text-xs text-gray-500 mb-0.5">产品</div>
                  <div class="text-gray-300">{{ order.product_name }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500 mb-0.5">用户ID</div>
                  <div class="text-gray-300">{{ order.user_id }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500 mb-0.5">支付方式</div>
                  <div>
                    <span v-if="order.payment_method === 'wechat'" class="text-green-400">微信</span>
                    <span v-else-if="order.payment_method === 'alipay'" class="text-blue-400">支付宝</span>
                    <span v-else class="text-gray-400">{{ order.payment_method }}</span>
                  </div>
                </div>
                <div>
                  <div class="text-xs text-gray-500 mb-0.5">时间</div>
                  <div class="text-xs text-gray-400">{{ formatDate(order.created_at) }}</div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="px-4 py-8 text-center text-gray-400">
            暂无订单数据
          </div>
        </div>
        
        <!-- Pagination -->
        <div v-if="pagination.total > 0" class="px-4 py-3 border-t border-gray-700 flex items-center justify-between">
          <div class="text-sm text-gray-400">
            显示 {{ pagination.from }} - {{ pagination.to }} 共 {{ pagination.total }} 条
          </div>
          <div class="flex space-x-2">
            <button 
              @click="changePage(pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
              class="px-3 py-1 bg-gray-700 border border-gray-600 text-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
            >
              上一页
            </button>
            <button 
              @click="changePage(pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page"
              class="px-3 py-1 bg-gray-700 border border-gray-600 text-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
      
      <!-- Daily Revenue Table -->
      <div v-if="dailyRevenue && dailyRevenue.length > 0" class="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 mt-6">
        <div class="px-4 py-3 border-b border-gray-700">
          <h3 class="text-lg font-semibold text-white">每日收入明细</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-700/50 border-b border-gray-700">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">日期</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">订单数</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">收入金额</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr v-for="(item, index) in dailyRevenue" :key="index" class="hover:bg-gray-700/30">
                <td class="px-4 py-2 text-sm text-gray-300">{{ item.date }}</td>
                <td class="px-4 py-2 text-sm text-gray-300">{{ item.orders }}</td>
                <td class="px-4 py-2 text-sm font-medium text-pink-400">¥{{ formatAmount(item.revenue) }}</td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-700/50 border-t border-gray-700">
              <tr>
                <td class="px-4 py-2 text-sm font-semibold text-gray-300">合计</td>
                <td class="px-4 py-2 text-sm font-semibold text-gray-300">{{ dailyRevenue.reduce((sum, item) => sum + (Number(item.orders) || 0), 0) }}</td>
                <td class="px-4 py-2 text-sm font-bold text-pink-400">¥{{ formatAmount(dailyRevenue.reduce((sum, item) => sum + (Number(item.revenue) || 0), 0)) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- Order Detail Modal -->
    <div v-if="showOrderModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="showOrderModal = false"></div>
      <div class="relative bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-700">
        <div class="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-white">订单详情</h3>
          <button @click="showOrderModal = false" class="text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div v-if="selectedOrder" class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-sm text-gray-400">订单号</div>
              <div class="font-medium text-white">{{ selectedOrder.mch_order_no }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-400">用户ID</div>
              <div class="font-medium text-white">{{ selectedOrder.user_id }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-400">产品</div>
              <div class="font-medium text-white">{{ selectedOrder.product_name }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-400">金额</div>
              <div class="font-medium text-pink-400">¥{{ selectedOrder.receive_amount }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-400">支付方式</div>
              <div class="font-medium text-white">{{ selectedOrder.payment_method }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-400">创建时间</div>
              <div class="font-medium text-white">{{ formatDate(selectedOrder.created_at) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/AppLayout.vue'
import { request } from '@/api/request'

const router = useRouter()
const authStore = useAuthStore()

// Check admin access
onMounted(() => {
  if (!authStore.user?.is_admin) {
    router.push('/')
  } else {
    fetchData(1)
  }
})

// Data
const orders = ref([])
const summary = ref({
  total_revenue: 0,
  total_orders: 0,
  average_order_value: 0,
  unique_users: 0
})
const dailyRevenue = ref([])
const productBreakdown = ref([])
const paymentMethodBreakdown = ref([])
const pagination = ref({
  current_page: 1,
  last_page: 1,
  from: 0,
  to: 0,
  total: 0
})

// Filters
const filters = ref({
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0],
  paymentMethod: ''
})

// Modal
const showOrderModal = ref(false)
const selectedOrder = ref(null)

// Computed properties removed - not needed anymore

// Methods
const fetchData = async (page = 1) => {
  try {
    const params = {
      start_date: filters.value.startDate,
      end_date: filters.value.endDate,
      page: page,
      per_page: 20
    }
    
    if (filters.value.paymentMethod) {
      params.payment_method = filters.value.paymentMethod
    }

    const response = await request.get('/api/admin/payment-analysis', { params })
    
    if (response.data.success) {
      const data = response.data.data
      orders.value = data.orders.data || []
      summary.value = data.summary || {}
      dailyRevenue.value = data.daily_revenue || []
      productBreakdown.value = data.product_breakdown || []
      paymentMethodBreakdown.value = data.payment_method_breakdown || []
      
      // Debug log
      console.log('Daily Revenue Data:', dailyRevenue.value)
      
      // Update pagination
      pagination.value = {
        current_page: data.orders.current_page || 1,
        last_page: data.orders.last_page || 1,
        from: data.orders.from || 0,
        to: data.orders.to || 0,
        total: data.orders.total || 0
      }
    }
  } catch (error) {
    console.error('Failed to fetch payment analysis:', error)
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    fetchData(page)
  }
}

const viewOrder = async (orderId) => {
  try {
    const response = await request.get(`/api/admin/payment-analysis/${orderId}`)
    if (response.data.success) {
      selectedOrder.value = response.data.data
      showOrderModal.value = true
    }
  } catch (error) {
    console.error('Failed to fetch order details:', error)
  }
}

const formatAmount = (amount) => {
  return Number(amount || 0).toFixed(2)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>