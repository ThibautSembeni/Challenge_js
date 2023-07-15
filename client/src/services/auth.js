import store from '@/stores/store'
import httpClient from '@/services/httpClient'

export async function login(userCredentials) {
    try {
        const response = await httpClient.post('/login', userCredentials)
        if (response.status === 200) {
            const {token} = response.data
            localStorage.setItem('access_token', token)
            store.commit('setLoggedIn', true)
            return token
        } else if (response.status === 422) {
            throw new Error(response.data)
        } else if (response.status === 401) {
            throw new Error("Le mot de passe ou l'adresse email ne sont pas corrects")
        }
    } catch (error) {
        throw new Error("Une erreur s'est produite lors de la connexion")
    }
}

export async function getCurrentUser() {
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