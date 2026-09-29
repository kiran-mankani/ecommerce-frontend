import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiShield,
  FiPackage,
  FiShoppingBag,
  FiDollarSign,
  FiAlertTriangle,
  FiCheckCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import AdminStatCard from "../../components/admin/AdminStatCard";
import { getDashboardApi } from "../../services/adminService";

/* Convert /uploads/... to a full URL pointing at the backend */
const resolveImageUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;

  const apiBase =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
  const origin = apiBase.replace(/\/api\/v1\/?$/, "");

  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getDashboardApi();
      setData(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load dashboard";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <Loader size="lg" />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!data) return null;

  const { totals, recentOrders, recentProducts, topProducts } = data;

  return (
    <div className="space-y-8">
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--color-text)" }}
        >
          Dashboard
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          Live overview of your store
        </p>
      </div>

      {/* Primary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          label="Revenue"
          value={`$${(totals?.revenue ?? 0).toFixed(2)}`}
          icon={FiDollarSign}
          accent="success"
        />
        <AdminStatCard
          label="Orders"
          value={totals?.orders ?? 0}
          icon={FiShoppingBag}
          accent="primary"
        />
        <AdminStatCard
          label="Products"
          value={totals?.products ?? 0}
          icon={FiPackage}
          accent="warning"
        />
        <AdminStatCard
          label="Customers"
          value={totals?.customers ?? 0}
          icon={FiUsers}
          accent="primary"
        />
      </div>

      {/* Secondary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard
          label="Pending Orders"
          value={totals?.pendingOrders ?? 0}
          icon={FiAlertTriangle}
          accent="warning"
        />
        <AdminStatCard
          label="Delivered"
          value={totals?.deliveredOrders ?? 0}
          icon={FiCheckCircle}
          accent="success"
        />
        <AdminStatCard
          label="Out of Stock"
          value={totals?.outOfStockProducts ?? 0}
          icon={FiAlertTriangle}
          accent="danger"
        />
        <AdminStatCard
          label="Admins"
          value={totals?.admins ?? 0}
          icon={FiShield}
          accent="primary"
        />
      </div>

      {/* Recent Orders + Recent Products */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentCard
          title="Recent Orders"
          viewAllLink="/admin/orders"
          items={recentOrders || []}
          emptyMessage="No orders yet."
          renderRow={(o) => (
            <Link
              key={o._id}
              to={`/admin/orders/${o._id}`}
              className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 transition hover:bg-slate-50"
            >
              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-sm font-medium"
                  style={{ color: "var(--color-text)" }}
                >
                  {o.userId?.name || "Customer"}
                </p>
                <p
                  className="truncate text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {new Date(o.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-text)" }}
                >
                  ${(o.total ?? 0).toFixed(2)}
                </p>
                <p
                  className="text-[10px] uppercase tracking-wide"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {o.orderStatus}
                </p>
              </div>
            </Link>
          )}
        />

        <RecentCard
          title="Recent Products"
          viewAllLink="/admin/products"
          items={recentProducts || []}
          emptyMessage="No products yet."
          renderRow={(p) => (
            <Link
              key={p._id}
              to={`/product/${p._id}`}
              className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-slate-50"
            >
              <ProductThumb src={p.images?.[0]} name={p.name} size={40} />
              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-sm font-medium"
                  style={{ color: "var(--color-text)" }}
                >
                  {p.name}
                </p>
                <p
                  className="truncate text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {p.categoryId?.name || "—"} · stock {p.stock}
                </p>
              </div>
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--color-text)" }}
              >
                ${(p.price ?? 0).toFixed(2)}
              </p>
            </Link>
          )}
        />
      </div>

      {/* Top-selling products */}
      <div
        className="rounded-xl border p-5"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <h3
          className="mb-3 text-base font-bold"
          style={{ color: "var(--color-text)" }}
        >
          Top Selling Products
        </h3>

        {(!topProducts || topProducts.length === 0) ? (
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            No sales yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {topProducts.map((t, i) => (
              <li
                key={t.productId}
                className="flex items-center justify-between gap-3 rounded-lg px-3 py-2"
                style={{ backgroundColor: "var(--color-surface-alt)" }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                    style={{
                      backgroundColor: "rgba(37, 99, 235, 0.1)",
                      color: "var(--color-primary)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--color-text)" }}
                  >
                    {t.name}
                  </span>
                </div>
                <div className="text-right">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--color-text)" }}
                  >
                    {t.quantity} sold
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    ${(t.revenue ?? 0).toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

/* ---------------- helper components ---------------- */

const RecentCard = ({ title, viewAllLink, items, emptyMessage, renderRow }) => (
  <div
    className="rounded-xl border p-5"
    style={{
      backgroundColor: "var(--color-surface)",
      borderColor: "var(--color-border)",
    }}
  >
    <div className="mb-3 flex items-center justify-between">
      <h3
        className="text-base font-bold"
        style={{ color: "var(--color-text)" }}
      >
        {title}
      </h3>
      <Link
        to={viewAllLink}
        className="text-xs font-semibold hover:underline"
        style={{ color: "var(--color-primary)" }}
      >
        View all
      </Link>
    </div>

    {items.length === 0 ? (
      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
        {emptyMessage}
      </p>
    ) : (
      <div className="space-y-1">{items.map(renderRow)}</div>
    )}
  </div>
);

/* Image with letter fallback when the URL fails or is blocked */
const ProductThumb = ({ src, name = "", size = 40 }) => {
  const url = resolveImageUrl(src);
  const [errored, setErrored] = useState(false);

  if (url && !errored) {
    return (
      <img
        src={url}
        alt={name}
        style={{ width: size, height: size }}
        className="shrink-0 rounded-lg object-cover"
        onError={() => setErrored(true)}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        color: "var(--color-primary)",
      }}
      className="flex shrink-0 items-center justify-center rounded-lg text-xs font-bold"
    >
      {name?.[0]?.toUpperCase() || "?"}
    </div>
  );
};

export default Dashboard;