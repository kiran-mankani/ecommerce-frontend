const ProductImage = ({ src, alt = "", size = 48, className = "" }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        style={{ width: size, height: size }}
        className={`rounded-lg border object-cover ${className}`}
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size }}
      className={`flex items-center justify-center rounded-lg text-xs font-bold ${className}`}
      aria-label={alt}
    >
      <span
        className="flex h-full w-full items-center justify-center rounded-lg"
        style={{
          backgroundColor: "rgba(37, 99, 235, 0.1)",
          color: "var(--color-primary)",
        }}
      >
        {alt?.[0]?.toUpperCase() || "?"}
      </span>
    </div>
  );
};

export default ProductImage;