import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://dheerajrathodconsult.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// ✅ Request interceptor (future token support)
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;