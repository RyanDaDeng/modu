<template>
  <AppLayout
    :title="'JMComic'"
    :show-back="false"
    :show-bottom-nav="true"
    :no-header="true"
    :show-top-nav="true"
  >
    <!-- Gradient overlay from top of content fading down -->
    <div class="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-black/90 to-transparent pointer-events-none"></div>
    
    <!-- Content Layer -->
    <div class="relative">
      <!-- Welcome Dialog -->
      <WelcomeDialog />
      <div class="container mx-auto px-4 -mb-12 py-6">
        <!-- New User Guide Banner - Desktop Only -->
        <div v-show="!announcementHidden" class="hidden sm:block mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg sm:rounded-xl p-[2px]">
          <div class="bg-gray-900/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-6">
            <div class="flex items-start space-x-3 sm:space-x-4">
              <!-- Icon (hidden on mobile) -->
              <div class="hidden sm:flex flex-shrink-0">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1">
                <h2 class="text-base sm:text-xl font-bold text-white mb-2 flex flex-wrap items-center gap-1 sm:gap-2">
                  <span>💡 新手指引</span>
                  <span class="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs bg-blue-500 text-white rounded-full">小贴士</span>
                </h2>

                <div class="text-gray-300 text-xs sm:text-base space-y-2">
                  <p class="leading-relaxed text-xs sm:text-sm">
                    如果图片加载过慢，可以尝试更换图片服务器哦！
                  </p>

                  <div class="flex items-start sm:items-center gap-2 bg-gray-800 rounded-lg p-2.5">
                    <svg class="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div class="flex-1">
                      <p class="text-xs sm:text-sm text-gray-200">
                        点击右上角的 <span class="text-pink-400 font-semibold">设置按钮</span>（齿轮图标），可以选择最适合你的图片服务器
                      </p>
                      <p class="text-[10px] sm:text-xs text-gray-400 mt-1">
                        系统会自动测试各服务器速度，选择加载最快的那个～
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Close button -->
              <button
                  @click="hideAnnouncement"
                  class="flex-shrink-0 text-gray-400 hover:text-gray-200 text-sm transition-colors cursor-pointer px-2 py-1 hover:bg-gray-800 rounded"
              >
                关闭
              </button>
            </div>
          </div>
        </div>

      </div>
      <!-- Mobile Search Bar -->
      <div class="sm:hidden sticky top-0 z-40 bg-gradient-to-b from-gray-900/95 to-gray-900/80 backdrop-blur-sm px-4 py-3">
        <div class="relative">
          <input
            v-model="searchQuery"
            @click="showFullscreenSearch = true"
            @focus="showFullscreenSearch = true"
            type="text"
            placeholder="搜索漫画、作者..."
            class="w-full px-4 py-2.5 pl-10 bg-white/90 backdrop-blur-sm rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-pink-400 transition-all cursor-pointer text-sm"
            readonly
          />
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <button
            @click="showFullscreenSearch = true"
            class="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-medium rounded-full transition-colors cursor-pointer"
          >
            搜索
          </button>
        </div>
        
        <!-- Mobile New User Guide Banner - Below Search -->
        <div v-show="!announcementHidden" class="sm:hidden mt-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg p-[1px]">
          <div class="bg-gray-900/90 backdrop-blur-sm rounded-lg p-3">
            <div class="flex items-start space-x-2">
              <!-- Content -->
              <div class="flex-1">
                <h2 class="text-sm font-bold text-white mb-1.5 flex items-center gap-1">
                  <span>💡 新手指引</span>
                  <span class="px-1.5 py-0.5 text-[10px] bg-blue-500 text-white rounded-full">小贴士</span>
                </h2>

                <div class="text-gray-300 text-xs space-y-1.5">
                  <p class="leading-relaxed">
                    图片加载慢？点击右上角齿轮图标切换服务器！
                  </p>
                </div>
              </div>

              <!-- Close button -->
              <button
                  @click="hideAnnouncement"
                  class="flex-shrink-0 text-gray-400 hover:text-gray-200 text-xs transition-colors cursor-pointer p-1"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Hero Slider Section - Featured Comics -->
      <div class="relative">
      <!-- Mobile Section Title -->
      <div class="sm:hidden container mx-auto px-4 pt-2 pb-2">
        <h2 class="text-lg font-bold text-white flex items-center">
          <svg class="w-5 h-5 mr-2 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          精选推荐
        </h2>
      </div>
      
      <!-- Hero Section with Split Layout -->
      <div class="container mx-auto px-4 py-4 sm:py-6">
        <!-- Mobile: Full width slider -->
        <div class="sm:hidden">
          <HeroSlider :items="heroComics" />
        </div>
        
        <!-- Desktop: Split Layout -->
        <div class="hidden sm:flex gap-3 items-stretch">
          <!-- Left: Slider (2/5 width) -->
          <div class="w-2/5 flex flex-col gap-3">
            <!-- Main Slider -->
            <HeroSlider :items="heroComics" />
            
            <!-- Quick Access Section Below Slider -->
            <div class="bg-gradient-to-br from-gray-800/50 to-gray-900/60 backdrop-blur-sm rounded-xl p-3">
              <!-- Quick Rankings -->
              <div class="grid grid-cols-4 gap-2 mb-3">
                <button 
                  v-for="ranking in quickRankings" 
                  :key="ranking.name"
                  @click="$router.push(ranking.path)"
                  class="group relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 p-3 hover:from-gray-600 hover:to-gray-700 transition-all duration-200 cursor-pointer"
                >
                  <div class="relative z-10">
                    <div class="text-2xl mb-1">{{ ranking.icon }}</div>
                    <p class="text-white text-xs font-medium">{{ ranking.name }}</p>
                  </div>
                </button>
              </div>
              
              <!-- Trending Tags -->
              <div class="border-t border-gray-700 pt-2">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs text-gray-400">热门标签</span>
                  <svg class="w-3 h-3 text-pink-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <div class="flex flex-wrap gap-1.5">
                  <span 
                    v-for="tag in trendingTags" 
                    :key="tag"
                    @click="$router.push(`/search?q=${encodeURIComponent(tag)}`)"
                    class="px-2.5 py-1 bg-gray-700/50 hover:bg-pink-500/30 text-gray-300 hover:text-pink-400 text-xs rounded-full cursor-pointer transition-all"
                  >
                    #{{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Right: Featured Comics -->
          <div class="w-3/5">
            <div class="bg-gradient-to-br from-gray-800/60 to-gray-900/70 backdrop-blur-sm rounded-xl h-full p-3 flex gap-3">
              <!-- Left: Main Featured Comic -->
              <div class="w-1/3">
                <router-link
                  v-if="heroComics[0]"
                  :to="`/chapter/${heroComics[0].id}`"
                  class="block relative h-full rounded-lg overflow-hidden bg-gray-900 group"
                >
                  <img
                    :src="heroComics[0].coverImage"
                    :alt="heroComics[0].name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    @error="handleImageError"
                  />
                  <!-- Featured Badge -->
                  <div class="absolute top-2 left-2 z-10">
                    <span class="px-2 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded">
                      主推
                    </span>
                  </div>
                  <!-- Bottom overlay -->
                  <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/90 to-transparent">
                    <p class="text-white text-sm font-bold truncate mb-1">{{ heroComics[0]?.name }}</p>
                    <div class="text-xs text-gray-300">
                      <div class="mb-1">{{ heroComics[0]?.category }}</div>
                      <div class="flex items-center gap-3">
                        <span class="flex items-center gap-1">
                          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                          </svg>
                          {{ formatNumber(heroComics[0]?.views) }}万
                        </span>
                        <span class="flex items-center gap-1">
                          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                          </svg>
                          {{ formatNumber(heroComics[0]?.likes) }}万
                        </span>
                      </div>
                    </div>
                  </div>
                </router-link>
              </div>
              
              <!-- Right: Grid of 6 smaller comics -->
              <div class="flex-1 grid grid-cols-3 grid-rows-2 gap-2">
                <!-- Featured Comic Cards -->
                <router-link
                  v-for="(comic, idx) in heroComics.slice(1, 7)"
                  :key="`feat-${comic.id}-${idx}`"
                  :to="`/chapter/${comic.id}`"
                  class="group relative rounded overflow-hidden bg-gray-900"
                >
                  <img
                    :src="comic.coverImage"
                    :alt="comic.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    @error="handleImageError"
                  />
                  
                  <!-- Mini badge -->
                  <div v-if="idx < 3" class="absolute top-1 right-1 z-10">
                    <span class="px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded">
                      {{ idx + 1 }}
                    </span>
                  </div>
                  
                  <!-- Overlay with stats -->
                  <div class="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <p class="text-white text-[10px] font-medium truncate mb-1">{{ comic.name }}</p>
                    <div class="flex items-center gap-2 text-[9px] text-gray-300">
                      <span class="flex items-center gap-0.5">
                        <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                          <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                        </svg>
                        {{ formatNumber(comic.views) }}万
                      </span>
                      <span class="flex items-center gap-0.5">
                        <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                        </svg>
                        {{ formatNumber(comic.likes) }}万
                      </span>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      
      <div class="container mx-auto px-4 py-6">
      <!-- Reading History Section -->
      <ReadingHistory />

      <!-- Divider before Latest Updates -->
      <div class="flex justify-center my-4">
        <img 
          src="/divider_1.png" 
          alt="" 
          class="h-6 w-auto opacity-30" 
          style="filter: drop-shadow(0 0 1px rgba(236, 72, 153, 0.3)) sepia(1) saturate(2) hue-rotate(280deg) brightness(0.8);"
        />
      </div>

      <!-- Latest Updates -->
      <div v-if="weeklyUpdates.length" class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-white flex items-center">
            <svg class="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            最新更新
          </h2>
          <div class="flex gap-2">
            <button
              v-for="tab in updateTabs"
              :key="tab.value"
              @click="selectUpdateType(tab.value)"
              :class="[
                'px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer',
                selectedUpdateType === tab.value
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
        
        <div class="px-1">
          <HorizontalSlider>
            <router-link
              v-for="comic in weeklyUpdates"
              :key="comic.id"
              :to="`/chapter/${comic.id}`"
              class="flex-shrink-0 w-32 sm:w-36 md:w-40 group block"
            >
              <div class="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-pink-500 transition-all">
                <div class="relative aspect-[3/4] bg-gray-700">
                  <img
                    :src="getAlbumCover(comic.id)"
                    :alt="comic.name"
                    class="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    loading="lazy"
                    @error="handleImageError"
                  />
                  <!-- New Badge -->
                  <div class="absolute top-2 right-2">
                    <span class="px-2 py-1 text-xs text-white bg-red-500 rounded-full">
                      新
                    </span>
                  </div>
                  <!-- Category Label -->
                  <div v-if="comic.category" class="absolute top-2 left-2">
                    <span class="px-2 py-1 text-xs text-white bg-pink-500/80 backdrop-blur rounded-full">
                      {{ comic.category?.title || comic.category }}
                    </span>
                  </div>
                </div>
                <div class="p-2">
                  <h3 class="text-xs font-semibold text-white truncate">
                    {{ comic.name }}
                  </h3>
                  <p class="text-xs text-gray-400 mt-0.5 truncate">
                    {{ comic.author || '未知作者' }}
                  </p>
                  <div class="text-xs text-gray-500 mt-1">
                    {{ formatUpdateTime(comic.update_at) }}
                  </div>
                </div>
              </div>
            </router-link>
          </HorizontalSlider>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner />
      </div>

      <!-- Promotions Sections -->
      <div v-else-if="promotions.length">
        <div v-for="(promotion, index) in promotions" :key="promotion.title" class="mb-8">
          <!-- Divider before each section -->
          <div v-if="index === 0 || promotion.title" class="flex justify-center my-4">
            <img 
              src="/divider_1.png" 
              alt="" 
              class="h-6 w-auto opacity-30" 
              style="filter: drop-shadow(0 0 1px rgba(236, 72, 153, 0.3)) sepia(1) saturate(2) hue-rotate(280deg) brightness(0.8);"
            />
          </div>
          <div class="flex items-center justify-between mb-4 px-1">
            <h2 class="text-xl font-bold text-white">{{ promotion.title }}</h2>
            <span class="text-sm text-gray-400 md:hidden">滑动查看更多 →</span>
          </div>
          
          <!-- Horizontal Slider Component -->
          <div class="px-1">
            <HorizontalSlider>
              <router-link
                v-for="comic in promotion.content"
                :key="comic.id"
                :to="`/chapter/${comic.id}`"
                class="flex-shrink-0 w-32 sm:w-36 md:w-40 group block"
              >
                <div class="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-pink-500 transition-all">
                <div class="relative aspect-[3/4] bg-gray-700">
                  <img
                    :src="getAlbumCover(comic.id)"
                    :alt="comic.name"
                    class="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    loading="lazy"
                    @error="handleImageError"
                  />
                  <!-- Category Label -->
                  <div v-if="comic.category" class="absolute top-2 left-2">
                    <span class="px-2 py-1 text-xs text-white bg-pink-500/80 backdrop-blur rounded-full">
                      {{ typeof comic.category === 'object' ? (comic.category.title || comic.category.name) : comic.category }}
                    </span>
                  </div>
                </div>
                <div class="p-2">
                  <h3 class="text-xs font-semibold text-white truncate">
                    {{ comic.name }}
                  </h3>
                  <p class="text-xs text-gray-400 mt-0.5 truncate">
                    {{ comic.author || '未知作者' }}
                  </p>
                </div>
                </div>
              </router-link>
            </HorizontalSlider>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading" class="text-center py-12">
        <p class="text-gray-400">暂无推荐内容</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center">
        <svg class="w-12 h-12 text-red-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <p class="text-red-400">{{ error }}</p>
        <button
          @click="() => { dataLoaded = false; loadPromotions() }"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          重试
        </button>
      </div>
      </div>
    </div>
    
    <!-- Fullscreen Search Modal -->
    <FullscreenSearch v-model="showFullscreenSearch" />
  </AppLayout>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { getPromotionContent, getWeeklyUpdates, getHotTags, getCategories } from '@/api/request'
import { addToCollection } from '@/api/collection'
import AppLayout from '@/components/AppLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import HorizontalSlider from '@/components/HorizontalSlider.vue'
import WelcomeDialog from '@/components/WelcomeDialog.vue'
import ReadingHistory from '@/components/ReadingHistory.vue'
import HeroSlider from '@/components/HeroSlider.vue'
import FullscreenSearch from '@/components/FullscreenSearch.vue'
import { formatNumber } from '@/utils/format'
import { getImageServer } from '@/utils/imageServer'
import { request } from '@/api/request'

const router = useRouter()
const appStore = useAppStore()

const promotions = ref([])
const weeklyUpdates = ref([])
const loading = ref(false)
const error = ref('')
const dataLoaded = ref(false) // Flag to prevent duplicate loading
const announcementHidden = ref(false) // Track if announcement is hidden

// Hero slider data
const heroComics = ref([])
const loadingHero = ref(true)
const navCategories = ref([]) // Categories for navigation

// Search
const searchQuery = ref('')
const showFullscreenSearch = ref(false)

// Quick rankings data
const quickRankings = [
  { name: '最多收藏', icon: '⭐', path: '/catalog?o=tf' },
  { name: '总排名', icon: '🏆', path: '/catalog' },
  { name: '月排名', icon: '📅', path: '/catalog?o=mv_m' },
  { name: '周排名', icon: '📊', path: '/catalog?o=mp_w' }
]

// Trending tags from API
const trendingTags = ref([])

// Update tabs
const updateTabs = [
  { label: '全部', value: 'all' },
  { label: '韩漫', value: 'hanman' },
  { label: '日漫', value: 'manga' }
]
const selectedUpdateType = ref('all')


const loadHotTags = async () => {
  try {
    const tags = await getHotTags()
    if (tags && Array.isArray(tags)) {
      trendingTags.value = tags.slice(0, 12) // Get first 12 tags
    }
  } catch (error) {
    console.error('Failed to load hot tags:', error)
    // Use fallback tags if API fails
    trendingTags.value = ['异世界', '重生', '系统', '穿越', '霸总', '甜宠', '末世', '修仙']
  }
}

// Load categories for navigation
const loadNavCategories = async () => {
  try {
    const data = await getCategories()
    if (data && data.categories) {
      navCategories.value = data.categories
      // Pass categories to app store for global access
      appStore.setNavCategories(data.categories)
    }
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

const loadPromotions = async () => {
  // Prevent duplicate loading
  if (dataLoaded.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    // Load promotions and weekly updates in parallel
    const [promotionData, updatesData] = await Promise.all([
      getPromotionContent(),
      getWeeklyUpdates('all').catch(err => {
        console.error('Failed to load weekly updates:', err)
        return null
      })
    ])
    
    console.log('Promotion data:', promotionData)
    console.log('Weekly updates data:', updatesData)
    
    promotions.value = promotionData || []
    
    // Handle weekly updates
    if (updatesData?.list) {
      weeklyUpdates.value = updatesData.list.slice(0, 20) // Show first 20 updates
    }
    
    dataLoaded.value = true // Mark as loaded
  } catch (err) {
    console.error('Failed to load promotions:', err)
    error.value = '加载推荐内容失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const getAlbumCover = (comicId) => {
  const server = getImageServer()
  return `${server}/media/albums/${comicId}_3x4.jpg`
}

const handleImageError = (e) => {
  e.target.src = '/default.jpeg'
}

// Fetch random comics for hero section
const fetchRandomComics = async () => {
  try {
    loadingHero.value = true
    const response = await request.get('/api/random-comics')
    
    if (response.data.success && response.data.comics) {
      heroComics.value = response.data.comics.map(item => {
        const comic = item.detail || item.basic_info || {}
        return {
          id: item.id,
          name: comic.name || comic.title || '未知',
          author: Array.isArray(comic.author) ? comic.author.join(', ') : (comic.author || '未知作者'),
          category: comic.category?.title || comic.category || '其他',
          type: comic.total_views > 0 ? '热门' : '推荐',
          coverImage: getAlbumCover(item.id),
          description: comic.description || '精彩内容等你发现...',
          rating: 9.0 + Math.random() * 0.8, // Random rating 9.0-9.8
          views: comic.total_views || comic.views || Math.floor(Math.random() * 1000000) + 100000,
          likes: comic.likes || Math.floor(Math.random() * 100000) + 10000,
          comment_total: comic.comment_total || Math.floor(Math.random() * 10000) + 1000,
          updateTime: comic.datetime_updated ? formatUpdateTime(comic.datetime_updated) : '最近更新',
          tags: comic.tags || []
        }
      })
    }
  } catch (error) {
    console.error('Failed to fetch random comics:', error)
  } finally {
    loadingHero.value = false
  }
}

const hideAnnouncement = () => {
  announcementHidden.value = true
  localStorage.setItem('announcementHidden', 'true')
}

const searchTag = (tag) => {
  router.push({
    path: '/search',
    query: { q: tag }
  })
}

const selectUpdateType = async (type) => {
  selectedUpdateType.value = type
  try {
    const data = await getWeeklyUpdates(type)
    if (data?.list) {
      weeklyUpdates.value = data.list.slice(0, 20)
    }
  } catch (err) {
    console.error('Failed to load weekly updates:', err)
  }
}

const formatUpdateTime = (timestamp) => {
  if (!timestamp) return ''
  
  // Convert to milliseconds if needed
  const ts = timestamp.toString().length === 10 ? timestamp * 1000 : timestamp
  const date = new Date(ts)
  const now = new Date()
  const diff = now - date
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (hours < 1) {
    return '刚刚更新'
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日`
  }
}

// Add to collection handler
const addToCollectionHandler = async (comicId) => {
  if (!appStore.isLoggedIn) {
    router.push({
      path: '/login',
      query: { redirect: router.currentRoute.value.fullPath }
    })
    return
  }
  
  try {
    await addToCollection(comicId)
    alert('收藏成功！')
  } catch (error) {
    console.error('Failed to add to collection:', error)
    alert('收藏失败，请稍后重试')
  }
}

onMounted(() => {
  // Check if announcement was previously hidden
  const hidden = localStorage.getItem('announcementHidden')
  if (hidden === 'true') {
    announcementHidden.value = true
  }
  
  // Load all data
  fetchRandomComics() // Load random comics for hero section
  loadPromotions()
  loadHotTags() // Load hot tags from API
  loadNavCategories() // Load categories for navigation
})

onUnmounted(() => {
  // Cleanup if needed
})
</script>

<style scoped>
@keyframes ping {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animation-delay-200 {
  animation-delay: 200ms;
}

.animation-delay-400 {
  animation-delay: 400ms;
}
</style>
