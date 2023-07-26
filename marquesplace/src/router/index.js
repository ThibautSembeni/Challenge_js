import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/auth/LoginView.vue'

import { canUserAccess } from '@/utils/auth'
import ForbiddenView from '@/views/errors/ForbiddenView.vue'
import NotFoundView from '@/views/errors/NotFoundView.vue'

import LogoutView from '@/views/auth/LogoutView.vue'
import DashboardMerchant from '@/views/merchant/DashboardMerchant.vue'
import SetupMerchant from '@/views/merchant/SetupMerchant.vue'
import ProfileView from '@/views/auth/ProfileView.vue'
import PaymentCreateView from '@/views/transactions/PaymentCreateView.vue'
import PaymentUpdateView from '@/views/transactions/PaymentUpdateView.vue'
import ForgotPassword from '@/views/auth/ForgotPassword.vue'
import ResetPassword from '@/views/auth/ResetPassword.vue'
import ShoppingCartView from '@/views/customer/ShoppingCartView.vue'
import ProductsView from "@/views/customer/ProductsView.vue";

const authRoutes = [
  {
    path: '/auth/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/auth/register',
    name: 'register',
    component: () => import('../views/auth/RegisterView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/logout',
    name: 'logout',
    component: LogoutView,
    meta: { requiresAuth: false }
  },
  {
    path: '/auth/forgot-password',
    name: 'forgotPassword',
    component: ForgotPassword,
    meta: { requiresAuth: false }
  },
  {
    path: '/auth/reset-password/:token',
    name: 'resetPassword',
    component: ResetPassword,
    meta: { requiresAuth: false }
  }
]

const customerRoutes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/panier',
    name: 'panier',
    component: ShoppingCartView,
    meta: { requiresAuth: false }
  },
  {
    path: '/products',
    name: 'products',
    component: ProductsView,
    meta: { requiresAuth: false }
  }
]


const merchantRoutes = [
  {
    path: '/merchant',
    name: 'merchant',
    component: DashboardMerchant,
    meta: { requiresAuth: true, requiresMerchantAccess: true }
  },
  {
    path: '/merchant/setup',
    name: 'setupMerchant',
    component: SetupMerchant,
    meta: { requiresAuth: true, requiresMerchantAccess: true }
  },
]

const errorRoutes = [
  {
    path: '/404',
    name: '404',
    component: ForbiddenView
  },
  {
    path: '/:catchAll(.*)',
    name: 'notFound',
    component: NotFoundView
  }
]

const routes = [...authRoutes,  ...merchantRoutes, ...customerRoutes, ...errorRoutes]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const canAccess = await canUserAccess(to)
  if (canAccess !== true) {
    next(canAccess)
  } else {
    next()
  }
})

export default router
