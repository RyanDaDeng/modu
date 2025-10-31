<template>
    <AppLayout :loading="loading" :header="props.item.name" :isCenter="false" :showDanmu="false" :showBreadcrumbs="true" :breadcrumbs="breadcrumbs">
        <template #title>
            <Head>
                <title>{{ props.item.name }}</title>
            </Head>
        </template>

        <template #body>


            <div>
                <!-- 主内容区域 -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- 左侧视频播放区域 -->
                    <div class="lg:col-span-2">
                        <!-- 浏览器推荐 - 放在视频上方 -->
                        <div class="flex items-start mb-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg p-3">
                            <svg class="w-5 h-5 text-blue-600 dark:text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                            </svg>
                            <div class="ml-3 flex-1">
                                <p class="text-sm text-gray-700 dark:text-gray-300">
                                    <span class="font-medium">说明：</span>如果遇到无法观看的情况，推荐使用谷歌浏览器（Chrome）获得最佳体验。
                                    <a href="https://www.google.cn/chrome/" target="_blank" rel="noopener noreferrer"
                                       class="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline ml-1">
                                        <span>下载谷歌浏览器</span>
                                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                                        </svg>
                                    </a>
                                </p>
                            </div>
                        </div>
                        <!-- 视频播放器 -->
                        <div class="bg-black rounded-lg overflow-hidden shadow-lg">
                            <div v-if="is_vip" class="relative aspect-video">
                                <iframe
                                    :src="'/video-parser?url=' + options.src + '&source=' + item.source + '&img=' + item.cover_img"
                                    class="w-full h-full"
                                    allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
                                    frameborder="0">
                                </iframe>
                            </div>
                            <div v-else class="relative aspect-video bg-gray-900 flex items-center justify-center">
                                <div class="text-center p-8">
                                    <svg class="w-20 h-20 mx-auto mb-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
                                    </svg>
                                    <h3 class="text-xl font-semibold text-white mb-2">请购买视频卡！</h3>
                                    <p class="text-gray-400 mb-6">购买视频卡锁完整视频</p>
                                    <div class="space-y-3">
                                        <button @click="getVip()"
                                            class="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105">
                                            立即购买视频卡
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 温馨提醒 - 简化版 -->
                        <div class="flex items-center mt-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-lg p-3">
                            <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                            </svg>
                            <p class="text-sm text-gray-700 dark:text-gray-300">
                                <span class="font-medium">温馨提醒：</span>请勿相信任何视频内的广告信息，谨防上当受骗！
                            </p>
                        </div>
                        <!-- 视频信息 -->
                        <div class="mt-4 bg-white dark:bg-dark-second rounded-lg shadow p-4 sm:p-6">
                            <!-- 桌面版：大标题区域 -->
                            <div class="hidden sm:block">
                                <!-- 分类标签 -->
                                <div class="mb-3">
                                    <span class="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm px-3 py-1 rounded-full">
                                        {{props.item.type_name}}
                                    </span>
                                </div>
                                <!-- 大标题 -->
                                <div class="mb-4">
                                    <div v-if="!isEditingTitle" class="flex items-start gap-2">
                                        <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-dark-txt break-words flex-1">
                                            {{ props.item.name }}
                                        </h1>
                                        <!-- 管理员编辑按钮 -->
                                        <button v-if="$page.props.auth.user?.is_admin"
                                            @click="startEditTitle"
                                            class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                            title="编辑标题">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    <!-- 编辑模式 -->
                                    <div v-else class="flex items-start gap-2">
                                        <input v-model="editedTitle"
                                            @keyup.enter="saveTitle"
                                            @keyup.escape="cancelEditTitle"
                                            class="flex-1 text-2xl lg:text-3xl font-bold bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-dark-txt"
                                            placeholder="输入新标题"
                                            autofocus>
                                        <button @click="saveTitle"
                                            class="p-2 text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400">
                                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </button>
                                        <button @click="cancelEditTitle"
                                            class="p-2 text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400">
                                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <!-- 视频元信息 -->
                                <div class="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-6">
                                    <span class="flex items-center gap-1.5">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                                        </svg>
                                        {{ formatViewCount(props.item.views) }} 次播放
                                    </span>
                                    <span class="flex items-center gap-1.5">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                                        </svg>
                                        {{ dayjs(props.item.created_at).format('YYYY年MM月DD日') }}
                                    </span>
                                    <span class="flex items-center gap-1.5">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
                                        </svg>
                                        {{ formatViewCount(props.item.comments_count || 0) }} 评论
                                    </span>
                                </div>
                            </div>

                            <!-- 移动版：紧凑标题区域 -->
                            <div class="sm:hidden">
                                <!-- 分类标签 -->
                                <div class="mb-2">
                                    <span class="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-2 py-0.5 rounded">
                                        {{props.item.type_name}}
                                    </span>
                                </div>
                                <!-- 标题 -->
                                <div class="mb-2">
                                    <div v-if="!isEditingTitle" class="flex items-start gap-1">
                                        <h1 class="text-base font-bold text-gray-900 dark:text-dark-txt break-words leading-tight flex-1">
                                            {{ props.item.name }}
                                        </h1>
                                        <!-- 管理员编辑按钮 -->
                                        <button v-if="$page.props.auth.user?.is_admin"
                                            @click="startEditTitle"
                                            class="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                            title="编辑标题">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    <!-- 编辑模式 -->
                                    <div v-else class="flex items-start gap-1">
                                        <input v-model="editedTitle"
                                            @keyup.enter="saveTitle"
                                            @keyup.escape="cancelEditTitle"
                                            class="flex-1 text-base font-bold bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-dark-txt"
                                            placeholder="输入新标题"
                                            autofocus>
                                        <button @click="saveTitle"
                                            class="p-1 text-green-600 hover:text-green-700">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </button>
                                        <button @click="cancelEditTitle"
                                            class="p-1 text-red-600 hover:text-red-700">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <!-- 元信息 - 显示播放量、收藏和评论 -->
                                <div class="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                                    <span class="flex items-center gap-1">
                                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                                        </svg>
                                        {{ formatViewCount(props.item.views) }}
                                    </span>
                                    <span class="text-gray-400">•</span>
                                    <span class="flex items-center gap-1">
                                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                                        </svg>
                                        {{ formatViewCount(props.item.favorites_count || 0) }}
                                    </span>
                                    <span class="text-gray-400">•</span>
                                    <span class="flex items-center gap-1">
                                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
                                        </svg>
                                        {{ formatViewCount(props.item.comments_count || 0) }}
                                    </span>
                                    <span class="text-gray-400">•</span>
                                    <span>{{ dayjs(props.item.created_at).fromNow() }}</span>
                                </div>
                            </div>

                            <!-- 操作按钮区域 -->
                            <div class="flex flex-col gap-3 border-t dark:border-gray-700 pt-4">
                                <!-- 收藏数显示 - 移动端和桌面端 -->
                                <div class="flex items-center justify-center sm:justify-start gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                                    <svg class="w-4 h-4" :fill="isFavorited ? 'currentColor' : 'none'" :stroke="isFavorited ? 'none' : 'currentColor'" stroke-width="2" viewBox="0 0 20 20">
                                        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                                    </svg>
                                    {{ formatViewCount(favoritesCount) }} 人收藏
                                </div>

                                <!-- 操作按钮 - 移动端2x2网格，桌面端单行 -->
                                <div class="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
                                    <!-- 收藏按钮 -->
                                    <button @click="toggleFavorite"
                                        :class="[
                                            'px-3 sm:px-4 py-2.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2',
                                            isFavorited
                                                ? 'bg-pink-500 text-white hover:bg-pink-600'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        ]">
                                        <svg class="w-4 h-4" :fill="isFavorited ? 'currentColor' : 'none'" :stroke="isFavorited ? 'none' : 'currentColor'" stroke-width="2" viewBox="0 0 20 20">
                                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                                        </svg>
                                        <span class="hidden sm:inline">{{ isFavorited ? '已收藏' : '收藏' }}</span>
                                        <span class="sm:hidden">{{ isFavorited ? '已收藏' : '收藏' }}</span>
                                    </button>

                                    <!-- 下载按钮 -->
                                    <button v-if="is_vip" @click="downloadVideo"
                                        class="px-3 sm:px-4 py-2.5 sm:py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs sm:text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                                        </svg>
                                        <span class="hidden sm:inline">下载视频</span>
                                        <span class="sm:hidden">下载</span>
                                    </button>

                                    <!-- 分享按钮 -->
                                    <button v-if="is_vip" @click="open"
                                        class="px-3 sm:px-4 py-2.5 sm:py-2 bg-blue-500 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1.5 sm:gap-2">
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                                        </svg>
                                        <span class="hidden sm:inline">分享到广场</span>
                                        <span class="sm:hidden">分享</span>
                                    </button>

                                    <!-- 管理员删除按钮 -->
                                    <button v-if="$page.props.auth.user?.is_admin"
                                        @click="deleteVideo"
                                        class="px-3 sm:px-4 py-2.5 sm:py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs sm:text-sm rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2">
                                        <span class="hidden sm:inline">删除视频</span>
                                        <span class="sm:hidden">删除</span>
                                    </button>
                                </div>
                            </div>

                            <!-- 视频简介 -->
                            <div v-if="props.item.description" class="border-t dark:border-gray-700 pt-4 mt-6">
                                <h3 class="text-sm font-medium text-gray-900 dark:text-dark-txt mb-2">视频简介</h3>
                                <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {{ props.item.description || '暂无简介' }}
                                </p>
                            </div>
                        </div>
                        <!-- 紧凑的提示信息区 -->
                        <div class="mt-4 space-y-3">

                            <!-- 域名信息和社交媒体 - 优化版 -->
                            <div class="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                                <div class="flex flex-col space-y-3">
                                    <!-- 域名和邮箱信息 -->
                                    <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                        <div class="flex items-center gap-2">
                                            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/>
                                            </svg>
                                            <span class="text-sm text-gray-700 dark:text-gray-300">
                                                永久域名：<a href="https://moxing.vip" target="_blank" class="font-medium text-blue-600 dark:text-blue-400 hover:underline">moxing.vip</a>
                                            </span>
                                        </div>
                                        <span class="hidden sm:inline text-gray-400">|</span>
                                        <span class="text-sm text-gray-600 dark:text-gray-400">
                                            找回邮箱：<span class="font-mono text-gray-700 dark:text-gray-300">moxingforever@gmail.com</span>
                                        </span>
                                    </div>

                                    <!-- 社交媒体链接 -->
                                    <div class="flex items-center gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <span class="text-sm text-gray-600 dark:text-gray-400">关注我们：</span>
                                        <div class="flex gap-2">
                                            <a target="_blank" href="https://twitter.com/moxing69"
                                               class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-black text-white rounded-full hover:bg-gray-800 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600">
                                                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                                </svg>
                                                <span>X (Twitter)</span>
                                            </a>
                                            <a target="_blank" href="https://t.me/moxing69"
                                               class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                                                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                                </svg>
                                                <span>Telegram</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 评论区 - 紧跟视频信息 -->
                        <div class="mt-4">
                            <VideoComments :video-id="props.item.id" />
                        </div>
                    </div>

                    <!-- 右侧推荐区域 -->
                    <div class="lg:col-span-1">
                        <!-- 推荐视频 -->
                        <div class="bg-white dark:bg-dark-second rounded-lg shadow p-4">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-dark-txt mb-4">相关推荐</h3>

                            <!-- 推荐视频列表 -->
                            <div class="space-y-4">
                                <!-- 推荐视频 -->
                                <a v-for="item in recommends"
                                   :key="item.id"
                                   :href="route('dashboard.online.video.details', { id: item.id })"
                                   class="group block">
                                    <div class="relative aspect-video bg-gray-200 dark:bg-dark-third rounded-lg overflow-hidden mb-2">
                                        <el-image
                                            v-if="item.cover_img"
                                            lazy
                                            :src="remoteAttachUrl2 + '/' + item.cover_img"
                                            fit="cover"
                                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        >
                                            <template #placeholder>
                                                <div class="w-full h-full flex items-center justify-center">
                                                    <svg class="animate-spin h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24">
                                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                </div>
                                            </template>
                                            <template #error>
                                                <div class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-dark-third">
                                                    <svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
                                                    </svg>
                                                </div>
                                            </template>
                                        </el-image>

                                        <!-- 悬停遮罩 -->
                                        <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div class="w-14 h-14 bg-black/60 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                                <svg class="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                                                </svg>
                                            </div>
                                        </div>

                                        <!-- 时长标签 -->
                                        <div v-if="item.duration" class="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-70 rounded text-xs text-white">
                                            {{ item.duration }}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 class="text-sm font-medium text-gray-900 dark:text-dark-txt line-clamp-2 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                            {{ item.name }}
                                        </h4>
                                        <div class="flex items-center gap-2 flex-wrap">
                                            <span v-if="item.type_name" class="text-xs px-2 py-0.5 bg-gray-100 dark:bg-dark-third text-gray-600 dark:text-gray-400 rounded">
                                                {{ item.type_name }}
                                            </span>
                                            <span class="text-xs text-gray-500 dark:text-gray-400">
                                                {{ formatViewCount(item.views || 0) }} 观看
                                            </span>
                                            <span v-if="item.created_at" class="text-xs text-gray-500 dark:text-gray-400">
                                                • {{ dayjs(item.created_at).fromNow() }}
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 删除确认框 -->
            <ConfirmationBox
                ref="deleteConfirmationBox"
                v-model:show="showDeleteConfirm"
                title="删除视频"
                message="确定要删除这个视频吗？此操作不可恢复。"
                confirm-text="确定删除"
                cancel-text="取消"
                type="error"
                icon="warning"
                loading-text="正在删除..."
                @confirm="confirmDelete"
                @cancel="showDeleteConfirm = false"
            />
        </template>
    </AppLayout>
</template>

<script setup>
import {ref, reactive, computed, onMounted} from 'vue'
import { Head, router, usePage } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'
import VideoComments from '@/Components/VideoComments.vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import { ElMessage } from 'element-plus'
import axios from 'axios';
import ConfirmationBox from '@/Components/ConfirmationBox.vue';

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const page = usePage()
const loading = ref(false)
const isEditingTitle = ref(false)
const editedTitle = ref('')
const showDeleteConfirm = ref(false)
const deleteConfirmationBox = ref(null)
const props = defineProps({
    item: Object,
    is_vip: Boolean,
    video_url: String,
    raw_url: String
})

// 收藏相关状态
const isFavorited = ref(props.item.is_favorited || false)
const favoritesCount = ref(props.item.favorites_count || 0)

const options = reactive({
    src: props.video_url,
    type: "m3u8"
})

const breadcrumbs = [
    {
        name: '在线视频',
        path: 'dashboard.online.video',
    },
    {
        name: props.item.name,
        path: null,
    }
]
const remoteAttachUrl2 = import.meta.env.VITE_REMOTE_ATTACH_URL_2

// 格式化浏览次数
const formatViewCount = (count) => {
    if (!count) return '0'
    if (count < 1000) return count.toString()
    if (count < 10000) return (count / 1000).toFixed(1) + 'k'
    return (count / 10000).toFixed(1) + 'w'
}

// 分享功能
const open = () => {
    ElMessageBox.prompt('请输入你的帖子内容', '分享视频', {
        confirmButtonText: '分享',
        cancelButtonText: '取消',
        inputValue: '大家好，这个视频感觉特别精彩！' + `\n` + props.item.name + `\n`,
        inputType: 'textarea'
    })
    .then(({ value }) => {
        loading.value = true
        axios.post(route("api.discuss.post", {
            text: value,
            post_type: 1,
            video_link: props.raw_url,
            price: null,
            price_type: null
        }))
        .then((response) => {
            loading.value = false
        })
        .catch((error) => {
            loading.value = false
        })
    })
    .catch(() => {})
}
// 内容过滤关键词
const bannedKeywords = ['幼女', '兽', '狗', '未成年', '小马']

// 内容过滤函数
const filterContent = (videoItems) => {
    return videoItems.filter(item => {
        if (!item.name) return true

        // 检查标题是否包含违禁关键词
        const title = item.name.toLowerCase()
        return !bannedKeywords.some(keyword => title.includes(keyword.toLowerCase()))
    })
}
const recommends = ref([]);
onMounted(() => {
    loadRecommend();
})
const loadRecommend = () => {
    axios.post(route("api.video.recommend", {
        type_name: props.item.type_name,
    }))
        .then((response) => {
            loading.value = false
            recommends.value = filterContent(response.data.data);
        })
        .catch((error) => {
            loading.value = false
        })
}

// 获取VIP
const getVip = () => {
    window.open('/store', '_blank')
}

// 切换收藏状态
const toggleFavorite = async () => {
    try {
        const response = await axios.post(route('api.online.video.favorite.toggle'), {
            video_id: props.item.id
        })

        if (response.data.success) {
            // 更新本地状态
            isFavorited.value = response.data.data.is_favorited
            favoritesCount.value = response.data.data.favorites_count

            ElMessage.success(response.data.data.message)
        }
    } catch (error) {
        console.error('收藏操作失败:', error)
        // axios 错误已被全局处理，无需再次提示
    }
}

// 编辑标题相关函数
const startEditTitle = () => {
    editedTitle.value = props.item.name
    isEditingTitle.value = true
}

const cancelEditTitle = () => {
    isEditingTitle.value = false
    editedTitle.value = ''
}

const saveTitle = async () => {
    if (!editedTitle.value.trim()) {
        ElMessage.error('标题不能为空')
        return
    }

    loading.value = true
    await axios.post(route('api.online-video.update-title', props.item.id), {
        name: editedTitle.value.trim()
    })

    // 更新本地数据
    props.item.name = editedTitle.value.trim()
    isEditingTitle.value = false
    ElMessage.success('标题更新成功')
    loading.value = false
}

// 删除视频
const deleteVideo = () => {
    showDeleteConfirm.value = true
}

// 确认删除
const confirmDelete = async () => {
    await axios.delete(route('api.online-video.delete', props.item.id))

    deleteConfirmationBox.value.setLoading(false)
    deleteConfirmationBox.value.close()

    ElMessage.success('视频已删除')
    // 跳转回视频列表页
    setTimeout(() => {
        router.visit(route('dashboard.online.video'))
    }, 1500)
}

// 下载视频功能
const downloadVideo = () => {
    const videoSrc = props.video_url

    // 对于 HLS 流，我们提供 m3u8 文件链接
    if (videoSrc && videoSrc.includes('.m3u8')) {
        // 创建一个文本文件包含 m3u8 链接和下载说明
        const textContent = `视频名称：${props.item.name}\n\n` +
            `视频流地址（M3U8）：\n${videoSrc}\n\n` +
            `下载说明：\n` +
            `1. 这是一个 HLS 流媒体地址\n` +
            `2. 您可以使用以下方法下载：\n` +
            `   - 使用 FFmpeg: ffmpeg -i "${videoSrc}" -c copy "${props.item.name}.mp4"\n` +
            `   - 使用在线工具搜索 "m3u8 downloader"\n` +
            `   - 使用浏览器插件如 "Stream Recorder" 或 "Video DownloadHelper"\n` +
            `   - 使用专门的下载软件如 IDM (Internet Download Manager)\n\n` +
            `注意：请遵守相关法律法规，仅供个人学习使用。`

        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${props.item.name}_下载信息.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        ElMessage.success('下载信息已生成，请查看下载的文本文件')
    } else {
        // 对于普通视频文件，直接下载
        const a = document.createElement('a')
        a.href = videoSrc
        a.download = `${props.item.name}.mp4`
        a.target = '_blank'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)

        ElMessage.success('开始下载视频')
    }
}
</script>

<style scoped>
.line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.aspect-video {
    aspect-ratio: 16 / 9;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: .5;
    }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
