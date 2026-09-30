import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FiPlus, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import toast from "react-hot-toast";
import useProducts from "../../hooks/useProducts";
import useCategories from "../../hooks/useCategories";
import {
  fetchProductsThunk,
  createProductThunk,
  updateProductThunk,
  deleteProductThunk,
} from "../../store/slices/productSlice";
import { fetchCategoriesThunk } from "../../store/slices/categorySlice";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import ProductTable from "../../components/admin/ProductTable";
import ProductForm from "../../components/admin/ProductForm";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

const Products = () => {
  const dispatch = useDispatch();
  const { items, pagination, loading, saving, error } = useProducts();
  const { items: categories } = useCategories();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    dispatch(
      fetchProductsThunk({
        page,
        limit: 10,
        search,
        category: categoryFilter,
        status: statusFilter,
      })
    );
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, categoryFilter, statusFilter]);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategoriesThunk({ page: 1, limit: 100 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (p) => {
    setEditing(p);
    setFormOpen(true);
  };

  const handleSubmit = async (payload) => {
    const thunk = editing
      ? updateProductThunk({ id: editing._id, payload })
      : createProductThunk(payload);
    const result = await dispatch(thunk);

    if (result.meta.requestStatus === "fulfilled") {
      toast.success(editing ? "Product updated" : "Product created");
      setFormOpen(false);
      setEditing(null);
      load();
    } else {
      toast.error(result.payload || "Operation failed");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleting) return;
    const result = await dispatch(deleteProductThunk(deleting._id));
    if (deleteProductThunk.fulfilled.match(result)) {
      toast.success("Product deleted");
      setDeleting(null);
    } else {
      toast.error(result.payload || "Delete failed");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-xl font-bold sm:text-2xl"
            style={{ color: "var(--color-text)" }}
          >
            Products
          </h1>
          <p
            className="text-xs sm:text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            Manage your store products
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md sm:w-auto"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <FiPlus size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <div className="relative flex-1 sm:max-w-xs">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2"
            size={16}
            style={{ color: "var(--color-text-muted)" }}
          />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search products..."
            className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-input-border)",
              color: "var(--color-text)",
            }}
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-input-border)",
            color: "var(--color-text)",
          }}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-input-border)",
            color: "var(--color-text)",
          }}
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Content */}
      {loading && items.length === 0 ? (
        <Loader size="lg" />
      ) : error && items.length === 0 ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <>
          <ProductTable
            items={items}
            onEdit={openEdit}
            onDelete={(p) => setDeleting(p)}
          />

          {pagination.pages > 1 && (
            <div className="flex flex-col items-center justify-between gap-2 text-sm sm:flex-row">
              <p style={{ color: "var(--color-text-muted)" }}>
                Page {pagination.page} of {pagination.pages} — {pagination.total}{" "}
                total
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                  onClick={() =>
                    setPage((p) => Math.min(pagination.pages, p + 1))
                  }
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

      {/* Create / Edit modal */}
      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-3 py-6 sm:px-4 sm:py-8"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.5)" }}
          onClick={() => !saving && (setFormOpen(false), setEditing(null))}
        >
          <div
            className="w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <ProductForm
              initialData={editing}
              loading={saving}
              onSubmit={handleSubmit}
              onCancel={() => !saving && (setFormOpen(false), setEditing(null))}
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Delete product?"
        message={
          deleting ? `This will permanently delete "${deleting.name}".` : ""
        }
        confirmLabel="Delete"
        loading={saving}
        onConfirm={handleDeleteConfirm}
        onCancel={() => !saving && setDeleting(null)}
      />
    </div>
  );
};

export default Products;