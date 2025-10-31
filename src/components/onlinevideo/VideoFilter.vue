<template>
  <div class="bg-gray-900/60 backdrop-blur-sm border border-white/10 rounded-lg p-4 space-y-4">
    <!-- 分类筛选 -->
    <div>
      <h3 class="text-sm font-semibold text-white mb-3">分类</h3>
      <div class="flex flex-wrap gap-2">
        <button
          @click="$emit('update:type', null)"
          class="px-3 py-1.5 text-sm rounded-lg transition-all cursor-pointer"
          :class="!selectedType
            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
            : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'"
        >
          全部
        </button>
        <button
          v-for="(category, index) in displayedCategories"
          :key="category.value"
          @click="$emit('update:type', category.value)"
          class="px-3 py-1.5 text-sm rounded-lg transition-all flex items-center gap-1 cursor-pointer"
          :class="selectedType === category.value
            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
            : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'"
        >
          <span>{{ category.label }}</span>
          <span class="text-xs opacity-70">({{ category.count }})</span>
        </button>
        <!-- 更多/收起按钮 -->
        <button
          v-if="categories.length > 10"
          @click="showAllCategories = !showAllCategories"
          class="px-3 py-1.5 text-sm rounded-lg transition-all cursor-pointer bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30"
        >
          {{ showAllCategories ? '收起 ↑' : '更多 ↓' }}
        </button>
      </div>
    </div>

    <!-- 排序筛选 -->
    <div>
      <h3 class="text-sm font-semibold text-white mb-3">排序</h3>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="sort in sortFilters"
          :key="sort.value"
          @click="$emit('update:sortFilter', sort.value)"
          class="px-3 py-1.5 text-sm rounded-lg transition-all cursor-pointer"
          :class="selectedSortFilter === sort.value
            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
            : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'"
        >
          {{ sort.label }}
        </button>
      </div>
    </div>

    <!-- 来源筛选 -->
    <div>
      <h3 class="text-sm font-semibold text-white mb-3">来源</h3>
      <div class="flex flex-wrap gap-2">
        <button
          @click="$emit('update:source', null)"
          class="px-3 py-1.5 text-sm rounded-lg transition-all cursor-pointer"
          :class="!selectedSource
            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
            : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'"
        >
          全部
        </button>
        <button
          v-for="(source, index) in sources"
          :key="source.value"
          @click="$emit('update:source', source.value)"
          class="px-3 py-1.5 text-sm rounded-lg transition-all cursor-pointer"
          :class="selectedSource === source.value
            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
            : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'"
        >
          {{ index + 1 }}号资源
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  selectedType: {
    type: String,
    default: null
  },
  selectedSortFilter: {
    type: String,
    default: 'latest'
  },
  selectedSource: {
    type: String,
    default: null
  }
})

defineEmits(['update:type', 'update:sortFilter', 'update:source', 'reset'])

// 是否显示所有分类
const showAllCategories = ref(false)

// 显示的分类列表（默认显示10个）
const displayedCategories = computed(() => {
  if (showAllCategories.value || props.categories.length <= 10) {
    return props.categories
  }
  return props.categories.slice(0, 10)
})

// 排序选项
const sortFilters = [
  { value: 'latest', label: '最新' },
  { value: 'hot', label: '最热' },
  { value: 'favorites', label: '最多收藏' }
]

// 来源选项
const sources = [
  { value: 'lebo', label: '乐播' },
  { value: 'lajiao', label: '辣椒' },
  { value: 'senlin', label: '森林' }
]
</script>
