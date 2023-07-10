import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import PaymentView from '@/views/PaymentsView.vue'
import PaymentDetailView from '@/views/PaymentDetailView.vue'
import CustomersView from '@/views/CustomersView.vue'
import CustomerDetailView from '@/views/CustomerDetailView.vue'
import ProductsView from '@/views/ProductsView.vue'
import ProductDetailView from '@/views/ProductDetailView.vue'
import ProductCreateView from '@/views/ProductCreateView.vue'
import {canUserAccess} from "@/utils/auth";
import ForbiddenView from "@/views/Erros/ForbiddenView.vue";
import NotFoundView from "@/views/Erros/NotFoundView.vue";
import DashboardView from "@/views/Admin/DashboardView.vue";
import UsersView from "@/views/Admin/UsersView.vue";
import UsersDetails from "@/views/Admin/ShowUserView.vue";
import PendingUsers from "@/views/Admin/PendingUsers.vue";
import EditUserView from "@/views/Admin/EditUserView.vue";

const customerRoutes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: {requiresAuth: true}
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: {requiresAuth: false}
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/RegisterView.vue'),
        meta: {requiresAuth: false}
    },
    {
        path: '/paiements',
        name: 'payments',
        component: PaymentView,
        meta: {requiresAuth: true}
    },
    {
        path: '/paiement/:reference',
        name: 'paymentDetail',
        component: PaymentDetailView,
        meta: {requiresAuth: true}
    },
    {
        path: '/clients',
        name: 'customers',
        component: CustomersView,
        meta: {requiresAuth: true}
    },
    {
        path: '/client/:id',
        name: 'customerDetail',
        component: CustomerDetailView,
        meta: {requiresAuth: true}
    },
    {
        path: '/produits',
        name: 'products',
        component: ProductsView,
        meta: {requiresAuth: true}
    },
    {
        path: '/produit/ajouter',
        name: 'productAdd',
        component: ProductCreateView,
        meta: {requiresAuth: true}
    },
    {
        path: '/produit/:reference',
        name: 'productDetail',
        component: ProductDetailView,
        meta: {requiresAuth: true}
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
        meta: {requiresAuth: true, requiresAdminAccess: true}
    },
    {
        path: '/admin/users',
        name: 'adminUsers',
        meta: { requiresAuth: true, requiresAdminAccess: true },
        children: [
            {
                path: '',
                name: 'UsersView',
                component: UsersView
            },
            {
                path: ':userId(\\d+)',
                name: 'adminUserDetails',
                component: UsersDetails
            },
            {
                path: 'edit/:userId(\\d+)',
                name: 'editUser',
                component: EditUserView
            },
            {
                path: 'pending',
                name: 'adminPendingUsers',
                component: PendingUsers
            }

        ]
    }
]

const errorRoutes = [
    {
        path: '/forbidden',
        name: 'forbidden',
        component: ForbiddenView
    },
    {
        path: '/:catchAll(.*)',
        name: 'notFound',
        component: NotFoundView
    },
];

const routes = [
    ...errorRoutes,
    ...customerRoutes,
    ...adminRoutes
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach(async (to, from, next) => {
    const canAccess = await canUserAccess(to)
    console.log("can", canAccess)
    if (canAccess !== true) {
        next(canAccess);
    } else {
        next();
    }
})


export default router
