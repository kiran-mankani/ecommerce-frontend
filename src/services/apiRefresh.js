import axios from "axios";
import { tokenStore } from "./tokenStore";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// Bare axios (no interceptors) — used only for the refresh call itself
const bare = axios.create({ baseURL: BASE_URL });

let isRefreshing = false;
let pendingQueue = [];

const flushQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
};

/**
 * Attach a request interceptor that adds the access token to every call.
 */
export const attachRequestInterceptor = (instance) => {
  instance.interceptors.request.use((config) => {
    const token = tokenStore.getAccess();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

/**
 * Attach a response interceptor that silently refreshes on 401
 * and retries the original request once.
 */
export const attachResponseInterceptor = (instance) => {
  instance.interceptors.response.use(
    (r) => r,
    async (error) => {
      const original = error.config;

      if (
        !original ||
        error.response?.status !== 401 ||
        original._retry ||
        original.url?.includes("/auth/refresh") ||
        original.url?.includes("/auth/login")
      ) {
        return Promise.reject(error);
      }

      const refreshToken = tokenStore.getRefresh();
      if (!refreshToken) {
        tokenStore.clear();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: (newToken) => {
              original.headers.Authorization = `Bearer ${newToken}`;
              resolve(instance(original));
            },
            reject,
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await bare.post("/auth/refresh", { refreshToken });
        const body = data?.data ?? data;

        tokenStore.set({
          accessToken: body.accessToken,
          refreshToken: body.refreshToken,
        });

        flushQueue(null, body.accessToken);
        original.headers.Authorization = `Bearer ${body.accessToken}`;
        return instance(original);
      } catch (refreshErr) {
        flushQueue(refreshErr, null);
        tokenStore.clear();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
  );
};