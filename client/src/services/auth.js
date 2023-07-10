import store from "@/stores/store";
import httpClient from "@/services/httpClient";


export function getUser() {
    return store.state.user
}

export function isLoggedIn() {
    return store.state.isLoggedIn
}

export async function fetchUser() {
    const userData = await httpClient.get('/me')
    store.commit('setUser',userData.data)
}