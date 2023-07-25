import store from '@/stores/store'
import httpClient from '@/services/httpClient'

export async function login(userCredentials) {
    const response = await httpClient.post('/login', userCredentials)
    if (response.status === 200) {
        const { token } = response.data
        localStorage.setItem('access_token', token)
        store.commit('setLoggedIn', true)
        return token
    }
    else if (response.status === 401) {
        throw new Error("Le mot de passe ou l'adresse email ne sont pas corrects")
    } else {
        throw new Error("Error server")
    }

}

export async function registerCustomer(userCredentials) {
    const response = await httpClient.post('/customer', userCredentials)
    if (response.status === 422) {
        const errorData = response.data;
        throw new Error(`Invalid registration data: ${errorData.message}`);
    } else if (response.status === 409) {
        const errorMessage = `L'adresse email ${userCredentials.email} est déjà utilisée.`;
        throw new Error(errorMessage);
    }
    return response;
}

export function getCurrentUser() {
    return store.state.user
}

export function isLoggedIn() {
    return store.state.isLoggedIn
}

export async function fetchUser() {
    const userData = await httpClient.get('/me')
    store.commit('setUser', userData.data)
    return userData.data
}