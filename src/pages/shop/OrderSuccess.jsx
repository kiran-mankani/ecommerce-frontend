import { Link, useParams } from "react-router-dom";
import { FiCheckCircle, FiPackage } from "react-icons/fi";

const OrderSuccess = () => {
  const { id } = useParams();

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
