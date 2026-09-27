import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({ page, pages, onChange }) => {
  if (!pages || pages <= 1) return null;

  const visible = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(pages, page + 2);
  for (let i = start; i <= end; i++) visible.push(i);

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        style={{
          borderColor: "var(--color-border)",
          color: "var(--color-text)",
        }}
      >
        <FiChevronLeft size={14} /> Prev
      </button>

      {visible[0] > 1 && (
        <span className="px-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
          …
        </span>
      )}

      {visible.map((p) => {
        const active = p === page;
        return (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className="h-9 w-9 rounded-lg text-xs font-semibold transition"
            style={{
              backgroundColor: active
                ? "var(--color-primary)"
                : "var(--color-surface)",
              color: active ? "#ffffff" : "var(--color-text)",
              border: `1px solid ${
                active ? "var(--color-primary)" : "var(--color-border)"
              }`,
            }}
          >
            {p}
          </button>
        );
      })}

      {visible[visible.length - 1] < pages && (
        <span className="px-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
          …
        </span>
      )}

      <button
        type="button"
        onClick={() => onChange(Math.min(pages, page + 1))}
        disabled={page >= pages}
        className="flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        style={{
          borderColor: "var(--color-border)",
          color: "var(--color-text)",
        }}
      >
        Next <FiChevronRight size={14} />
      </button>
    </div>
  );
};

export default Pagination;