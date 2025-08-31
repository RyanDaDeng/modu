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

// Get all user's bookmarks
export const getBookmarks = async () => {
  const response = await api.get('/api/bookmarks')
  return response.data
}

// Add or update a bookmark
export const addBookmark = async (bookmarkData) => {
  const response = await api.post('/api/bookmarks', bookmarkData)
  return response.data
}

// Remove a bookmark
export const removeBookmark = async (bookmarkId) => {
  const response = await api.delete(`/api/bookmarks/${bookmarkId}`)
  return response.data
}