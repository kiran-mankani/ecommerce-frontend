import axios from 'axios';
import { tokenStore } from './tokenStore';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

// ---- request: attach access token ----
axiosClient.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- response: silent refresh on 401 ----
let isRefreshing = false;
let pendingQueue = [];

const flushQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Don't retry refresh endpoint or non-401
    if (
      !original ||
      error.response?.status !== 401 ||
      original._retry ||
      original.url?.includes('/auth/refresh') ||
      original.url?.includes('/auth/login')
    ) {
      return Promise.reject(error);
    }

    const refreshToken = tokenStore.getRefresh();
    if (!refreshToken) {
      tokenStore.clear();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // queue this request until refresh completes
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (newToken) => {
            original.headers.Authorization = `Bearer ${newToken}`;
            resolve(axiosClient(original));
          },
          reject,
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
        refreshToken,
      });

      tokenStore.set({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      flushQueue(null, data.accessToken);

      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return axiosClient(original);
    } catch (refreshErr) {
      flushQueue(refreshErr, null);
      tokenStore.clear();
      // Optional: redirect to login here
      // window.location.href = '/login';
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosClient;