const STYLES = {
  pending:   { bg: "rgba(245, 158, 11, 0.15)", color: "var(--color-warning)" },
  confirmed: { bg: "rgba(37, 99, 235, 0.12)",  color: "var(--color-primary)" },
  processing:{ bg: "rgba(37, 99, 235, 0.12)",  color: "var(--color-primary)" },
  shipped:   { bg: "rgba(139, 92, 246, 0.12)", color: "#8b5cf6" },
  delivered: { bg: "rgba(34, 197, 94, 0.12)",  color: "var(--color-success)" },
  cancelled: { bg: "rgba(239, 68, 68, 0.12)",  color: "var(--color-danger)" },
};

const OrderStatusBadge = ({ status }) => {
  const s = STYLES[status] || STYLES.pending;
  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {status}
    </span>
  );
};

export default OrderStatusBadge;