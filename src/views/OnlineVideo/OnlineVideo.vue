<template>
    <AppLayout :header="showFavorites ? '我的收藏' : '在线视频'" :loading="loading" :showSubmenus="true" :isCenter="false" :showBreadcrumbs="false" :breadcrumbs="breadcrumbs" :showDanmu="false">
        <template #body>
            <div class="mt-4">
                <!-- 顶部推荐区域 - 左右两栏布局，收藏模式下隐藏 -->
                <div v-if="!showFavorites" class="mb-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <!-- 左侧：大的推荐轮播 -->
                    <div class="lg:col-span-1">
                        <VideoRecommendationSlider :type-name="selectedType" />
                    </div>

                    <!-- 右侧：福利中心卡片 -->
                    <div class="lg:col-span-1">
                        <WelfareCenterCards />
                    </div>
                </div>

                <!-- 视频充值区域 - 根据会员状态显示不同内容，收藏模式下隐藏 -->
                <div v-if="!showFavorites && (!$page.props.auth.user.video_expired_at || showChargeDetails)" class="mb-4 bg-gradient-to-r from-yellow-50 via-orange-50 to-yellow-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 rounded-xl shadow-lg border-2 border-yellow-300 dark:border-yellow-700 p-4 sm:p-6">
                    <!-- 会员状态显示 -->
                    <div class="text-center mb-4">
                        <h3 class="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                            🎬 视频通行证充值
                        </h3>
                        <div class="text-sm sm:text-base">
                            <span class="text-gray-600 dark:text-gray-400">当前状态：</span>
                            <span v-if="$page.props.auth.user.video_expired_at" class="ml-1 text-base sm:text-lg font-semibold text-green-600 dark:text-green-400">
                                有效至 {{ $page.props.auth.user.video_expired_at }}
                            </span>
                            <span v-else class="ml-1 text-base sm:text-lg font-semibold text-red-600 dark:text-red-400">
                                未开通
                            </span>
                        </div>
                        <!-- 如果是从简洁模式展开的，显示收起按钮 -->
                        <button v-if="$page.props.auth.user.video_expired_at && showChargeDetails"
                            @click="showChargeDetails = false"
                            class="mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                            收起 ↑
                        </button>
                    </div>

                    <!-- 充值选项 - 大号按钮，清晰价格 -->
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        <!-- 月卡 -->
                        <button @click="quickPay('video-1')"
                           class="relative bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl p-4 transition-all duration-200 transform hover:scale-105 hover:shadow-xl group">
                            <div class="flex flex-col items-center">
                                <span class="text-gray-600 dark:text-gray-400 text-sm mb-1">月卡</span>
                                <span class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">¥50</span>
                                <span class="text-xs text-gray-500 dark:text-gray-400">30天</span>
                            </div>
                        </button>

                        <!-- 季卡 -->
                        <button @click="quickPay('video-3')"
                           class="relative bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl p-4 transition-all duration-200 transform hover:scale-105 hover:shadow-xl group">
                            <div class="flex flex-col items-center">
                                <span class="text-gray-600 dark:text-gray-400 text-sm mb-1">季卡</span>
                                <span class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">¥100</span>
                                <span class="text-xs text-gray-500 dark:text-gray-400">90天</span>
                                <span class="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">省¥50</span>
                            </div>
                        </button>

                        <!-- 半年卡 - 推荐 -->
                        <button @click="quickPay('video-6')"
                           class="relative bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-800/40 dark:hover:to-pink-800/40 border-2 border-purple-400 dark:border-purple-600 rounded-xl p-4 transition-all duration-200 transform hover:scale-105 hover:shadow-xl group">
                            <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse">
                                推荐
                            </div>
                            <div class="flex flex-col items-center">
                                <span class="text-purple-700 dark:text-purple-300 text-sm mb-1 font-semibold">半年卡</span>
                                <span class="text-2xl sm:text-3xl font-bold text-purple-800 dark:text-purple-200 mb-1">¥150</span>
                                <span class="text-xs text-purple-600 dark:text-purple-400">180天</span>
                                <span class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">省¥150</span>
                            </div>
                        </button>

                        <!-- 年卡 -->
                        <button @click="quickPay('video-7')"
                           class="relative bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl p-4 transition-all duration-200 transform hover:scale-105 hover:shadow-xl group">
                            <div class="flex flex-col items-center">
                                <span class="text-gray-600 dark:text-gray-400 text-sm mb-1">年卡</span>
                                <span class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">¥280</span>
                                <span class="text-xs text-gray-500 dark:text-gray-400">365天</span>
                                <span class="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">省¥320</span>
                            </div>
                        </button>
                    </div>

                    <!-- 温馨提示 -->
                    <div class="mt-4 text-center">
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            💡 提示：点击即可快速充值，支持支付宝/微信支付
                        </p>
                    </div>
                </div>

                <!-- 简洁的续费提示 - 仅在会员未过期且未展开详情时显示，收藏模式下隐藏 -->
                <div v-else-if="!showFavorites" class="mb-4 bg-white dark:bg-dark-second rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3">
                    <div class="flex items-center gap-2">
                        <div class="text-green-500 dark:text-green-400">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div class="text-sm flex items-center flex-wrap gap-x-1">
                            <span class="text-gray-700 dark:text-gray-300">视频通行证有效至</span>
                            <span class="text-gray-600 dark:text-gray-400 font-medium">{{ $page.props.auth.user.video_expired_at }}</span>
                            <span class="text-gray-400 dark:text-gray-500">·</span>
                            <a @click="showChargeModal = true"
                               class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer hover:underline">
                                点我续费
                            </a>
                        </div>
                    </div>
                </div>

                <!-- 搜索栏 -->
                <div class="bg-white dark:bg-dark-second rounded-lg shadow p-3 sm:p-4 mb-4">
                    <div class="flex flex-col gap-3">
                        <div class="flex gap-2">
                            <input
                                v-model="searchText"
                                @keyup.enter="applyFilter"
                                type="text"
                                placeholder="搜索视频..."
                                :disabled="searchLoading"
                                class="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-gray-50 dark:bg-dark-third text-gray-700 dark:text-dark-txt border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                            <button
                                @click="applyFilter"
                                :disabled="searchLoading"
                                class="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-1 sm:gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
                                <svg v-if="!searchLoading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                                <svg v-else class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span class="hidden sm:inline">{{ searchLoading ? '搜索中...' : '搜索' }}</span>
                            </button>
                        </div>

                        <!-- 新窗打开设置 - 居中显示 -->
                        <div class="flex items-center justify-center border-t border-gray-100 dark:border-gray-700 pt-3">
                            <div class="flex items-center gap-2 cursor-pointer">
                                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                </svg>
                                <span class="text-sm text-gray-600 dark:text-gray-400">新窗口打开视频</span>
                                <button
                                    @click="toggleNewTabSetting"
                                    :class="[
                                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors ml-2',
                                        openInNewTab ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                    ]"
                                    :title="openInNewTab ? '点击关闭新窗打开' : '点击开启新窗打开'">
                                    <span
                                        :class="[
                                            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                                            openInNewTab ? 'translate-x-6' : 'translate-x-1'
                                        ]"
                                    />
                                </button>
                            </div>
                            <!-- 桌面端：我的收藏切换按钮 -->
                            <div class="hidden sm:flex justify-end ml-4">
                                <button
                                    @click="toggleFavoritesView"
                                    :class="[
                                'px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 flex items-center gap-2',
                                showFavorites
                                    ? 'bg-pink-500 text-white shadow-md hover:bg-pink-600'
                                    : 'bg-white dark:bg-gray-800 text-pink-600 dark:text-pink-400 border-2 border-pink-300 dark:border-pink-700 hover:bg-pink-50 dark:hover:bg-pink-900/20'
                            ]">
                                    <svg class="w-4 h-4" :fill="showFavorites ? 'currentColor' : 'none'" :stroke="showFavorites ? 'none' : 'currentColor'" stroke-width="2" viewBox="0 0 20 20">
                                        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                                    </svg>
                                    <span>{{ showFavorites ? '返回列表' : '我的收藏' }}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 筛选和排序区域 - 手机端优化设计 -->
                <div class="bg-white dark:bg-dark-second rounded-lg shadow mb-4">
                    <!-- 手机端：筛选器摘要和展开按钮 -->
                    <div class="sm:hidden p-3 flex items-center justify-between">
                        <div class="flex items-center gap-2 text-sm">
                            <span class="text-gray-600 dark:text-gray-400">筛选：</span>
                            <div class="flex items-center gap-1 text-xs">
                                <span v-if="showFavorites" class="bg-pink-500 text-white px-2 py-0.5 rounded">我的收藏</span>
                                <span v-else-if="selectedType" class="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">{{ selectedType }}</span>
                                <span v-if="selectedTimeFilter !== 'all' && !showFavorites" class="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">{{ timeFilters.find(t => t.value === selectedTimeFilter)?.label }}</span>
                                <span v-if="selectedSortFilter !== 'latest' && !showFavorites" class="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                                    {{ selectedSortFilter === 'hot' ? '最热' : selectedSortFilter === 'favorites' ? '最多收藏' : selectedSortFilter === 'comments' ? '最多评论' : '' }}
                                </span>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <!-- 我的收藏按钮 - 手机端 -->
                            <button
                                @click="toggleFavoritesView"
                                :class="[
                                    'flex items-center gap-1 px-3 py-2 text-sm rounded-lg font-medium transition-all duration-200',
                                    showFavorites
                                        ? 'bg-pink-500 text-white shadow-md'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                ]">
                                <svg v-if="!showFavorites" class="w-4 h-4" :fill="showFavorites ? 'currentColor' : 'none'" :stroke="showFavorites ? 'none' : 'currentColor'" stroke-width="2" viewBox="0 0 20 20">
                                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                                </svg>
                                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                                </svg>
                                <span>{{ showFavorites ? '返回筛选' : '我的收藏' }}</span>
                            </button>

                            <button v-if="!showFavorites" @click="showMobileFilters = !showMobileFilters"
                                class="flex items-center gap-1 px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium shadow-md">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                                </svg>
                                <span>{{ showMobileFilters ? '收起' : '筛选' }}</span>
                                <svg class="w-3 h-3 ml-1 transition-transform" :class="{ 'rotate-180': showMobileFilters }" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- 筛选选项内容 -->
                    <div v-if="!showFavorites" :class="['p-3 sm:p-4 space-y-3', { 'hidden': !showMobileFilters && isMobile }]">
                        <!-- 资源服务器选择 -->
                        <div v-if="!showFavorites" class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <span class="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">资源：</span>
                            <div class="flex gap-1 sm:gap-2 flex-wrap">
                                <button
                                    @click="selectSource(null)"
                                    :class="[
                                        'px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full transition-all duration-200',
                                        selectedSource === null
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 dark:bg-dark-third text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    ]">
                                    全部
                                </button>
                                <button
                                    v-for="(source, index) in props.sources"
                                    :key="source"
                                    @click="selectSource(source)"
                                    :class="[
                                        'px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full transition-all duration-200',
                                        selectedSource === source
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 dark:bg-dark-third text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    ]">
                                    {{ getSourceDisplayName(source, index) }}
                                </button>
                            </div>
                        </div>

                        <!-- 排序和时间组合 -->
                        <div v-if="!showFavorites" class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                            <!-- 排序选项 -->
                            <div class="flex items-center gap-2 sm:gap-3">
                                <span class="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">排序：</span>
                                <div class="flex gap-1 sm:gap-2 flex-wrap">
                                    <button
                                        @click="selectSortFilter('latest')"
                                        :class="[
                                            'px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full transition-all duration-200',
                                            selectedSortFilter === 'latest'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 dark:bg-dark-third text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        ]">
                                        最新
                                    </button>
                                    <button
                                        @click="selectSortFilter('hot')"
                                        :class="[
                                            'px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full transition-all duration-200',
                                            selectedSortFilter === 'hot'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 dark:bg-dark-third text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        ]">
                                        最热
                                    </button>
                                    <button
                                        @click="selectSortFilter('favorites')"
                                        :class="[
                                            'px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full transition-all duration-200',
                                            selectedSortFilter === 'favorites'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 dark:bg-dark-third text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        ]">
                                        最多收藏
                                    </button>
                                    <button
                                        @click="selectSortFilter('comments')"
                                        :class="[
                                            'px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full transition-all duration-200',
                                            selectedSortFilter === 'comments'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 dark:bg-dark-third text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        ]">
                                        最多评论
                                    </button>
                                </div>
                            </div>

<!--                            &lt;!&ndash; 时间筛选 &ndash;&gt;-->
<!--                            <div class="flex items-center gap-2 sm:gap-3">-->
<!--                                <span class="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">时间：</span>-->
<!--                                <div class="flex gap-1 sm:gap-2">-->
<!--                                    <button-->
<!--                                        @click="selectTimeFilter('all')"-->
<!--                                        :class="[-->
<!--                                            'px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full transition-all duration-200',-->
<!--                                            selectedTimeFilter === 'all'-->
<!--                                                ? 'bg-blue-500 text-white'-->
<!--                                                : 'bg-gray-100 dark:bg-dark-third text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'-->
<!--                                        ]">-->
<!--                                        所有-->
<!--                                    </button>-->
<!--                                    <button-->
<!--                                        @click="selectTimeFilter('7days')"-->
<!--                                        :class="[-->
<!--                                            'px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full transition-all duration-200',-->
<!--                                            selectedTimeFilter === '7days'-->
<!--                                                ? 'bg-blue-500 text-white'-->
<!--                                                : 'bg-gray-100 dark:bg-dark-third text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'-->
<!--                                        ]">-->
<!--                                        7天-->
<!--                                    </button>-->
<!--                                    <button-->
<!--                                        @click="selectTimeFilter('30days')"-->
<!--                                        :class="[-->
<!--                                            'px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full transition-all duration-200',-->
<!--                                            selectedTimeFilter === '30days'-->
<!--                                                ? 'bg-blue-500 text-white'-->
<!--                                                : 'bg-gray-100 dark:bg-dark-third text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'-->
<!--                                        ]">-->
<!--                                        30天-->
<!--                                    </button>-->
<!--                                </div>-->
<!--                            </div>-->
                        </div>

                        <!-- 分类选项 -->
                        <div v-if="!showFavorites" class="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
                            <span class="text-sm text-gray-600 dark:text-gray-400 sm:mt-1.5 whitespace-nowrap">分类：</span>
                            <div class="flex-1">
                                <div class="flex flex-wrap gap-1.5 sm:gap-2">
                                    <button
                                        @click="selectType(null)"
                                        :class="[
                                            'px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full transition-all duration-200',
                                            selectedType === null && !showFavorites
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 dark:bg-dark-third text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        ]">
                                        全部
                                    </button>
                                    <button
                                        v-for="type in displayedTypes"
                                        :key="type.label"
                                        @click="selectType(type.label)"
                                        :class="[
                                            'px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full transition-all duration-200',
                                            selectedType === type.label && !showFavorites
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 dark:bg-dark-third text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        ]">
                                        {{ type.label }}
                                        <span v-if="type.count > 0" class="ml-0.5 sm:ml-1 text-[10px] sm:text-xs opacity-70">({{ type.count }})</span>
                                    </button>
                                    <button
                                        v-if="typeOptions.length > 15"
                                        @click="showAllTypes = !showAllTypes"
                                        class="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-full bg-gray-100 dark:bg-dark-third text-blue-600 dark:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 flex items-center gap-1">
                                        <span>{{ showAllTypes ? '收起' : '更多' }}</span>
                                        <svg class="w-3 h-3 transition-transform" :class="{ 'rotate-180': showAllTypes }" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- 重置按钮 -->
                        <div v-if="!showFavorites" class="hidden sm:flex justify-center pt-3 border-t border-gray-200 dark:border-gray-700">
                            <button
                                @click="resetFilter"
                                class="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors flex items-center gap-1">
                                <svg class="w-3.5 sm:w-4 h-3.5 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                                <span class="hidden sm:inline">重置筛选</span>
                                <span class="sm:hidden">重置</span>
                            </button>
                        </div>

                        <!-- 手机端：重置筛选按钮 -->
                        <div class="sm:hidden pt-3 border-t border-gray-200 dark:border-gray-700">
                            <button @click="resetFilterAndClose"
                                class="w-full py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium flex items-center justify-center gap-2">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                                重置所有筛选
                            </button>
                        </div>
                    </div>

                </div>

                <!-- 分页 -->
                <div id="first-pagination" class="border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4">
                    <div class="flex justify-center">
                        <el-pagination
                            v-model:current-page="page"
                            :page-size="30"
                            :total="totalItems"
                            @current-change="handlePageChange"
                            background
                            :layout="paginationLayout"
                            :hide-on-single-page="false"
                            :small="isMobile"
                            :pager-count="windowWidth < 480 ? 3 : (isMobile ? 5 : 7)"
                        />
                    </div>
                    <!-- 搜索文本显示 -->
                    <div v-if="searchText" class="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">
                        搜索: <span class="font-semibold text-gray-800 dark:text-gray-200">{{ searchText }}</span>
                    </div>
                </div>
                <!-- 视频统计 -->
                <div class="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    共 <span class="font-semibold text-gray-800 dark:text-gray-200">{{ totalItems }}</span> 个视频
                </div>

                <!-- 视频列表 -->
                <div class="relative">
                    <!-- 搜索加载遮罩 -->
                    <div v-if="searchLoading" class="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                        <div class="flex flex-col items-center gap-3">
                            <svg class="animate-spin h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span class="text-gray-600 dark:text-gray-400 text-sm">搜索中...</span>
                        </div>
                    </div>

                    <div ref="scrollContainer" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                        <div v-for="item in items"
                             :key="item.id"
                             :id="`video-${item.id}`"
                             class="group relative bg-white dark:bg-dark-second shadow hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden">
                            <a :href="route('dashboard.online.video.details', { id: item.id })"
                               :target="openInNewTab ? '_blank' : '_self'"
                               @click="handleVideoClick(item.id)"
                               class="block overflow-hidden">
                                <!-- 封面 - 手机端优化 -->
                                <div class="relative overflow-hidden bg-gray-100 dark:bg-dark-third aspect-video">
                                    <el-image
                                        v-if="item.cover_img"
                                        lazy
                                        :src="remoteAttachUrl2 + '/' + item.cover_img"
                                        :fit="imageFitModes[item.id] || 'cover'"
                                        class="block w-full h-full hover:scale-105 transition-transform duration-300"
                                        @load="handleImageLoad($event, item)"
                                        :style="{ backgroundColor: imageFitModes[item.id] === 'contain' ? '#000' : '' }"
                                    >
                                        <template #placeholder>
                                            <div class="w-full h-full flex items-center justify-center">
                                                <svg class="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-gray-400" fill="none" viewBox="0 0 24 24">
                                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            </div>
                                        </template>
                                        <template #error>
                                            <div class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-dark-third">
                                                <svg class="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
                                                </svg>
                                            </div>
                                        </template>
                                    </el-image>

                                    <!-- 无图片时的占位符 -->
                                    <div v-else class="w-full h-full flex items-center justify-center">
                                        <svg class="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
                                        </svg>
                                    </div>

                                    <!-- 悬停遮罩 -->
                                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div class="w-12 h-12 sm:w-14 sm:h-14 bg-black/60 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                                            </svg>
                                        </div>
                                    </div>

                                    <!-- 时长标签 -->
                                    <div v-if="item.duration" class="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 px-1.5 py-0.5 sm:px-2 sm:py-1 bg-black bg-opacity-70 rounded text-[10px] sm:text-xs text-white">
                                        {{ item.duration }}
                                    </div>
                                </div>

                                <!-- 信息 - 手机端优化布局 -->
                                <div class="p-2 sm:p-3">
                                    <!-- 标题 -->
                                    <h3 class="text-xs sm:text-sm font-medium text-gray-900 dark:text-dark-txt line-clamp-2 mb-1.5 sm:mb-2 hover:text-blue-600 dark:hover:text-blue-400">
                                        {{ item.name }}
                                    </h3>

                                    <!-- 手机端：分类和时间 -->
                                    <div class="sm:hidden">
                                        <div class="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
                                            <span v-if="item.type_name" class="text-blue-600 dark:text-blue-400 truncate max-w-[60px]">
                                                {{ item.type_name }}
                                            </span>
                                            <span v-if="item.type_name" class="text-gray-400">·</span>
                                            <span class="truncate">{{ item.created_at ? dayjs(item.created_at).fromNow() : dayjs(item.vod_time).fromNow() }}</span>
                                        </div>
                                        <!-- 手机端浏览量和收藏数 -->
                                        <div class="mt-1 flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                                            </svg>
                                            <span>{{ formatViewCount(item.views || 0) }}</span>
                                            <span class="mx-1 text-gray-400">·</span>
                                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                                            </svg>
                                            <span>{{ formatViewCount(item.favorites_count || 0) }}</span>
                                            <span class="mx-1 text-gray-400">·</span>
                                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
                                            </svg>
                                            <span>{{ formatViewCount(item.comments_count || 0) }}</span>
                                        </div>
                                    </div>

                                    <!-- 桌面端：单行显示 -->
                                    <div class="hidden sm:flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                        <div class="flex items-center gap-2">
                                            <span v-if="item.type_name" class="text-blue-600 dark:text-blue-400">
                                                {{ item.type_name }}
                                            </span>
                                            <span>{{ item.created_at ? dayjs(item.created_at).fromNow() : dayjs(item.vod_time).fromNow() }}</span>
                                        </div>
                                        <div class="flex items-center gap-1">
                                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                                            </svg>
                                            <span>{{ formatViewCount(item.views || 0) }}</span>
                                            <span class="mx-1 text-gray-400">·</span>
                                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                                            </svg>
                                            <span>{{ formatViewCount(item.favorites_count || 0) }}</span>
                                            <span class="mx-1 text-gray-400">·</span>
                                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
                                            </svg>
                                            <span>{{ formatViewCount(item.comments_count || 0) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </a>
                    </div>
                </div>
                </div>
                <div class="border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4">
                    <div class="flex justify-center">
                        <el-pagination
                            v-model:current-page="page"
                            :page-size="30"
                            :total="totalItems"
                            @current-change="handleBotPagination"
                            background
                            :layout="paginationLayout"
                            :hide-on-single-page="false"
                            :small="isMobile"
                            :pager-count="windowWidth < 480 ? 3 : (isMobile ? 5 : 7)"
                        />
                    </div>
                </div>
                <!-- 加载更多按钮 -->
<!--                <div class="flex justify-center py-10 mt-5 bg-white dark:bg-dark-second rounded-lg">-->
<!--                    <div v-if="isLoadingMore" class="flex items-center gap-2">-->
<!--                        <svg class="animate-spin h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24">-->
<!--                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>-->
<!--                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>-->
<!--                        </svg>-->
<!--                        <span class="text-gray-500">加载中...</span>-->
<!--                    </div>-->

<!--                    <button v-else-if="totalPage !== null && page < totalPage"-->
<!--                            class="px-5 py-2 rounded-full bg-gray-700 dark:bg-dark-third text-white hover:bg-gray-800 dark:hover:bg-dark-second transition-all duration-300"-->
<!--                            @click="handleLoadMore">-->
<!--                        加载更多-->
<!--                    </button>-->

<!--                    <div v-else class="text-gray-500 dark:text-gray-400">-->
<!--                        已经没有更多啦~-->
<!--                    </div>-->
<!--                </div>-->

            </div>

            <!-- 充值弹窗 -->
            <Teleport to="body">
                <Transition name="modal-fade">
                    <div v-if="showChargeModal" class="fixed inset-0 z-50 overflow-y-auto">
                        <!-- 背景遮罩 -->
                        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="showChargeModal = false"></div>

                        <!-- 弹窗内容 -->
                        <div class="flex min-h-full items-center justify-center p-4">
                            <div class="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transition-all">
                                <!-- 关闭按钮 -->
                                <button @click="showChargeModal = false"
                                    class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>

                                <!-- 弹窗主体 -->
                                <div class="bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 p-6 sm:p-8">
                                    <!-- 标题 -->
                                    <div class="text-center mb-6">
                                        <h3 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                                            🎬 视频通行证续费
                                        </h3>
                                        <div class="text-base sm:text-lg">
                                            <span class="text-gray-600 dark:text-gray-400">当前状态：</span>
                                            <span v-if="$page.props.auth.user.video_expired_at" class="ml-1 font-semibold text-green-600 dark:text-green-400">
                                                有效至 {{ $page.props.auth.user.video_expired_at }}
                                            </span>
                                            <span v-else class="ml-1 font-semibold text-red-600 dark:text-red-400">
                                                未开通
                                            </span>
                                        </div>
                                    </div>

                                    <!-- 充值选项网格 -->
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                        <!-- 月卡 -->
                                        <button @click="quickPay('video-1')"
                                           class="relative bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl p-6 transition-all duration-200 transform hover:scale-105 hover:shadow-xl group">
                                            <div class="flex items-center justify-between">
                                                <div class="text-left">
                                                    <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">月卡</h4>
                                                    <p class="text-sm text-gray-500 dark:text-gray-400">30天有效期</p>
                                                </div>
                                                <div class="text-right">
                                                    <div class="text-3xl font-bold text-gray-800 dark:text-gray-200">¥50</div>
                                                </div>
                                            </div>
                                        </button>

                                        <!-- 季卡 -->
                                        <button @click="quickPay('video-3')"
                                           class="relative bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl p-6 transition-all duration-200 transform hover:scale-105 hover:shadow-xl group">
                                            <div class="flex items-center justify-between">
                                                <div class="text-left">
                                                    <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">季卡</h4>
                                                    <p class="text-sm text-gray-500 dark:text-gray-400">90天有效期</p>
                                                </div>
                                                <div class="text-right">
                                                    <div class="text-3xl font-bold text-gray-800 dark:text-gray-200">¥100</div>
                                                    <div class="text-sm text-green-600 dark:text-green-400">省¥50</div>
                                                </div>
                                            </div>
                                            <span class="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">省钱</span>
                                        </button>

                                        <!-- 半年卡 - 推荐 -->
                                        <button @click="quickPay('video-6')"
                                           class="relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 border-2 border-purple-400 dark:border-purple-600 rounded-xl p-6 transition-all duration-200 transform hover:scale-105 hover:shadow-xl group">
                                            <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse">
                                                推荐
                                            </div>
                                            <div class="flex items-center justify-between">
                                                <div class="text-left">
                                                    <h4 class="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-1">半年卡</h4>
                                                    <p class="text-sm text-purple-600 dark:text-purple-400">180天有效期</p>
                                                </div>
                                                <div class="text-right">
                                                    <div class="text-3xl font-bold text-purple-800 dark:text-purple-200">¥150</div>
                                                    <div class="text-sm text-green-600 dark:text-green-400">省¥150</div>
                                                </div>
                                            </div>
                                        </button>

                                        <!-- 年卡 -->
                                        <button @click="quickPay('video-7')"
                                           class="relative bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl p-6 transition-all duration-200 transform hover:scale-105 hover:shadow-xl group">
                                            <div class="flex items-center justify-between">
                                                <div class="text-left">
                                                    <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">年卡</h4>
                                                    <p class="text-sm text-gray-500 dark:text-gray-400">365天有效期</p>
                                                </div>
                                                <div class="text-right">
                                                    <div class="text-3xl font-bold text-gray-800 dark:text-gray-200">¥280</div>
                                                    <div class="text-sm text-green-600 dark:text-green-400">省¥320</div>
                                                </div>
                                            </div>
                                            <span class="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">最划算</span>
                                        </button>
                                    </div>

                                    <!-- 温馨提示 -->
                                    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                                        <p class="text-sm text-blue-700 dark:text-blue-300 text-center">
                                            💡 提示：点击任意套餐即可快速充值，支持支付宝/微信支付
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
            </Teleport>
        </template>
    </AppLayout>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localeData from 'dayjs/plugin/localeData'
import 'dayjs/locale/zh-cn'
import { debounce } from 'lodash'
import BackToTop from '@/Pages/Guide/BackToTop.vue'
import { router, usePage } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'
import VideoRecommendationSlider from '@/Components/VideoRecommendationSlider.vue'
import WelfareCenterCards from '@/Components/WelfareCenterCards.vue'
import { ElMessage } from 'element-plus'

const $page = usePage()

dayjs.extend(relativeTime)
dayjs.extend(localeData)
dayjs.locale('zh-cn')

const remoteAttachUrl2 = import.meta.env.VITE_REMOTE_ATTACH_URL_2

const props = defineProps({
    selected_source: String,
    sources: Array,
    page: {
        type: Number,
        default: 1
    },
    type: String,
    search: String,
    time_filter: String,
    sort_filter: String,
    showFavorites: {
        type: Boolean,
        default: false
    }
})

// 内容过滤关键词
const bannedKeywords = ['幼女', '兽', '狗', '未成年', '小马', '破处', '猛男', '肌肉','男孩', '黑皮', '白壮','夫夫']
// 需要过滤的类型
const bannedTypes = ['男同性恋', '重口色情']

// 内容过滤函数
const filterContent = (videoItems) => {
    return videoItems.filter(item => {
        if (!item.name) return true

        // 检查类型是否在禁止列表中
        if (item.type_name && bannedTypes.includes(item.type_name)) {
            return false
        }

        // 检查标题是否包含违禁关键词
        const title = item.name.toLowerCase()
        return !bannedKeywords.some(keyword => title.includes(keyword.toLowerCase()))
    })
}

// 响应式数据
const loading = ref(false)
const isLoadingMore = ref(false)
const searchLoading = ref(false) // 搜索加载状态
const items = reactive([])
const totalItems = ref(0)
const page = ref(props.page)
const totalPage = ref(null)
const perPage = ref(30)
const searchText = ref(props.search || '')
const selectedType = ref(props.type || null)
const selectedTimeFilter = ref(props.time_filter || 'all')
const selectedSortFilter = ref(props.sort_filter || 'latest')
const typeOptions = ref([])
const selectedSource = ref(props.selected_source || null)
const showAllTypes = ref(false)
const openInNewTab = ref(localStorage.getItem('online_video_new_tab') === 'true') // 默认为 false
const scrollContainer = ref(null)
const imageFitModes = reactive({}) // 存储每个图片的 fit 模式
const showChargeDetails = ref(false) // 控制充值详情显示
const showChargeModal = ref(false) // 控制充值弹窗显示
const showMobileFilters = ref(false) // 控制手机端筛选器显示
const showFavorites = ref(props.showFavorites || false) // 是否显示收藏列表

// 排序选项
const sortFilters = [
    { value: 'latest', label: '最新' },
    { value: 'hot', label: '最热' },
    { value: 'favorites', label: '最多收藏' }
]

// 时间筛选选项
const timeFilters = [
    { value: 'all', label: '所有' },
    { value: '7days', label: '7天' },
    { value: '30days', label: '30天' }
]

// 显示的分类
const displayedTypes = computed(() => {
    if (showAllTypes.value) {
        return typeOptions.value
    }
    return typeOptions.value.slice(0, 15)
})

// 窗口宽度
const windowWidth = ref(window.innerWidth)

// 检测是否为移动设备
const isMobile = computed(() => {
    return windowWidth.value < 640
})

// 根据设备类型设置分页布局
const paginationLayout = computed(() => {
    if (windowWidth.value < 640) {
        // 手机：显示简化分页
        return 'prev, pager, next'
    } else {
        // 平板和桌面：显示总数和分页
        return 'prev, pager, next'
    }
})

const breadcrumbs = computed(() => {
    if (showFavorites.value) {
        return [
            {
                name: '在线视频',
                path: 'dashboard.online.video',
            },
            {
                name: '我的收藏',
                path: null,
            }
        ]
    }
    return [
        {
            name: '在线视频',
            path: 'dashboard.online.video',
        }
    ]
})

// 格式化浏览次数
const formatViewCount = (count) => {
    if (!count) return '0'
    if (count < 1000) return count.toString()
    if (count < 10000) return (count / 1000).toFixed(1) + 'k'
    return (count / 10000).toFixed(1) + 'w'
}

// 获取资源站显示名称
const getSourceDisplayName = (source, index) => {
    const sourceMap = {
        'lajiao': '1号资源',
        'lebo': '2号资源',
        'senlin': '3号资源'
    }
    return sourceMap[source] || `${index + 1}号资源`
}

// 选择资源站
const selectSource = (source) => {
    selectedSource.value = source
    getOnlineVideoSetting()
    goToPage(1)
}

// 选择排序
const selectSortFilter = (value) => {
    selectedSortFilter.value = value
    goToPage(1)
}

// 选择时间筛选
const selectTimeFilter = (value) => {
    selectedTimeFilter.value = value
    goToPage(1)
}

// 选择分类
const selectType = (value) => {
    selectedType.value = value
    // 如果选择了分类，退出收藏模式
    if (showFavorites.value) {
        showFavorites.value = false
        // 更新 URL
        const url = new URL(window.location)
        url.searchParams.delete('favorites')
        window.history.pushState({}, '', url)
    }
    goToPage(1)
}

// 更新 URL 参数
const updateUrlParams = (includeAnchor = false, anchorId = null) => {
    const params = {}
    if (page.value > 1) params.page = page.value
    if (selectedType.value) params.type = selectedType.value
    if (searchText.value) params.search = searchText.value
    if (selectedSource.value) params.source = selectedSource.value
    if (selectedTimeFilter.value !== 'all') params.time_filter = selectedTimeFilter.value
    if (selectedSortFilter.value !== 'latest') params.sort_filter = selectedSortFilter.value

    // 保留现有的 anchor 参数（如果存在）
    const currentParams = new URLSearchParams(window.location.search)
    const currentAnchor = currentParams.get('anchor')
    if (currentAnchor && !includeAnchor) {
        params.anchor = currentAnchor
    }
    if (includeAnchor && anchorId) {
        params.anchor = anchorId
    }

    const url = new URL(window.location)
    url.search = new URLSearchParams(params).toString()
    window.history.replaceState({}, '', url)
}

// 处理视频点击
const handleVideoClick = (videoId) => {
    // 在点击时添加 anchor 参数到 URL，使用 pushState 保留历史记录
    const params = new URLSearchParams(window.location.search)
    params.set('anchor', videoId)

    const url = new URL(window.location)
    url.search = params.toString()
    window.history.pushState({}, '', url)
}

// 防抖搜索
const applyFilter = debounce(() => {
    search()
}, 300)

// 切换收藏状态
const toggleFavorite = async (video) => {
    if (!$page.props.auth.user) {
        ElMessage.warning('请先登录后再收藏')
        return
    }

    try {
        const response = await axios.post(route('api.online.video.favorite.toggle'), {
            video_id: video.id
        })

        if (response.data.success) {
            // 更新本地状态
            video.is_favorited = response.data.data.is_favorited
            video.favorites_count = response.data.data.favorites_count

            ElMessage.success(response.data.data.message)
        }
    } catch (error) {
        console.error('收藏操作失败:', error)
        // axios 错误已被全局处理，无需再次提示
    }
}

// 快捷支付
const quickPay = (productKey) => {
    // 关闭弹窗
    showChargeModal.value = false

    loading.value = true
    axios
        .post(route("api.forum.payments.btc"), {
            product_key: productKey,
            code: null
        })
        .then((response) => {
            loading.value = false
            window.location.href = response.data.data.url
        })
        .catch((error) => {
            loading.value = false
            ElMessage.error('支付请求失败，请稍后重试')
        })
}



// 获取视频设置
const getOnlineVideoSetting = () => {
    axios.get(route('api.online.video.setting', {
        source: selectedSource.value,
    }))
    .then((response) => {
        typeOptions.value = response.data.data || []
    })
    .catch((error) => {
        console.error('Failed to get video settings:', error)
    })
}

// 搜索
const search = () => {
    searchLoading.value = true
    // 只有在有搜索文本时才重置筛选选项
    if (searchText.value) {
        selectedType.value = null
        selectedTimeFilter.value = 'all'
        selectedSortFilter.value = 'latest'
    }
    goToPage(1)
}

// 重置筛选（不清除搜索内容）
const resetFilter = () => {
    selectedType.value = null
    selectedTimeFilter.value = 'all'
    selectedSortFilter.value = 'latest'
    goToPage(1)
}

// 重置筛选并关闭手机端筛选面板
const resetFilterAndClose = () => {
    resetFilter()
    showMobileFilters.value = false
}

// 重置所有筛选项
const resetAll = () => {
    selectedType.value = null
    searchText.value = ''
    selectedTimeFilter.value = 'all'
    selectedSortFilter.value = 'latest'
    page.value = 1
    goToPage(1)
}

// 处理分页变化
const handlePageChange = (newPage) => {
    goToPage(newPage)
}

// 跳转到指定页
const goToPage = (requestPage = null) => {
    if (requestPage != null) {
        page.value = requestPage
    }
    loading.value = true

    // 根据是否是收藏模式选择不同的 API
    const apiRoute = showFavorites.value
        ? route('api.online.video.favorites', {
            page: page.value,
            per_page: perPage.value
        })
        : route('api.online.video', {
            text: searchText.value,
            page: page.value,
            per_page: perPage.value,
            type: selectedType.value,
            source: selectedSource.value,
            time_filter: selectedTimeFilter.value,
            sort_filter: selectedSortFilter.value
        })

    axios.get(apiRoute)
    .then((response) => {
        // 过滤不当内容
        const filteredData = filterContent(response.data.data.data)

        items.splice(0, items.length)
        items.push(...filteredData)
        totalItems.value = response.data.data.total
        page.value = response.data.data.current_page
        if (response.data.data.current_page > response.data.data.last_page) {
            page.value = response.data.data.last_page
        }
        totalPage.value = response.data.data.last_page
        loading.value = false
        searchLoading.value = false
        updateUrlParams()
    })
    .catch((error) => {
        loading.value = false
        searchLoading.value = false
        console.error('Failed to load videos:', error)
    })
}

// 加载更多
const handleLoadMore = () => {
    if (isLoadingMore.value) return

    isLoadingMore.value = true
    const nextPage = page.value + 1

    axios.get(route('api.online.video', {
        text: searchText.value,
        page: nextPage,
        per_page: perPage.value,
        type: selectedType.value,
        source: selectedSource.value,
        time_filter: selectedTimeFilter.value
    }))
    .then((response) => {
        // 过滤不当内容
        const filteredData = filterContent(response.data.data.data)

        items.push(...filteredData)
        totalItems.value = response.data.data.total
        page.value = response.data.data.current_page
        if (response.data.data.current_page > response.data.data.last_page) {
            page.value = response.data.data.last_page
        }
        totalPage.value = response.data.data.last_page
        isLoadingMore.value = false
        updateUrlParams()
    })
    .catch((error) => {
        isLoadingMore.value = false
        console.error('Failed to load more videos:', error)
    })
}

// 切换新窗口打开设置
const toggleNewTabSetting = () => {
    openInNewTab.value = !openInNewTab.value
    localStorage.setItem('online_video_new_tab', openInNewTab.value.toString())

    // 显示提示
    ElMessage({
        message: openInNewTab.value ? '已开启新窗口打开' : '已关闭新窗口打开',
        type: 'success',
        duration: 2000
    })
}

// 切换收藏视图
const toggleFavoritesView = () => {
    showFavorites.value = !showFavorites.value
    page.value = 1

    // 如果切换到收藏视图，重置所有筛选条件
    if (showFavorites.value) {
        selectedType.value = null
        selectedSource.value = null
        selectedTimeFilter.value = 'all'
        selectedSortFilter.value = 'latest'
        searchText.value = ''
    }

    // 更新 URL
    const url = new URL(window.location)
    if (showFavorites.value) {
        url.searchParams.set('favorites', '1')
        // 清除所有其他筛选参数
        url.searchParams.delete('type')
        url.searchParams.delete('source')
        url.searchParams.delete('time_filter')
        url.searchParams.delete('sort_filter')
        url.searchParams.delete('search')
    } else {
        url.searchParams.delete('favorites')
    }
    window.history.pushState({}, '', url)

    // 重新加载数据
    goToPage(1)
}

// 处理窗口大小变化
const handleResize = () => {
    windowWidth.value = window.innerWidth
}
const scrollToTop = () => {
    const paginationElement = document.getElementById('first-pagination');
    if (paginationElement) {
        paginationElement.scrollIntoView({
            behavior: 'instant',
            block: 'start'
        });
    } else {
        // Fallback to top if element not found
        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });
    }
};
const handleBotPagination = (newPage) => {
    handlePageChange(newPage)
    scrollToTop();
}
// 滚动到锚点
const scrollToAnchor = (instant = false) => {
    const urlParams = new URLSearchParams(window.location.search)
    const anchorId = urlParams.get('anchor')
    if (anchorId) {
        const element = document.getElementById(`video-${anchorId}`)
        if (element) {
            // 使用 requestAnimationFrame 确保在下一帧执行，避免布局问题
            requestAnimationFrame(() => {
                element.scrollIntoView({
                    behavior: instant ? 'instant' : 'smooth',
                    block: 'center'
                })
            })
        } else if (page.value < totalPage.value && !isLoadingMore.value) {
            // 如果元素不存在且还有更多页，自动加载更多
            handleLoadMore()
        }
    }
}

// 处理浏览器前进/后退
const handlePopState = () => {
    // 浏览器返回时使用即时跳转
    scrollToAnchor(true)
}

// 处理滚动事件
const handleScroll = () => {
    // 如果正在加载，不处理
    // if (isLoadingMore.value) return
    //
    // // 检查是否已经加载完所有页
    // if (page.value >= totalPage.value) return
    //
    // // 获取滚动位置
    // const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    // const windowHeight = window.innerHeight
    // const documentHeight = document.documentElement.scrollHeight
    //
    // // 根据屏幕大小调整触发距离
    // const isMobileDevice = window.innerWidth < 640
    // const triggerDistance = isMobileDevice ? 1500 : 500  // 手机端提前1500px触发，桌面端500px
    //
    // // 如果滚动到底部附近
    // if (scrollTop + windowHeight >= documentHeight - triggerDistance) {
    //     handleLoadMore()
    // }
}

// 防抖的滚动处理
const handleScrollDebounced = debounce(handleScroll, 200)

// 处理图片加载，动态调整显示方式
const handleImageLoad = (event, item) => {
    // el-image 组件的 load 事件中，event 就是原生的 Event 对象
    // 需要通过 event.target 获取实际的 img 元素
    const img = event.target
    if (!img || !img.naturalWidth) return

    // 获取图片的自然宽高
    const naturalWidth = img.naturalWidth
    const naturalHeight = img.naturalHeight

    // 计算图片的宽高比
    const imageRatio = naturalWidth / naturalHeight
    const containerRatio = 16 / 9 // 容器的宽高比

    // 判断图片是否会被严重裁剪
    if (imageRatio > containerRatio * 1.3 || imageRatio < containerRatio * 0.7) {
        // 图片比例与容器差异较大，使用 contain 避免重要内容被裁剪
        imageFitModes[item.id] = 'contain'
    } else {
        // 图片比例合适，使用 cover 填充
        imageFitModes[item.id] = 'cover'
    }
}

// 初始化
onMounted(() => {
    window.addEventListener('resize', handleResize)
    window.addEventListener('popstate', handlePopState)
    window.addEventListener('scroll', handleScrollDebounced)

    // 检查 URL 参数是否有 favorites
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('favorites') === '1') {
        showFavorites.value = true
    }

    // 初始加载时不重置筛选器，直接获取设置和加载数据
    getOnlineVideoSetting()
    goToPage()
    // 确保 URL 参数与当前状态同步
    updateUrlParams()

    // 初始检查锚点，如果是从其他页面返回，使用即时跳转
    setTimeout(() => {
        // 检查是否是从其他页面返回（通过 referrer 或 navigation type）
        const isReturning = document.referrer && document.referrer.includes('online-video-details')
        scrollToAnchor(isReturning)
    }, 300)
})

// 清理
onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('popstate', handlePopState)
    window.removeEventListener('scroll', handleScrollDebounced)
})
</script>

<style scoped>
.line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

/* Ensure el-image fills container without gaps */
:deep(.el-image) {
    display: block;
    width: 100%;
    height: 100%;
}

:deep(.el-image__inner) {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

:deep(.el-image__placeholder),
:deep(.el-image__error) {
    background: transparent;
}

/* 脉冲动画优化 - 减缓频率 */
@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.8;
    }
}

.animate-pulse {
    animation: pulse 3s ease-in-out infinite;
}

/* 弹窗动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-fade-enter-from .relative,
.modal-fade-leave-to .relative {
    transform: scale(0.95);
}
</style>
