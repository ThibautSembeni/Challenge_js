import {createStore} from 'vuex';
import createPersistedState from 'vuex-persistedstate';

const store = createStore({
    plugins: [createPersistedState()],
    state: {
        isLoading: false,
        user: null,
        isLoggedIn: false,
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
        }
    },
    actions: {
        getUser(state) {
            return state.user;
        },
        getLoggedIn(state) {
            return state.isLoggedIn;
        }

    }
});

export default store;
