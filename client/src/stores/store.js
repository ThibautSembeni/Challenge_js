import {createStore} from 'vuex';
import createPersistedState from 'vuex-persistedstate';

const store = createStore({
    plugins: [createPersistedState()],
    state: {
        isLoading: false,
        isLoggedIn: false,
        user: null,
        credentials:null
    },
    mutations: {
        setIsLoading(state, value) {
            state.isLoading = value;
        },
        setUser(state, user) {
            state.user = user;
        },
        setLoggedIn(state, isLoggedIn) {
            state.isLoggedIn = isLoggedIn;
        },
        setCredentials(state, credentials) {
            state.credentials = credentials;
        }
    },
    actions: {
        getCurrentUser(state) {
            return state.user;
        },
        getLoggedIn(state) {
            return state.isLoggedIn;
        }
    }
});

export default store;
