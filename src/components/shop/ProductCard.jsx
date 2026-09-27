import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiShoppingCart } from "react-icons/fi";
import toast from "react-hot-toast";
import ProductImage from "../common/ProductImage";
import PriceDisplay from "./PriceDisplay";
import StockBadge from "./StockBadge";
import { addToCartThunk } from "../../store/slices/cartSlice";
import useAuth from "../../hooks/useAuth";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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
      <div
        className="relative aspect-square w-full overflow-hidden"
        style={{ backgroundColor: "var(--color-surface-alt)" }}
      >
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-3xl font-bold"
            style={{
              backgroundColor: "rgba(37, 99, 235, 0.08)",
              color: "var(--color-primary)",
            }}
          >
            {product.name?.[0]?.toUpperCase() || "?"}
          </div>
        )}

        <div className="absolute left-2 top-2">
          <StockBadge stock={product.stock} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3
          className="line-clamp-2 text-sm font-semibold leading-tight"
          style={{ color: "var(--color-text)" }}
        >
          {product.name}
        </h3>

        {product.brand && (
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {product.brand}
          </p>
        )}

        {product.categoryId?.name && (
          <p
            className="text-[11px] uppercase tracking-wide"
            style={{ color: "var(--color-primary)" }}
          >
            {product.categoryId.name}
          </p>
        )}

        <div className="mt-auto pt-2">
          <PriceDisplay
            price={product.price}
            discount={product.discount}
            size="md"
          />
        </div>

        <button
          type="button"
          onClick={quickAdd}
          disabled={outOfStock}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold text-white transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <FiShoppingCart size={14} />
          {outOfStock ? "Out of stock" : "Add to Cart"}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;