import api from "./api";

export const getAdminUsersApi = (params = {}) =>
  api.get("/admin/users", { params }).then((r) => r.data);

export const getAdminUserByIdApi = (id) =>
  api.get(`/admin/users/${id}`).then((r) => r.data);