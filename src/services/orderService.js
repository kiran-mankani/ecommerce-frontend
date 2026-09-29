import api from "./api";

export const createOrderApi = (payload) =>
  api.post("/orders", payload).then((r) => r.data);

export const getMyOrdersApi = (params = {}) =>
  api.get("/orders", { params }).then((r) => r.data);

export const getMyOrderByIdApi = (id) =>
  api.get(`/orders/${id}`).then((r) => r.data);