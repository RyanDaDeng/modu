import { createApp } from 'vue'
import './app.css'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered:', registration)
        
        // Check for updates periodically
        setInterval(() => {
          registration.update()
        }, 60000) // Check every minute
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error)
      })
  })
}

// iOS PWA Detection and Install Prompt
let deferredPrompt = null
let isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
let isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone

// Handle install prompt for other browsers
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredPrompt = e
  console.log('Install prompt saved')
})

// iOS Install Instructions
if (isIOS && !isInStandaloneMode) {
  // You can show a custom install banner for iOS users
  console.log('iOS device detected. Show install instructions.')
}
