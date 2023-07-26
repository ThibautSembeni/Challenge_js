import axios from 'axios';
import store from '@/stores/store';

const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000,
    withCredentials: true,
});

httpClient.interceptors.request.use(
    (config) => {
        store.commit('setIsLoading', true);
        return config;
    },
    (error) => {
        store.commit('setIsLoading', false);
        return Promise.reject(error);
    }
);

const handleResponse = (response) => {
    store.commit('setIsLoading', false);
    if ([200, 201, 202, 204].includes(response.status)) {
        response.ok = true;
    }
    return response;
};

const handleRequestError = async (error) => {
    store.commit('setIsLoading', false);
    const originalRequest = error.config;
    if ((error.response && error.response.status === 401 && !originalRequest._retry) || error.response.status === 403) {
        originalRequest._retry = true;

        try {
            await axios.get(`${import.meta.env.VITE_API_URL}/refresh-token`, { withCredentials: true });
            return httpClient(originalRequest);
        } catch (refreshError) {
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
};

httpClient.interceptors.response.use(handleResponse, handleRequestError);

const makeRequest = async (method, url, data, config) => {
    data = JSON.stringify(data)
    try {
        store.commit('setIsLoading', true);
        return await httpClient({
            method,
            url,
            data,
            ...config,
        });
    } catch (error) {
        return error.response;
    } finally {
        store.commit('setIsLoading', false);
    }
};

httpClient.get = async function (url, config) {
    return makeRequest('get', url, null, config);
};

httpClient.post = async function (url, data, config) {
    const headers = { 'Content-Type': 'application/json', ...config?.headers };
    config = {
        ...config,
        headers
    };
    return makeRequest('post', url, data, config);
};

httpClient.put = async function (url, data, config) {
    const headers = { 'Content-Type': 'application/json', ...config?.headers };
    config = {
        ...config,
        headers
    };
    return makeRequest('put', url, data, config);
};

httpClient.patch = async function (url, data, config) {
    const headers = { 'Content-Type': 'application/json', ...config?.headers };
    config = {
        ...config,
        headers
    };
    return makeRequest('patch', url, data, config);
};

httpClient.delete = async function (url, config) {
    return makeRequest('delete', url, null, config);
};

export default httpClient;