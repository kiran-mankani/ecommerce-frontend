import api from "./api";

export const getCartApi = () =>
  api.get("/cart").then((r) => r.data);

export const addToCartApi = (payload) =>
  api.post("/cart", payload).then((r) => r.data);

export const updateCartItemApi = (productId, quantity) =>
  api.put(`/cart/items/${productId}`, { quantity }).then((r) => r.data);

export const removeCartItemApi = (productId) =>
  api.delete(`/cart/items/${productId}`).then((r) => r.data);

export const clearCartApi = () =>
  api.delete("/cart").then((r) => r.data);