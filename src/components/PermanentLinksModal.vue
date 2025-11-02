<template>
  <!-- Permanent Links Modal -->
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div
      @click="close"
      class="absolute inset-0 bg-black/70 backdrop-blur-sm"
    ></div>

    <!-- Modal Container -->
    <div class="relative max-w-md w-full">
      <!-- Gradient border effect -->
      <div class="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl blur opacity-50"></div>

      <!-- Main modal content -->
      <div class="relative bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
        <!-- Close Button -->
        <button
          @click="close"
          class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Title -->
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-bold text-white">永久链接</h2>
            <p class="text-sm text-gray-400 mt-0.5">请保存以下地址</p>
          </div>
        </div>

        <!-- Links -->
        <div class="space-y-4">
          <!-- Main Address 1 -->
          <div class="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-400">主地址一</span>
              <button
                @click="copyToClipboard('https://modu18.vip')"
                class="text-xs px-2 py-1 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/50 text-pink-300 rounded transition-all cursor-pointer"
              >
                复制
              </button>
            </div>
            <a
              href="https://modu18.vip"
              target="_blank"
              class="text-blue-400 hover:text-blue-300 font-mono text-sm break-all transition-colors"
            >
              https://modu18.vip
            </a>
          </div>

          <!-- Main Address 2 -->
          <div class="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-gray-400">主地址二</span>
              <button
                @click="copyToClipboard('https://18modu.vip')"
                class="text-xs px-2 py-1 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/50 text-pink-300 rounded transition-all cursor-pointer"
              >
                复制
              </button>
            </div>
            <a
              href="https://18modu.vip"
              target="_blank"
              class="text-blue-400 hover:text-blue-300 font-mono text-sm break-all transition-colors"
            >
              https://18modu.vip
            </a>
          </div>
        </div>

        <!-- Notice -->
        <div class="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <div class="flex items-start gap-2">
            <svg class="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-yellow-200">
              可能需要科学上网访问
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useNotification } from '@/composables/useNotification'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const notification = useNotification()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const close = () => {
  isOpen.value = false
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    notification.success('已复制到剪贴板')
  } catch (err) {
    console.error('Failed to copy:', err)
    notification.error('复制失败，请手动复制')
  }
}
</script>
