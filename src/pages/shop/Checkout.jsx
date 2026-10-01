import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";
import useCart from "../../hooks/useCart";
import useAuth from "../../hooks/useAuth";
import { fetchCartThunk } from "../../store/slices/cartSlice";
import { createCheckoutSessionApi } from "../../services/paymentService";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import CheckoutForm from "../../components/shop/CheckoutForm";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, subtotal, discount, total, loading } = useCart();

  useEffect(() => {
    dispatch(fetchCartThunk());
  }, [dispatch]);

  const handleSubmit = async (shippingAddress) => {
    try {
      console.log("🔍 [Checkout] raw items:", items);
      console.log("🔍 [Checkout] typeof items:", typeof items);
      console.log("🔍 [Checkout] isArray:", Array.isArray(items));

      // 🔧 Handle both `[...]` and `{ items: [...] }` shapes safely
      const rawArray = Array.isArray(items)
        ? items
        : Array.isArray(items?.items)
        ? items.items
        : [];

      console.log("🔍 [Checkout] rawArray:", rawArray);

      // Build a clean array of { productId, quantity }
      const stripeItems = rawArray
        .map((it) => ({
          productId:
            it?.productId ||
            it?.product?._id ||
            it?.product?.id ||
            (typeof it?.product === "string" ? it.product : null) ||
            it?._id ||
            it?.id,
          quantity: Number(it?.quantity) || 1,
        }))
        .filter((it) => it.productId);

      console.log("🔍 [Checkout] stripeItems:", stripeItems);

      if (stripeItems.length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      // ✅ Send a plain array — no wrapping
      const res = await createCheckoutSessionApi({
        items: stripeItems,
        shippingAddress,
      });

      if (!res?.url) {
        toast.error("Could not start payment. Please try again.");
        return;
      }

      // 🚀 Redirect to Stripe-hosted Checkout page
      window.location.href = res.url;
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error(
        err?.response?.data?.error || "Payment failed. Please try again."
      );
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
            loading={loading}
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
            {items.map((it, idx) => (
              <li
                key={it.productId || it._id || idx}
                className="flex justify-between gap-3"
              >
                <span
                  className="line-clamp-1"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {it.quantity}× {it.name || it.product?.name || "Item"}
                </span>
                <span style={{ color: "var(--color-text)" }}>
                  $
                  {Number(
                    it.lineTotal ||
                      (it.product?.price || it.price || 0) * it.quantity
                  ).toFixed(2)}
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
                ${Number(subtotal).toFixed(2)}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <span style={{ color: "var(--color-text-muted)" }}>
                  Discount
                </span>
                <span style={{ color: "var(--color-success)" }}>
                  −${Number(discount).toFixed(2)}
                </span>
              </div>
            )}
            <div
              className="flex justify-between border-t pt-2 text-base font-bold"
              style={{ borderColor: "var(--color-border)" }}
            >
              <span style={{ color: "var(--color-text)" }}>Total</span>
              <span style={{ color: "var(--color-text)" }}>
                ${Number(total).toFixed(2)}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;