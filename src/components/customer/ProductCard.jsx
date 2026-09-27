import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { _id, name, price, discount, images, brand, stock, categoryId } =
    product;

  const hasDiscount = discount > 0;
  const finalPrice = hasDiscount ? price * (1 - discount / 100) : price;
  const primaryImage = images?.[0];
  const isOutOfStock = stock <= 0;

  return (
    <Link
      to={`/products/${_id}`}
      className="group flex flex-col overflow-hidden rounded-xl border transition hover:shadow-lg"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div
        className="relative aspect-square overflow-hidden"
        style={{ backgroundColor: "var(--color-surface-alt)" }}
      >
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-3xl font-bold"
            style={{
              backgroundColor: "rgba(37, 99, 235, 0.08)",
              color: "var(--color-primary)",
            }}
          >
            {name?.[0]?.toUpperCase() || "?"}
          </div>
        )}

        {hasDiscount && !isOutOfStock && (
          <span
            className="absolute left-2 top-2 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow"
            style={{ backgroundColor: "var(--color-warning)" }}
          >
            -{discount}%
          </span>
        )}

        {isOutOfStock && (
          <span
            className="absolute inset-x-0 bottom-0 py-1 text-center text-[11px] font-semibold text-white"
            style={{ backgroundColor: "rgba(15, 23, 42, 0.75)" }}
          >
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        {categoryId?.name && (
          <span
            className="mb-1 text-[11px] font-medium uppercase tracking-wide"
            style={{ color: "var(--color-text-muted)" }}
          >
            {categoryId.name}
          </span>
        )}

        <h3
          className="line-clamp-2 text-sm font-semibold leading-snug"
          style={{ color: "var(--color-text)" }}
        >
          {name}
        </h3>

        {brand && (
          <p
            className="mt-0.5 text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            {brand}
          </p>
        )}

        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span
            className="text-base font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            ${finalPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span
              className="text-xs line-through"
              style={{ color: "var(--color-text-muted)" }}
            >
              ${price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;