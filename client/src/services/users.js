import httpClient from '@/services/httpClient'
import {fetchUser} from "@/services/auth";
import router from "@/router";

export async function getAllUsers() {
    const response = await httpClient.get('/users');
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de l'approbation du marchand`);
    }
}

export async function getAllUsersToMerchant() {
    const response = await httpClient.get('/users/user/customers');
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`Error: ${response.status} - Une erreur s'est produite`);
    }
}

export async function getUserById(id) {
    const response = await httpClient.get(`/users/${id}`);
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de l'approbation du marchand`);
    }
}

export async function updateUser(id, user) {
    const response = await httpClient.patch(`/users/${id}`, user)
    if (response.status === 200) {
        await fetchUser()
        return response.data;
    } else {
        throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de l'approbation du marchand`);
    }
}

export function deleteUser(id) {
    return httpClient.delete(`/users/${id}`)
}

export async function impersonateUser(merchantId) {
    const response = await httpClient.post('/users/admin/impersonate', { merchantId });
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de l'usurpation de l'utilisateur`);
    }
}

export async function stopImpersonatingUser() {
    const response = await httpClient.get('/users/admin/stopImpersonating');
    if (response.status === 200) {
        return router.push({ name: 'adminDashboard' })
    } else {
        throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de l'arrêt de l'usurpation d'utilisateur`);
    }
}

export async function isConnectedByImpersonation() {
    const response = await httpClient.get('/users/admin/impersonate');
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de l'usurpation de l'utilisateur`);
    }
}