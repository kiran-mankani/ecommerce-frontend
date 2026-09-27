import { useEffect, useState } from "react";
import { FiSave, FiX } from "react-icons/fi";

const CategoryForm = ({
  initialData = null,
  loading = false,
  onSubmit,
  onCancel,
}) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    status: "active",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        image: initialData.image || "",
        status: initialData.status || "active",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    else if (form.name.trim().length < 2)
      e.name = "Name must be at least 2 characters";
    else if (form.name.trim().length > 60)
      e.name = "Name cannot exceed 60 characters";
    if (form.description && form.description.length > 300)
      e.description = "Description cannot exceed 300 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      status: form.status,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border p-5"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <h3
        className="text-base font-bold"
        style={{ color: "var(--color-text)" }}
      >
        {initialData ? "Edit Category" : "Add Category"}
      </h3>

      {/* Name */}
      <div>
        <label
          className="mb-1.5 block text-xs font-semibold"
          style={{ color: "var(--color-text)" }}
        >
          Name <span style={{ color: "var(--color-danger)" }}>*</span>
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Electronics"
          className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2"
          style={{
            backgroundColor: "var(--color-input-bg)",
            borderColor: errors.name
              ? "var(--color-danger)"
              : "var(--color-input-border)",
            color: "var(--color-text)",
          }}
        />
        {errors.name && (
          <p className="mt-1 text-xs" style={{ color: "var(--color-danger)" }}>
            {errors.name}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          className="mb-1.5 block text-xs font-semibold"
          style={{ color: "var(--color-text)" }}
        >
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          placeholder="Short description (optional)"
          className="w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2"
          style={{
            backgroundColor: "var(--color-input-bg)",
            borderColor: errors.description
              ? "var(--color-danger)"
              : "var(--color-input-border)",
            color: "var(--color-text)",
          }}
        />
        <div className="mt-1 flex justify-between text-xs">
          {errors.description ? (
            <span style={{ color: "var(--color-danger)" }}>
              {errors.description}
            </span>
          ) : (
            <span style={{ color: "var(--color-text-muted)" }}>
              Optional
            </span>
          )}
          <span style={{ color: "var(--color-text-muted)" }}>
            {form.description.length}/300
          </span>
        </div>
      </div>

      {/* Image URL */}
      <div>
        <label
          className="mb-1.5 block text-xs font-semibold"
          style={{ color: "var(--color-text)" }}
        >
          Image URL
        </label>
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="https://..."
          className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2"
          style={{
            backgroundColor: "var(--color-input-bg)",
            borderColor: "var(--color-input-border)",
            color: "var(--color-text)",
          }}
        />
        <p
          className="mt-1 text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          Optional. Used as category thumbnail.
        </p>
      </div>

      {/* Status */}
      <div>
        <label
          className="mb-1.5 block text-xs font-semibold"
          style={{ color: "var(--color-text)" }}
        >
          Status
        </label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2"
          style={{
            backgroundColor: "var(--color-input-bg)",
            borderColor: "var(--color-input-border)",
            color: "var(--color-text)",
          }}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-slate-50 disabled:opacity-60"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
            }}
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

export default CategoryForm;