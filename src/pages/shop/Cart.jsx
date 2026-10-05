import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiArrowLeft, FiTrash2, FiAlertTriangle } from "react-icons/fi";
import toast from "react-hot-toast";
import useCart from "../../hooks/useCart";
import {
  fetchCartThunk,
  clearCartThunk,
  removeCartItemThunk,   // ✅ Correct name from your slice
} from "../../store/slices/cartSlice";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import CartItem from "../../components/shop/CartItem";
import ConfirmDialog from "../../components/common/ConfirmDialog";  // 🆕

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, subtotal, discount, total, count, loading, saving, error } =
    useCart();

  // 🆕 Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteAction, setDeleteAction] = useState({ type: null, id: null });

  useEffect(() => {
    dispatch(fetchCartThunk());
  }, [dispatch]);

  // 🆕 Open dialog — single item
  const handleRemoveClick = (productId) => {
    setDeleteAction({ type: "single", id: productId });
    setDialogOpen(true);
  };

  // 🆕 Open dialog — clear cart
  const handleClearCartClick = () => {
    setDeleteAction({ type: "all", id: null });
    setDialogOpen(true);
  };

  // 🆕 Confirm deletion
  const handleConfirmDelete = async () => {
    if (deleteAction.type === "single") {
      const res = await dispatch(removeCartItemThunk(deleteAction.id));
      if (removeCartItemThunk.fulfilled.match(res)) {
        toast.success("Item removed");
      } else {
        toast.error(res.payload || "Failed to remove");
      }
    } else if (deleteAction.type === "all") {
      const res = await dispatch(clearCartThunk());
      if (clearCartThunk.fulfilled.match(res)) {
        toast.success("Cart cleared");
      } else {
        toast.error(res.payload || "Failed to clear");
      }
    }
    setDialogOpen(false);
    setDeleteAction({ type: null, id: null });
  };

  // 🆕 Cancel dialog
  const handleCancelDelete = () => {
    setDialogOpen(false);
    setDeleteAction({ type: null, id: null });
  };

  const handleCheckout = () => {
    const hasOutOfStock = items.some((it) => it.stock <= 0);
    if (hasOutOfStock) {
      toast.error("Remove out-of-stock items before checkout");
      return;
    }
    const overStock = items.some((it) => it.quantity > it.stock);
    if (overStock) {
      toast.error("Some items exceed available stock");
      return;
    }
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

  const hasIssues = items.some(
    (it) => it.stock <= 0 || it.quantity > it.stock
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-xl font-bold sm:text-2xl"
            style={{ color: "var(--color-text)" }}
          >
            Your Cart
          </h1>
          <p
            className="text-xs sm:text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            {count} item{count === 1 ? "" : "s"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex w-fit items-center gap-2 text-sm font-medium hover:underline"
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
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-3">
            {hasIssues && (
              <div
                className="flex items-start gap-2 rounded-lg border p-3 text-sm"
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.08)",
                  borderColor: "rgba(239, 68, 68, 0.3)",
                  color: "var(--color-danger)",
                }}
              >
                <FiAlertTriangle size={18} className="mt-0.5 shrink-0" />
                <p>
                  Some items in your cart are out of stock or exceed available
                  quantity. Remove them to continue.
                </p>
              </div>
            )}

            {/* 🆕 Pass onRemoveClick */}
            {items.map((it) => (
              <CartItem
                key={it.productId}
                item={it}
                onRemoveClick={handleRemoveClick}
              />
            ))}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleClearCartClick}   // 🆕 opens dialog
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

          <aside
            className="h-fit space-y-4 rounded-xl border p-4 sm:p-5"
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
              disabled={hasIssues}
              className="flex w-full items-center justify-center rounded-lg py-3 text-sm font-semibold text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
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

      {/* 🆕 CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={dialogOpen}
        title={
          deleteAction.type === "all" ? "Clear entire cart?" : "Remove item?"
        }
        message={
          deleteAction.type === "all"
            ? "Are you sure you want to remove all items from your cart? This action cannot be undone."
            : "Are you sure you want to remove this item from your cart?"
        }
        confirmText={
          deleteAction.type === "all" ? "Yes, Clear Cart" : "Yes, Remove"
        }
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default Cart;