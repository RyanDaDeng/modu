/**
 * Reading History Service
 * Manages comic reading history with localStorage and future API support
 */

class ReadingHistoryService {
  constructor() {
    this.storageKey = 'reading_history'
    this.maxItems = 20
    this.useApi = false // Switch this to true when API is ready
  }

  /**
   * Get all reading history
   * @returns {Array} Array of history items
   */
  async getAll() {
    if (this.useApi) {
      // Future API implementation
      // return await api.get('/user/reading-history')
    }
    
    const data = localStorage.getItem(this.storageKey)
    return data ? JSON.parse(data) : []
  }

  /**
   * Get history for a specific comic
   * @param {Number} comicId 
   * @returns {Object|null} History item or null
   */
  async getByComicId(comicId) {
    const history = await this.getAll()
    return history.find(item => item.comicId === comicId) || null
  }

  /**
   * Add or update reading history
   * @param {Object} historyItem - { comicId, comicTitle, chapterId, chapterTitle, coverImage }
   */
  async add(historyItem) {
    if (this.useApi) {
      // Future API implementation
      // return await api.post('/user/reading-history', historyItem)
    }

    let history = await this.getAll()
    
    // Add timestamp
    historyItem.lastRead = new Date().toISOString()
    
    // Check if comic already exists in history
    const existingIndex = history.findIndex(item => item.comicId === historyItem.comicId)
    
    if (existingIndex !== -1) {
      // Update existing entry
      history[existingIndex] = { ...history[existingIndex], ...historyItem }
    } else {
      // Add new entry at the beginning
      history.unshift(historyItem)
      
      // Remove oldest items if exceeding max
      if (history.length > this.maxItems) {
        history = history.slice(0, this.maxItems)
      }
    }
    
    // Sort by last read (most recent first)
    history.sort((a, b) => new Date(b.lastRead) - new Date(a.lastRead))
    
    localStorage.setItem(this.storageKey, JSON.stringify(history))
    return historyItem
  }

  /**
   * Remove a comic from history
   * @param {Number} comicId 
   */
  async remove(comicId) {
    if (this.useApi) {
      // Future API implementation
      // return await api.delete(`/user/reading-history/${comicId}`)
    }

    let history = await this.getAll()
    history = history.filter(item => item.comicId !== comicId)
    localStorage.setItem(this.storageKey, JSON.stringify(history))
  }

  /**
   * Clear all history
   */
  async clearAll() {
    if (this.useApi) {
      // Future API implementation
      // return await api.delete('/user/reading-history')
    }

    localStorage.removeItem(this.storageKey)
  }

  /**
   * Format last read time for display
   * @param {String} dateString 
   * @returns {String} Formatted time string
   */
  formatLastRead(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 30) return `${days}天前`
    
    return date.toLocaleDateString('zh-CN')
  }
}

export default new ReadingHistoryService()