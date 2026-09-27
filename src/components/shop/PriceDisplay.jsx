const PriceDisplay = ({ price, discount = 0, size = "md" }) => {
  const hasDiscount = discount > 0;
  const finalPrice = hasDiscount ? price * (1 - discount / 100) : price;

  const sizes = {
    sm: { main: "text-base", old: "text-xs", tag: "text-[10px]" },
    md: { main: "text-lg", old: "text-sm", tag: "text-xs" },
    lg: { main: "text-2xl", old: "text-base", tag: "text-sm" },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span
        className={`font-bold ${s.main}`}
        style={{ color: "var(--color-text)" }}
      >
        ${finalPrice.toFixed(2)}
      </span>

      {hasDiscount && (
        <>
          <span
            className={`line-through ${s.old}`}
            style={{ color: "var(--color-text-muted)" }}
          >
            ${price.toFixed(2)}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 font-semibold ${s.tag}`}
            style={{
              backgroundColor: "rgba(245, 158, 11, 0.15)",
              color: "var(--color-warning)",
            }}
          >
            -{discount}%
          </span>
        </>
      )}
    </div>
  );
};

export default PriceDisplay;