<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="fixed inset-0 z-50">
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-black/70 backdrop-blur-sm"
          @click="handleClose"
        ></div>
        
        <!-- Drawer Content -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="translate-y-full"
          enter-to-class="translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="translate-y-0"
          leave-to-class="translate-y-full"
        >
          <div 
            v-if="modelValue" 
            class="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-2xl"
            :style="{ maxHeight: maxHeight }"
            @touchstart.passive="handleTouchStart"
            @touchmove.passive="handleTouchMove"
            @touchend.passive="handleTouchEnd"
          >
            <!-- Handle bar -->
            <div class="flex justify-center pt-3 pb-2">
              <div class="w-12 h-1 bg-gray-600 rounded-full"></div>
            </div>
            
            <!-- Header -->
            <div v-if="title || showCloseButton" class="flex items-center justify-between px-4 pb-4">
              <h3 v-if="title" class="text-lg font-semibold text-white">{{ title }}</h3>
              <div v-else></div>
              <button 
                v-if="showCloseButton"
                @click="handleClose"
                class="text-gray-400 p-1 hover:text-white transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <!-- Content -->
            <div 
              class="overflow-y-auto"
              :class="contentClass"
              :style="{ maxHeight: `calc(${maxHeight} - 80px)` }"
            >
              <slot></slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  showCloseButton: {
    type: Boolean,
    default: true
  },
  maxHeight: {
    type: String,
    default: '85vh'
  },
  contentClass: {
    type: String,
    default: ''
  },
  swipeToClose: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

// Touch handling for swipe to close
const touchStartY = ref(0)
const touchEndY = ref(0)
const swipeThreshold = 50

const handleTouchStart = (e) => {
  if (!props.swipeToClose) return
  touchStartY.value = e.touches[0].clientY
}

const handleTouchMove = (e) => {
  if (!props.swipeToClose) return
  touchEndY.value = e.touches[0].clientY
}

const handleTouchEnd = () => {
  if (!props.swipeToClose) return
  
  const swipeDistance = touchEndY.value - touchStartY.value
  
  // Swipe down to close
  if (swipeDistance > swipeThreshold) {
    handleClose()
  }
  
  // Reset
  touchStartY.value = 0
  touchEndY.value = 0
}

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

// Handle escape key
const handleEscape = (e) => {
  if (e.key === 'Escape' && props.modelValue) {
    handleClose()
  }
}

// Add/remove escape listener
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    document.addEventListener('keydown', handleEscape)
    // Prevent body scroll when drawer is open
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleEscape)
    // Restore body scroll
    document.body.style.overflow = ''
  }
})
</script>