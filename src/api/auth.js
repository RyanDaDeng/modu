import axios from 'axios'
import { useNotificationStore } from '@/stores/notification'

// 开发环境：优先使用 VITE_DEV_API_URL，如果没有则使用代理
// 生产环境：使用 VITE_BACKEND_API_URL
const API_URL = import.meta.env.PROD 
  ? import.meta.env.VITE_BACKEND_API_URL 
  : (import.meta.env.VITE_DEV_API_URL || '')

// 简单配置 - 不使用 CSRF
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false  // 不使用 cookies
})

// Request interceptor - 只添加 Bearer token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理401未认证和其他错误
api.interceptors.response.use(
  response => response.data,
  error => {
    const notificationStore = useNotificationStore()
    
    if (error.response) {
      const status = error.response.status
      const data = error.response.data
      
      // Handle 422 Validation Errors
      if (status === 422) {
        if (data.errors) {
          // Show first validation error
          const firstError = Object.values(data.errors)[0]
          const errorMessage = Array.isArray(firstError) ? firstError[0] : firstError
          notificationStore.error(errorMessage, '验证失败')
        } else if (data.message) {
          notificationStore.error(data.message, '验证失败')
        }
      }
      // Handle 500 Server Errors
      else if (status >= 500) {
        notificationStore.error('服务器错误，请稍后重试', '服务器错误')
      }
      // Handle 404 Not Found
      else if (status === 404) {
        notificationStore.error('请求的资源不存在', '未找到')
      }
      // Handle 403 Forbidden
      else if (status === 403) {
        notificationStore.error('您没有权限执行此操作', '权限不足')
      }
      // Handle 401 Unauthorized (but don't show notification for normal auth checks)
      else if (status === 401 && !error.config.url?.includes('/api/user')) {
        // Only show notification for actual unauthorized actions, not auth checks
        if (error.config.method !== 'get') {
          notificationStore.warning('请先登录', '需要登录')
        }
      }
    } else if (error.request) {
      // Request made but no response
      notificationStore.error('网络连接失败，请检查网络', '网络错误')
    } else {
      // Something else happened
      notificationStore.error('请求失败，请稍后重试', '错误')
    }
    
    return Promise.reject(error.response?.data || error)
  }
)

// 生成请求签名（简单的时间戳验证）
const generateRequestSignature = () => {
  const timestamp = Date.now()
  const signature = btoa(timestamp + ':modu18') // 简单签名
  return { timestamp, signature }
}

// 注册 - 带安全验证
export const register = async (data) => {
  const { timestamp, signature } = generateRequestSignature()
  const response = await api.post('/api/auth/register', {
    ...data,
    _timestamp: timestamp,
    _signature: signature
  })
  return response
}

// 登录 - 带安全验证
export const login = async (credentials) => {
  const { timestamp, signature } = generateRequestSignature()
  const response = await api.post('/api/auth/login', {
    ...credentials,
    _timestamp: timestamp,
    _signature: signature
  })
  return response
}

// 退出登录
export const logout = async () => {
  await api.post('/api/auth/logout')
}

// 获取当前用户信息（从服务器）
export const getUser = async () => {
  try {
    const user = await api.get('/api/user')
    return user
  } catch (error) {
    // 对于用户未登录的401错误，这是预期的，静默处理
    if (error?.status === 401 || error?.response?.status === 401) {
      return null
    }
    // 其他错误继续抛出
    throw error
  }
}

// 检查是否有 token
export const hasAuthToken = () => {
  return !!localStorage.getItem('auth_token')
}

// 检查是否已登录（通过API调用）
export const checkAuth = async () => {
  // 先检查 token，没有 token 就不用调用API
  if (!hasAuthToken()) {
    return false
  }
  
  try {
    const user = await getUser()
    return !!user
  } catch {
    return false
  }
}

// 更新用户资料
export const updateProfile = async (data) => {
  const response = await api.put('/api/user/profile', data)
  return response
}

// 修改密码
export const changePassword = async (data) => {
  const response = await api.put('/api/user/password', data)
  return response
}
