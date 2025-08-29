<template>
  <!-- Modal Only -->
  <div 
    v-if="modelValue"
    class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
    @click.self="closeModal"
  >
      <div class="bg-gray-800 rounded-t-2xl sm:rounded-lg p-4 sm:p-6 max-w-lg w-full sm:mx-4 max-h-[70vh] sm:max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg sm:text-xl font-bold text-white">服务器设置</h2>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-white"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- API Servers -->
        <div class="mb-4 sm:mb-6">
          <h3 class="text-base sm:text-lg font-semibold text-white mb-2">API 服务器</h3>
          <div class="space-y-1 sm:space-y-2">
            <div
              v-for="(server, index) in appStore.serverInfo.Server"
              :key="server"
              class="flex items-center justify-between p-2 sm:p-3 bg-gray-700 rounded-lg"
            >
              <label class="flex items-center flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="apiServer"
                  :value="server"
                  :checked="appStore.primaryServer === server"
                  @change="selectServer(server)"
                  class="mr-3"
                />
                <span class="text-white text-sm">服务器 {{ index + 1 }}号</span>
              </label>
              <span class="ml-2 px-2 py-1 text-xs rounded-full"
                :class="{
                  'bg-green-600 text-white': appStore.serverStatus[server] === 'online',
                  'bg-red-600 text-white': appStore.serverStatus[server] === 'offline',
                  'bg-gray-600 text-gray-300': !appStore.serverStatus[server]
                }"
              >
                {{ appStore.serverStatus[server] === 'online' ? '在线' : 
                   appStore.serverStatus[server] === 'offline' ? '离线' : '未检测' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Image Servers -->
        <div class="mb-4 sm:mb-6">
          <h3 class="text-base sm:text-lg font-semibold text-white mb-2">图片服务器</h3>
          <div class="space-y-1 sm:space-y-2">
            <div
              v-for="(server, index) in appStore.serverInfo.imgServer"
              :key="server"
              class="flex items-center justify-between p-2 sm:p-3 bg-gray-700 rounded-lg"
            >
              <label class="flex items-center flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="imgServer"
                  :value="server"
                  :checked="appStore.primaryImgServer === server"
                  @change="selectImgServer(server)"
                  class="mr-3"
                />
                <span class="text-white text-sm">图片服务器 {{ index + 1 }}号</span>
              </label>
              <span class="ml-2 px-2 py-1 text-xs rounded-full"
                :class="{
                  'bg-green-600 text-white': appStore.imgServerStatus[server] === 'online',
                  'bg-red-600 text-white': appStore.imgServerStatus[server] === 'offline',
                  'bg-gray-600 text-gray-300': !appStore.imgServerStatus[server]
                }"
              >
                {{ appStore.imgServerStatus[server] === 'online' ? '在线' : 
                   appStore.imgServerStatus[server] === 'offline' ? '离线' : '未检测' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-between gap-2">
          <button
            @click="checkServers"
            :disabled="appStore.checkingServers"
            class="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ appStore.checkingServers ? '检测中...' : '重新检测' }}
          </button>
          <button
            @click="closeModal"
            class="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const appStore = useAppStore()

const closeModal = () => {
  emit('update:modelValue', false)
}

const selectServer = (server) => {
  appStore.setSelectedServer(server)
}

const selectImgServer = (server) => {
  appStore.setSelectedImgServer(server)
}

const checkServers = async () => {
  // Server checking removed - not needed
}
</script>