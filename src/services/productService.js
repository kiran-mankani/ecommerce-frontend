import api from "./api";

/* Public */
export const getProductsApi = (params = {}) =>
  api.get("/products", { params }).then((r) => r.data);

export const getProductByIdApi = (id) =>
  api.get(`/products/${id}`).then((r) => r.data);

/* Admin */
export const createProductApi = (payload) =>
  api.post("/products", payload).then((r) => r.data);

export const updateProductApi = (id, payload) =>
  api.put(`/products/${id}`, payload).then((r) => r.data);

export const deleteProductApi = (id) =>
  api.delete(`/products/${id}`).then((r) => r.data);

/* Image upload — multipart/form-data */
export const uploadProductImagesApi = (files) => {
  const formData = new FormData();
  Array.from(files).forEach((f) => formData.append("images", f));

  return api
    .post("/products/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
};