import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";
import useCart from "../../hooks/useCart";
import useAuth from "../../hooks/useAuth";
import useOrders from "../../hooks/useOrders";
import { fetchCartThunk } from "../../store/slices/cartSlice";
import { createOrderThunk } from "../../store/slices/orderSlice";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import CheckoutForm from "../../components/shop/CheckoutForm";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, subtotal, discount, total, loading } = useCart();
  const { saving } = useOrders();

  useEffect(() => {
    dispatch(fetchCartThunk());
  }, [dispatch]);

  const handleSubmit = async (shippingAddress) => {
    const res = await dispatch(createOrderThunk({ shippingAddress }));
    if (createOrderThunk.fulfilled.match(res)) {
      toast.success("Order placed");
      navigate(`/order-success/${res.payload.data._id}`);
    } else {
      toast.error(res.payload || "Failed to place order");
    }
  };

  if (loading && items.length === 0) return <Loader size="lg" />;

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyState
          title="Your cart is empty"
          message="Add products before checking out."
        />
        <div className="text-center">
          <Link
            to="/"
            className="text-sm font-semibold hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            ← Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const initial = {
    name: user?.name || "",
    phone: user?.profile?.phone || "",
    address: user?.profile?.address || "",
    city: user?.profile?.city || "",
    country: user?.profile?.country || "",
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium hover:underline"
        style={{ color: "var(--color-text-muted)" }}
      >
        <FiArrowLeft size={16} /> Back
      </button>

      <h1
        className="text-2xl font-bold"
        style={{ color: "var(--color-text)" }}
      >
        Checkout
      </h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div
          className="space-y-4 rounded-xl border p-6"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <h2
            className="text-base font-bold"
            style={{ color: "var(--color-text)" }}
          >
            Shipping Address
          </h2>
          <CheckoutForm
            initial={initial}
            loading={saving}
            onSubmit={handleSubmit}
          />
        </div>

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

          <ul className="space-y-2 text-sm">
            {items.map((it) => (
              <li key={it.productId} className="flex justify-between gap-3">
                <span
                  className="line-clamp-1"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {it.quantity}× {it.name}
                </span>
                <span style={{ color: "var(--color-text)" }}>
                  ${it.lineTotal.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          <div
            className="space-y-2 border-t pt-3 text-sm"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="flex justify-between">
              <span style={{ color: "var(--color-text-muted)" }}>Subtotal</span>
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
              className="flex justify-between border-t pt-2 text-base font-bold"
              style={{ borderColor: "var(--color-border)" }}
            >
              <span style={{ color: "var(--color-text)" }}>Total</span>
              <span style={{ color: "var(--color-text)" }}>
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;