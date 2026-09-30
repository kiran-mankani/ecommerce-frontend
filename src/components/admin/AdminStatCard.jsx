const AdminStatCard = ({ label, value, icon: Icon, accent = "primary" }) => {
  const accentColor = {
    primary: "var(--color-primary)",
    success: "var(--color-success)",
    warning: "var(--color-warning)",
    danger: "var(--color-danger)",
  }[accent];

  return (
    <div
      className="flex items-center gap-2 rounded-xl border p-2.5 shadow-sm sm:gap-3 sm:p-4 md:gap-4 md:p-5"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      {Icon && (
        <span
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full min-[400px]:flex sm:h-11 sm:w-11 md:h-12 md:w-12"
          style={{
            backgroundColor: "rgba(37, 99, 235, 0.1)",
            color: accentColor,
          }}
        >
          <Icon size={16} className="sm:hidden" />
          <Icon size={22} className="hidden sm:block" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p
          className="text-[10px] font-medium uppercase leading-tight tracking-wide sm:text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          {label}
        </p>
        <p
          className="mt-0.5 break-words text-base font-bold leading-tight sm:text-xl md:text-2xl"
          style={{ color: "var(--color-text)" }}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

export default AdminStatCard;