<template>
  <header class="relative">
    <!-- Banner Background -->
    <div class="relative h-40 sm:h-48 lg:h-56">
      <!-- Banner Image -->
      <div 
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: 'url(/img_1.png)' }"
      >
        <!-- Multi-layer gradient for smooth transition - brightened -->
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40"></div>
        <!-- Very subtle top gradient for nav text -->
        <div class="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/5 to-transparent"></div>
      </div>
      
      <!-- Top Navigation Bar -->
      <nav class="relative z-40 pt-safe">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-between h-16 sm:h-20">
            <!-- Left Section: Logo and Main Nav -->
            <div class="flex items-center gap-6">
              <!-- Logo -->
              <router-link to="/" class="flex items-center">
                <SiteLogo :size="'small'" />
              </router-link>
              
              <!-- Main Navigation Links - Desktop -->
              <div class="hidden lg:flex items-center gap-1">
                <router-link
                  v-for="item in mainNavItems"
                  :key="item.path"
                  :to="item.path"
                  class="px-3 py-2 text-white hover:text-white text-sm font-medium hover:bg-white/20 rounded-lg transition-all shadow-text"
                  :class="{ 'bg-white/30': $route.path === item.path }"
                >
                  {{ item.name }}
                </router-link>
              </div>
            </div>

            <!-- Center Section: Search Bar -->
            <div class="flex-1 max-w-xl mx-4 hidden lg:block">
              <div class="relative group">
                <!-- Gradient border glow on focus -->
                <div class="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
                
                <!-- Search input with glassmorphism -->
                <input
                  v-model="searchQuery"
                  @click="handleSearchClick"
                  @focus="handleSearchClick"
                  type="text"
                  placeholder="搜索漫画..."
                  class="relative w-full px-4 py-2 pl-10 bg-gray-900/60 backdrop-blur-xl border border-white/20 rounded-full text-gray-200 placeholder-gray-400 focus:outline-none focus:border-pink-500/50 focus:bg-gray-900/70 transition-all cursor-pointer"
                  readonly
                />
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                
                <!-- Search button with glassmorphism -->
                <button
                  @click="handleSearchClick"
                  class="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1 bg-gradient-to-r from-pink-500/30 to-purple-500/30 backdrop-blur-sm border border-pink-400/50 hover:from-pink-500/40 hover:to-purple-500/40 hover:border-pink-400/70 text-pink-200 hover:text-white text-sm rounded-full transition-all cursor-pointer"
                >
                  搜索
                </button>
              </div>
            </div>

            <!-- Right Section: User Actions -->
            <div class="flex items-center gap-2 sm:gap-4">
              <!-- Permanent Link Button -->
              <button
                @click="showPermanentLinkModal = true"
                class="flex items-center gap-1 px-2.5 py-1 bg-gray-700/40 backdrop-blur-sm border border-gray-500/40 hover:bg-gray-600/50 hover:border-pink-500/30 text-gray-300 hover:text-pink-300 rounded-lg transition-all cursor-pointer"
                title="永久链接"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span class="text-xs font-medium">永链</span>
              </button>
              
              <!-- APP Install Button - Mobile and Desktop (Only show if not in WebView) -->
              <router-link
                v-if="appStore.shouldShowAppDownload"
                to="/app-download"
                class="flex items-center gap-1 px-2.5 py-1 bg-gray-700/40 backdrop-blur-sm border border-gray-500/40 hover:bg-gray-600/50 hover:border-pink-500/30 text-gray-300 hover:text-pink-300 rounded-lg transition-all cursor-pointer"
                title="安装 APP"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span class="text-xs font-medium">APP</span>
              </router-link>
              
              <!-- Quick Links - Desktop -->
              <div class="hidden md:flex items-center gap-2">
                <button
                  @click="showImageServerModal = true"
                  class="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer"
                  title="图片服务器设置"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </button>
                
                <router-link
                  v-if="authStore.isLoggedIn"
                  to="/bookmarks"
                  class="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  title="我的书签"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </router-link>
                
                <router-link
                  v-if="authStore.isLoggedIn"
                  to="/collection"
                  class="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  title="我的收藏"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </router-link>
                
                <!-- VIP Button - Only show if not logged in or not VIP -->
                <router-link
                  v-if="!authStore.isLoggedIn || !isUserVip"
                  to="/vip"
                  class="relative group"
                >
                  <!-- Animated gradient glow effect -->
                  <div class="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-full blur-sm opacity-70 group-hover:opacity-100 animate-pulse"></div>
                  
                  <!-- Main button with glassmorphism -->
                  <div class="relative px-3 py-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-400/50 text-yellow-300 text-sm font-medium rounded-full transition-all group-hover:scale-105 group-hover:border-yellow-300 group-hover:text-yellow-200 cursor-pointer">
                    <div class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      开通VIP
                    </div>
                  </div>
                </router-link>
              </div>
              
              <!-- Mobile Icons - Show on mobile only -->
              <div class="flex md:hidden items-center gap-1">
                <!-- Settings Icon -->
                <button
                  @click="showImageServerModal = true"
                  class="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer"
                  title="图片服务器设置"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </button>
                
                <!-- Bookmarks Icon - Hidden on Mobile -->
                <router-link
                  v-if="authStore.isLoggedIn"
                  to="/bookmarks"
                  class="hidden sm:block p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  title="我的书签"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </router-link>
                
                <!-- Collection Icon - Hidden on Mobile -->
                <router-link
                  v-if="authStore.isLoggedIn"
                  to="/collection"
                  class="hidden sm:block p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  title="我的收藏"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </router-link>
                
                <!-- VIP Button - Only show if not logged in or not VIP -->
                <router-link
                  v-if="!authStore.isLoggedIn || !isUserVip"
                  to="/vip"
                  class="relative group"
                >
                  <!-- Animated glow for mobile -->
                  <div class="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-sm opacity-60 group-hover:opacity-90"></div>
                  
                  <!-- Mobile VIP button -->
                  <div class="relative px-2 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-400/40 text-yellow-300 text-xs font-medium rounded-full transition-all cursor-pointer">
                    开通VIP
                  </div>
                </router-link>
              </div>

              <!-- User Avatar / Login Button -->
              <div v-if="authStore.isLoggedIn" class="relative user-dropdown-container">
                <button
                  @click="showUserMenu = !showUserMenu"
                  class="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-all cursor-pointer"
                >
                  <!-- VIP Badge integrated with Avatar -->
                  <div class="relative">
                    <div class="w-7 h-7 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {{ userInitial }}
                    </div>
                    <!-- VIP Crown Badge -->
                    <div v-if="isUserVip" class="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                  <span class="text-white text-sm hidden sm:block">{{ authStore.user?.name }}</span>
                  <svg class="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <!-- Backdrop for mobile -->
                <div 
                  v-if="showUserMenu"
                  @click="showUserMenu = false"
                  class="fixed inset-0 z-40 sm:hidden"
                ></div>
                
                <!-- User Dropdown Menu -->
                <div
                  v-if="showUserMenu"
                  class="absolute right-0 mt-2 w-48 z-50"
                >
                  <!-- Glassmorphism dropdown with gradient border -->
                  <div class="relative">
                    <!-- Gradient border effect -->
                    <div class="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-lg blur-sm opacity-50"></div>
                    
                    <!-- Main dropdown content -->
                    <div class="relative bg-gray-900/95 backdrop-blur-xl rounded-lg border border-white/10 overflow-hidden">
                      <div class="py-2">
                        <!-- VIP Status / Upgrade Section -->
                        <div v-if="isUserVip" class="px-4 py-2 border-b border-white/10">
                          <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                              <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span class="text-yellow-400 font-medium text-sm">VIP会员</span>
                            </div>
                            <span class="text-gray-400 text-xs">{{ vipExpireText }}</span>
                          </div>
                        </div>
                        <router-link
                          v-else
                          to="/vip"
                          @click="handleDropdownClick"
                          class="block px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/20 hover:to-orange-500/20 border-b border-white/10 transition-colors cursor-pointer"
                        >
                          <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                              <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span class="text-yellow-400 font-medium">开通VIP</span>
                            </div>
                            <svg class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </router-link>
                        <router-link
                          to="/vip"
                          @click="handleDropdownClick"
                          class="block px-4 py-2 text-gray-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        >
                          <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            我要充值
                          </div>
                        </router-link>
                        <router-link
                          to="/profile"
                          @click="handleDropdownClick"
                          class="block px-4 py-2 text-gray-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        >
                          <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            个人中心
                          </div>
                        </router-link>
                        <router-link
                          v-if="authStore.isLoggedIn"
                          to="/collection"
                          @click="handleDropdownClick"
                          class="block px-4 py-2 text-gray-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        >
                          <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            我的收藏
                          </div>
                        </router-link>
                        <router-link
                          to="/bookmarks"
                          @click="handleDropdownClick"
                          class="block px-4 py-2 text-gray-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        >
                          <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            我的书签
                          </div>
                        </router-link>
                        <router-link
                          to="/reading-history"
                          @click="handleDropdownClick"
                          class="block px-4 py-2 text-gray-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        >
                          <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            阅读历史
                          </div>
                        </router-link>
                        <router-link
                          v-if="appStore.shouldShowAppDownload"
                          to="/app-download"
                          @click="handleDropdownClick"
                          class="block px-4 py-2 text-gray-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        >
                          <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            APP 安装
                          </div>
                        </router-link>
                        <router-link
                          to="/recharge-history"
                          @click="handleDropdownClick"
                          class="block px-4 py-2 text-gray-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        >
                          <div class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            充值记录
                          </div>
                        </router-link>
                        <div class="my-2 border-t border-white/10"></div>
                        <button
                          @click="handleLogout"
                          class="block w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors cursor-pointer"
                        >
                          <div class="flex items-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            退出登录
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <router-link
                v-else
                to="/login"
                class="px-4 py-1.5 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-full transition-all"
              >
                登录
              </router-link>
            </div>
          </div>
        </div>
      </nav>

      <!-- Secondary Navigation Bar -->
      <div class="absolute bottom-0 left-0 right-0">
        <div class="container mx-auto px-4">
          <div class="flex items-center gap-4 sm:gap-6 h-12 overflow-x-auto scrollbar-hide">
            <router-link
              v-for="(item, index) in categoryItems"
              :key="`cat-${index}-${item.name}`"
              :to="item.path"
              class="flex-shrink-0 px-3 py-1 text-white/80 hover:text-white text-sm font-medium hover:bg-white/10 rounded-lg transition-all whitespace-nowrap"
            >
              {{ item.name }}
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Server Settings Modal -->
    <ServerSettings v-model="showServerSettings" />
    
    <!-- Image Server Modal -->
    <ImageServerModal v-model="showImageServerModal" />
    
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

    <!-- Permanent Link Modal -->
    <div v-if="showPermanentLinkModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div 
        @click="showPermanentLinkModal = false"
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
      ></div>
      
      <!-- Modal Content -->
      <div class="relative max-w-md w-full">
        <!-- Gradient border effect -->
        <div class="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl blur opacity-50"></div>
        
        <!-- Main modal with glassmorphism -->
        <div class="relative bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
          <!-- Close button -->
          <button
            @click="showPermanentLinkModal = false"
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

  </header>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { useNotificationStore } from '@/stores/notification'
import SiteLogo from '@/components/SiteLogo.vue'
import ServerSettings from '@/components/ServerSettings.vue'
import FullscreenSearch from '@/components/FullscreenSearch.vue'
import ImageServerModal from '@/components/ImageServerModal.vue'
import ModalDialog from '@/components/ModalDialog.vue'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()
const notificationStore = useNotificationStore()

// State
const searchQuery = ref('')
const showUserMenu = ref(false)
const showServerSettings = ref(false)
const showFullscreenSearch = ref(false)
const showImageServerModal = ref(false)
const showLoginPrompt = ref(false)
const showPermanentLinkModal = ref(false)

// Navigation Items
const mainNavItems = [
  { name: '首页', path: '/' },
  { name: '最新', path: '/latest' },
  { name: '分类', path: '/catalog' },
  { name: '更新', path: '/updates' },
]

// Dynamic categories from store only
const categoryItems = computed(() => {
  const storeCategories = appStore.navCategories
  
  // Always include 热门标签 as first item
  const items = [{ name: '热门标签', path: '/search' }]
  
  // If we have categories from API, use them
  if (storeCategories && storeCategories.length > 0) {
    // Take first 6 categories and format them
    const apiCategories = storeCategories.slice(0, 6).map((cat, index) => {
      // Use the slug if available, otherwise use id
      const categoryParam = cat.slug || cat.id || index
      return {
        name: cat.name || cat.title,
        // First category (index 0) doesn't need c= parameter as it's the default
        path: index === 0 ? '/catalog' : `/catalog?c=${categoryParam}`
      }
    })
    items.push(...apiCategories)
  }
  
  return items
})

// Computed
const userInitial = computed(() => {
  return authStore.user?.name?.charAt(0).toUpperCase() || 'U'
})

// Check if user is VIP
const isUserVip = computed(() => {
  if (!authStore.user?.vip_expired_at) return false
  return new Date(authStore.user.vip_expired_at) > new Date()
})

// VIP expire text
const vipExpireText = computed(() => {
  if (!authStore.user?.vip_expired_at) return ''
  const expireDate = new Date(authStore.user.vip_expired_at)
  const now = new Date()
  const daysLeft = Math.ceil((expireDate - now) / (1000 * 60 * 60 * 24))
  
  if (daysLeft <= 0) return '已过期'
  if (daysLeft === 1) return '明天到期'
  if (daysLeft <= 7) return `${daysLeft}天后到期`
  if (daysLeft <= 30) return `${Math.ceil(daysLeft / 7)}周后到期`
  
  return `${Math.ceil(daysLeft / 30)}月后到期`
})

// Methods
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?wd=${encodeURIComponent(searchQuery.value.trim())}`)
    searchQuery.value = ''
  }
}

const handleSearchClick = () => {
  if (!authStore.isLoggedIn) {
    showLoginPrompt.value = true
  } else {
    showFullscreenSearch.value = true
  }
}

const handleLogout = async () => {
  showUserMenu.value = false
  await authStore.logout()
  router.push('/')
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

// Handle dropdown navigation
const navigateFromDropdown = (path) => {
  showUserMenu.value = false
  router.push(path)
}

// Handle dropdown click - close menu
const handleDropdownClick = () => {
  showUserMenu.value = false
}

// Copy to clipboard function
const copyToClipboard = (text) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      notificationStore.success('链接已复制到剪贴板')
    }).catch(() => {
      fallbackCopyToClipboard(text)
    })
  } else {
    fallbackCopyToClipboard(text)
  }
}

// Fallback copy method for older browsers
const fallbackCopyToClipboard = (text) => {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  
  try {
    document.execCommand('copy')
    notificationStore.success('链接已复制到剪贴板')
  } catch (err) {
    notificationStore.error('复制失败，请手动复制')
  }
  
  document.body.removeChild(textArea)
}
</script>

<style scoped>
/* Hide scrollbar for category items */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Slide transition for mobile menu */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from .absolute.right-0,
.slide-leave-to .absolute.right-0 {
  transform: translateX(100%);
}

.slide-enter-from .absolute.inset-0,
.slide-leave-to .absolute.inset-0 {
  opacity: 0;
}
</style>
