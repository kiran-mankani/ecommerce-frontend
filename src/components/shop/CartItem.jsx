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

  const change = async (qty) => {
    if (qty < 1) return;
    const res = await dispatch(
      updateCartItemThunk({ productId: item.productId, quantity: qty })
    );
    if (updateCartItemThunk.rejected.match(res)) {
      toast.error(res.payload || "Failed to update");
    }
  };

  const remove = async () => {
    const res = await dispatch(removeCartItemThunk(item.productId));
    if (removeCartItemThunk.fulfilled.match(res)) toast.success("Removed");
    else toast.error(res.payload || "Failed to remove");
  };

  const outOfStock = item.stock <= 0;

  return (
    <div
      className="flex gap-4 rounded-xl border p-4"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <Link
        to={`/product/${item.productId}`}
        className="shrink-0 overflow-hidden rounded-lg"
      >
        <ProductImage src={item.image} alt={item.name} size={80} />
      </Link>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <Link
            to={`/product/${item.productId}`}
            className="line-clamp-2 text-sm font-semibold hover:underline"
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
          <p className="text-xs font-semibold" style={{ color: "var(--color-danger)" }}>
            Out of stock — remove to continue
          </p>
        )}

        <div className="mt-auto flex items-center justify-between">
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
              disabled={saving || item.quantity >= item.stock}
              className="px-3 py-1.5 disabled:opacity-40"
              style={{ color: "var(--color-text)" }}
            >
              <FiPlus size={12} />
            </button>
          </div>

          <span
            className="text-base font-bold"
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