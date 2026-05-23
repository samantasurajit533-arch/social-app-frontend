import axios from "axios";

export const API_BASE_URL = "https://social-app-backend-pogv.onrender.com";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, 
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");

    if (token && token !== "null" && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);