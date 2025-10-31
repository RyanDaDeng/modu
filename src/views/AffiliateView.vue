<template>
  <GeneralLayout title="推广中心">
    <div class="container mx-auto px-4 py-6 pb-20 md:pb-6">
      <!-- Not Affiliate Notice -->
      <div v-if="!loading && !isAffiliate" class="bg-gradient-to-r from-pink-500/20 to-purple-600/20 backdrop-blur-sm rounded-lg border border-pink-500/30 p-8 mb-6 text-center">
        <div class="max-w-2xl mx-auto">
          <h2 class="text-2xl font-bold text-white mb-4">成为推广合作伙伴</h2>
          <div class="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-4">
            50% 回扣
          </div>
          <p class="text-gray-300 mb-6">
            推广我们的服务，获得高达 50% 的佣金回扣！<br>
            每一笔通过您推广链接产生的订单，您都将获得丰厚回报。
          </p>
          <div class="bg-gray-800/50 rounded-lg p-4 mb-6">
            <p class="text-gray-400 mb-2">申请成为推广合作伙伴，请联系我们：</p>
            <a 
              href="https://t.me/+frktRDVHynY3OTA1" 
              target="_blank"
              class="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-1.513 6.337-1.948 7.885-.185.656-.541.867-.885.892-.753.054-1.325-.497-2.054-.975-1.141-.747-1.786-1.212-2.892-1.941-1.279-.843-.45-1.307.279-2.064.191-.198 3.512-3.219 3.577-3.493.008-.034.015-.16-.06-.227-.074-.068-.183-.045-.262-.027-.112.026-1.895 1.205-5.349 3.537-.506.348-.965.518-1.376.507-.453-.012-1.325-.256-1.973-.467-.795-.259-1.426-.395-1.371-.834.029-.228.343-.462 1.942-.723 3.715-.889 6.191-1.485 7.438-1.788 3.547-.862 4.283-.638 4.764-.604.106.008.343.024.497.147.13.103.166.242.183.339.017.097.038.319.021.493z"/>
              </svg>
              Telegram 联系我们
            </a>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div class="bg-gray-800/30 rounded-lg p-4">
              <div class="text-pink-400 font-semibold mb-2">💰 高额佣金</div>
              <p class="text-sm text-gray-400">每笔订单获得 50% 佣金</p>
            </div>
            <div class="bg-gray-800/30 rounded-lg p-4">
              <div class="text-purple-400 font-semibold mb-2">📊 实时数据</div>
              <p class="text-sm text-gray-400">实时查看推广数据和收益</p>
            </div>
            <div class="bg-gray-800/30 rounded-lg p-4">
              <div class="text-blue-400 font-semibold mb-2">💳 快速结算</div>
              <p class="text-sm text-gray-400">定期结算，快速到账</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Affiliate Content (only show if user is affiliate) -->
      <div v-if="isAffiliate">
      <!-- Referral Link Section -->
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-6 mb-6">
        <h3 class="text-lg font-semibold text-white mb-4">我的推广链接 <span class="text-sm font-normal text-gray-400">(My Referral Link)</span></h3>
        <div class="flex flex-col md:flex-row gap-3">
          <input 
            :value="referralLink" 
            readonly 
            class="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 text-gray-300 rounded-md"
            @click="selectAll"
          />
          <button 
            @click="copyLink" 
            class="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-md hover:from-pink-600 hover:to-purple-700 transition-all"
          >
            {{ copied ? '已复制 Copied' : '复制链接 Copy Link' }}
          </button>
        </div>
        <p class="text-sm text-gray-400 mt-2">分享此链接，新用户通过您的链接注册后的消费，您将获得佣金<br/>
        <span class="text-xs">Share this link. You will earn commission from purchases made by new users who register through your link.</span></p>
      </div>

      <!-- Statistics -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4">
          <div class="text-sm text-gray-400">邀请用户<br/><span class="text-xs">(Invited Users)</span></div>
          <div class="text-2xl font-bold text-white mt-1">{{ stats.total_invited }}</div>
        </div>
        <div class="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4">
          <div class="text-sm text-gray-400">成功订单<br/><span class="text-xs">(Success Orders)</span></div>
          <div class="text-2xl font-bold text-white mt-1">{{ stats.total_orders }}</div>
        </div>
        <div class="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4">
          <div class="text-sm text-gray-400">总收入<br/><span class="text-xs">(Total Revenue/CNY)</span></div>
          <div class="text-2xl font-bold text-pink-400 mt-1">¥{{ formatAmount(stats.total_revenue) }}</div>
        </div>
        <div class="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4">
          <div class="text-sm text-gray-400">预计佣金<br/><span class="text-xs">(EST Commission/CNY)</span></div>
          <div class="text-2xl font-bold text-green-400 mt-1">¥{{ formatAmount(stats.estimated_commission) }}</div>
          <div v-if="isAffiliate" class="text-xs text-gray-500 mt-1">费率 Rate: {{ stats.commission_rate }}%</div>
        </div>
      </div>

      <!-- Invited Users -->
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 mb-6">
        <div class="px-4 py-3 border-b border-gray-700">
          <h3 class="text-lg font-semibold text-white">邀请的用户 <span class="text-sm font-normal text-gray-400">(Invited Users)</span></h3>
        </div>
        <div class="p-4">
          <div v-if="invitedUsers.length > 0" class="space-y-2">
            <div v-for="user in invitedUsers" :key="user.id" class="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-0">
              <div>
                <div class="text-white">{{ user.name }}</div>
                <div class="text-xs text-gray-400">{{ user.email }}</div>
              </div>
              <div class="text-xs text-gray-500">{{ formatDate(user.created_at) }}</div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-400">
            暂无邀请用户
          </div>
        </div>
      </div>

      <!-- Payment Orders -->
      <div class="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50">
        <div class="px-4 py-3 border-b border-gray-700">
          <h3 class="text-lg font-semibold text-white">关联订单 <span class="text-sm font-normal text-gray-400">(Related Orders)</span></h3>
        </div>
        
        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-700/50 border-b border-gray-700">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">用户<br/>User</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">产品<br/>Product</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">金额<br/>Amount</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">佣金<br/>Commission</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">时间<br/>Time</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr v-for="order in paymentOrders" :key="order.id" class="hover:bg-gray-700/30">
                <td class="px-4 py-2 text-sm text-gray-300">
                  <div>{{ order.user?.name }}</div>
                  <div class="text-xs text-gray-500">{{ order.user?.email }}</div>
                </td>
                <td class="px-4 py-2 text-sm text-gray-300">{{ order.product_name }}</td>
                <td class="px-4 py-2 text-sm font-medium text-pink-400">¥{{ formatAmount(order.receive_amount) }}</td>
                <td class="px-4 py-2 text-sm font-medium text-green-400">
                  <span v-if="isAffiliate">¥{{ formatAmount(order.receive_amount * stats.commission_rate / 100) }}</span>
                  <span v-else class="text-gray-500">-</span>
                </td>
                <td class="px-4 py-2 text-sm text-gray-400">{{ formatDate(order.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden p-4">
          <div v-if="paymentOrders.length > 0" class="space-y-3">
            <div v-for="order in paymentOrders" :key="order.id" class="border border-gray-700 rounded-lg p-3">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <div class="text-white text-sm">{{ order.user?.name }}</div>
                  <div class="text-xs text-gray-400">{{ order.product_name }}</div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-medium text-pink-400">¥{{ formatAmount(order.receive_amount) }}</div>
                  <div v-if="isAffiliate" class="text-xs text-green-400">佣金: ¥{{ formatAmount(order.receive_amount * stats.commission_rate / 100) }}</div>
                </div>
              </div>
              <div class="text-xs text-gray-500">{{ formatDate(order.created_at) }}</div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-400">
            暂无关联订单
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination && pagination.last_page > 1" class="px-4 py-3 border-t border-gray-700 flex justify-center">
          <div class="flex gap-2">
            <button
              @click="changePage(pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
              class="px-3 py-1 bg-gray-700 border border-gray-600 text-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
            >
              上一页
            </button>
            <span class="px-3 py-1 text-gray-300">
              {{ pagination.current_page }} / {{ pagination.last_page }}
            </span>
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
      </div>
    </div>
  </GeneralLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import GeneralLayout from '@/components/GeneralLayout.vue'
import { request } from '@/api/request'

const router = useRouter()
const authStore = useAuthStore()

// Data
const isAffiliate = ref(false)
const affiliate = ref(null)
const stats = ref({
  total_invited: 0,
  total_orders: 0,
  total_revenue: 0,
  commission_rate: 0,
  estimated_commission: 0,
})
const invitedUsers = ref([])
const paymentOrders = ref([])
const pagination = ref(null)
const referralLink = ref('')
const copied = ref(false)
const loading = ref(false)

// Methods
const fetchData = async (page = 1) => {
  loading.value = true
  try {
    const response = await request.get('/api/affiliate/dashboard', {
      params: { page }
    })
    
    if (response.data.success) {
      const data = response.data.data
      isAffiliate.value = data.is_affiliate
      affiliate.value = data.affiliate
      stats.value = data.stats
      invitedUsers.value = data.invited_users
      paymentOrders.value = data.payment_orders.data || []
      pagination.value = {
        current_page: data.payment_orders.current_page,
        last_page: data.payment_orders.last_page,
        total: data.payment_orders.total
      }
      // Construct full referral link with current domain
      referralLink.value = window.location.origin + data.referral_link
    }
  } catch (error) {
    console.error('Failed to fetch affiliate data:', error)
  } finally {
    loading.value = false
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    fetchData(page)
  }
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(referralLink.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

const selectAll = (event) => {
  event.target.select()
}

const formatAmount = (amount) => {
  return (Number(amount || 0) / 100).toFixed(2)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

// Check auth and load data
onMounted(() => {
  if (!authStore.isLoggedIn) {
    router.push({
      path: '/login',
      query: { redirect: '/affiliate' }
    })
    return
  }
  
  fetchData()
})
</script>