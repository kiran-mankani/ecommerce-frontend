import api from "./api";
import { tokenStore } from "./tokenStore";

// ---------------- existing endpoints ----------------

export const signupApi = (payload) =>
  api.post("/auth/signup", payload).then((r) => r.data);

export const verifyOtpApi = (payload) =>
  api.post("/auth/verify-otp", payload).then((r) => r.data);

export const resendOtpApi = (payload) =>
  api.post("/auth/resend-otp", payload).then((r) => r.data);

// login: persist tokens + user
export const loginApi = async (payload) => {
  const data = await api.post("/auth/login", payload).then((r) => r.data);
  const body = data?.data ?? data;

  if (body?.accessToken || body?.token || body?.refreshToken) {
    tokenStore.set({
      accessToken: body.accessToken || body.token,
      refreshToken: body.refreshToken,
    });
  }

  if (body?.user) {
    localStorage.setItem("user", JSON.stringify(body.user));
  }

  return data;
};

export const forgotPasswordApi = (payload) =>
  api.post("/auth/forgot-password", payload).then((r) => r.data);

export const resetPasswordApi = (payload) =>
  api.post("/auth/reset-password", payload).then((r) => r.data);

// logout: revoke refresh token server-side, then clear everything
export const logoutApi = async () => {
  const refreshToken = tokenStore.getRefresh();
  try {
    if (refreshToken) {
      await api.post("/auth/logout-refresh", { refreshToken });
    }
  } catch {
    /* ignore — still clear local state */
  }
  tokenStore.clear();
  localStorage.removeItem("user");
  return { success: true };
};

// ---------------- Phase 6 additions ----------------

export const refreshApi = (payload) =>
  api.post("/auth/refresh", payload).then((r) => r.data);

export const logoutRefreshApi = (payload) =>
  api.post("/auth/logout-refresh", payload).then((r) => r.data);

export const logoutAllApi = () =>
  api.post("/auth/logout-all").then((r) => r.data);