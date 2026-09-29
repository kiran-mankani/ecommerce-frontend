const AdminStatCard = ({ label, value, icon: Icon, accent = "primary" }) => {
  const accentColor = {
    primary: "var(--color-primary)",
    success: "var(--color-success)",
    warning: "var(--color-warning)",
    danger: "var(--color-danger)",
  }[accent];

  return (
    <div
      className="flex items-center gap-4 rounded-xl border p-5 shadow-sm"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      {Icon && (
        <span
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{
            backgroundColor: "rgba(37, 99, 235, 0.1)",
            color: accentColor,
          }}
        >
          <Icon size={22} />
        </span>
      )}
      <div>
        <p
          className="text-xs font-medium uppercase tracking-wide"
          style={{ color: "var(--color-text-muted)" }}
        >
          {label}
        </p>
        <p
          className="mt-0.5 text-2xl font-bold"
          style={{ color: "var(--color-text)" }}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

export default AdminStatCard;