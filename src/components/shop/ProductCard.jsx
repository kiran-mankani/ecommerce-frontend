import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiShoppingCart } from "react-icons/fi";
import toast from "react-hot-toast";
import PriceDisplay from "./PriceDisplay";
import StockBadge from "./StockBadge";
import { addToCartThunk } from "../../store/slices/cartSlice";
import useAuth from "../../hooks/useAuth";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === "admin";

  const quickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    const res = await dispatch(
      addToCartThunk({ productId: product._id, quantity: 1 })
    );
    if (addToCartThunk.fulfilled.match(res)) toast.success("Added to cart");
    else toast.error(res.payload || "Failed to add to cart");
  };

  const outOfStock = product.stock <= 0;

  return (
    <Link
      to={`/product/${product._id}`}
      className="group flex flex-col overflow-hidden rounded-xl border transition hover:shadow-lg"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Image */}
      <div
        className="relative aspect-square w-full overflow-hidden"
        style={{ backgroundColor: "var(--color-surface-alt)" }}
      >
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const fb = e.currentTarget.parentElement?.querySelector(
                "[data-fallback]"
              );
              if (fb) fb.style.display = "flex";
            }}
          />
        ) : null}

        <div
          data-fallback
          className="h-full w-full items-center justify-center text-4xl font-bold"
          style={{
            display: product.images?.[0] ? "none" : "flex",
            backgroundColor: "rgba(37, 99, 235, 0.08)",
            color: "var(--color-primary)",
          }}
        >
          {product.name?.[0]?.toUpperCase() || "?"}
        </div>

        <div className="absolute left-2 top-2">
          <StockBadge stock={product.stock} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1 p-2 sm:gap-1.5 sm:p-3 md:p-4">
        <h3
          className="line-clamp-2 text-xs font-semibold leading-snug sm:text-sm"
          style={{ color: "var(--color-text)" }}
        >
          {product.name}
        </h3>

        {product.brand && (
          <p
            className="truncate text-[10px] sm:text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            {product.brand}
          </p>
        )}

        {product.categoryId?.name && (
          <p
            className="truncate text-[9px] uppercase tracking-wide sm:text-[11px]"
            style={{ color: "var(--color-primary)" }}
          >
            {product.categoryId.name}
          </p>
        )}

        <div className="mt-auto pt-1.5 sm:pt-2">
          <PriceDisplay
            price={product.price}
            discount={product.discount}
            size="sm"
          />
        </div>

        {/* Add to Cart — hidden for admin */}
        {!isAdmin && (
          <button
            type="button"
            onClick={quickAdd}
            disabled={outOfStock}
            className="mt-1 flex w-full items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-semibold text-white transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 sm:gap-2 sm:py-2 sm:text-xs"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <FiShoppingCart size={12} className="sm:hidden" />
            <FiShoppingCart size={14} className="hidden sm:block" />
            <span className="truncate">
              {outOfStock ? "Out of stock" : "Add to Cart"}
            </span>
          </button>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;