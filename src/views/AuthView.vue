<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Background Image -->
    <div class="fixed inset-0">
      <img 
        src="/img_1.png" 
        alt="Background" 
        class="w-full h-full object-cover"
      />
      <!-- Dark Overlay with gradient -->
      <div class="absolute inset-0 bg-gradient-to-br from-black/70 via-purple-900/50 to-pink-900/50"></div>
      
      <!-- Animated particles effect -->
      <div class="absolute inset-0">
        <div class="particle particle-1"></div>
        <div class="particle particle-2"></div>
        <div class="particle particle-3"></div>
        <div class="particle particle-4"></div>
      </div>
    </div>

    <!-- Content -->
    <div class="relative z-10 min-h-screen flex items-center justify-center p-4">
      <!-- Auth Card -->
      <div class="w-full max-w-md">
        <!-- Logo and Title -->
        <div class="text-center mb-8 animate-fade-in-down">
          <div class="flex justify-center mb-4">
            <SiteLogo :size="'normal'" />
          </div>
          <p class="text-gray-300 text-sm">记住永久地址：modu18.vip</p>
        </div>

        <!-- Tab Switcher -->
        <div class="flex mb-6 bg-black/30 backdrop-blur-md rounded-full p-1">
          <button
            @click="isLogin = true"
            :class="[
              'flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300',
              isLogin 
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/25' 
                : 'text-gray-400 hover:text-white'
            ]"
          >
            登录
          </button>
          <button
            @click="isLogin = false"
            :class="[
              'flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300',
              !isLogin 
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25' 
                : 'text-gray-400 hover:text-white'
            ]"
          >
            注册
          </button>
        </div>

        <!-- Auth Form Container -->
        <div class="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          <!-- Decorative top bar -->
          <div class="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>
          
          <div class="p-6 sm:p-8">
            <!-- Login Form -->
            <form v-if="isLogin" @submit.prevent="handleLogin" class="space-y-4">
              <!-- Email Input -->
              <div class="group">
                <label class="block text-xs font-medium text-pink-300 mb-2 ml-1">
                  电子邮箱
                </label>
                <div class="relative">
                  <input
                    v-model="loginForm.email"
                    type="email"
                    autocomplete="email"
                    required
                    class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-400 focus:bg-white/10 transition-all duration-300 pr-10"
                    placeholder="your@email.com"
                  />
                  <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <!-- Password Input -->
              <div class="group">
                <label class="block text-xs font-medium text-pink-300 mb-2 ml-1">
                  密码
                </label>
                <div class="relative">
                  <input
                    v-model="loginForm.password"
                    :type="showPassword ? 'text' : 'password'"
                    autocomplete="current-password"
                    required
                    class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-400 focus:bg-white/10 transition-all duration-300 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-pink-400 transition-colors"
                  >
                    <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Remember me & Forgot password -->
              <div class="flex items-center justify-between">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    v-model="loginForm.remember"
                    type="checkbox"
                    class="w-4 h-4 rounded border-gray-600 bg-gray-700 text-pink-500 focus:ring-pink-500 focus:ring-offset-0"
                  />
                  <span class="text-sm text-gray-300">记住我</span>
                </label>
                <a href="#" class="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                  忘记密码？
                </a>
              </div>

              <!-- Error Message -->
              <div v-if="loginError" class="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p class="text-sm text-red-400">{{ loginError }}</p>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="loginLoading"
                class="relative w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden group cursor-pointer"
              >
                <span v-if="!loginLoading" class="relative z-10">登录</span>
                <span v-else class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  登录中...
                </span>
                <!-- Button shine effect -->
                <div class="absolute inset-0 -top-2 h-[200%] w-[200%] rotate-45 translate-x-[-70%] bg-white/20 transition-all duration-1000 ease-out group-hover:translate-x-[50%]"></div>
              </button>
            </form>

            <!-- Register Form -->
            <form v-else @submit.prevent="handleRegister" class="space-y-3">
              <!-- Username and Email in one row on desktop -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <!-- Username Input -->
                <div class="group">
                  <label class="block text-xs font-medium text-purple-300 mb-1.5 ml-1">
                    用户名
                  </label>
                  <div class="relative">
                    <input
                      v-model="registerForm.name"
                      type="text"
                      autocomplete="username"
                      required
                      class="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300 text-sm"
                      placeholder="昵称"
                    />
                  </div>
                </div>

                <!-- Email Input -->
                <div class="group">
                  <label class="block text-xs font-medium text-purple-300 mb-1.5 ml-1">
                    电子邮箱
                  </label>
                  <div class="relative">
                    <input
                      v-model="registerForm.email"
                      type="email"
                      autocomplete="email"
                      required
                      class="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300 text-sm"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              </div>

              <!-- Password and Confirm in one row on desktop -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <!-- Password Input -->
                <div class="group">
                  <label class="block text-xs font-medium text-purple-300 mb-1.5 ml-1">
                    密码
                  </label>
                  <div class="relative">
                    <input
                      v-model="registerForm.password"
                      :type="showPassword ? 'text' : 'password'"
                      autocomplete="new-password"
                      required
                      minlength="8"
                      class="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300 text-sm"
                      placeholder="至少8个字符"
                    />
                  </div>
                </div>

                <!-- Confirm Password Input -->
                <div class="group">
                  <label class="block text-xs font-medium text-purple-300 mb-1.5 ml-1">
                    确认密码
                  </label>
                  <div class="relative">
                    <input
                      v-model="registerForm.password_confirmation"
                      :type="showPassword ? 'text' : 'password'"
                      autocomplete="new-password"
                      required
                      minlength="8"
                      class="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all duration-300 text-sm"
                      placeholder="再次输入"
                    />
                  </div>
                </div>
              </div>

              <!-- Honeypot field (hidden) -->
              <input 
                type="text" 
                v-model="registerForm.website" 
                name="website" 
                style="position: absolute; left: -9999px;" 
                tabindex="-1" 
                autocomplete="off"
              />

              <!-- Terms -->
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="registerForm.terms"
                  type="checkbox"
                  required
                  class="w-3.5 h-3.5 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
                />
                <span class="text-xs text-gray-300">
                  我同意 <a href="/terms" class="text-purple-400 hover:text-purple-300">服务条款</a> 和 
                  <a href="/privacy" class="text-purple-400 hover:text-purple-300">隐私政策</a>
                </span>
              </label>

              <!-- Error Message -->
              <div v-if="registerError" class="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p class="text-sm text-red-400">{{ registerError }}</p>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="registerLoading || !registerForm.terms"
                class="relative w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden group cursor-pointer"
              >
                <span v-if="!registerLoading" class="relative z-10">注册</span>
                <span v-else class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  注册中...
                </span>
                <!-- Button shine effect -->
                <div class="absolute inset-0 -top-2 h-[200%] w-[200%] rotate-45 translate-x-[-70%] bg-white/20 transition-all duration-1000 ease-out group-hover:translate-x-[50%]"></div>
              </button>
            </form>

            <!-- Social Login (Hidden for now) -->
            <!-- <div class="mt-6 pt-6 border-t border-white/10">
              <p class="text-center text-xs text-gray-400 mb-4">或使用其他方式</p>
              <div class="flex gap-3">
                <button class="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-white transition-all duration-300">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                  </svg>
                  <span class="text-sm">Google</span>
                </button>
                <button class="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-white transition-all duration-300">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                  <span class="text-sm">Facebook</span>
                </button>
              </div>
            </div> -->
          </div>
        </div>

        <!-- Back to Home -->
        <div class="text-center mt-6">
          <router-link 
            to="/" 
            class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import SiteLogo from '@/components/SiteLogo.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// State - Set initial tab based on route
const isLogin = ref(route.name !== 'register')

// Watch route changes to update tab
onMounted(() => {
  if (route.name === 'register') {
    isLogin.value = false
  }
})
const showPassword = ref(false)
const loginLoading = ref(false)
const registerLoading = ref(false)
const loginError = ref('')
const registerError = ref('')

// Forms
const loginForm = reactive({
  email: '',
  password: '',
  remember: false
})

const registerForm = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  terms: false,
  website: '' // Honeypot
})

// Methods
const handleLogin = async () => {
  loginLoading.value = true
  loginError.value = ''
  
  try {
    const result = await authStore.login({
      email: loginForm.email,
      password: loginForm.password,
      remember: loginForm.remember
    })
    
    if (result.success) {
      notificationStore.success('登录成功！')
      router.push('/')
    } else {
      loginError.value = result.message || '登录失败，请检查您的邮箱和密码'
    }
  } catch (error) {
    loginError.value = '登录失败，请稍后重试'
  } finally {
    loginLoading.value = false
  }
}

const handleRegister = async () => {
  // Check honeypot
  if (registerForm.website) {
    console.log('Bot detected')
    return
  }
  
  // Check password confirmation
  if (registerForm.password !== registerForm.password_confirmation) {
    registerError.value = '两次输入的密码不一致'
    return
  }
  
  registerLoading.value = true
  registerError.value = ''
  
  try {
    const result = await authStore.register({
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password,
      password_confirmation: registerForm.password_confirmation
    })
    
    if (result.success) {
      notificationStore.success('注册成功！')
      router.push('/')
    } else {
      registerError.value = result.message || '注册失败'
    }
  } catch (error) {
    registerError.value = '注册失败，请稍后重试'
  } finally {
    registerLoading.value = false
  }
}
</script>

<style scoped>
/* Animated particles */
.particle {
  position: absolute;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  opacity: 0.3;
  animation: float 20s infinite ease-in-out;
}

.particle-1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.particle-2 {
  width: 120px;
  height: 120px;
  top: 70%;
  right: 10%;
  animation-delay: 5s;
}

.particle-3 {
  width: 60px;
  height: 60px;
  bottom: 10%;
  left: 30%;
  animation-delay: 10s;
}

.particle-4 {
  width: 100px;
  height: 100px;
  top: 40%;
  right: 30%;
  animation-delay: 15s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.3;
  }
  33% {
    transform: translateY(-100px) rotate(120deg);
    opacity: 0.5;
  }
  66% {
    transform: translateY(100px) rotate(240deg);
    opacity: 0.2;
  }
}

/* Animation classes */
.animate-fade-in-down {
  animation: fadeInDown 0.8s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>