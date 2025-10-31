<template>
  <VideoLayout title="视频VIP会员">
    <!-- Main Content -->
    <div class="container mx-auto px-4 py-6">
      <!-- Title Section -->
      <div class="text-center mb-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-pink-500 mb-3" style="text-shadow: 2px 2px 0 rgba(31, 41, 55, 0.8);">
          视频通行证充值
        </h2>
        <p class="text-gray-400 text-sm sm:text-base">畅享全站海量视频内容</p>
      </div>

      <!-- Current VIP Status -->
      <div v-if="authStore.isLoggedIn" class="max-w-2xl mx-auto mb-8">
        <div class="bg-gradient-to-r from-gray-900/60 to-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-white font-semibold mb-1">当前状态</h3>
              <p v-if="isVideoVip" class="text-green-400">
                视频通行证有效期至：{{ formatDate(authStore.user?.video_expired_at) }}
              </p>
              <p v-else class="text-gray-400">未开通视频通行证</p>
            </div>
            <div v-if="isVideoVip" class="px-4 py-2 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg">
              已开通
            </div>
            <div v-else class="px-4 py-2 bg-gray-700/50 border border-gray-600 text-gray-400 rounded-lg">
              未开通
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-20">
        <LoadingSpinner />
      </div>

      <!-- Pricing Cards -->
      <div v-else class="max-w-md mx-auto space-y-4 sm:max-w-3xl sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-stretch">
        <div
          v-for="plan in plans"
          :key="plan.key"
          :class="[
            'relative bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 border transition-all flex flex-col',
            plan.popular
              ? 'border-pink-500/50 shadow-lg shadow-pink-500/20'
              : 'border-white/10 hover:border-pink-500/30'
          ]"
        >
          <!-- Popular Badge -->
          <div v-if="plan.popular" class="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span class="px-3 py-1 bg-pink-600/90 backdrop-blur-sm border border-pink-400/60 text-white text-xs font-bold rounded-full shadow-lg">
              最受欢迎
            </span>
          </div>

          <!-- Plan Content -->
          <div class="flex flex-col flex-grow text-center">
            <!-- Plan Name -->
            <h3 class="text-xl font-bold text-white mb-2">{{ plan.name }}</h3>

            <!-- Duration -->
            <p class="text-gray-400 text-sm mb-4">{{ plan.duration }}{{ plan.duration_unit }}</p>

            <!-- Price Section -->
            <div class="mb-4">
              <div class="flex items-baseline justify-center gap-1">
                <span class="text-pink-500 text-sm">¥</span>
                <span class="text-pink-500 text-3xl font-bold">{{ plan.price }}</span>
              </div>

              <!-- Original Price & Save -->
              <div class="h-10 mt-2">
                <template v-if="plan.original_price">
                  <div class="text-gray-500 text-sm line-through">¥{{ plan.original_price }}</div>
                  <div v-if="plan.save_amount" class="text-green-400 text-xs">
                    节省 ¥{{ plan.save_amount }}
                  </div>
                </template>
              </div>
            </div>

            <!-- Features -->
            <div class="flex-grow flex items-center justify-center border-t border-white/10 py-4">
              <div v-for="feature in plan.features" :key="feature" class="flex items-center justify-center gap-2 text-gray-300 text-sm">
                <svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{{ feature }}</span>
              </div>
            </div>

            <!-- Payment Buttons -->
            <div class="space-y-2">
              <button
                @click.stop="handlePurchase(plan, 'alipay')"
                class="w-full py-2 px-4 rounded-lg font-medium transition-all cursor-pointer bg-gray-800/50 backdrop-blur-sm text-white hover:bg-gray-700/50 border border-white/10 hover:border-white/20 flex items-center justify-center gap-2"
              >
                <span class="text-blue-400">支付宝</span>
                支付
              </button>
              <button
                @click.stop="handlePurchase(plan, 'wechat')"
                class="w-full py-2 px-4 rounded-lg font-medium transition-all cursor-pointer bg-gray-800/50 backdrop-blur-sm text-white hover:bg-gray-700/50 border border-white/10 hover:border-white/20 flex items-center justify-center gap-2"
              >
                <span class="text-green-400">微信</span>
                支付
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Redemption Code Section -->
      <div class="mt-8 max-w-md mx-auto sm:max-w-2xl">
        <div class="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 class="text-lg font-bold text-white mb-4 text-center">使用兑换码</h3>
          <div class="space-y-4">
            <input
              v-model="redemptionCode"
              type="text"
              placeholder="请输入兑换码"
              class="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition-colors"
              @keyup.enter="handleRedeem"
            />
            <button
              @click="handleRedeem"
              :disabled="!redemptionCode.trim() || redeeming"
              class="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-lg transition-all disabled:cursor-not-allowed"
            >
              <span v-if="!redeeming">兑换</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                兑换中...
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="mt-12 max-w-md mx-auto sm:max-w-2xl">
        <h3 class="text-lg font-semibold text-white mb-4 text-center">常见问题</h3>
        <div class="bg-gray-900/60 backdrop-blur-sm border border-white/10 rounded-lg divide-y divide-white/10">
          <details class="group">
            <summary class="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-800/50 transition-colors">
              <span class="text-gray-300 text-sm">视频通行证可以观看所有视频吗？</span>
              <svg class="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div class="px-4 pt-2 pb-4 text-gray-400 text-sm">
              是的，开通视频通行证后可以无限制观看全站所有视频内容。
            </div>
          </details>

          <details class="group">
            <summary class="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-800/50 transition-colors">
              <span class="text-gray-300 text-sm">视频通行证和漫画VIP是分开的吗？</span>
              <svg class="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div class="px-4 pt-2 pb-4 text-gray-400 text-sm">
              是的，视频通行证和漫画VIP是独立的会员服务，需要分别购买。
            </div>
          </details>

          <details class="group">
            <summary class="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-800/50 transition-colors">
              <span class="text-gray-300 text-sm">视频通行证到期后会怎样？</span>
              <svg class="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div class="px-4 pt-2 pb-4 text-gray-400 text-sm">
              到期后将无法观看视频内容，但可以随时续费恢复权益。
            </div>
          </details>

          <details class="group">
            <summary class="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-800/50 transition-colors">
              <span class="text-gray-300 text-sm">支持哪些支付方式？</span>
              <svg class="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div class="px-4 pt-2 pb-4 text-gray-400 text-sm">
              目前支持支付宝和微信支付。
            </div>
          </details>

          <details class="group">
            <summary class="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-800/50 transition-colors">
              <span class="text-gray-300 text-sm">支付后多久到账？</span>
              <svg class="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div class="px-4 pt-2 pb-4 text-gray-400 text-sm">
              支付成功后，视频通行证权益会在几秒到几分钟内自动到账。如果长时间未到账，请联系客服反馈。
            </div>
          </details>
        </div>
      </div>
    </div>

    <!-- Login Modal -->
    <ModalDialog
      v-model="showLoginModal"
      icon="lock"
      title="请先登录"
      message="购买视频通行证需要先登录账号"
      confirm-text="立即登录"
      cancel-text="取消"
      @confirm="goToLogin"
    />

    <!-- Payment Modal -->
    <ModalDialog
      v-model="showPaymentModal"
      :icon="paymentModalIcon"
      :title="paymentModalTitle"
      :message="paymentModalMessage"
      :confirm-text="paymentModalConfirmText"
      @confirm="handlePaymentModalConfirm"
    />
  </VideoLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotification } from '@/composables/useNotification'
import VideoLayout from '@/components/onlinevideo/VideoLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ModalDialog from '@/components/ModalDialog.vue'
import { createVipOrder } from '@/api/vip'
import { redeemCode } from '@/api/redemption'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { showSuccess, showError } = useNotification()

const loading = ref(false)
const redemptionCode = ref('')
const redeeming = ref(false)
const showLoginModal = ref(false)
const showPaymentModal = ref(false)
const paymentModalIcon = ref('success')
const paymentModalTitle = ref('')
const paymentModalMessage = ref('')
const paymentModalConfirmText = ref('确定')
const currentOrderId = ref(null)

// 视频VIP套餐（月卡、季卡、年卡）
const plans = ref([
  {
    key: 'video-1',
    name: '月卡',
    duration: 30,
    duration_unit: '天',
    price: 50,
    original_price: null,
    save_amount: null,
    features: ['畅享全站视频'],
    popular: false
  },
  {
    key: 'video-3',
    name: '季卡',
    duration: 90,
    duration_unit: '天',
    price: 100,
    original_price: 150,
    save_amount: 50,
    features: ['畅享全站视频'],
    popular: false
  },
  {
    key: 'video-7',
    name: '年卡',
    duration: 365,
    duration_unit: '天',
    price: 280,
    original_price: 600,
    save_amount: 320,
    features: ['畅享全站视频'],
    popular: true
  }
])

// 是否是视频VIP
const isVideoVip = computed(() => {
  if (!authStore.user?.video_expired_at) return false
  const expiredDate = new Date(authStore.user.video_expired_at)
  return expiredDate > new Date()
})

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 跳转到登录页
const goToLogin = () => {
  router.push({
    path: '/login',
    query: { redirect: route.fullPath }
  })
}

// 处理购买
const handlePurchase = async (plan, paymentMethod) => {
  // 检查登录状态
  if (!authStore.isLoggedIn) {
    showLoginModal.value = true
    return
  }

  try {
    loading.value = true

    // 创建订单
    const response = await createVipOrder({
      plan_key: plan.key,
      payment_method: paymentMethod
    })

    if (response.data) {
      currentOrderId.value = response.data.order_id

      // 显示支付二维码或跳转链接
      if (response.data.qr_code) {
        paymentModalIcon.value = 'qrcode'
        paymentModalTitle.value = '扫码支付'
        paymentModalMessage.value = response.data.qr_code
        paymentModalConfirmText.value = '我已支付'
        showPaymentModal.value = true
      } else if (response.data.pay_url) {
        // 跳转到支付页面
        window.location.href = response.data.pay_url
      }
    }
  } catch (error) {
    console.error('创建订单失败:', error)
    showError(error.response?.data?.message || '创建订单失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 处理兑换码
const handleRedeem = async () => {
  const code = redemptionCode.value.trim()
  if (!code) return

  // 检查登录状态
  if (!authStore.isLoggedIn) {
    showLoginModal.value = true
    return
  }

  try {
    redeeming.value = true
    const response = await redeemCode(code)

    if (response.data) {
      showSuccess('兑换成功！视频通行证已到账')
      redemptionCode.value = ''
      // 刷新用户信息
      await authStore.fetchUser()
    }
  } catch (error) {
    console.error('兑换失败:', error)
    showError(error.response?.data?.message || '兑换码无效或已使用')
  } finally {
    redeeming.value = false
  }
}

// 处理支付确认
const handlePaymentModalConfirm = () => {
  showPaymentModal.value = false
  // 刷新用户信息
  authStore.fetchUser()
  showSuccess('如果支付成功，权益将在几分钟内到账')
}

onMounted(() => {
  // 如果URL中有plan参数，自动选中对应套餐
  const planKey = route.query.plan
  if (planKey) {
    const plan = plans.value.find(p => p.key === planKey)
    if (plan) {
      // 可以高亮显示或自动打开该套餐
      console.log('预选套餐:', plan.name)
    }
  }
})
</script>
