import api from "./api";

export const signupApi = (payload) =>
  api.post("/auth/signup", payload).then((r) => r.data);

export const verifyOtpApi = (payload) =>
  api.post("/auth/verify-otp", payload).then((r) => r.data);

export const resendOtpApi = (payload) =>
  api.post("/auth/resend-otp", payload).then((r) => r.data);

export const loginApi = (payload) =>
  api.post("/auth/login", payload).then((r) => r.data);

export const forgotPasswordApi = (payload) =>
  api.post("/auth/forgot-password", payload).then((r) => r.data);

export const resetPasswordApi = (payload) =>
  api.post("/auth/reset-password", payload).then((r) => r.data);

export const logoutApi = () =>
  api.post("/auth/logout").then((r) => r.data);