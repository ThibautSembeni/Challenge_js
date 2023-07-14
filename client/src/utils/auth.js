import { getCurrentUser, isLoggedIn} from "@/services/auth";

export async function canUserAccess(route) {
    const requiresAdminAccess = route.meta.requiresAdminAccess;
    const requiresAuth = route.meta.requiresAuth;
    const requiresMerchantAccess = route.meta.requiresMerchantAccess;

    if (requiresAdminAccess) {
        const user = await getCurrentUser();
        return user && user.role === "admin" ? true : "/404";
    }
    if (requiresMerchantAccess) {
        const user = await getCurrentUser();
        return user && user.role === "merchant" ? true : "/404";
    }
    if (requiresAuth) {
        if (isLoggedIn() === true) {
            return true;
        }
        return "/login";
    }
    return true;
}