const StockBadge = ({ stock }) => {
  let label = "In stock";
  let bg = "rgba(34, 197, 94, 0.12)";
  let color = "var(--color-success)";

  if (stock <= 0) {
    label = "Out of stock";
    bg = "rgba(239, 68, 68, 0.12)";
    color = "var(--color-danger)";
  } else if (stock <= 5) {
    label = `Only ${stock} left`;
    bg = "rgba(245, 158, 11, 0.15)";
    color = "var(--color-warning)";
  }

  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
      style={{ backgroundColor: bg, color }}
    >
      {label}
    </span>
  );
};

export default StockBadge;