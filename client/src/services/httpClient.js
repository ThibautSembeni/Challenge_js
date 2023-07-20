import axios from 'axios';
import store from '@/stores/store';

const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000,
});

httpClient.interceptors.request.use(
    (config) => {
        store.commit('setIsLoading', true);
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
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
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('access_token');
        if (!refreshToken) {
            return Promise.reject(error);
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/refresh-token`, {
                token: refreshToken,
            });
            const newAccessToken = response.data.token;
            localStorage.setItem('access_token', newAccessToken);

            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
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
    return makeRequest('post', url, data, config);
};

httpClient.put = async function (url, data, config) {
    return makeRequest('put', url, data, config);
};

httpClient.patch = async function (url, data, config) {
    return makeRequest('patch', url, data, config);
};

httpClient.delete = async function (url, config) {
    return makeRequest('delete', url, null, config);
};

export default httpClient;