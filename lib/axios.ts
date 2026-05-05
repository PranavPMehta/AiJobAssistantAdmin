import axios from 'axios';
import {
    ADMIN_SESSION_HEADER_NAMES,
    clearAdminSession,
    getAdminSessionToken,
} from '../api/authSession';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://dheerajrathodconsult.com',
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = getAdminSessionToken();

    if (token) {
        ADMIN_SESSION_HEADER_NAMES.forEach((headerName) => {
            config.headers.set(headerName, token);
        });
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response || error.message);

        if (error.response?.status === 401) {
            clearAdminSession();
            window.dispatchEvent(new Event('admin-session-expired'));
        }

        return Promise.reject(error);
    }
);

export default api;
