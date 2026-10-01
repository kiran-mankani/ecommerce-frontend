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

/* Related products — fetch a pool and pick `count` random ones,
   excluding the currently viewed product */
export const getRandomProductsApi = async (count = 6, excludeId = null) => {
  console.log("🔍 [getRandomProductsApi] START", { count, excludeId });

  const data = await getProductsApi({ limit: 50 });
  console.log("🔍 [getRandomProductsApi] Raw API response:", data);

  // ---- UNIVERSAL array extractor ----
  const extractArray = (obj) => {
    if (!obj) return [];
    if (Array.isArray(obj)) return obj;

    // Try common wrappers
    if (Array.isArray(obj.products)) return obj.products;
    if (Array.isArray(obj.items)) return obj.items;
    if (Array.isArray(obj.data)) return obj.data;
    if (Array.isArray(obj.docs)) return obj.docs;
    if (Array.isArray(obj.results)) return obj.results;
    if (Array.isArray(obj.rows)) return obj.rows;
    if (Array.isArray(obj.list)) return obj.list;

    // Nested: { data: { products: [...] } }
    if (obj.data && typeof obj.data === "object") {
      const nested = extractArray(obj.data);
      if (nested.length) return nested;
    }

    // Fallback: find the first array-valued property anywhere
    for (const key of Object.keys(obj)) {
      if (Array.isArray(obj[key])) return obj[key];
    }

    console.warn("🔍 [getRandomProductsApi] Could not find array in:", obj);
    return [];
  };

  const allProducts = extractArray(data);
  console.log("🔍 [getRandomProductsApi] Extracted array length:", allProducts.length);

  const excludeIdStr = excludeId != null ? String(excludeId) : null;

  const filtered = allProducts.filter(
    (p) => String(p._id ?? p.id) !== excludeIdStr
  );
  console.log("🔍 [getRandomProductsApi] After filter:", filtered.length);

  const shuffled = [...filtered];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const result = shuffled.slice(0, count);
  console.log("🔍 [getRandomProductsApi] Returning:", result.length, "products");
  return result;
};