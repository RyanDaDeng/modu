import axios from 'axios'
import { processEncryptedResponse } from './customCrypto'

// 使用与auth.js相同的配置
const API_URL = import.meta.env.PROD 
  ? import.meta.env.VITE_BACKEND_API_URL 
  : ''

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
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

// Response interceptor for decryption
api.interceptors.response.use(
  async response => {
    // Check if response has encrypted data
    if (response.data && response.data.encrypted) {
      try {
        // Decrypt the data
        const decrypted = await processEncryptedResponse(response)
        // Replace response data with decrypted data
        response.data = decrypted
      } catch (error) {
        console.error('Failed to decrypt response:', error)
        // Keep original response if decryption fails
      }
    }
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

// 搜索漫画
export async function getSearchResults(searchQuery, page = 1) {
  const cleanQuery = searchQuery.replace(/\s/g, '')
  
  const { data } = await api.get('/api/comic/search', {
    params: {
      search_query: cleanQuery,
      o: 'mv',
      page: page
    }
  })
  
  // Backend now handles decryption
  return data.data || data
}

// 获取最新内容
export async function getLatestContent(page = 1) {
  const { data } = await api.get('/api/comic/latest', {
    params: { page }
  })
  return data.data || data
}

// 获取推广内容
export async function getPromotionContent() {
  // Check cache first
  const cached = localStorage.getItem('promotionData')
  if (cached) {
    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
      return data
    }
  }
  
  const { data } = await api.get('/api/comic/promote', {
    params: { page: 1 }
  })
  const result = data.data || data
  
  // Cache for 24 hours
  localStorage.setItem('promotionData', JSON.stringify({
    data: result,
    timestamp: Date.now()
  }))
  
  return result
}

// 获取漫画专辑
export async function getComicAlbum(comicId) {
  const { data } = await api.get('/api/comic/album', {
    params: { id: comicId }
  })
  return data.data || data
}

// 获取漫画章节
export async function getComicChapter(comicId) {
  const { data } = await api.get('/api/comic/chapter', {
    params: { id: comicId }
  })
  return data.data || data
}

// 获取论坛评论
export async function getForumComments(albumId, page = 1) {
  const { data } = await api.get('/api/comic/forum', {
    params: {
      page: page,
      mode: 'manhua',
      aid: albumId
    }
  })
  const result = data.data || data
  return result.list || []
}

// 获取热门标签
export async function getHotTags() {
  // Check cache first
  const cached = localStorage.getItem('hotTagsData')
  if (cached) {
    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
      return data
    }
  }
  
  const { data } = await api.get('/api/comic/hottag')
  const result = data.data || data
  
  // Cache for 24 hours
  localStorage.setItem('hotTagsData', JSON.stringify({
    data: result,
    timestamp: Date.now()
  }))
  
  return result
}

// 获取分类内容
export async function getCatalogContent(mode, page = 1) {
  const { data } = await api.get('/api/comic/search', {
    params: {
      mode: mode,
      page: page,
      o: 'mv'
    }
  })
  return data.data || data
}

// 获取随机漫画
export async function getRandomComics() {
  // Check cache first
  const cached = localStorage.getItem('randomComicsData')
  if (cached) {
    const { data, timestamp } = JSON.parse(cached)
    // Cache for 5 minutes
    if (Date.now() - timestamp < 5 * 60 * 1000) {
      return data
    }
  }
  
  const { data } = await api.get('/api/comic/forum', {
    params: { mode: 'random' }
  })
  const result = data.data || data
  
  // Cache for 5 minutes
  localStorage.setItem('randomComicsData', JSON.stringify({
    data: result,
    timestamp: Date.now()
  }))
  
  return result
}

// 导出所有函数以保持兼容性
export default {
  getSearchResults,
  getLatestContent,
  getPromotionContent,
  getComicAlbum,
  getComicChapter,
  getForumComments,
  getHotTags,
  getCatalogContent,
  getRandomComics
}