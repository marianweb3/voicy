import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "https://api.dev-e4d.workers.dev",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // if (error.response.data.message === "Missing token") {
    //   localStorage.removeItem("token");
    //   localStorage.removeItem("isLoggedIn");
    //   window.location.href = "/auth";
    // }

    // // Skip redirect for login endpoint errors
    // if (error.config?.url === "/login") {
    //   return Promise.reject(error);
    // }
    // // Handle authentication errors
    // if (error.response?.status === 401) {
    //   localStorage.removeItem("token");
    //   localStorage.removeItem("isLoggedIn");
    //   window.location.href = "/auth";
    // }

    // Handle other errors
    if (error.response?.status >= 500) {
      console.error("Server error:", error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;
