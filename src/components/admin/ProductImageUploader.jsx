import { useRef, useState } from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { uploadProductImagesApi } from "../../services/productService";

const ProductImageUploader = ({ images = [], onChange, max = 5 }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const trigger = () => {
    if (images.length >= max) {
      toast.error(`Maximum ${max} images`);
      return;
    }
    inputRef.current?.click();
  };

  const handleFiles = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = max - images.length;
    if (files.length > remaining) {
      toast.error(`You can add up to ${remaining} more image(s)`);
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);
      const res = await uploadProductImagesApi(files);
      const urls = res?.data?.urls || [];
      onChange([...images, ...urls]);
      toast.success(`${urls.length} image(s) uploaded`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeAt = (index) => {
    const next = images.filter((_, i) => i !== index);
    onChange(next);
  };

  return (
    <div>
      <label
        className="mb-1.5 block text-xs font-semibold"
        style={{ color: "var(--color-text)" }}
      >
        Product Images <span style={{ color: "var(--color-text-muted)" }}>({images.length}/{max})</span>
      </label>

      <div className="flex flex-wrap gap-3">
        {images.map((url, i) => (
          <div key={i} className="relative">
            <img
              src={url}
              alt="product"
              className="h-20 w-20 rounded-lg border object-cover"
              style={{ borderColor: "var(--color-border)" }}
            />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow transition hover:bg-slate-100"
              style={{ color: "var(--color-danger)" }}
              aria-label="Remove image"
            >
              <FiX size={12} />
            </button>
          </div>
        ))}

        {images.length < max && (
          <button
            type="button"
            onClick={trigger}
            disabled={uploading}
            className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-xs transition hover:bg-slate-50 disabled:opacity-60"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-muted)",
            }}
          >
            <FiUploadCloud size={18} />
            {uploading ? "Uploading…" : "Add"}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        hidden
        onChange={handleFiles}
      />
      <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
        JPG, PNG, or WEBP. Max 5 MB each. Up to {max} images.
      </p>
    </div>
  );
};

export default ProductImageUploader;