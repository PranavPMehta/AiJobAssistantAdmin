import axios from "axios";
import {
  ADMIN_SESSION_HEADER_NAMES,
  clearAdminSession,
  getAdminSessionToken,
} from "./authSession";

const isDev = window.location.hostname === "localhost";

const axiosClient = axios.create({
  baseURL: isDev ? "" : "https://dheerajrathodconsult.com",
  //baseURL: isDev ? "http://localhost:8090" : "",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = getAdminSessionToken();

    if (token) {
      ADMIN_SESSION_HEADER_NAMES.forEach((headerName) => {
        config.headers.set(headerName, token);
      });
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.response?.data || error.message;
    console.error("API Error:", message);

    if (error.response?.status === 401) {
      clearAdminSession();
      window.dispatchEvent(new Event("admin-session-expired"));
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
