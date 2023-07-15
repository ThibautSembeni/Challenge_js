import httpClient from '@/services/httpClient'
import {fetchUser} from "@/services/auth";

export async function getAllUsers() {
    const response = await httpClient.get('/users');
    if (response.status === 200) {
        return response.data;
    } else {
        throw new Error(`Error: ${response.status} - Une erreur s'est produite lors de l'approbation du marchand`);
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