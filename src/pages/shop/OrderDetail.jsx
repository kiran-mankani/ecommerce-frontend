import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiArrowLeft } from "react-icons/fi";
import useOrders from "../../hooks/useOrders";
import { fetchOrderByIdThunk } from "../../store/slices/orderSlice";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import OrderStatusBadge from "../../components/shop/OrderStatusBadge";

const OrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, loading, error } = useOrders();

  useEffect(() => {
    dispatch(fetchOrderByIdThunk(id));
  }, [dispatch, id]);

  if (loading && !current) return <Loader size="lg" />;
  if (error && !current)
    return (
      <ErrorState
        message={error}
        onRetry={() => dispatch(fetchOrderByIdThunk(id))}
      />
    );
  if (!current) return null;

  const order = current;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium hover:underline"
        style={{ color: "var(--color-text-muted)" }}
      >
        <FiArrowLeft size={16} /> Back
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1
            className="text-2xl font-bold"
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
        </div>
        <OrderStatusBadge status={order.orderStatus} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div
          className="space-y-3 rounded-xl border p-5"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <h2
            className="text-base font-bold"
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
                <div>
                  <Link
                    to={`/product/${it.productId}`}
                    className="text-sm font-medium hover:underline"
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
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-text)" }}
                >
                  ${it.subtotal.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="space-y-6">
          <div
            className="space-y-3 rounded-xl border p-5"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <h3
              className="text-base font-bold"
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

          <div
            className="space-y-2 rounded-xl border p-5"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <h3
              className="text-base font-bold"
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
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              {order.shippingAddress.address}
            </p>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              {order.shippingAddress.city}, {order.shippingAddress.country}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default OrderDetail;
