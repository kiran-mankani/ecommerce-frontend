const AuthLayout = ({ title, subtitle, children, footer }) => {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1
            className="mb-2 text-3xl font-bold"
            style={{ color: "var(--color-text)" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              {subtitle}
            </p>
          )}
        </div>

        <div className="card">
          {children}
          {footer && <div className="mt-5">{footer}</div>}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;