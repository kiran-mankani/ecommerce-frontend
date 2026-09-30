import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  FiPlus,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import toast from "react-hot-toast";
import useCategories from "../../hooks/useCategories";
import {
  fetchCategoriesThunk,
  createCategoryThunk,
  updateCategoryThunk,
  deleteCategoryThunk,
} from "../../store/slices/categorySlice";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import CategoryTable from "../../components/admin/CategoryTable";
import CategoryForm from "../../components/admin/CategoryForm";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

const Categories = () => {
  const dispatch = useDispatch();
  const { items, pagination, loading, saving, error } = useCategories();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    dispatch(fetchCategoriesThunk({ page, limit: 10, search }));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (cat) => {
    setEditing(cat);
    setFormOpen(true);
  };

  const handleSubmit = async (payload) => {
    const thunk = editing
      ? updateCategoryThunk({ id: editing._id, payload })
      : createCategoryThunk(payload);
    const result = await dispatch(thunk);

    if (result.meta.requestStatus === "fulfilled") {
      toast.success(editing ? "Category updated" : "Category created");
      setFormOpen(false);
      setEditing(null);
      load();
    } else {
      toast.error(result.payload || "Operation failed");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleting) return;
    const result = await dispatch(deleteCategoryThunk(deleting._id));
    if (deleteCategoryThunk.fulfilled.match(result)) {
      toast.success("Category deleted");
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
            Categories
          </h1>
          <p
            className="text-xs sm:text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            Manage product categories
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md sm:w-auto"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <FiPlus size={16} /> Add Category
        </button>
      </div>

      {/* Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          load();
        }}
        className="flex gap-2"
      >
        <div className="relative max-w-md flex-1">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2"
            size={16}
            style={{ color: "var(--color-text-muted)" }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
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

      {/* Content */}
      {loading && items.length === 0 ? (
        <Loader size="lg" />
      ) : error && items.length === 0 ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <>
          <CategoryTable
            items={items}
            onEdit={openEdit}
            onDelete={(c) => setDeleting(c)}
          />

          {pagination.pages > 1 && (
            <div className="flex flex-col items-center justify-between gap-2 text-sm sm:flex-row">
              <p style={{ color: "var(--color-text-muted)" }}>
                Page {pagination.page} of {pagination.pages} —{" "}
                {pagination.total} total
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

      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-3 py-6 sm:px-4 sm:py-8"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.5)" }}
          onClick={() => !saving && (setFormOpen(false), setEditing(null))}
        >
          <div
            className="w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <CategoryForm
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
        title="Delete category?"
        message={
          deleting
            ? `This will permanently delete "${deleting.name}".`
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

export default Categories;