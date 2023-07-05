import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import PaymentView from '@/views/PaymentView.vue'
import PaymentDetailView from '@/views/PaymentDetailView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false },

  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
    meta: { requiresAuth: false },

  },
  {
    path: '/paiements',
    name: 'payments',
    component: PaymentView,
    meta: { requiresAuth: true },

  },
  {
    path: '/paiement/:uuid',
    name: 'paymentDetail',
    component: PaymentDetailView,
    meta: { requiresAuth: true },

  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  let isAuthenticated = false;
  if (from.name !== 'login' || from.name !== 'register') {
    isAuthenticated = await auth();
  }

  if (to.meta.requiresAuth && !isAuthenticated) next({ name: 'login' })
  else next()

});

const auth = async () => {

  const response = await fetch(`${import.meta.env.VITE_API_URL}/check`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    }
  })

  if (response.ok) {
    return true
  } else {
    return false
  }


}



export default router
