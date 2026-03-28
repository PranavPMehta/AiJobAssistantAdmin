import axios from 'axios';

const api = axios.create({
    baseURL: 'https://dheerajrathodconsult.com',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response || error.message);
        return Promise.reject(error);
    }
);

export default api;
