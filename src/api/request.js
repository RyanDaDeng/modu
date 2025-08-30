import axios from 'axios'
import { useAppStore } from '@/stores/app'
import { processEncryptedResponse } from './customCrypto'

// 使用后端代理服务器
// 开发环境：优先使用 VITE_DEV_API_URL，如果没有则使用代理（空字符串）
// 生产环境：使用 VITE_BACKEND_API_URL
const BACKEND_PROXY = import.meta.env.PROD 
  ? (import.meta.env.VITE_BACKEND_API_URL || '') 
  : (import.meta.env.VITE_DEV_API_URL || '')

const api = axios.create({
  baseURL: BACKEND_PROXY,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
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

// Response interceptor for handling errors and decryption
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
    if (error.response?.status === 401) {
      // Clear auth data on 401
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      // Optionally redirect to login
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export async function getLatestComics(page = 1) {
  const response = await api.get(
    `${BACKEND_PROXY}/api/latest`,
    { params: { page } }
  )
  
  // Backend now handles decryption
  return response.data.data || response.data
}

export async function searchComics(query, page = 1, order = 'mv') {
  const cleanQuery = query.replace(/\s/g, '')
  
  const response = await api.get(
    `${BACKEND_PROXY}/api/search`, 
    {
      params: {
        search_query: cleanQuery,
        o: order,
        page: page
      }
    }
  )
  
  // Backend now handles decryption
  return response.data.data || response.data
}

export async function getPromotionComics() {
  // Check cache first
  const cached = localStorage.getItem('promotionData')
  if (cached) {
    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
      return data
    }
  }
  
  const response = await api.get(
    `${BACKEND_PROXY}/api/promote`,
    { params: { page: 1 } }
  )
  
  // Backend now handles decryption
  const result = response.data.data || response.data
  
  // Cache for 24 hours
  localStorage.setItem('promotionData', JSON.stringify({
    data: result,
    timestamp: Date.now()
  }))
  
  return result
}

export async function getComicAlbum(comicId) {
  const response = await api.get(
    `${BACKEND_PROXY}/api/album`,
    { params: { id: comicId } }
  )
  
  console.log('Album response:', response.data)
  
  // Backend now handles decryption
  return response.data.data || response.data
}

export async function getComicChapter(comicId) {
  console.log('Getting chapter for comic:', comicId)
  
  const response = await api.get(
    `${BACKEND_PROXY}/api/chapter?id=${comicId}`
  )
  
  console.log('Chapter response:', response.data)
  
  // Backend now handles decryption
  return response.data.data || response.data
}

export async function getForumComments(albumId, page = 1) {
  const response = await api.get(
    `${BACKEND_PROXY}/api/forum?page=${page}&mode=manhua&aid=${albumId}`
  )
  
  // Backend now handles decryption
  const result = response.data.data || response.data
  return result.list || []
}

export async function getHotTags() {
  // Check cache first
  const cached = localStorage.getItem('hotTagsData')
  if (cached) {
    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
      return data
    }
  }
  
  const response = await api.get(
    `${BACKEND_PROXY}/api/hottag`
  )
  
  // Backend now handles decryption
  const hotTags = response.data.data || response.data
  
  // Cache for 24 hours
  localStorage.setItem('hotTagsData', JSON.stringify({
    data: hotTags,
    timestamp: Date.now()
  }))
  
  return hotTags
}

export async function getCategories() {
  const response = await api.get(
    `${BACKEND_PROXY}/api/categories`
  )
  
  // Backend now handles decryption, return data directly
  return response.data.data || response.data
}

export async function getImageServers() {
  const response = await api.get('/api/image-servers')
  return response.data
}

export async function updateUserImageServer(imgServer) {
  const response = await api.put('/api/user/image-server', {
    img_server: imgServer
  })
  return response.data
}

export async function getCategoriesFilter(page = 1, order = '', category = '') {
  const response = await api.get(
    `${BACKEND_PROXY}/api/categories/filter?page=${page}&o=${order}&c=${category}`
  )
  
  // Backend now handles decryption
  return response.data.data || response.data
}

export async function updateCategories(page = 1) {
  // Use latest API as fallback for updates
  const response = await api.get(
    `${BACKEND_PROXY}/api/latest`,
    { params: { page } }
  )
  
  // Backend now handles decryption
  return response.data.data || response.data
}

export async function getWeeklyList(type = 'all', page = 1) {
  // Use week/filter API for weekly updates
  const response = await api.get(
    `${BACKEND_PROXY}/api/week/filter`,
    { params: { type, page } }
  )
  
  // Backend now handles decryption
  return response.data.data || response.data
}

// Export axios instance for direct use
export const request = api

// Export with both names for compatibility
export const getPromotionContent = getPromotionComics
export const getWeeklyUpdates = getWeeklyList
export const getLatestContent = getLatestComics
export const getSearchResults = searchComics

// getSerialization doesn't exist, create a stub that uses weekly updates
export async function getSerialization(page = 1) {
  return getWeeklyList('all', page)
}

export default {
  getLatestComics,
  searchComics,
  getPromotionComics,
  getPromotionContent, // Alias for compatibility
  getComicAlbum,
  getComicChapter,
  getForumComments,
  getHotTags,
  getCategories,
  getImageServers,
  updateUserImageServer,
  getCategoriesFilter,
  updateCategories,
  getWeeklyList,
  getWeeklyUpdates, // Alias for compatibility
  getLatestContent, // Alias for compatibility
  getSearchResults, // Alias for compatibility
  getSerialization // New function
}