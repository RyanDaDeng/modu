<template>
  <div class="lg:hidden fixed bottom-0 left-0 right-0 z-40">
    <!-- Glassmorphism background with gradient border -->
    <div class="absolute inset-0 bg-gray-900/80 backdrop-blur-xl border-t border-white/10"></div>
    
    <!-- Gradient top border -->
    <div class="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>
    
    <!-- Navigation Items -->
    <div class="relative grid grid-cols-6 h-20 pb-safe">
      <!-- Home -->
      <router-link
        to="/"
        class="group flex flex-col items-center justify-center py-3 transition-all duration-300 relative"
        :class="{ 'text-pink-400': $route.path === '/', 'text-gray-400': $route.path !== '/' }"
      >
        <!-- Active indicator -->
        <div v-if="$route.path === '/'" 
             class="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent"></div>
        
        <!-- Icon container with glow effect -->
        <div class="relative">
          <svg class="w-7 h-7 transition-transform group-active:scale-95" 
               :class="{ 'filter drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]': $route.path === '/' }"
               fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </div>
        <span class="text-xs mt-1.5 font-medium"
              :class="{ 'text-pink-400': $route.path === '/', 'text-gray-500': $route.path !== '/' }">
          首页
        </span>
      </router-link>
      
      <!-- Catalog -->
      <router-link
        to="/catalog"
        class="group flex flex-col items-center justify-center py-3 transition-all duration-300 relative"
        :class="{ 'text-purple-400': $route.path === '/catalog', 'text-gray-400': $route.path !== '/catalog' }"
      >
        <!-- Active indicator -->
        <div v-if="$route.path === '/catalog'" 
             class="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent"></div>
        
        <div class="relative">
          <svg class="w-7 h-7 transition-transform group-active:scale-95"
               :class="{ 'filter drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]': $route.path === '/catalog' }"
               fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
        </div>
        <span class="text-xs mt-1.5 font-medium"
              :class="{ 'text-purple-400': $route.path === '/catalog', 'text-gray-500': $route.path !== '/catalog' }">
          分类
        </span>
      </router-link>
      
      <!-- Search -->
      <router-link
        to="/search"
        class="group flex flex-col items-center justify-center py-3 transition-all duration-300 relative"
        :class="{ 'text-cyan-400': $route.path === '/search', 'text-gray-400': $route.path !== '/search' }"
      >
        <!-- Active indicator -->
        <div v-if="$route.path === '/search'" 
             class="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent"></div>
        
        <div class="relative">
          <svg class="w-7 h-7 transition-transform group-active:scale-95"
               :class="{ 'filter drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]': $route.path === '/search' }"
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <span class="text-xs mt-1.5 font-medium"
              :class="{ 'text-cyan-400': $route.path === '/search', 'text-gray-500': $route.path !== '/search' }">
          搜索
        </span>
      </router-link>
      
      <!-- Updates -->
      <router-link
        to="/updates"
        class="group flex flex-col items-center justify-center py-3 transition-all duration-300 relative"
        :class="{ 'text-blue-400': $route.path === '/updates', 'text-gray-400': $route.path !== '/updates' }"
      >
        <!-- Active indicator -->
        <div v-if="$route.path === '/updates'" 
             class="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent"></div>
        
        <div class="relative">
          <svg class="w-7 h-7 transition-transform group-active:scale-95"
               :class="{ 'filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]': $route.path === '/updates' }"
               fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
          </svg>
        </div>
        <span class="text-xs mt-1.5 font-medium"
              :class="{ 'text-blue-400': $route.path === '/updates', 'text-gray-500': $route.path !== '/updates' }">
          更新
        </span>
      </router-link>
      
      <!-- Latest -->
      <router-link
        to="/latest"
        class="group flex flex-col items-center justify-center py-3 transition-all duration-300 relative"
        :class="{ 'text-green-400': $route.path === '/latest', 'text-gray-400': $route.path !== '/latest' }"
      >
        <!-- Active indicator -->
        <div v-if="$route.path === '/latest'" 
             class="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent"></div>
        
        <div class="relative">
          <svg class="w-7 h-7 transition-transform group-active:scale-95"
               :class="{ 'filter drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]': $route.path === '/latest' }"
               fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </div>
        <span class="text-xs mt-1.5 font-medium"
              :class="{ 'text-green-400': $route.path === '/latest', 'text-gray-500': $route.path !== '/latest' }">
          最新
        </span>
      </router-link>
      
      <!-- Profile/My -->
      <router-link
        to="/profile"
        class="group flex flex-col items-center justify-center py-3 transition-all duration-300 relative"
        :class="{ 'text-yellow-400': $route.path === '/profile', 'text-gray-400': $route.path !== '/profile' }"
      >
        <!-- Active indicator -->
        <div v-if="$route.path === '/profile'" 
             class="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent"></div>
        
        <div class="relative">
          <svg class="w-7 h-7 transition-transform group-active:scale-95"
               :class="{ 'filter drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]': $route.path === '/profile' }"
               fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
        </div>
        <span class="text-xs mt-1.5 font-medium"
              :class="{ 'text-yellow-400': $route.path === '/profile', 'text-gray-500': $route.path !== '/profile' }">
          我的
        </span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
