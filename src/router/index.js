import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePageStateStore } from '@/stores/pageState'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/latest',
      name: 'latest',
      component: () => import('../views/LatestView.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue')
    },
    {
      path: '/chapter/:id',
      name: 'chapter',
      component: () => import('../views/ChapterView.vue')
    },
    {
      path: '/collection',
      name: 'collection',
      component: () => import('../views/CollectionView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/reading-history',
      name: 'reading-history',
      component: () => import('../views/ReadingHistoryView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/bookmarks',
      name: 'bookmarks',
      component: () => import('../views/BookmarksView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: () => import('../views/CatalogView.vue')
    },
    {
      path: '/updates',
      name: 'updates',
      component: () => import('../views/UpdatesView.vue')
    },
    {
      path: '/albums-test',
      name: 'albums-test',
      component: () => import('../views/AlbumsTestView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/AuthView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/AuthView.vue')
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/AuthView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/vip',
      name: 'vip',
      component: () => import('../views/VipView.vue')
    },
    {
      path: '/recharge-history',
      name: 'recharge-history',
      component: () => import('../views/RechargeHistoryView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('../views/TermsView.vue')
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('../views/PrivacyView.vue')
    },
    {
      path: '/app-download',
      name: 'app-download',
      component: () => import('../views/AppDownloadView.vue')
    },
    {
      path: '/admin/payment-analysis',
      name: 'admin-payment',
      component: () => import('../views/AdminPaymentView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫 - 保存页面状态和检查认证
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const pageStateStore = usePageStateStore()
  
  // Save scroll position when leaving a page
  if (from.name) {
    pageStateStore.saveScrollPosition(from.fullPath)
  }
  
  // 如果路由需要认证
  if (to.meta.requiresAuth) {
    // 如果还没有初始化认证状态，先初始化
    if (!authStore.authInitialized) {
      await authStore.initAuth()
    }
    
    // 检查是否已登录
    if (authStore.isLoggedIn) {
      // 如果需要管理员权限
      if (to.meta.requiresAdmin && !authStore.user?.is_admin) {
        next({ path: '/' })
      } else {
        next()
      }
    } else {
      // 未登录，重定向到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else if (to.path === '/login' || to.path === '/register') {
    // 如果已登录，访问登录或注册页面时重定向到首页
    if (!authStore.authInitialized) {
      await authStore.initAuth()
    }
    
    if (authStore.isLoggedIn) {
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    // 不需要认证的页面，直接放行
    next()
  }
})

// After navigation hook - restore scroll position
router.afterEach((to, from) => {
  const pageStateStore = usePageStateStore()
  
  // Small delay to ensure DOM is ready
  setTimeout(() => {
    // Try to restore scroll position
    const restored = pageStateStore.restoreScrollPosition(to.fullPath)
    if (!restored) {
      // If no saved position, scroll to top
      window.scrollTo(0, 0)
    }
  }, 100)
  
  // Clean old states periodically
  pageStateStore.clearOldStates()
})

export default router
