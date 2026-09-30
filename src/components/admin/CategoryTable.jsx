import { FiEdit2, FiTrash2 } from "react-icons/fi";

const CategoryTable = ({ items, onEdit, onDelete }) => {
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
        No categories yet.
      </div>
    );
  }

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
                Description
              </th>
              <th className="px-3 py-3 font-semibold md:px-4">Status</th>
              <th className="px-3 py-3 text-right font-semibold md:px-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr
                key={c._id}
                className="border-t transition hover:bg-slate-50"
                style={{ borderColor: "var(--color-border)" }}
              >
                <td className="hidden px-3 py-3 sm:table-cell md:px-4">
                  {c.image ? (
                    <img
                      src={c.image}
                      alt={c.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold"
                      style={{
                        backgroundColor: "rgba(37, 99, 235, 0.1)",
                        color: "var(--color-primary)",
                      }}
                    >
                      {c.name?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                </td>
                <td
                  className="px-3 py-3 font-medium md:px-4"
                  style={{ color: "var(--color-text)" }}
                >
                  {c.name}
                </td>
                <td
                  className="hidden max-w-xs truncate px-3 py-3 md:table-cell md:px-4"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {c.description || "—"}
                </td>
                <td className="px-3 py-3 md:px-4">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize"
                    style={{
                      backgroundColor:
                        c.status === "active"
                          ? "rgba(34, 197, 94, 0.12)"
                          : "rgba(100, 116, 139, 0.12)",
                      color:
                        c.status === "active"
                          ? "var(--color-success)"
                          : "var(--color-text-muted)",
                    }}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-3 py-3 md:px-4">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => onEdit(c)}
                      className="rounded-lg p-2 transition hover:bg-blue-50"
                      style={{ color: "var(--color-primary)" }}
                      title="Edit"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(c)}
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

export default CategoryTable;