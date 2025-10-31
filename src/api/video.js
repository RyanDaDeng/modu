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
  withCredentials: false
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

/**
 * 获取视频列表
 * @param {Object} params - 查询参数
 */
export const getVideos = async (params) => {
  const response = await api.get('/api/online-video', { params })
  return response.data
}

/**
 * 获取视频分类设置
 * @param {string} source - 来源筛选
 */
export const getVideoSettings = async (source = null) => {
  const response = await api.get('/api/online-video-settings', {
    params: { source }
  })
  return response.data
}

/**
 * 获取视频详情
 * @param {string|number} id - 视频ID
 */
export const getVideoDetail = async (id) => {
  // 检查用户是否已登录
  const token = localStorage.getItem('auth_token')
  // 根据登录状态选择不同的API端点
  const endpoint = token
    ? `/api/online-video/${id}/detail`  // 已登录：使用需要认证的接口
    : `/api/public/online-video/${id}/detail`  // 未登录：使用公开接口
  const response = await api.get(endpoint)
  return response.data
}

/**
 * 获取热门推荐视频
 * @param {Object} params - 查询参数
 */
export const getHotRecommendations = async (params = {}) => {
  const response = await api.get('/api/online-video/hot-recommendations', {
    params: {
      limit: params.limit || 10,
      type_name: params.type_name || null
    }
  })
  return response.data
}

/**
 * 搜索视频
 * @param {string} text - 搜索关键词
 * @param {Object} params - 其他查询参数
 */
export const searchVideos = async (text, params = {}) => {
  const response = await api.get('/api/online-video', {
    params: {
      text,
      ...params
    }
  })
  return response.data
}
