import api from "./api";

export const getAdminMeApi = () =>
  api.get("/admin/me").then((r) => r.data);

export const getDashboardApi = () =>
  api.get("/admin/dashboard").then((r) => r.data);

export const getUsersApi = (params = {}) =>
  api.get("/admin/users", { params }).then((r) => r.data);

export const getUserByIdApi = (id) =>
  api.get(`/admin/users/${id}`).then((r) => r.data);