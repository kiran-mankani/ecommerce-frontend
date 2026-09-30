import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiArrowLeft } from "react-icons/fi";
import useAdminOrders from "../../hooks/useAdminOrders";
import { fetchAdminOrderByIdThunk } from "../../store/slices/adminOrderSlice";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import OrderStatusBadge from "../../components/shop/OrderStatusBadge";
import OrderStatusSelect from "../../components/admin/OrderStatusSelect";

const AdminOrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, loading, saving, error } = useAdminOrders();

  useEffect(() => {
    dispatch(fetchAdminOrderByIdThunk(id));
  }, [dispatch, id]);

  if (loading && !current) return <Loader size="lg" />;
  if (error && !current)
    return (
      <ErrorState
        message={error}
        onRetry={() => dispatch(fetchAdminOrderByIdThunk(id))}
      />
    );
  if (!current) return null;

  const order = current;

  return (
    <div className="space-y-4 sm:space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium hover:underline"
        style={{ color: "var(--color-text-muted)" }}
      >
        <FiArrowLeft size={16} /> Back
      </button>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1
            className="text-xl font-bold sm:text-2xl"
            style={{ color: "var(--color-text)" }}
          >
            Order Details
          </h1>
          <p
            className="mt-1 break-all text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            Order ID: {order._id}
          </p>
          <p
            className="mt-1 text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            Placed: {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.orderStatus} />
          <OrderStatusSelect
            orderId={order._id}
            currentStatus={order.orderStatus}
            disabled={saving}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_340px] lg:gap-6">
        <div
          className="space-y-3 rounded-xl border p-3 sm:p-4 md:p-5"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <h2
            className="text-sm font-bold sm:text-base"
            style={{ color: "var(--color-text)" }}
          >
            Items
          </h2>

          <ul
            className="divide-y"
            style={{ borderColor: "var(--color-border)" }}
          >
            {order.items.map((it, i) => (
              <li key={i} className="flex justify-between gap-3 py-3">
                <div className="min-w-0">
                  <Link
                    to={`/product/${it.productId}`}
                    className="break-words text-sm font-medium hover:underline"
                    style={{ color: "var(--color-text)" }}
                  >
                    {it.productName}
                  </Link>
                  <p
                    className="mt-0.5 text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    ${it.price.toFixed(2)} × {it.quantity}
                    {it.discount > 0 && ` · -${it.discount}%`}
                  </p>
                </div>
                <span
                  className="shrink-0 text-sm font-semibold"
                  style={{ color: "var(--color-text)" }}
                >
                  ${it.subtotal.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="space-y-4 lg:space-y-6">
          <div
            className="space-y-2 rounded-xl border p-3 sm:p-4 md:p-5"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <h3
              className="text-sm font-bold sm:text-base"
              style={{ color: "var(--color-text)" }}
            >
              Customer
            </h3>
            <p className="text-sm" style={{ color: "var(--color-text)" }}>
              {order.userId?.name || "—"}
            </p>
            <p className="break-all text-sm" style={{ color: "var(--color-text-muted)" }}>
              {order.userId?.email || ""}
            </p>
          </div>

          <div
            className="space-y-2 rounded-xl border p-3 sm:p-4 md:p-5"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <h3
              className="text-sm font-bold sm:text-base"
              style={{ color: "var(--color-text)" }}
            >
              Shipping Address
            </h3>
            <p className="text-sm" style={{ color: "var(--color-text)" }}>
              {order.shippingAddress.name}
            </p>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              {order.shippingAddress.phone}
            </p>
            <p className="break-words text-sm" style={{ color: "var(--color-text-muted)" }}>
              {order.shippingAddress.address}
            </p>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              {order.shippingAddress.city}, {order.shippingAddress.country}
            </p>
          </div>

          <div
            className="space-y-3 rounded-xl border p-3 sm:p-4 md:p-5"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <h3
              className="text-sm font-bold sm:text-base"
              style={{ color: "var(--color-text)" }}
            >
              Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: "var(--color-text-muted)" }}>
                  Subtotal
                </span>
                <span style={{ color: "var(--color-text)" }}>
                  ${order.subtotal.toFixed(2)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <span style={{ color: "var(--color-text-muted)" }}>
                    Discount
                  </span>
                  <span style={{ color: "var(--color-success)" }}>
                    −${order.discount.toFixed(2)}
                  </span>
                </div>
              )}
              <div
                className="flex justify-between border-t pt-2 text-base font-bold"
                style={{ borderColor: "var(--color-border)" }}
              >
                <span style={{ color: "var(--color-text)" }}>Total</span>
                <span style={{ color: "var(--color-text)" }}>
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminOrderDetail;