import { FiX } from "react-icons/fi";

const ProductFilters = ({
  categories = [],
  activeCategory = "",
  onCategoryChange,
  onClearAll,
}) => {
  const hasFilter = !!activeCategory;

  return (
    <aside
      className="h-fit rounded-xl border p-4"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3
          className="text-sm font-bold"
          style={{ color: "var(--color-text)" }}
        >
          Filters
        </h3>
        {hasFilter && (
          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1 text-xs font-medium hover:underline"
            style={{ color: "var(--color-danger)" }}
          >
            <FiX size={12} /> Clear
          </button>
        )}
      </div>

      <p
        className="mb-2 text-xs font-semibold uppercase tracking-wide"
        style={{ color: "var(--color-text-muted)" }}
      >
        Categories
      </p>

      <ul className="category-scroll max-h-80 space-y-1 overflow-y-auto pr-1">
        <li>
          <button
            type="button"
            onClick={() => onCategoryChange("")}
            className="w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-slate-100"
            style={{
              backgroundColor: !activeCategory
                ? "rgba(37, 99, 235, 0.1)"
                : "transparent",
              color: !activeCategory
                ? "var(--color-primary)"
                : "var(--color-text)",
              fontWeight: !activeCategory ? 600 : 500,
            }}
          >
            All categories
          </button>
        </li>

        {categories.map((c) => {
          const active = activeCategory === c._id;
          return (
            <li key={c._id}>
              <button
                type="button"
                onClick={() => onCategoryChange(c._id)}
                className="w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-slate-100"
                style={{
                  backgroundColor: active
                    ? "rgba(37, 99, 235, 0.1)"
                    : "transparent",
                  color: active ? "var(--color-primary)" : "var(--color-text)",
                  fontWeight: active ? 600 : 500,
                }}
              >
                {c.name}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default ProductFilters;