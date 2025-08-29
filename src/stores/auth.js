import { defineStore } from 'pinia'
import { login as apiLogin, logout as apiLogout, register as apiRegister, getUser, checkAuth } from '@/api/auth'
import { useAppStore } from './app'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    authInitialized: false,
    rememberMe: false
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated && !!state.user,
    userName: (state) => state.user?.name || '',
    userEmail: (state) => state.user?.email || ''
  },

  actions: {
    async initAuth() {
      if (this.authInitialized) return
      
      // 检查 localStorage 中的 token
      const token = localStorage.getItem('auth_token')
      const expiresAt = localStorage.getItem('token_expires_at')
      
      if (!token) {
        // 没有 token，直接显示登录按钮
        this.authInitialized = true
        this.clearAuth()
        return
      }
      
      // 检查 token 是否已过期
      if (expiresAt && new Date(expiresAt) < new Date()) {
        console.log('Token has expired')
        this.authInitialized = true
        this.clearAuth()
        localStorage.removeItem('auth_token')
        localStorage.removeItem('token_expires_at')
        return
      }
      
      // 有 token 且未过期，设置并尝试获取用户信息
      this.token = token
      this.isLoading = true
      
      try {
        const user = await getUser()
        
        // 立即标记为已初始化
        this.authInitialized = true
        
        if (user) {
          this.user = user
          this.isAuthenticated = true
          
          // 同步到 app store
          const appStore = useAppStore()
          appStore.setUser(user)
        } else {
          // token 无效
          this.clearAuth()
          localStorage.removeItem('auth_token')
          localStorage.removeItem('token_expires_at')
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        this.authInitialized = true
        this.clearAuth()
        // 401 错误，清除 token
        localStorage.removeItem('auth_token')
        localStorage.removeItem('token_expires_at')
      } finally {
        this.isLoading = false
      }
    },

    async login(credentials) {
      this.isLoading = true
      try {
        const response = await apiLogin({
          ...credentials,
          remember: this.rememberMe
        })
        
        if (response.user && response.token) {
          this.user = response.user
          this.token = response.token
          this.isAuthenticated = true
          
          // 保存 token 到 localStorage
          localStorage.setItem('auth_token', response.token)
          if (response.expires_at) {
            localStorage.setItem('token_expires_at', response.expires_at)
          }
          
          // 同步到 app store
          const appStore = useAppStore()
          appStore.setUser(response.user)
          
          return { success: true }
        }
        
        return { 
          success: false, 
          message: response.message || '登录失败' 
        }
      } catch (error) {
        console.error('Login error:', error)
        return { 
          success: false, 
          message: error.message || error.email?.[0] || '登录失败，请检查邮箱和密码' 
        }
      } finally {
        this.isLoading = false
      }
    },

    async register(userData) {
      this.isLoading = true
      try {
        const response = await apiRegister(userData)
        
        if (response.user && response.token) {
          this.user = response.user
          this.token = response.token
          this.isAuthenticated = true
          
          // 保存 token 到 localStorage
          localStorage.setItem('auth_token', response.token)
          if (response.expires_at) {
            localStorage.setItem('token_expires_at', response.expires_at)
          }
          
          // 同步到 app store
          const appStore = useAppStore()
          appStore.setUser(response.user)
          
          return { success: true }
        }
        
        return { 
          success: false, 
          message: response.message || '注册失败' 
        }
      } catch (error) {
        console.error('Register error:', error)
        
        // 处理验证错误
        let errorMessage = '注册失败'
        if (error.errors) {
          const firstError = Object.values(error.errors)[0]
          errorMessage = Array.isArray(firstError) ? firstError[0] : firstError
        } else if (error.message) {
          errorMessage = error.message
        }
        
        return { 
          success: false, 
          message: errorMessage 
        }
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        await apiLogout()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.clearAuth()
        
        // 清除所有认证相关的 localStorage
        localStorage.removeItem('auth_token')
        localStorage.removeItem('token_expires_at')
        
        // 清除 app store 的用户信息
        const appStore = useAppStore()
        appStore.clearUser()
        appStore.collectedComics = []
      }
    },

    async fetchUser() {
      try {
        const user = await getUser()
        if (user) {
          this.user = user
          this.isAuthenticated = true
          
          // 同步到 app store
          const appStore = useAppStore()
          appStore.setUser(user)
          
          return user
        } else {
          // 没有用户，清除 token
          localStorage.removeItem('auth_token')
          localStorage.removeItem('token_expires_at')
        }
      } catch (error) {
        // 获取失败，清除 token
        localStorage.removeItem('auth_token')
        localStorage.removeItem('token_expires_at')
        this.clearAuth()
        throw error
      }
    },

    clearAuth() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.rememberMe = false
    },

    setRememberMe(value) {
      this.rememberMe = value
    }
  }
})