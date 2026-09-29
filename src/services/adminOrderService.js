import api from "./api";

export const getAdminOrdersApi = (params = {}) =>
  api.get("/admin/orders", { params }).then((r) => r.data);

export const getAdminOrderByIdApi = (id) =>
  api.get(`/admin/orders/${id}`).then((r) => r.data);

export const updateOrderStatusApi = (id, status) =>
  api.put(`/admin/orders/${id}/status`, { status }).then((r) => r.data);

export const deleteAdminOrderApi = (id) =>
  api.delete(`/admin/orders/${id}`).then((r) => r.data);

