import { useEffect, useState } from "react";
import { FiSave, FiX } from "react-icons/fi";
import useCategories from "../../hooks/useCategories";
import ProductImageUploader from "./ProductImageUploader";

const ProductForm = ({
  initialData = null,
  loading = false,
  onSubmit,
  onCancel,
}) => {
  const { items: categories } = useCategories();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discount: 0,
    categoryId: "",
    brand: "",
    stock: "",
    images: [],
    status: "active",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price ?? "",
        discount: initialData.discount ?? 0,
        categoryId:
          typeof initialData.categoryId === "string"
            ? initialData.categoryId
            : initialData.categoryId?._id || "",
        brand: initialData.brand || "",
        stock: initialData.stock ?? "",
        images: initialData.images || [],
        status: initialData.status || "active",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    else if (form.name.trim().length < 2)
      e.name = "Name must be at least 2 characters";

    if (!form.description.trim()) e.description = "Description is required";

    if (!form.price) e.price = "Price is required";
    else if (Number(form.price) <= 0) e.price = "Price must be greater than 0";

    if (form.discount !== "" && (Number(form.discount) < 0 || Number(form.discount) > 100))
      e.discount = "Discount must be 0–100";

    if (!form.categoryId) e.categoryId = "Category is required";

    if (form.stock === "") e.stock = "Stock is required";
    else if (!Number.isInteger(Number(form.stock)) || Number(form.stock) < 0)
      e.stock = "Stock must be a whole number ≥ 0";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      discount: Number(form.discount) || 0,
      categoryId: form.categoryId,
      brand: form.brand.trim(),
      stock: Number(form.stock),
      images: form.images,
      status: form.status,
    });
  };

  const inputStyle = (err) => ({
    backgroundColor: "var(--color-input-bg)",
    borderColor: err ? "var(--color-danger)" : "var(--color-input-border)",
    color: "var(--color-text)",
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border p-5"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <h3 className="text-base font-bold" style={{ color: "var(--color-text)" }}>
        {initialData ? "Edit Product" : "Add Product"}
      </h3>

      {/* Name */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--color-text)" }}>
          Name <span style={{ color: "var(--color-danger)" }}>*</span>
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. iPhone 15 Pro"
          className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2"
          style={inputStyle(errors.name)}
        />
        {errors.name && <p className="mt-1 text-xs" style={{ color: "var(--color-danger)" }}>{errors.name}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--color-text)" }}>
          Description <span style={{ color: "var(--color-danger)" }}>*</span>
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          placeholder="Detailed product description"
          className="w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2"
          style={inputStyle(errors.description)}
        />
        {errors.description && <p className="mt-1 text-xs" style={{ color: "var(--color-danger)" }}>{errors.description}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Price */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--color-text)" }}>
            Price ($) <span style={{ color: "var(--color-danger)" }}>*</span>
          </label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="199.99"
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2"
            style={inputStyle(errors.price)}
          />
          {errors.price && <p className="mt-1 text-xs" style={{ color: "var(--color-danger)" }}>{errors.price}</p>}
        </div>

        {/* Discount */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--color-text)" }}>
            Discount (%)
          </label>
          <input
            type="number"
            min={0}
            max={100}
            name="discount"
            value={form.discount}
            onChange={handleChange}
            placeholder="0"
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2"
            style={inputStyle(errors.discount)}
          />
          {errors.discount && <p className="mt-1 text-xs" style={{ color: "var(--color-danger)" }}>{errors.discount}</p>}
        </div>

        {/* Stock */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--color-text)" }}>
            Stock <span style={{ color: "var(--color-danger)" }}>*</span>
          </label>
          <input
            type="number"
            min={0}
            name="stock"
            value={form.stock}
            onChange={handleChange}
            placeholder="25"
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2"
            style={inputStyle(errors.stock)}
          />
          {errors.stock && <p className="mt-1 text-xs" style={{ color: "var(--color-danger)" }}>{errors.stock}</p>}
        </div>

        {/* Brand */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--color-text)" }}>
            Brand
          </label>
          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="Apple"
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2"
            style={inputStyle()}
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--color-text)" }}>
            Category <span style={{ color: "var(--color-danger)" }}>*</span>
          </label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2"
            style={inputStyle(errors.categoryId)}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="mt-1 text-xs" style={{ color: "var(--color-danger)" }}>{errors.categoryId}</p>}
        </div>

        {/* Status */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--color-text)" }}>
            Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2"
            style={inputStyle()}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Images */}
      <ProductImageUploader
        images={form.images}
        onChange={(imgs) => setForm({ ...form, images: imgs })}
      />

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-slate-50 disabled:opacity-60"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
          >
            <FiX size={16} /> Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <FiSave size={16} />
          {loading ? "Saving..." : initialData ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;