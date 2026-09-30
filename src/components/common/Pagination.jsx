import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({ page, pages, onChange, disabled = false }) => {
  if (!pages || pages <= 1) return null;

  const goTo = (p) => {
    if (disabled) return;
    if (p < 1 || p > pages || p === page) return;
    onChange(p);
  };

  const buildVisible = () => {
    const windowSize = 1;
    const items = new Set();
    items.add(1);
    items.add(pages);
    for (let i = page - windowSize; i <= page + windowSize; i++) {
      if (i >= 1 && i <= pages) items.add(i);
    }

    const sorted = [...items].sort((a, b) => a - b);
    const result = [];
    let last = 0;
    for (const n of sorted) {
      if (n - last > 1) result.push("...");
      result.push(n);
      last = n;
    }
    return result;
  };

  const visible = buildVisible();

  const btnBase =
    "flex h-9 min-w-[36px] items-center justify-center rounded-lg border px-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="flex flex-wrap items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => goTo(page - 1)}
        disabled={page <= 1 || disabled}
        className={`${btnBase} gap-1 hover:bg-slate-50`}
        style={{
          borderColor: "var(--color-border)",
          color: "var(--color-text)",
          backgroundColor: "var(--color-surface)",
        }}
      >
        <FiChevronLeft size={14} />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {visible.map((item, i) =>
        item === "..." ? (
          <span
            key={`gap-${i}`}
            className="px-1 text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => goTo(item)}
            disabled={disabled}
            className={`${btnBase} ${
              item === page ? "font-semibold text-white" : "hover:bg-slate-50"
            }`}
            style={{
              backgroundColor:
                item === page ? "var(--color-primary)" : "var(--color-surface)",
              borderColor:
                item === page ? "var(--color-primary)" : "var(--color-border)",
              color: item === page ? "#ffffff" : "var(--color-text)",
            }}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => goTo(page + 1)}
        disabled={page >= pages || disabled}
        className={`${btnBase} gap-1 hover:bg-slate-50`}
        style={{
          borderColor: "var(--color-border)",
          color: "var(--color-text)",
          backgroundColor: "var(--color-surface)",
        }}
      >
        <span className="hidden sm:inline">Next</span>
        <FiChevronRight size={14} />
      </button>
    </div>
  );
};

export default Pagination;