<template>
  <div class="sm:hidden sticky top-0 z-30">
    <!-- Background layers -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- Light overlay for text readability -->
      <div class="absolute inset-0 bg-gray-900/80"></div>
    </div>
    
    <!-- Content container - removed backdrop blur -->
    <div class="relative px-4 py-2">
    <div class="relative group">
      <!-- Gradient border glow effect -->
      <div class="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
      
      <!-- Search input with transparency -->
      <input
        :value="modelValue"
        @click="handleClick"
        @focus="handleClick"
        type="text"
        :placeholder="placeholder"
        class="relative w-full px-4 py-2 pl-10 bg-white/5 backdrop-blur-sm border border-white/30 rounded-full text-white placeholder-gray-300 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all cursor-pointer text-sm shadow-lg"
        :class="{ 'pr-10': modelValue }"
        readonly
      />
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      
      <!-- Search button when no value -->
      <button
        v-if="!modelValue"
        @click="handleClick"
        class="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-pink-500/30 to-purple-500/30 backdrop-blur-sm border border-pink-400/50 hover:from-pink-500/40 hover:to-purple-500/40 hover:border-pink-400/70 text-pink-200 hover:text-white text-xs font-medium rounded-full transition-all cursor-pointer"
      >
        搜索
      </button>
      
      <!-- Clear button when there's a value -->
      <button
        v-else
        @click="handleClear"
        class="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-gray-700/50 hover:bg-gray-600/50 backdrop-blur-sm border border-gray-600/50 hover:border-gray-500/50 text-gray-400 hover:text-white rounded-full transition-all cursor-pointer"
        title="清空"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <!-- Optional: Announcement banner slot -->
    <slot name="announcement"></slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '搜索漫画、作者...'
  },
  showCurrentQuery: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click', 'update:modelValue', 'clear'])

const handleClick = () => {
  emit('click')
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
}
</script>
