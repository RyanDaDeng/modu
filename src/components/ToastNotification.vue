<template>
  <teleport to="body">
    <!-- Notification Container - Top Center -->
    <div class="fixed top-20 left-1/2 -translate-x-1/2 z-[100] space-y-3 pointer-events-none w-full max-w-md px-4">
      <transition-group
        name="notification"
        tag="div"
        @enter="onEnter"
        @leave="onLeave"
      >
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="pointer-events-auto"
        >
          <!-- Glassmorphism Card with Gradient Border -->
          <div class="relative group">
            <!-- Animated gradient border glow -->
            <div 
              :class="[
                'absolute inset-0 rounded-xl blur-sm opacity-70 group-hover:opacity-100 transition-opacity',
                glowClasses[notification.type]
              ]"
            ></div>
            
            <!-- Main notification content -->
            <div
              :class="[
                'relative flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-xl border transition-all transform hover:scale-[1.02]',
                notificationClasses[notification.type]
              ]"
            >
              <!-- Icon with glow effect -->
              <div class="flex-shrink-0 relative">
                <div 
                  :class="[
                    'absolute inset-0 blur-md opacity-50',
                    iconGlowClasses[notification.type]
                  ]"
                ></div>
                
                <!-- Success Icon -->
                <svg v-if="notification.type === 'success'" class="relative w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                
                <!-- Error Icon -->
                <svg v-else-if="notification.type === 'error'" class="relative w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                
                <!-- Warning Icon -->
                <svg v-else-if="notification.type === 'warning'" class="relative w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                
                <!-- Info Icon -->
                <svg v-else class="relative w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </div>
              
              <!-- Content -->
              <div class="flex-1 min-w-0">
                <p v-if="notification.title" class="text-sm font-bold text-white">
                  {{ notification.title }}
                </p>
                <p class="text-sm text-gray-200" :class="{ 'mt-0.5': notification.title }">
                  {{ notification.message }}
                </p>
              </div>
              
              <!-- Close Button with hover effect -->
              <button
                @click="removeNotification(notification.id)"
                class="flex-shrink-0 ml-2 p-1 rounded-lg hover:bg-white/10 transition-all cursor-pointer group"
              >
                <svg class="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
              
              <!-- Progress bar for auto-dismiss -->
              <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 rounded-b-xl overflow-hidden">
                <div 
                  :class="[
                    'h-full transition-all duration-[5000ms] ease-linear',
                    progressBarClasses[notification.type]
                  ]"
                  :style="{ width: '0%', animation: 'progress 5s linear forwards' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()

const notifications = computed(() => notificationStore.notifications)

// Glassmorphism styles with gradient borders
const notificationClasses = {
  success: 'bg-gray-900/90 border-green-500/50 text-green-400',
  error: 'bg-gray-900/90 border-red-500/50 text-red-400',
  warning: 'bg-gray-900/90 border-yellow-500/50 text-yellow-400',
  info: 'bg-gray-900/90 border-pink-500/50 text-pink-400'
}

// Gradient glow for the outer border
const glowClasses = {
  success: 'bg-gradient-to-r from-green-500 to-emerald-500',
  error: 'bg-gradient-to-r from-red-500 to-rose-500',
  warning: 'bg-gradient-to-r from-yellow-500 to-orange-500',
  info: 'bg-gradient-to-r from-pink-500 to-purple-500'
}

// Icon glow classes
const iconGlowClasses = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-pink-500'
}

// Progress bar colors
const progressBarClasses = {
  success: 'bg-green-500/50',
  error: 'bg-red-500/50',
  warning: 'bg-yellow-500/50',
  info: 'bg-pink-500/50'
}

const removeNotification = (id) => {
  notificationStore.remove(id)
}

// Enhanced animation hooks
const onEnter = (el) => {
  el.style.transform = 'translateY(-20px) scale(0.95)'
  el.style.opacity = 0
  
  setTimeout(() => {
    el.style.transition = 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    el.style.transform = 'translateY(0) scale(1)'
    el.style.opacity = 1
  }, 10)
}

const onLeave = (el) => {
  el.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  el.style.transform = 'translateY(-20px) scale(0.95)'
  el.style.opacity = 0
}
</script>

<style scoped>
/* Progress bar animation */
@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .fixed {
    top: 5rem; /* Below mobile header */
  }
}

/* Smooth animation for notification stack */
.notification-move {
  transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Enter animation - slide down from top */
.notification-enter-active {
  animation: slideDown 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Leave animation - slide up and fade */
.notification-leave-active {
  animation: slideUp 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes slideDown {
  from {
    transform: translateY(-100%) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateY(-100%) scale(0.9);
    opacity: 0;
  }
}

/* Hover effects */
.group:hover .relative {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}
</style>