import { defineStore } from 'pinia'

export const usePageStateStore = defineStore('pageState', {
  state: () => ({
    // Store page states by route path
    pageStates: {},
    // Store scroll positions by route path
    scrollPositions: {}
  }),

  actions: {
    // Save page state
    savePageState(path, state) {
      this.pageStates[path] = {
        ...state,
        timestamp: Date.now()
      }
    },

    // Get page state
    getPageState(path) {
      const state = this.pageStates[path]
      // Only return state if it's less than 30 minutes old
      if (state && (Date.now() - state.timestamp) < 30 * 60 * 1000) {
        return state
      }
      return null
    },

    // Save scroll position
    saveScrollPosition(path) {
      this.scrollPositions[path] = {
        y: window.scrollY,
        x: window.scrollX,
        timestamp: Date.now()
      }
    },

    // Restore scroll position
    restoreScrollPosition(path) {
      const position = this.scrollPositions[path]
      if (position && (Date.now() - position.timestamp) < 30 * 60 * 1000) {
        // Use requestAnimationFrame for smoother restoration
        requestAnimationFrame(() => {
          window.scrollTo({
            top: position.y,
            left: position.x,
            behavior: 'instant'
          })
        })
        return true
      }
      return false
    },

    // Clear old states (cleanup)
    clearOldStates() {
      const now = Date.now()
      const maxAge = 30 * 60 * 1000 // 30 minutes

      // Clean page states
      Object.keys(this.pageStates).forEach(key => {
        if (now - this.pageStates[key].timestamp > maxAge) {
          delete this.pageStates[key]
        }
      })

      // Clean scroll positions
      Object.keys(this.scrollPositions).forEach(key => {
        if (now - this.scrollPositions[key].timestamp > maxAge) {
          delete this.scrollPositions[key]
        }
      })
    },

    // Clear specific page state
    clearPageState(path) {
      delete this.pageStates[path]
      delete this.scrollPositions[path]
    }
  }
})