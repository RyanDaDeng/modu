<template>
  <div class="flex items-center space-x-2">
    <div class="logo-container">
      <img 
        src="/logo.png" 
        alt="魔都"
        :class="[
          'object-contain logo-enhanced',
          size === 'small' ? 'w-10 h-10' : 'w-12 h-12 sm:w-14 sm:h-14'
        ]"
      />
    </div>
    <div class="flex items-baseline">
      <span 
        :class="[
          'text-pink-500 font-extrabold tracking-wider',
          size === 'small' ? 'text-lg' : 'text-xl sm:text-2xl'
        ]"
        style="font-family: 'Pacifico', 'Dancing Script', 'Satisfy', 'Kaushan Script', 'Permanent Marker', fantasy; text-shadow: 2px 2px 0 rgba(31, 41, 55, 0.8), 3px 3px 0 rgba(219, 39, 119, 0.5); letter-spacing: 0.05em;"
      >
        魔都
      </span>
      <span 
        :class="[
          'text-pink-400 ml-1',
          size === 'small' ? 'text-xs' : 'text-sm'
        ]"
      >♥</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'normal',
    validator: (value) => ['small', 'normal'].includes(value)
  }
})
</script>

<style scoped>
/* 方案 1: 白色光晕效果 - 让黑色部分更明显 */
.logo-enhanced {
  /* 添加白色光晕，让黑色尾巴更突出 */
  filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.3)) 
          drop-shadow(0 0 4px rgba(255, 255, 255, 0.2));
}

/* 方案 2: 白色背景衬托（可选） */
.logo-container {
  position: relative;
}

/* 如果你想要一个微妙的白色背景 */
.logo-container::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  z-index: -1;
}

/* 悬停时增强效果 */
.logo-container:hover .logo-enhanced {
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.4)) 
          drop-shadow(0 0 6px rgba(255, 255, 255, 0.3))
          brightness(1.1);
  transition: filter 0.3s ease;
}

/* 方案 3: 亮度和对比度调整 */
/* .logo-enhanced {
  filter: brightness(1.2) contrast(1.1) 
          drop-shadow(0 0 2px rgba(255, 255, 255, 0.3));
} */

/* 方案 4: 粉色光晕匹配主题 */
/* .logo-enhanced {
  filter: drop-shadow(0 0 3px rgba(236, 72, 153, 0.4)) 
          drop-shadow(0 0 6px rgba(236, 72, 153, 0.2));
} */
</style>
