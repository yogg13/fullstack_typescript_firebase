import axios from "axios";

// Base URL dari backend server
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Create axios instance dengan konfigurasi default
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000, // 10 detik
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor untuk debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor untuk error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("❌ Response Error:", error.response?.data || error.message);

    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.error("Unauthorized access");
    } else if (error.response?.status >= 500) {
      // Handle server errors
      console.error("Server error occurred");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
