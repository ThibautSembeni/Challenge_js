import {getCurrentUser, isLoggedIn} from '@/services/auth'

export async function canUserAccess(route) {
    const requiresAdminAccess = route.meta.requiresAdminAccess
    const requiresAuth = route.meta.requiresAuth
    const requiresMerchantAccess = route.meta.requiresMerchantAccess
    const user = await getCurrentUser()

    if (requiresAdminAccess) {
        return user && user.role === 'admin' ? true : '/404'
    }
    if (requiresMerchantAccess) {
        return user && (user.role === 'merchant' || user.role === 'admin') ? true : '/404'
    }
    if (requiresAuth) {
        if (isLoggedIn() === true) {
            return true
        }
        return '/auth/login'
    }
    return true
}
