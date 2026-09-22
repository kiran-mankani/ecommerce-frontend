const EmptyState = ({ title = "Nothing here", message = "" }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-10 text-center">
      <h3 className="text-base font-semibold" style={{ color: "var(--color-text)" }}>
        {title}
      </h3>
      {message && (
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default EmptyState;