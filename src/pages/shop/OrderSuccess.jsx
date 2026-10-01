import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiCheckCircle, FiPackage, FiXCircle } from "react-icons/fi";
import { clearCart } from "../../store/slices/cartSlice";
import { verifyCheckoutSessionApi } from "../../services/paymentService";
import Loader from "../../components/common/Loader";

const OrderSuccess = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const sessionId = searchParams.get("session_id");

  // Stripe-specific state
  const [verifying, setVerifying] = useState(Boolean(sessionId));
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState(null);

  // Verify the Stripe session once on mount
  useEffect(() => {
    if (!sessionId) return;

    let mounted = true;

    (async () => {
      try {
        setVerifying(true);
        const res = await verifyCheckoutSessionApi(sessionId);

        if (!mounted) return;

        if (res?.paid) {
          setPaid(true);
          // ✅ Clear cart and reset total to 0
          dispatch(clearCart());
        } else {
          setError("Payment not completed");
        }
      } catch (e) {
        if (mounted) {
          setError(e?.response?.data?.error || "Verification failed");
        }
      } finally {
        if (mounted) setVerifying(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [sessionId, dispatch]);

  /* -------------------- Stripe: verifying -------------------- */
  if (sessionId && verifying) {
    return <Loader size="lg" />;
  }

  /* -------------------- Stripe: failed -------------------- */
  if (sessionId && error) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <div
          className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.12)",
            color: "#ef4444",
          }}
        >
          <FiXCircle size={36} />
        </div>

        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
          Payment Failed
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
          {error}
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/cart"
            className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Back to Cart
          </Link>
          <Link
            to="/"
            className="rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:bg-slate-50"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  /* -------------------- Stripe: paid -------------------- */
  if (sessionId && paid) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <div
          className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full"
          style={{
            backgroundColor: "rgba(34, 197, 94, 0.12)",
            color: "var(--color-success)",
          }}
        >
          <FiCheckCircle size={36} />
        </div>

        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
          Payment Successful!
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
          Thank you. Your order has been received.
        </p>
        <p
          className="mt-3 break-all rounded-lg px-3 py-2 text-xs"
          style={{
            backgroundColor: "var(--color-surface-alt)",
            color: "var(--color-text-muted)",
          }}
        >
          Session ID: {sessionId}
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/orders"
            className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <FiPackage size={16} /> My Orders
          </Link>
          <Link
            to="/"
            className="rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:bg-slate-50"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  /* -------------------- Legacy: /order-success/:id -------------------- */
  return (
    <div className="mx-auto max-w-xl text-center">
      <div
        className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full"
        style={{
          backgroundColor: "rgba(34, 197, 94, 0.12)",
          color: "var(--color-success)",
        }}
      >
        <FiCheckCircle size={36} />
      </div>

      <h1
        className="text-2xl font-bold"
        style={{ color: "var(--color-text)" }}
      >
        Order Placed!
      </h1>
      <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
        Thank you. Your order has been received.
      </p>
      <p
        className="mt-3 break-all rounded-lg px-3 py-2 text-xs"
        style={{
          backgroundColor: "var(--color-surface-alt)",
          color: "var(--color-text-muted)",
        }}
      >
        Order ID: {id}
      </p>

      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          to={`/order/${id}`}
          className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <FiPackage size={16} /> View Order
        </Link>
        <Link
          to="/"
          className="rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:bg-slate-50"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text)",
          }}
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;