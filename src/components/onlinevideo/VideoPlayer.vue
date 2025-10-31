<template>
  <div class="video-player-container relative w-full bg-black rounded-lg overflow-hidden shadow-2xl">
    <!-- 播放器 -->
    <div class="aspect-video relative">
      <!-- 视频元素 -->
      <video
        ref="videoElement"
        controls
        playsinline
        webkit-playsinline
        preload="none"
        :poster="coverImage"
        class="w-full h-full object-contain bg-black"
      >
        您的浏览器不支持 HTML5 视频。
      </video>

      <!-- 封面覆盖层（点击前显示） -->
      <div
        v-if="!started"
        ref="coverLayer"
        class="absolute inset-0 flex items-center justify-center bg-black"
      >
        <img
          :src="coverImage"
          alt="封面"
          class="max-w-full max-h-full object-contain"
          @error="handleImageError"
        />
      </div>

      <!-- 非VIP提示（启动前显示） -->
      <div
        v-if="!started && !isVip"
        class="absolute inset-0 flex items-center justify-center z-10 p-2"
      >
        <div class="text-center bg-black/80 backdrop-blur-md rounded-xl px-4 py-3 sm:px-6 sm:py-4 max-w-xs sm:max-w-sm shadow-2xl border border-yellow-500/40">
          <svg class="w-10 h-10 sm:w-14 sm:h-14 mx-auto mb-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <h3 class="text-base sm:text-xl font-bold text-white mb-1 sm:mb-2">视频会员专享</h3>
          <p class="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4">此视频仅限会员观看</p>
          <button
            @click="goToVip"
            class="w-full px-4 py-2 sm:px-6 sm:py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs sm:text-sm font-bold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
          >
            立即开通会员
          </button>
        </div>
      </div>

      <!-- 点击开始按钮（仅VIP可见） -->
      <div
        v-if="!started && isVip"
        ref="playGate"
        class="absolute inset-0 flex items-center justify-center"
      >
        <button
          @click="startPlayback"
          class="w-21 h-21 rounded-full border-none cursor-pointer flex items-center justify-center bg-white/12 backdrop-blur-sm hover:bg-white/18 transition-all"
          aria-label="播放"
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
            <path d="M8 5v14l11-7z"></path>
          </svg>
        </button>
      </div>

      <!-- 错误蒙层 -->
      <div
        v-if="error"
        class="absolute inset-0 flex items-center justify-center bg-black/90"
      >
        <div class="text-center text-white p-8">
          <svg class="w-16 h-16 mx-auto mb-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          <h3 class="text-xl font-semibold mb-2">视频加载失败</h3>
          <p class="text-gray-400" v-html="errorMessage"></p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Hls from 'hls.js'

const props = defineProps({
  videoUrl: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    required: true
  },
  source: {
    type: String,
    default: ''
  },
  skipSeconds: {
    type: Number,
    default: 26
  }
})

const router = useRouter()
const authStore = useAuthStore()

const videoElement = ref(null)
const coverLayer = ref(null)
const playGate = ref(null)
const started = ref(false)
const error = ref(false)
const errorMessage = ref('您的浏览器不支持此视频格式<br>请使用 Chrome、Firefox、Edge 或 Safari 浏览器')
const destroyed = ref(false)
const hls = ref(null)
const didSafetySeek = ref(false)

// 是否是VIP（基于后端是否返回了视频URL）
const isVip = computed(() => {
  // 如果后端返回了 videoUrl，说明用户是VIP
  // 如果后端没有返回 videoUrl，说明用户不是VIP（后端已经 unset）
  return !!props.videoUrl
})

// 跳转到视频VIP页面
const goToVip = () => {
  router.push('/vip?tab=video')
}

// 图片加载失败处理
const handleImageError = (e) => {
  e.target.src = '/img_6.png'
}

// 显示错误
const showError = (msg) => {
  if (destroyed.value) return
  if (msg) errorMessage.value = msg
  error.value = true
}

// 计算从 currentTime 到段末的缓冲长度
const bufferedLenNow = () => {
  if (!videoElement.value) return 0
  const video = videoElement.value
  const t = video.currentTime
  for (let i = 0; i < video.buffered.length; i++) {
    const start = video.buffered.start(i)
    const end = video.buffered.end(i)
    if (t >= start && t <= end) return end - t
  }
  return 0
}

// 就绪后若不在目标附近，做一次兜底跳转（仅 VOD）
const safetySeekOnce = () => {
  if (didSafetySeek.value) return
  const video = videoElement.value
  if (!video) return

  if (Number.isFinite(video.duration) && video.duration > props.skipSeconds) {
    didSafetySeek.value = true
    if (Math.abs(video.currentTime - props.skipSeconds) > 0.5) {
      try {
        video.currentTime = props.skipSeconds
      } catch (e) {
        console.warn('跳转失败:', e)
      }
    }
  }
}

// 降低码率
const downshiftOnStall = () => {
  if (!hls.value) return
  const next = typeof hls.value.nextAutoLevel === 'number' ? hls.value.nextAutoLevel : hls.value.autoLevel
  const targetCap = Math.max(0, next - 1)
  if (hls.value.autoLevelCapping !== targetCap) {
    hls.value.autoLevelCapping = targetCap
    hls.value.nextAutoLevel = targetCap
  }
}

// 等待缓冲后播放
const waitAndPlay = () => {
  const checkBuffer = setInterval(() => {
    if (bufferedLenNow() >= 2) {
      clearInterval(checkBuffer)
      videoElement.value?.play().catch((err) => {
        console.warn('自动播放被阻止:', err)
      })
    }
  }, 150)
}

// 初始化 HLS.js
const initHls = () => {
  hls.value = new Hls({
    autoStartLoad: false,
    lowLatencyMode: false,
    startPosition: props.skipSeconds,
    enableWorker: true,

    // 缓冲策略
    maxBufferLength: 90,
    maxMaxBufferLength: 600,
    backBufferLength: 120,
    maxBufferSize: 100 * 1000 * 1000,

    // 容忍小 gap
    maxBufferHole: 1.5,
    maxFragLookUpTolerance: 0.2,
    nudgeOffset: 0.12,
    nudgeMaxRetry: 10,

    // ABR
    capLevelToPlayerSize: true,
    abrBandWidthFactor: 0.8,
    abrBandWidthUpFactor: 0.7,
    abrEwmaDefaultEstimate: 600e3,
    abrMaxWithRealBitrate: true,

    // 重试
    fragLoadingTimeOut: 20000,
    fragLoadingRetry: 2,
    fragLoadingMaxRetry: 4,
    manifestLoadingTimeOut: 15000,
    manifestLoadingMaxRetry: 3,
  })

  hls.value.attachMedia(videoElement.value)
  hls.value.loadSource(props.videoUrl)

  // 错误处理
  hls.value.on(Hls.Events.ERROR, (event, data) => {
    console.warn('播放提示/错误：', data)

    if (data?.details === Hls.ErrorDetails.BUFFER_SEEK_OVER_HOLE || data?.details === 'bufferSeekOverHole') {
      if (videoElement.value?.paused) {
        videoElement.value.play().catch(() => {})
      }
      return
    }

    if (data?.details === Hls.ErrorDetails.BUFFER_STALLED_ERROR) {
      try {
        downshiftOnStall()
        const t = videoElement.value?.currentTime || 0
        hls.value.startLoad(t + 0.01)
        if (videoElement.value?.paused) {
          videoElement.value.play().catch(() => {})
        }
      } catch (e) {
        console.error('处理缓冲错误失败:', e)
      }
      return
    }

    if (data?.fatal) {
      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          hls.value.startLoad()
          break
        case Hls.ErrorTypes.MEDIA_ERROR:
          hls.value.recoverMediaError()
          break
        default:
          showError()
          hls.value.destroy()
          destroyed.value = true
          break
      }
    }
  })

  // 清单解析后，再从指定位置开始加载片段
  hls.value.on(Hls.Events.MANIFEST_PARSED, () => {
    hls.value.startLoad(props.skipSeconds)
  })

  // 有数据可播后，再真正调用 play
  videoElement.value.addEventListener('loadeddata', waitAndPlay)

  // 可播后兜底补跳转
  videoElement.value.addEventListener('canplay', safetySeekOnce)
  videoElement.value.addEventListener('loadeddata', safetySeekOnce)
  videoElement.value.addEventListener('error', () => showError())
}

// 初始化原生 HLS（Safari）
const initNative = () => {
  videoElement.value.src = props.videoUrl
  videoElement.value.addEventListener('loadeddata', waitAndPlay)
  videoElement.value.addEventListener('canplay', safetySeekOnce)
  videoElement.value.addEventListener('loadeddata', safetySeekOnce)
  videoElement.value.addEventListener('error', () => showError())
}

// 点击后才开始加载/播放
const startPlayback = async () => {
  if (started.value) return
  started.value = true

  // hls.js 路线
  if (Hls.isSupported()) {
    initHls()
  } else if (videoElement.value?.canPlayType('application/vnd.apple.mpegurl')) {
    // Safari / iOS 原生
    initNative()
  } else {
    // 不支持 HLS
    videoElement.value.src = props.videoUrl
    const timer = setTimeout(() => {
      if (videoElement.value?.readyState === 0) {
        showError('您的浏览器不支持此视频格式<br>请使用 Chrome、Firefox、Edge 或 Safari 浏览器')
      }
      clearTimeout(timer)
    }, 5000)
  }
}

onMounted(() => {
  // 兼容用户直接点 video 控件也触发
  videoElement.value?.addEventListener('play', () => {
    if (!started.value) startPlayback()
  })
})

onUnmounted(() => {
  // 清理 HLS 实例
  if (hls.value) {
    hls.value.destroy()
    hls.value = null
  }
})
</script>

<style scoped>
.aspect-video {
  aspect-ratio: 16 / 9;
}

@media (max-width: 640px) {
  .aspect-video {
    min-height: 200px;
  }
}
</style>
