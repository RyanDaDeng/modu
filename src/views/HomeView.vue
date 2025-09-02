<template>
  <AppLayout
    :title="'JMComic'"
    :show-back="false"
    :show-bottom-nav="true"
    :no-header="true"
    :show-top-nav="true"
    :page-loading="pageLoading"
  >
    <!-- Sticky Mobile Search (appears when main search scrolls out of view) -->
    <StickyMobileSearch @search-click="handleSearchClick" />
    
    <!-- Gradient overlay from top of content fading down -->
    <div class="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-black/90 to-transparent pointer-events-none"></div>
    
    <!-- Content Layer -->
    <div class="relative">
      <!-- Welcome Dialog -->
      <WelcomeDialog @close="handleWelcomeClose" />

      <!-- Image Server Selection Modal -->
      <ImageServerModal v-model="showImageServerModal" />
      <!-- Mobile Search Bar -->
      <MobileSearchBar
        v-model="searchQuery"
        @click="handleSearchClick"
        class="mobile-search-bar"
      >
        <template #announcement>
          <!-- Mobile New User Guide Banner - Below Search -->
        <div v-show="!announcementHidden" class="sm:hidden mt-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg p-[1px]">
          <div class="bg-gray-900/90 backdrop-blur-sm rounded-lg p-3">
            <div class="flex items-start space-x-2">
              <!-- Content -->
              <div class="flex-1">
                <h2 class="text-sm font-bold text-white mb-1.5 flex items-center gap-1">
                  <span>💡 新手指引</span>
                  <span class="px-1.5 py-0.5 text-[10px] bg-blue-500/30 backdrop-blur-sm border border-blue-400/50 text-blue-300 rounded-full">小贴士</span>
                </h2>

                <div class="text-gray-300 text-xs space-y-1.5">
                  <p class="leading-relaxed">
                    图片加载慢？点击右上角 <span class="text-pink-400 font-semibold">闪电图标</span> 切换服务器！
                  </p>
                </div>
              </div>

              <!-- Close button -->
              <button
                  @click="hideAnnouncement"
                  class="flex-shrink-0 text-gray-300 hover:text-white text-sm font-medium transition-colors cursor-pointer px-2 py-1 hover:bg-white/10 rounded"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
        </template>
      </MobileSearchBar>
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
                  <span class="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs bg-blue-500/30 backdrop-blur-sm border border-blue-400/50 text-blue-300 rounded-full">小贴士</span>
                </h2>

                <div class="text-gray-300 text-xs sm:text-base space-y-2">
                  <p class="leading-relaxed text-xs sm:text-sm">
                    如果图片加载过慢，可以尝试更换图片服务器哦！
                  </p>

                  <div class="flex items-start sm:items-center gap-2 bg-gray-900/60 backdrop-blur-sm border border-white/10 rounded-lg p-2.5">
                    <svg class="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <div class="flex-1">
                      <p class="text-xs sm:text-sm text-gray-200">
                        点击右上角的 <span class="text-pink-400 font-semibold">闪电按钮</span>，可以选择最适合你的图片服务器
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
                  class="flex-shrink-0 text-gray-400 hover:text-white text-sm transition-colors cursor-pointer px-2 py-1 hover:bg-white/10 rounded"
              >
                关闭
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
        <!-- Mobile: Full width slider + Quick Access -->
        <div class="sm:hidden">
          <HeroSlider :items="heroComics" :auto-play="true" :interval="5000" />

          <!-- Quick Access & Tag Cloud Section for Mobile -->
          <div class="bg-gray-900/60 backdrop-blur-sm border border-white/10 rounded-xl p-2 mt-3">
            <!-- Quick Rankings -->
            <div class="grid grid-cols-4 gap-1.5 mb-2">
              <button
                v-for="ranking in quickRankings"
                :key="ranking.name"
                @click="$router.push(ranking.path)"
                class="group relative overflow-hidden rounded-lg bg-gray-800/50 backdrop-blur-sm border border-white/10 p-2 hover:bg-gray-700/50 hover:border-white/20 transition-all duration-200 cursor-pointer"
              >
                <div class="relative z-10 flex flex-col items-center">
                  <div class="text-lg mb-0.5">{{ ranking.icon }}</div>
                  <p class="text-white text-[10px] font-medium">{{ ranking.name }}</p>
                </div>
              </button>
            </div>

            <!-- Word Cloud -->
            <div class="border-t border-white/10 pt-2">
              <div class="word-cloud-container">
                <span
                  v-for="(tag, index) in tagCloudData"
                  :key="tag.text"
                  @click="$router.push(`/search?wd=${encodeURIComponent(tag.text)}`)"
                  class="word-cloud-tag text-[11px]"
                  :style="{
                    fontSize: (tag.size * 0.8) + 'px',
                    color: tag.color,
                    fontWeight: tag.weight
                  }"
                >
                  {{ tag.text }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tablet: Stack Layout for medium screens -->
        <div class="hidden sm:block lg:hidden">
          <div class="flex flex-col gap-3">
            <!-- Slider Full Width -->
            <HeroSlider :items="heroComics" :auto-play="true" :interval="5000" />

            <!-- Quick Access & Tag Cloud Section Below Slider -->
            <div class="bg-gray-900/60 backdrop-blur-sm border border-white/10 rounded-xl p-3">
              <!-- Quick Rankings -->
              <div class="grid grid-cols-4 gap-2 mb-3">
                <button
                  v-for="ranking in quickRankings"
                  :key="ranking.name"
                  @click="$router.push(ranking.path)"
                  class="group relative overflow-hidden rounded-lg bg-gray-800/50 backdrop-blur-sm border border-white/10 p-3 hover:bg-gray-700/50 hover:border-white/20 transition-all duration-200 cursor-pointer"
                >
                  <div class="relative z-10">
                    <div class="text-2xl mb-1">{{ ranking.icon }}</div>
                    <p class="text-white text-xs font-medium">{{ ranking.name }}</p>
                  </div>
                </button>
              </div>

              <!-- Word Cloud -->
              <div class="border-t border-white/10 pt-3">
                <div class="word-cloud-container">
                  <span
                    v-for="(tag, index) in tagCloudData"
                    :key="tag.text"
                    @click="$router.push(`/search?wd=${encodeURIComponent(tag.text)}`)"
                    class="word-cloud-tag"
                    :style="{
                      fontSize: tag.size + 'px',
                      color: tag.color,
                      fontWeight: tag.weight
                    }"
                  >
                    {{ tag.text }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Featured Comics Section Below for Tablet -->
            <div class="bg-gray-900/60 backdrop-blur-sm border border-white/10 rounded-xl p-3">
              <div class="grid grid-cols-4 gap-3">
                <!-- Main Featured Comic -->
                <router-link
                  v-if="heroComics[0]"
                  :to="`/chapter/${heroComics[0].id}`"
                  class="col-span-2 row-span-2 block relative rounded-lg overflow-hidden bg-gray-800/50 border border-white/10 group hover:border-pink-500/30 transition-all"
                >
                  <img
                    :src="heroComics[0].coverImage"
                    :alt="heroComics[0].name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    @error="handleImageError"
                  />

                  <!-- Badge -->
                  <div class="absolute top-2 left-2 z-10">
                    <span class="px-2 py-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg">
                      热门推荐
                    </span>
                  </div>

                  <!-- Overlay with info -->
                  <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <p class="text-white text-sm font-bold truncate mb-1">{{ heroComics[0]?.name }}</p>
                    <div class="text-xs text-gray-300">
                      <div class="mb-1">{{ heroComics[0]?.category }}</div>
                      <div class="flex items-center gap-3">
                        <span class="flex items-center gap-1">
                          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                          </svg>
                          {{ formatNumber(heroComics[0]?.views) }}
                        </span>
                        <span class="flex items-center gap-1">
                          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                          </svg>
                          {{ formatNumber(heroComics[0]?.likes) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </router-link>

                <!-- Other Featured Comics -->
                <router-link
                  v-for="(comic, idx) in heroComics.slice(1, 9)"
                  :key="`feat-${comic.id}-${idx}`"
                  :to="`/chapter/${comic.id}`"
                  class="group relative rounded overflow-hidden bg-gray-800/50 border border-white/10 hover:border-pink-500/30 transition-all"
                >
                  <img
                    :src="comic.coverImage"
                    :alt="comic.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    @error="handleImageError"
                  />

                  <!-- Mini badge -->
                  <div v-if="idx < 3" class="absolute top-1 right-1 z-10">
                    <span class="px-1.5 py-0.5 bg-red-600/70 backdrop-blur-sm border border-red-400/60 text-white text-[9px] font-bold rounded">
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
                        {{ formatNumber(comic.views) }}
                      </span>
                      <span class="flex items-center gap-0.5">
                        <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                        </svg>
                        {{ formatNumber(comic.likes) }}
                      </span>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop: Split Layout (large screens and above) -->
        <div class="hidden lg:flex gap-3 items-stretch">
          <!-- Left: Slider (2/5 width) -->
          <div class="w-2/5 flex flex-col gap-3">
            <!-- Main Slider -->
            <HeroSlider :items="heroComics" :auto-play="true" :interval="5000" />

            <!-- Quick Access & Tag Cloud Section Below Slider -->
            <div class="bg-gray-900/60 backdrop-blur-sm border border-white/10 rounded-xl p-3">
              <!-- Quick Rankings -->
              <div class="grid grid-cols-4 gap-2 mb-3">
                <button
                  v-for="ranking in quickRankings"
                  :key="ranking.name"
                  @click="$router.push(ranking.path)"
                  class="group relative overflow-hidden rounded-lg bg-gray-800/50 backdrop-blur-sm border border-white/10 p-3 hover:bg-gray-700/50 hover:border-white/20 transition-all duration-200 cursor-pointer"
                >
                  <div class="relative z-10">
                    <div class="text-2xl mb-1">{{ ranking.icon }}</div>
                    <p class="text-white text-xs font-medium">{{ ranking.name }}</p>
                  </div>
                </button>
              </div>

              <!-- Word Cloud -->
              <div class="border-t border-white/10 pt-3">
                <div class="word-cloud-container">
                  <span
                    v-for="(tag, index) in tagCloudData"
                    :key="tag.text"
                    @click="$router.push(`/search?wd=${encodeURIComponent(tag.text)}`)"
                    class="word-cloud-tag"
                    :style="{
                      fontSize: tag.size + 'px',
                      color: tag.color,
                      fontWeight: tag.weight
                    }"
                  >
                    {{ tag.text }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Featured Comics -->
          <div class="w-3/5">
            <div class="bg-gray-900/60 backdrop-blur-sm border border-white/10 rounded-xl h-full p-3 flex gap-3">
              <!-- Left: Main Featured Comic -->
              <div class="w-1/3">
                <router-link
                  v-if="heroComics[0]"
                  :to="`/chapter/${heroComics[0].id}`"
                  class="block relative h-full rounded-lg overflow-hidden bg-gray-800/50 border border-white/10 group hover:border-pink-500/30 transition-all"
                >
                  <img
                    :src="heroComics[0].coverImage"
                    :alt="heroComics[0].name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    @error="handleImageError"
                  />
                  <!-- Featured Badge -->
                  <div class="absolute top-2 left-2 z-10">
                    <span class="px-2 py-1 bg-pink-600/70 backdrop-blur-sm border border-pink-400/60 text-white text-xs font-bold rounded">
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
                          {{ formatNumber(heroComics[0]?.views) }}
                        </span>
                        <span class="flex items-center gap-1">
                          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                          </svg>
                          {{ formatNumber(heroComics[0]?.likes) }}
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
                  class="group relative rounded overflow-hidden bg-gray-800/50 border border-white/10 hover:border-pink-500/30 transition-all"
                >
                  <img
                    :src="comic.coverImage"
                    :alt="comic.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    @error="handleImageError"
                  />

                  <!-- Mini badge -->
                  <div v-if="idx < 3" class="absolute top-1 right-1 z-10">
                    <span class="px-1.5 py-0.5 bg-red-600/70 backdrop-blur-sm border border-red-400/60 text-white text-[9px] font-bold rounded">
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
                        {{ formatNumber(comic.views) }}
                      </span>
                      <span class="flex items-center gap-0.5">
                        <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                        </svg>
                        {{ formatNumber(comic.likes) }}
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

      <div class="container mx-auto px-4">
      <!-- Reading History Section -->
      <ReadingHistory />

      <!-- Divider before Latest Updates -->
      <div class="flex justify-center">
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
                'px-4 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer',
                selectedUpdateType === tab.value
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              ]"
              :disabled="loadingWeekly"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <div class="px-1">
          <!-- Mobile: Horizontal Slider -->
          <div class="md:hidden relative">
            <!-- Loading overlay for mobile -->
            <div v-if="loadingWeekly" class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center min-h-[200px]">
              <LoadingSpinner />
            </div>
            <HorizontalSlider ref="weeklySlider">
              <router-link
                v-for="comic in weeklyUpdates"
                :key="comic.id"
                :to="`/chapter/${comic.id}`"
                class="flex-shrink-0 w-32 sm:w-36 group block"
              >
                <div class="relative">
                  <!-- Gradient border effect on hover -->
                  <div class="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-lg opacity-0 group-hover:opacity-50 blur-sm transition-opacity"></div>
                  <div class="relative bg-gray-900/60 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden group-hover:border-pink-500/30 transition-all">
                    <div class="relative aspect-[3/4] bg-gray-800/50">
                    <img
                      :src="getAlbumCover(comic.id)"
                      :alt="comic.name"
                      class="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                      loading="lazy"
                      @error="handleImageError"
                    />
                    <!-- New Badge -->
                    <div class="absolute top-2 right-2">
                      <span class="px-2 py-1 text-xs bg-red-600/70 backdrop-blur-sm border border-red-400/60 text-white font-medium rounded-full">
                        新
                      </span>
                    </div>
                    <!-- Category Label -->
                    <div v-if="comic.category" class="absolute top-2 left-2">
                      <span class="px-2 py-1 text-xs bg-pink-600/70 backdrop-blur-sm border border-pink-400/60 text-white font-medium rounded-full">
                        {{ comic.category?.title || comic.category }}
                      </span>
                    </div>
                    </div>
                    <div class="p-2">
                      <h3 class="text-xs sm:text-sm font-semibold text-white truncate">
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
                </div>
              </router-link>
            </HorizontalSlider>
          </div>

          <!-- Desktop: Grid with Load More -->
          <div class="hidden md:block">
            <GridWithLoadMore
              :items="weeklyUpdates"
              :initial-count="6"
              :increment-count="6"
              :show-new-badge="true"
            >
              <template #loading-overlay>
                <div v-if="loadingWeekly" class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center min-h-[200px]">
                  <LoadingSpinner />
                </div>
              </template>
            </GridWithLoadMore>
          </div>
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

          <!-- Mobile: Horizontal Slider Component -->
          <div class="px-1 md:hidden">
            <HorizontalSlider>
              <router-link
                v-for="comic in promotion.content"
                :key="comic.id"
                :to="`/chapter/${comic.id}`"
                class="flex-shrink-0 w-32 sm:w-36 group block relative"
              >
                <!-- Gradient border effect on hover -->
                <div class="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-lg opacity-0 group-hover:opacity-50 blur-sm transition-opacity"></div>

                <!-- Main card with glassmorphism -->
                <div class="relative bg-gray-900/60 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden group-hover:border-pink-500/30 transition-all">
                <div class="relative aspect-[3/4] bg-gray-800/50">
                  <img
                    :src="getAlbumCover(comic.id)"
                    :alt="comic.name"
                    class="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    loading="lazy"
                    @error="handleImageError"
                  />
                  <!-- Category Label -->
                  <div v-if="comic.category" class="absolute top-2 left-2">
                    <span class="px-2 py-1 text-xs bg-pink-600/70 backdrop-blur-sm border border-pink-400/60 text-white font-medium rounded-full">
                      {{ typeof comic.category === 'object' ? (comic.category.title || comic.category.name) : comic.category }}
                    </span>
                  </div>
                </div>
                <div class="p-2">
                  <h3 class="text-xs sm:text-sm font-semibold text-white truncate">
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

          <!-- Desktop: Grid with Load More -->
          <div class="px-1 hidden md:block">
            <GridWithLoadMore
              :items="promotion.content"
              :initial-count="6"
              :increment-count="6"
            />
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
          class="mt-4 px-4 py-2 bg-red-600/20 backdrop-blur-sm border border-red-500/50 text-red-400 rounded-lg hover:bg-red-600/30 hover:border-red-400 transition-all cursor-pointer"
        >
          重试
        </button>
      </div>
      </div>
    </div>

    <!-- Fullscreen Search Modal -->
    <FullscreenSearch v-model="showFullscreenSearch" />

    <!-- Login Prompt Modal -->
    <ModalDialog
      v-model="showLoginPrompt"
      icon="lock"
      title="需要登录"
      message="登录后即可使用搜索功能"
      confirm-text="立即登录"
      cancel-text="注册账号"
      @confirm="handleLoginConfirm"
      @cancel="handleRegister"
    />
  </AppLayout>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { getPromotionContent, getWeeklyUpdates, getHotTags, getCategories } from '@/api/request'
import { addToCollection } from '@/api/collection'
import AppLayout from '@/components/AppLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import HorizontalSlider from '@/components/HorizontalSlider.vue'
import GridWithLoadMore from '@/components/GridWithLoadMore.vue'
import WelcomeDialog from '@/components/WelcomeDialog.vue'
import ImageServerModal from '@/components/ImageServerModal.vue'
import ReadingHistory from '@/components/ReadingHistory.vue'
import HeroSlider from '@/components/HeroSlider.vue'
import FullscreenSearch from '@/components/FullscreenSearch.vue'
import ModalDialog from '@/components/ModalDialog.vue'
import MobileSearchBar from '@/components/MobileSearchBar.vue'
import StickyMobileSearch from '@/components/StickyMobileSearch.vue'
import { formatNumber } from '@/utils/format'
import { getImageServer } from '@/utils/imageServer'
import { handleImageError } from '@/utils/handleImageError'
import { request } from '@/api/request'

const router = useRouter()
const appStore = useAppStore()
const authStore = useAuthStore()

const promotions = ref([])
const weeklyUpdates = ref([])
const loading = ref(false)
const loadingWeekly = ref(false) // Loading state for weekly updates tab switching
const pageLoading = ref(true) // Page loading state for AppLayout
const error = ref('')
const dataLoaded = ref(false) // Flag to prevent duplicate loading
const announcementHidden = ref(false) // Track if announcement is hidden

// Load more state for desktop grid layout
const weeklyUpdatesVisible = ref(12) // Show 12 items initially
const promotionVisibleItems = ref({}) // Track visible items for each promotion section

// Hero slider data
const heroComics = ref([])
const loadingHero = ref(true)
const navCategories = ref([]) // Categories for navigation

// Search
const searchQuery = ref('')
const showFullscreenSearch = ref(false)
const showLoginPrompt = ref(false)

// Image Server Modal
const showImageServerModal = ref(false)

// Quick rankings data
const quickRankings = [
  { name: '最多收藏', icon: '⭐', path: '/catalog?o=tf' },
  { name: '总排名', icon: '🏆', path: '/catalog' },
  { name: '月排名', icon: '📅', path: '/catalog?o=mv_m' },
  { name: '周排名', icon: '📊', path: '/catalog?o=mp_w' }
]

// Trending tags from API
const trendingTags = ref([])
const tagCloudData = ref([])

// Update tabs
const updateTabs = [
  { label: '全部', value: 'all' },
  { label: '韩漫', value: 'hanman' },
  { label: '日漫', value: 'manga' }
]
const selectedUpdateType = ref('all')
const weeklySlider = ref(null)



// Generate word cloud data with different sizes and colors
const generateWordCloud = (tags) => {
  const colors = [
    '#ec4899', // pink-500
    '#a855f7', // purple-500
    '#3b82f6', // blue-500
    '#f59e0b', // amber-500
    '#10b981', // emerald-500
    '#ef4444', // red-500
    '#8b5cf6', // violet-500
    '#06b6d4', // cyan-500
  ]
  
  // Smaller size ranges for more compact design
  const sizes = [20, 18, 17, 16, 15, 14, 13, 12, 11, 10]
  const weights = [600, 600, 500, 500, 500, 400, 400, 400, 300, 300]
  
  return tags.slice(0, 25).map((tag, index) => {
    // Randomly assign size (but keep first 3 tags larger for emphasis)
    let sizeIndex
    if (index < 3) {
      // First 3 tags should be larger (randomly from first 3 sizes)
      sizeIndex = Math.floor(Math.random() * 3)
    } else {
      // Other tags can be any size
      sizeIndex = Math.floor(Math.random() * sizes.length)
    }
    
    const colorIndex = Math.floor(Math.random() * colors.length)
    
    return {
      text: tag,
      size: sizes[sizeIndex],
      color: colors[colorIndex],
      weight: weights[sizeIndex]
    }
  })
}

const loadHotTags = async () => {
  try {
    // Check cache first (1 day cache)
    const cached = localStorage.getItem('hotTagsCache')
    if (cached) {
      const { tags, timestamp } = JSON.parse(cached)
      // Check if cache is less than 1 day old
      if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
        trendingTags.value = tags.slice(0, 20)
        tagCloudData.value = generateWordCloud(trendingTags.value)
        return
      }
    }
    
    // If no cache or cache expired, try API
    const tags = await getHotTags()
    if (tags && Array.isArray(tags)) {
      // Cache for 1 day
      const hotTagsCache = {
        tags: tags,
        timestamp: Date.now()
      }
      localStorage.setItem('hotTagsCache', JSON.stringify(hotTagsCache))
      
      trendingTags.value = tags.slice(0, 20)
      tagCloudData.value = generateWordCloud(trendingTags.value)
    }
  } catch (error) {
    console.error('Failed to load hot tags:', error)
    // Use fallback tags if API fails
    trendingTags.value = ['异世界', '重生', '系统', '穿越', '霸总', '甜宠', '末世', '修仙', '都市', '玄幻', '热血', '恋爱', '校园', '悬疑', '冒险']
    tagCloudData.value = generateWordCloud(trendingTags.value)
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
      
      // Extract hot_tags from response and update tag cloud
      if (response.data.hot_tags && Array.isArray(response.data.hot_tags)) {
        // Cache hot tags for 1 day
        const hotTagsCache = {
          tags: response.data.hot_tags,
          timestamp: Date.now()
        }
        localStorage.setItem('hotTagsCache', JSON.stringify(hotTagsCache))
        
        trendingTags.value = response.data.hot_tags.slice(0, 20)
        tagCloudData.value = generateWordCloud(trendingTags.value)
      }
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
    query: { wd: tag }
  })
}

const selectUpdateType = async (type) => {
  if (loadingWeekly.value) return // Prevent multiple simultaneous requests
  
  selectedUpdateType.value = type
  loadingWeekly.value = true
  
  try {
    const data = await getWeeklyUpdates(type)
    if (data?.list) {
      weeklyUpdates.value = data.list.slice(0, 20)
      // Reset slider to the beginning on mobile after data loads
      if (weeklySlider.value && window.innerWidth < 768) {
        // Use nextTick to ensure DOM has updated with new content
        await nextTick()
        weeklySlider.value.resetScroll()
      }
    }
  } catch (err) {
    console.error('Failed to load weekly updates:', err)
  } finally {
    loadingWeekly.value = false
  }
}

// Handle welcome dialog close - show image server modal for first-time users
const handleWelcomeClose = () => {
  // Check if this is the first time user (no image server selected)
  const hasSelectedServer = localStorage.getItem('imageServerSelected')
  if (!hasSelectedServer) {
    // Show image server modal after a short delay
    setTimeout(() => {
      showImageServerModal.value = true
      // Mark that we've shown the image server modal
      localStorage.setItem('imageServerSelected', 'pending')
    }, 500)
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

// Functions
const handleSearchClick = () => {
  if (!authStore.isLoggedIn) {
    showLoginPrompt.value = true
  } else {
    showFullscreenSearch.value = true
  }
}

const handleLoginConfirm = () => {
  showLoginPrompt.value = false
  router.push({
    path: '/login',
    query: { redirect: router.currentRoute.value.fullPath }
  })
}

const handleRegister = () => {
  showLoginPrompt.value = false
  router.push('/register')
}

onMounted(async () => {
  // Check if announcement was previously hidden
  const hidden = localStorage.getItem('announcementHidden')
  if (hidden === 'true') {
    announcementHidden.value = true
  }
  
  // Load all data in parallel
  try {
    await Promise.all([
      fetchRandomComics(), // Load random comics for hero section
      loadPromotions(),
      loadHotTags(), // Load hot tags from API
      loadNavCategories() // Load categories for navigation
    ])
  } catch (error) {
    console.error('Error loading initial data:', error)
  } finally {
    pageLoading.value = false // Hide page loading after initial load
  }
})

onUnmounted(() => {
  // Cleanup if needed
})
</script>

<style scoped>
/* Word Cloud Styles */
.word-cloud-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem 0.5rem;
  align-items: baseline;
  justify-content: center;
  padding: 0.25rem;
  min-height: 60px;
  line-height: 1;
}

.word-cloud-tag {
  display: inline-block;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.85;
  white-space: nowrap;
  padding: 0 0.2rem;
}

.word-cloud-tag:hover {
  opacity: 1;
  transform: scale(1.05);
  filter: brightness(1.2);
  text-shadow: 0 0 8px currentColor;
}

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
