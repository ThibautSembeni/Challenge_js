import {createRouter, createWebHistory} from 'vue-router'
import LoginView from '../views/auth/LoginView.vue'
import {canUserAccess} from '@/utils/auth'
import ForbiddenView from '@/views/errors/ForbiddenView.vue'
import NotFoundView from '@/views/errors/NotFoundView.vue'
import LogoutView from '@/views/auth/LogoutView.vue'
import DashboardMerchant from '@/views/merchant/DashboardMerchant.vue'
import RegisterView from "@/views/auth/RegisterView.vue";
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
        component: RegisterView,
        meta: { requiresAuth: false }
    },
    {
        path: '/logout',
        name: 'logout',
        component: LogoutView,
        meta: { requiresAuth: false }
    }
]

const customerRoutes = [
    {
        path: '/',
        name: 'productsFront',
        component: ProductsView,
    },
]

const merchantRoutes = [
    {
        path: '/merchant',
        name: 'merchant',
        component: DashboardMerchant,
        meta: {requiresAuth: true, requiresMerchantAccess: true}
    }
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

const routes = [...authRoutes, ...customerRoutes, ...merchantRoutes, ...errorRoutes]

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
