import { FiSearch, FiX } from "react-icons/fi";

const ProductFilters = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  status,
  onStatusChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  sort,
  onSortChange,
  onClear,
}) => {
  const hasAnyFilter =
    search ||
    category ||
    status ||
    minPrice ||
    maxPrice ||
    (sort && sort !== "-createdAt");

  const inputStyle = {
    backgroundColor: "var(--color-surface)",
    borderColor: "var(--color-input-border)",
    color: "var(--color-text)",
  };

  return (
    <div
      className="mb-6 rounded-xl border p-4"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Row 1: search */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2"
            size={16}
            style={{ color: "var(--color-text-muted)" }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none transition focus:ring-2"
            style={inputStyle}
          />
        </div>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2"
          style={inputStyle}
        >
          <option value="-createdAt">Newest</option>
          <option value="createdAt">Oldest</option>
          <option value="price">Price: Low → High</option>
          <option value="-price">Price: High → Low</option>
          <option value="name">Name A → Z</option>
        </select>
      </div>

      {/* Row 2: filters */}
      <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2"
          style={inputStyle}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2"
          style={inputStyle}
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <input
          type="number"
          min={0}
          value={minPrice}
          onChange={(e) => onMinPriceChange(e.target.value)}
          placeholder="Min price"
          className="rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2"
          style={inputStyle}
        />

        <input
          type="number"
          min={0}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(e.target.value)}
          placeholder="Max price"
          className="rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2"
          style={inputStyle}
        />
      </div>

      {hasAnyFilter && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:bg-slate-50"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-muted)",
            }}
          >
            <FiX size={12} /> Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;