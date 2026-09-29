import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiArrowLeft, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import useCart from "../../hooks/useCart";
import {
  fetchCartThunk,
  clearCartThunk,
} from "../../store/slices/cartSlice";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import CartItem from "../../components/shop/CartItem";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, subtotal, discount, total, count, loading, saving, error } =
    useCart();

  useEffect(() => {
    dispatch(fetchCartThunk());
  }, [dispatch]);

  const handleClear = async () => {
    const res = await dispatch(clearCartThunk());
    if (clearCartThunk.fulfilled.match(res)) toast.success("Cart cleared");
    else toast.error(res.payload || "Failed to clear");
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading && items.length === 0) return <Loader size="lg" />;
  if (error && items.length === 0)
    return (
      <ErrorState
        message={error}
        onRetry={() => dispatch(fetchCartThunk())}
      />
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--color-text)" }}
          >
            Your Cart
          </h1>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            {count} item{count === 1 ? "" : "s"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium hover:underline"
          style={{ color: "var(--color-text-muted)" }}
        >
          <FiArrowLeft size={16} /> Continue shopping
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          message="Add some products to see them here."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Items */}
          <div className="space-y-3">
            {items.map((it) => (
              <CartItem key={it.productId} item={it} />
            ))}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleClear}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-red-50 disabled:opacity-60"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-danger)",
                }}
              >
                <FiTrash2 size={14} /> Clear cart
              </button>
            </div>
          </div>

          {/* Summary */}
          <aside
            className="h-fit space-y-4 rounded-xl border p-5"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <h3
              className="text-base font-bold"
              style={{ color: "var(--color-text)" }}
            >
              Order Summary
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: "var(--color-text-muted)" }}>
                  Subtotal
                </span>
                <span style={{ color: "var(--color-text)" }}>
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: "var(--color-text-muted)" }}>
                    Discount
                  </span>
                  <span style={{ color: "var(--color-success)" }}>
                    −${discount.toFixed(2)}
                  </span>
                </div>
              )}

              <div
                className="mt-2 flex justify-between border-t pt-3 text-base font-bold"
                style={{ borderColor: "var(--color-border)" }}
              >
                <span style={{ color: "var(--color-text)" }}>Total</span>
                <span style={{ color: "var(--color-text)" }}>
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="flex w-full items-center justify-center rounded-lg py-3 text-sm font-semibold text-white shadow-sm transition hover:shadow-md"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Proceed to Checkout
            </button>

            <Link
              to="/"
              className="block text-center text-xs hover:underline"
              style={{ color: "var(--color-text-muted)" }}
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;