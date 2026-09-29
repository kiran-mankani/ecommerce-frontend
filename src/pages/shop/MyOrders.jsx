import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useOrders from "../../hooks/useOrders";
import { fetchMyOrdersThunk } from "../../store/slices/orderSlice";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import OrderStatusBadge from "../../components/shop/OrderStatusBadge";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { list, pagination, loading, error } = useOrders();
  const [params, setParams] = useSearchParams();
  const page = parseInt(params.get("page") || "1", 10);
  const [loadedOnce, setLoadedOnce] = useState(false);

  useEffect(() => {
    dispatch(fetchMyOrdersThunk({ page, limit: 10 })).finally(() =>
      setLoadedOnce(true)
    );
  }, [dispatch, page]);

  const goToPage = (p) => {
    const next = new URLSearchParams(params);
    if (p <= 1) next.delete("page");
    else next.set("page", String(p));
    setParams(next);
  };

  if (loading && !loadedOnce) return <Loader size="lg" />;
  if (error && list.length === 0)
    return (
      <ErrorState
        message={error}
        onRetry={() => dispatch(fetchMyOrdersThunk({ page, limit: 10 }))}
      />
    );

  if (list.length === 0) {
    return (
      <div className="space-y-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--color-text)" }}
        >
          My Orders
        </h1>
        <EmptyState
          title="No orders yet"
          message="Your order history will appear here once you place an order."
        />
        <div className="text-center">
          <Link
            to="/"
            className="text-sm font-semibold hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            ← Start shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1
        className="text-2xl font-bold"
        style={{ color: "var(--color-text)" }}
      >
        My Orders
      </h1>

      <ul className="space-y-3">
        {list.map((o) => (
          <li
            key={o._id}
            className="rounded-xl border p-4 transition hover:shadow-md"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <Link to={`/order/${o._id}`} className="block space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Order ID
                  </p>
                  <p
                    className="break-all text-xs"
                    style={{ color: "var(--color-text)" }}
                  >
                    {o._id}
                  </p>
                </div>
                <OrderStatusBadge status={o.orderStatus} />
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span style={{ color: "var(--color-text-muted)" }}>
                  {o.items.length} item{o.items.length === 1 ? "" : "s"}
                </span>
                <span style={{ color: "var(--color-text-muted)" }}>·</span>
                <span style={{ color: "var(--color-text-muted)" }}>
                  {new Date(o.createdAt).toLocaleString()}
                </span>
              </div>

              <div
                className="flex items-center justify-between border-t pt-3"
                style={{ borderColor: "var(--color-border)" }}
              >
                <span
                  className="text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Total
                </span>
                <span
                  className="text-base font-bold"
                  style={{ color: "var(--color-text)" }}
                >
                  ${o.total.toFixed(2)}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p style={{ color: "var(--color-text-muted)" }}>
            Page {pagination.page} of {pagination.pages}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => goToPage(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium disabled:opacity-40"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text)",
              }}
            >
              <FiChevronLeft size={14} /> Prev
            </button>
            <button
              onClick={() => goToPage(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium disabled:opacity-40"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text)",
              }}
            >
              Next <FiChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
