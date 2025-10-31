import axios from 'axios'

// Use the same axios instance setup as auth
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


// Get all user's video collections
export const getVideoCollections = async (page = 1, perPage = 20) => {
  const response = await api.get('/api/video-collections', {
    params: { page, per_page: perPage }
  })
  return response.data
}

// Add a video to collection
export const addToVideoCollection = async (video) => {
  const videoId = video.id || video.vod_id
  const response = await api.post('/api/video-collections', {
    video_id: String(videoId),
    name: video.name || video.vod_name || video.title || '',
    cover: video.cover || video.vod_pic || null
  })
  return response.data
}

// Remove a video from collection
export const removeFromVideoCollection = async (videoId) => {
  const response = await api.delete(`/api/video-collections/${videoId}`)
  return response.data
}

// Toggle video collection status
export const toggleVideoCollection = async (video) => {
  const videoId = video.id || video.vod_id
  const response = await api.post('/api/video-collections/toggle', {
    video_id: String(videoId),
    name: video.name || video.vod_name || video.title || '',
    cover: video.cover || video.vod_pic || null
  })
  return response.data
}

// Check if a video is collected
export const checkVideoCollection = async (videoId) => {
  if (!videoId || videoId === 'undefined') {
    console.warn('checkVideoCollection called with invalid videoId:', videoId)
    return { is_collected: false }
  }
  const response = await api.get(`/api/video-collections/check/${videoId}`)
  return response.data
}

// Get video collection stats
export const getVideoCollectionStats = async () => {
  const response = await api.get('/api/video-collections/stats')
  return response.data
}
