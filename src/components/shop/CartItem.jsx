import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import ProductImage from "../common/ProductImage";
import {
  updateCartItemThunk,
  removeCartItemThunk,
} from "../../store/slices/cartSlice";
import useCart from "../../hooks/useCart";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const { saving } = useCart();

  const outOfStock = item.stock <= 0;
  const atMax = item.quantity >= item.stock;

  const change = async (qty) => {
    if (qty < 1) return;

    if (qty > item.stock) {
      // Show how many are left in stock
      toast.error(`Only ${item.stock} left in stock`, {
        id: `stock-${item.productId}`,
      });
      return;
    }

    const res = await dispatch(
      updateCartItemThunk({ productId: item.productId, quantity: qty })
    );

    if (updateCartItemThunk.rejected.match(res)) {
      toast.error(res.payload || "Out of stock", {
        id: `stock-${item.productId}`,
      });
    }
  };

  const remove = async () => {
    const res = await dispatch(removeCartItemThunk(item.productId));
    if (removeCartItemThunk.fulfilled.match(res)) {
      toast.success("Removed", { id: `remove-${item.productId}` });
    } else {
      toast.error(res.payload || "Failed to remove", {
        id: `remove-${item.productId}`,
      });
    }
  };

  return (
    <div
      className="flex gap-3 rounded-xl border p-3 sm:gap-4 sm:p-4"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Image */}
      <Link
        to={`/product/${item.productId}`}
        className="shrink-0 overflow-hidden rounded-lg"
      >
        <ProductImage src={item.image} alt={item.name} size={80} />
      </Link>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <Link
            to={`/product/${item.productId}`}
            className="line-clamp-2 break-words text-sm font-semibold hover:underline"
            style={{ color: "var(--color-text)" }}
          >
            {item.name}
          </Link>

          <button
            type="button"
            onClick={remove}
            disabled={saving}
            className="rounded-lg p-1.5 transition hover:bg-red-50 disabled:opacity-50"
            style={{ color: "var(--color-danger)" }}
            title="Remove"
          >
            <FiTrash2 size={16} />
          </button>
        </div>

        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          ${item.finalPrice.toFixed(2)} each
          {item.discount > 0 && ` · -${item.discount}%`}
        </p>

        {outOfStock && (
          <p
            className="text-xs font-semibold"
            style={{ color: "var(--color-danger)" }}
          >
            Out of stock — remove to continue
          </p>
        )}

        {!outOfStock && atMax && (
          <p className="text-xs font-semibold" style={{ color: "var(--color-warning)" }}>
            Only {item.stock} left — max reached
          </p>
        )}

        {!outOfStock && !atMax && item.stock <= 5 && (
          <p className="text-xs" style={{ color: "var(--color-warning)" }}>
            Only {item.stock} left in stock
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2">
          <div
            className="flex items-center rounded-lg border"
            style={{ borderColor: "var(--color-border)" }}
          >
            <button
              type="button"
              onClick={() => change(item.quantity - 1)}
              disabled={saving || item.quantity <= 1}
              className="px-3 py-1.5 disabled:opacity-40"
              style={{ color: "var(--color-text)" }}
            >
              <FiMinus size={12} />
            </button>
            <span
              className="w-10 text-center text-sm font-semibold"
              style={{ color: "var(--color-text)" }}
            >
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => change(item.quantity + 1)}
              disabled={saving || atMax || outOfStock}
              className="px-3 py-1.5 disabled:opacity-40"
              style={{ color: "var(--color-text)" }}
            >
              <FiPlus size={12} />
            </button>
          </div>

          <span
            className="shrink-0 text-base font-bold"
            style={{ color: "var(--color-text)" }}
          >
            ${item.lineTotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;