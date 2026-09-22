const Button = ({
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
  className = "",
  onClick,
  ...rest
}) => {
  const variants = {
    primary: "btn-primary",
    outline: "btn-outline",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${variants[variant]} ${className}`}
      {...rest}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;