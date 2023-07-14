import httpClient from "@/services/httpClient";

export function getUsers() {
    return httpClient.get('/users');
}

export function getUserById(id) {
    return httpClient.get(`/users/${id}`);
}

export function createUser(user) {
    return httpClient.post('/users', user);
}

export function updateUser(id, user) {
    return httpClient.put(`/users/${id}`, user);
}

export function deleteUser(id) {
    return httpClient.delete(`/users/${id}`);
}

