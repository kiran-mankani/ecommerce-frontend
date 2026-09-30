import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiTrash2,
} from "react-icons/fi";
import toast from "react-hot-toast";
import useAdminOrders from "../../hooks/useAdminOrders";
import {
  fetchAdminOrdersThunk,
  deleteAdminOrderThunk,
} from "../../store/slices/adminOrderSlice";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import OrderStatusBadge from "../../components/shop/OrderStatusBadge";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { list, pagination, loading, saving, error } = useAdminOrders();
  const [params, setParams] = useSearchParams();

  const status = params.get("status") || "";
  const search = params.get("search") || "";
  const page = parseInt(params.get("page") || "1", 10);

  const [searchInput, setSearchInput] = useState(search);
  const [deleting, setDeleting] = useState(null);

  const update = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === "" || v === null || v === undefined) next.delete(k);
      else next.set(k, String(v));
    });
    if ("status" in patch || "search" in patch) next.delete("page");
    setParams(next);
  };

  useEffect(() => {
    dispatch(fetchAdminOrdersThunk({ status, search, page, limit: 10 }));
  }, [dispatch, status, search, page]);

  const submitSearch = (e) => {
    e.preventDefault();
    update({ search: searchInput.trim() });
  };

  const handleDeleteConfirm = async () => {
    if (!deleting) return;
    const res = await dispatch(deleteAdminOrderThunk(deleting._id));
    if (deleteAdminOrderThunk.fulfilled.match(res)) {
      toast.success("Order deleted");
      setDeleting(null);
    } else {
      toast.error(res.payload || "Delete failed");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1
          className="text-xl font-bold sm:text-2xl"
          style={{ color: "var(--color-text)" }}
        >
          Orders
        </h1>
        <p
          className="text-xs sm:text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          Manage all customer orders
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <form onSubmit={submitSearch} className="flex flex-1 gap-2">
          <div className="relative max-w-md flex-1">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2"
              size={16}
              style={{ color: "var(--color-text-muted)" }}
            />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, phone, or order id..."
              className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-input-border)",
                color: "var(--color-text)",
              }}
            />
          </div>
          <button
            type="submit"
            className="rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:bg-slate-50"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            Search
          </button>
        </form>

        <select
          value={status}
          onChange={(e) => update({ status: e.target.value })}
          className="rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-input-border)",
            color: "var(--color-text)",
          }}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Content */}
      {loading && list.length === 0 ? (
        <Loader size="lg" />
      ) : error && list.length === 0 ? (
        <ErrorState
          message={error}
          onRetry={() =>
            dispatch(
              fetchAdminOrdersThunk({ status, search, page, limit: 10 })
            )
          }
        />
      ) : list.length === 0 ? (
        <EmptyState
          title="No orders found"
          message="Try adjusting the filters."
        />
      ) : (
        <>
          <div
            className="overflow-hidden rounded-xl border"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead
                  style={{
                    backgroundColor: "var(--color-surface-alt)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  <tr>
                    <th className="px-3 py-3 font-semibold md:px-4">
                      Order ID
                    </th>
                    <th className="hidden px-3 py-3 font-semibold md:table-cell md:px-4">
                      Customer
                    </th>
                    <th className="hidden px-3 py-3 font-semibold lg:table-cell md:px-4">
                      Items
                    </th>
                    <th className="px-3 py-3 font-semibold md:px-4">Total</th>
                    <th className="px-3 py-3 font-semibold md:px-4">Status</th>
                    <th className="hidden px-3 py-3 font-semibold sm:table-cell md:px-4">
                      Date
                    </th>
                    <th className="px-3 py-3 text-right font-semibold md:px-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((o) => (
                    <tr
                      key={o._id}
                      className="border-t transition hover:bg-slate-50"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <td
                        className="break-all px-3 py-3 text-xs md:px-4"
                        style={{ color: "var(--color-text)" }}
                      >
                        <div className="font-medium">
                          {o.userId?.name || "—"}
                        </div>
                        <div
                          className="text-[10px]"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          {o._id}
                        </div>
                      </td>
                      <td
                        className="hidden px-3 py-3 md:table-cell md:px-4"
                        style={{ color: "var(--color-text)" }}
                      >
                        <div className="font-medium">
                          {o.userId?.name || "—"}
                        </div>
                        <div
                          className="text-xs"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          {o.userId?.email || ""}
                        </div>
                      </td>
                      <td
                        className="hidden px-3 py-3 lg:table-cell md:px-4"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {o.items.length}
                      </td>
                      <td
                        className="px-3 py-3 font-semibold md:px-4"
                        style={{ color: "var(--color-text)" }}
                      >
                        ${o.total.toFixed(2)}
                      </td>
                      <td className="px-3 py-3 md:px-4">
                        <OrderStatusBadge status={o.orderStatus} />
                      </td>
                      <td
                        className="hidden px-3 py-3 text-xs sm:table-cell md:px-4"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {new Date(o.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-3 md:px-4">
                        <div className="flex justify-end gap-1">
                          <Link
                            to={`/admin/orders/${o._id}`}
                            className="rounded-lg p-2 transition hover:bg-blue-50"
                            style={{ color: "var(--color-primary)" }}
                            title="View"
                          >
                            <FiEye size={16} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleting(o)}
                            className="rounded-lg p-2 transition hover:bg-red-50"
                            style={{ color: "var(--color-danger)" }}
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {pagination.pages > 1 && (
            <div className="flex flex-col items-center justify-between gap-2 text-sm sm:flex-row">
              <p style={{ color: "var(--color-text-muted)" }}>
                Page {pagination.page} of {pagination.pages} —{" "}
                {pagination.total} total
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => update({ page: pagination.page - 1 })}
                  disabled={pagination.page <= 1 || loading}
                  className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-text)",
                  }}
                >
                  <FiChevronLeft size={14} /> Prev
                </button>
                <button
                  onClick={() => update({ page: pagination.page + 1 })}
                  disabled={pagination.page >= pagination.pages || loading}
                  className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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
        </>
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Delete order?"
        message={
          deleting
            ? `This will permanently delete order ${deleting._id}. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        loading={saving}
        onConfirm={handleDeleteConfirm}
        onCancel={() => !saving && setDeleting(null)}
      />
    </div>
  );
};

export default AdminOrders;