import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/auth/LoginView.vue'
import PaymentView from '@/views/transactions/PaymentsView.vue'
import PaymentDetailView from '@/views/transactions/PaymentDetailView.vue'
import CustomersView from '@/views/CustomersView.vue'
import CustomerDetailView from '@/views/CustomerDetailView.vue'
import ProductsView from '@/views/products/ProductsView.vue'
import ProductDetailView from '@/views/products/ProductDetailView.vue'
import ProductUpdateView from '@/views/products/ProductUpdateView.vue'
import ProductCreateView from '@/views/products/ProductCreateView.vue'
import { canUserAccess } from '@/utils/auth'
import ForbiddenView from '@/views/errors/ForbiddenView.vue'
import NotFoundView from '@/views/errors/NotFoundView.vue'
import DashboardView from '@/views/admin/DashboardView.vue'
import UsersView from '@/views/admin/UsersView.vue'
import PendingMerchants from '@/views/admin/PendingMerchants.vue'
import LogoutView from '@/views/auth/LogoutView.vue'
import ProfileView from '@/views/auth/ProfileView.vue'
import PaymentCreateView from '@/views/transactions/PaymentCreateView.vue'
import ForgotPassword from '@/views/auth/ForgotPassword.vue'
import ResetPassword from '@/views/auth/ResetPassword.vue'
import PaymentCapture from "@/views/customer/PaymentCapture.vue";
import VerifyAccount from "@/views/auth/VerifyAccount.vue";
import PendingVerificationView from "@/views/errors/PendingVerificationView.vue";

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
  },
  {
    path: '/auth/complete-register/:token',
    name: 'verifyAccount',
    component: VerifyAccount,
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
    path: '/payment/capture/:reference',
    name: 'capturePayment',
    component: PaymentCapture,
    meta: { requiresAuth: false }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  }
]

const adminRoutes = [
  {
    path: '/admin',
    name: 'adminDashboard',
    component: DashboardView,
    meta: { requiresAuth: true, requiresAdminAccess: true }
  },
  {
    path: '/admin/users',
    name: 'UsersView',
    component: UsersView,
    meta: { requiresAuth: true, requiresAdminAccess: true }
  },
  {
    path: '/admin/users/pending',
    name: 'adminPendingUsers',
    component: PendingMerchants,
    meta: { requiresAuth: true, requiresAdminAccess: true }
  },
]

const merchantRoutes = [
  {
    path: '/paiements',
    name: 'payments',
    component: PaymentView,
    meta: { requiresAuth: true, requiresMerchantAccess: true }
  },
  {
    path: '/paiement/ajouter',
    name: 'transactionAdd',
    component: PaymentCreateView,
    meta: { requiresAuth: true, requiresMerchantAccess: true }
  },
  {
    path: '/paiement/:reference',
    name: 'paymentDetail',
    component: PaymentDetailView,
    meta: { requiresAuth: true, requiresMerchantAccess: true }
  },
  {
    path: '/clients',
    name: 'customers',
    component: CustomersView,
    meta: { requiresAuth: true, requiresMerchantAccess: true }
  },
  {
    path: '/client/:id',
    name: 'customerDetail',
    component: CustomerDetailView,
    meta: { requiresAuth: true, requiresMerchantAccess: true }
  },
  {
    path: '/produits',
    name: 'products',
    component: ProductsView,
    meta: { requiresAuth: true, requiresMerchantAccess: true }
  },
  {
    path: '/produit/ajouter',
    name: 'productAdd',
    component: ProductCreateView,
    meta: { requiresAuth: true, requiresMerchantAccess: true }
  },
  {
    path: '/produit/:reference',
    name: 'productDetail',
    component: ProductDetailView,
    meta: { requiresAuth: true, requiresMerchantAccess: true }
  },
  {
    path: '/produit/:reference/update',
    name: 'productUpdate',
    component: ProductUpdateView,
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
    path: '/pending-verification',
    name: 'PendingVerification',
    component: PendingVerificationView
  },
  {
    path: '/:catchAll(.*)',
    name: 'notFound',
    component: NotFoundView
  }
]

const routes = [...authRoutes, ...adminRoutes, ...merchantRoutes, ...customerRoutes, ...errorRoutes]

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
// router.afterEach(async (to, from, next) => {
//   await check()
//   // next()
// })
export default router
