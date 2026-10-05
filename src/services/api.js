import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

console.log("🔗 API baseURL:", baseURL);

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    // Try multiple keys
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("jwt");

    console.log(
      `🔐 [${config.method?.toUpperCase()} ${config.url}]`,
      token ? `token=${token.slice(0, 20)}...` : "NO TOKEN"
    );

    if (token && token !== "null" && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("❌ 401 Unauthorized");
    }
    return Promise.reject(error);
  }
);

export default api;