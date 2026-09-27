const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  message = "",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.5)" }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-xl p-6 shadow-xl"
        style={{ backgroundColor: "var(--color-surface)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          className="text-lg font-bold"
          style={{ color: "var(--color-text)" }}
        >
          {title}
        </h3>
        {message && (
          <p
            className="mt-2 text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            {message}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-slate-50 disabled:opacity-60"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60"
            style={{ backgroundColor: "var(--color-danger)" }}
          >
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;