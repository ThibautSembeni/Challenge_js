import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from "../views/LoginView.vue";
import PaymentView from "@/views/PaymentView.vue";
import PaymentDetailView from "@/views/PaymentDetailView.vue";
import CustomersView from "@/views/CustomersView.vue";
import CustomerDetailView from "@/views/CustomerDetailView.vue";

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/paiements',
    name: 'payments',
    component: PaymentView
  },
  {
    path: '/paiement/:reference',
    name: 'paymentDetail',
    component: PaymentDetailView
  },
  {
    path: '/clients',
    name: 'customers',
    component: CustomersView
  },
  {
    path: '/client/:id',
    name: 'customerDetail',
    component: CustomerDetailView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
