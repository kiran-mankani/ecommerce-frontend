import { useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

const ProductSearchBar = ({ initial = "", onChange }) => {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    setValue(initial);
  }, [initial]);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => {
      if (value !== initial) onChange(value);
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="relative">
      <FiSearch
        className="absolute left-3 top-1/2 -translate-y-1/2"
        size={16}
        style={{ color: "var(--color-text-muted)" }}
      />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products..."
        className="w-full rounded-lg border py-2.5 pl-10 pr-10 text-sm outline-none focus:ring-2"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-input-border)",
          color: "var(--color-text)",
        }}
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-black/5"
          style={{ color: "var(--color-text-muted)" }}
        >
          <FiX size={14} />
        </button>
      )}
    </div>
  );
};

export default ProductSearchBar;