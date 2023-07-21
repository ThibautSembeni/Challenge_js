import store from '@/stores/store'
import {getCurrentUser} from "@/services/auth";
import httpClient from "@/services/httpClient";

export function getCurrentCredentials() {
    const currentUser = getCurrentUser()
    const credentialsFromStore = store.state.credentials
    if (credentialsFromStore?.user_id !== currentUser.id){
        store.commit('setCredentials',null)
        return null
    }
    return credentialsFromStore
}

export async function verifyCredentials(payload) {
    const currentUser = getCurrentUser()
    const response = await httpClient.post('credentials/verify',payload)
    const credentials = response.data
    if (credentials.user_id !== currentUser.id){
        throw new Error('Error validation credentials')
    }
    return credentials
}

export async function regenerateCredentials() {
    const response = await httpClient.get('credentials/regenerate')
    return response.data
}