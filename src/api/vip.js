import axios from 'axios'

// Use the same axios instance setup
const API_URL = import.meta.env.PROD 
  ? import.meta.env.VITE_BACKEND_API_URL 
  : ''

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: false // No longer using cookies
})

// Request interceptor to add auth token
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


// Get All VIP plans (including both comic and video plans)
export const getVipPlans = async () => {
  const response = await api.get('/api/vip/plans')
  return response.data
}

// Deprecated: Use getVipPlans() instead which now returns all plans
export const getVideoVipPlans = async () => {
  console.warn('getVideoVipPlans is deprecated. Use getVipPlans() instead.')
  const response = await api.get('/api/vip/plans')
  return response.data
}

// Create VIP order
export const createVipOrder = async (planKey, paymentMethod) => {
  const response = await api.post('/api/vip/create-order', {
    plan_key: planKey,
    payment_method: paymentMethod
  })
  return response.data
}

// Get recharge history
export const getRechargeHistory = async (page = 1, perPage = 10) => {
  const response = await api.get('/api/recharge-history', {
    params: { page, per_page: perPage }
  })
  return response.data
}