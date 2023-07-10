import { getUser, isLoggedIn} from "@/services/auth";

export async function canUserAccess(route) {
    const requiresAdminAccess = route.meta.requiresAdminAccess;
    const requiresAuth = route.meta.requiresAuth;
    const requiresMerchantAccess = route.meta.requiresMerchantAccess;

    console.log("require auth", requiresAuth);
    console.log("auth", isLoggedIn());
    console.log("result can", requiresAuth && isLoggedIn());

    if (requiresAdminAccess) {
        const user = await getUser();
        return user && user.role === "admin" ? true : "/forbidden";
    }
    if (requiresMerchantAccess) {
        const user = await getUser();
        return user && user.role === "merchant" ? true : "/forbidden";
    }
    if (requiresAuth) {
        if (isLoggedIn() === true) {
            return true;
        }
        return "/login";
    }
    return true;
}