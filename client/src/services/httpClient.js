import axios from 'axios';
import store from "@/stores/store";

const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

httpClient.interceptors.request.use(config => {
    store.commit('setIsLoading', true);
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
}, error => {
    store.commit('setIsLoading', false);
    return Promise.reject(error);
});

httpClient.interceptors.response.use(response => {
    store.commit('setIsLoading', false);
    return response;
}, async error => {
    store.commit('setIsLoading', false);
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('access_token');
        if (!refreshToken) {
            return Promise.reject(error);
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/refresh-token`, {token: refreshToken});
            const newAccessToken = response.data.token;
            localStorage.setItem('access_token', newAccessToken);

            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return httpClient(originalRequest);
        } catch (refreshError) {
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
});

httpClient.isLoading = false;

httpClient.get = async function (url, config) {
    try {
        httpClient.isLoading = true;
        const response = await httpClient({
            method: 'get',
            url,
            ...config
        });
        if ([200, 201, 202].includes(response.status)) {
            response.ok = true;
        }
        return response;
    } catch (error) {
        throw error;
    } finally {
        httpClient.isLoading = false;
    }
};

httpClient.post = async function (url, data, config) {
    try {
        httpClient.isLoading = true;
        const response = await httpClient({
            method: 'post',
            url,
            data,
            ...config
        });
        if ([200, 201, 202].includes(response.status)) {
            response.ok = true;
        }
        return response;
    } catch (error) {
        return error.response;
    } finally {
        httpClient.isLoading = false;
    }
};

httpClient.put = async function (url, data, config) {
    try {
        httpClient.isLoading = true;
        const response = await httpClient({
            method: 'put',
            url,
            data,
            ...config
        });
        if ([200, 201, 202].includes(response.status)) {
            response.ok = true;
        }
        return response;
    } catch (error) {
        return error.response;
    } finally {
        httpClient.isLoading = false;
    }
};

httpClient.delete = async function (url, config) {
    try {
        httpClient.isLoading = true;
        const response = await httpClient({
            method: 'delete',
            url,
            ...config
        });
        if ([200, 201, 202].includes(response.status)) {
            response.ok = true;
        }
        return response;
    } catch (error) {
        return error.response;
    } finally {
        httpClient.isLoading = false;
    }
};

export default httpClient;