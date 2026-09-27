import { FiEdit2, FiTrash2 } from "react-icons/fi";
import ProductImage from "../common/ProductImage";

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
              <th className="px-4 py-3 font-semibold">Image</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="hidden px-4 py-3 font-semibold md:table-cell">Category</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr
                key={p._id}
                className="border-t transition hover:bg-slate-50"
                style={{ borderColor: "var(--color-border)" }}
              >
                <td className="px-4 py-3">
                  <ProductImage
                    src={p.images?.[0]}
                    alt={p.name}
                    size={40}
                  />
                </td>
                <td className="px-4 py-3" style={{ color: "var(--color-text)" }}>
                  <div className="font-medium">{p.name}</div>
                  {p.brand && (
                    <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                      {p.brand}
                    </div>
                  )}
                </td>
                <td
                  className="hidden px-4 py-3 md:table-cell"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {p.categoryId?.name || "—"}
                </td>
                <td className="px-4 py-3" style={{ color: "var(--color-text)" }}>
                  {finalPrice(p)}
                  {p.discount > 0 && (
                    <span
                      className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        backgroundColor: "rgba(245, 158, 11, 0.15)",
                        color: "var(--color-warning)",
                      }}
                    >
                      -{p.discount}%
                    </span>
                  )}
                </td>
                <td className="px-4 py-3" style={{ color: "var(--color-text)" }}>
                  {p.stock}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize"
                    style={{
                      backgroundColor:
                        p.status === "active"
                          ? "rgba(34, 197, 94, 0.12)"
                          : "rgba(100, 116, 139, 0.12)",
                      color:
                        p.status === "active"
                          ? "var(--color-success)"
                          : "var(--color-text-muted)",
                    }}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">
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