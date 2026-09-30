import { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const resolveImageUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const apiBase =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
  const origin = apiBase.replace(/\/api\/v1\/?$/, "");
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
};

const ProductThumb = ({ src, name = "", size = 40 }) => {
  const [errored, setErrored] = useState(false);
  const url = resolveImageUrl(src);

  if (url && !errored) {
    return (
      <img
        src={url}
        alt={name}
        loading="lazy"
        onError={() => setErrored(true)}
        style={{ width: size, height: size }}
        className="shrink-0 rounded-lg object-cover"
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        color: "var(--color-primary)",
      }}
      className="flex shrink-0 items-center justify-center rounded-lg text-xs font-bold"
    >
      {name?.[0]?.toUpperCase() || "?"}
    </div>
  );
};

const ProductTable = ({ items, onEdit, onDelete }) => {
  if (!items || items.length === 0) {
    return (
      <div
        className="rounded-xl border p-10 text-center text-sm"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
          color: "var(--color-text-muted)",
        }}
      >
        No products yet.
      </div>
    );
  }

  const finalPrice = (p) =>
    p.discount > 0
      ? `$${(p.price * (1 - p.discount / 100)).toFixed(2)}`
      : `$${p.price.toFixed(2)}`;

  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead
            style={{
              backgroundColor: "var(--color-surface-alt)",
              color: "var(--color-text-muted)",
            }}
          >
            <tr>
              <th className="hidden px-3 py-3 font-semibold sm:table-cell md:px-4">
                Image
              </th>
              <th className="px-3 py-3 font-semibold md:px-4">Name</th>
              <th className="hidden px-3 py-3 font-semibold md:table-cell md:px-4">
                Category
              </th>
              <th className="px-3 py-3 font-semibold md:px-4">Price</th>
              <th className="px-3 py-3 font-semibold md:px-4">Stock</th>
              <th className="px-3 py-3 text-right font-semibold md:px-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr
                key={p._id}
                className="border-t transition hover:bg-slate-50"
                style={{ borderColor: "var(--color-border)" }}
              >
                <td className="hidden px-3 py-3 sm:table-cell md:px-4">
                  <ProductThumb src={p.images?.[0]} name={p.name} size={40} />
                </td>
                <td
                  className="px-3 py-3 md:px-4"
                  style={{ color: "var(--color-text)" }}
                >
                  <div className="font-medium">{p.name}</div>
                  {p.brand && (
                    <div
                      className="text-xs"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {p.brand}
                    </div>
                  )}
                </td>
                <td
                  className="hidden px-3 py-3 md:table-cell md:px-4"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {p.categoryId?.name || "—"}
                </td>
                <td className="px-3 py-3 md:px-4" style={{ color: "var(--color-text)" }}>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span>{finalPrice(p)}</span>
                    {p.discount > 0 && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{
                          backgroundColor: "rgba(245, 158, 11, 0.15)",
                          color: "var(--color-warning)",
                        }}
                      >
                        -{p.discount}%
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3 md:px-4" style={{ color: "var(--color-text)" }}>
                  {p.stock}
                </td>
                <td className="px-3 py-3 md:px-4">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => onEdit(p)}
                      className="rounded-lg p-2 transition hover:bg-blue-50"
                      style={{ color: "var(--color-primary)" }}
                      title="Edit"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(p)}
                      className="rounded-lg p-2 transition hover:bg-red-50"
                      style={{ color: "var(--color-danger)" }}
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;