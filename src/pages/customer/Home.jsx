import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useProducts from "../../hooks/useProducts";
import useCategories from "../../hooks/useCategories";
import useProductFilters from "../../hooks/useProductFilters";
import { fetchProductsThunk } from "../../store/slices/productSlice";
import { fetchCategoriesThunk } from "../../store/slices/categorySlice";
import ProductGrid from "../../components/customer/ProductGrid";
import ProductFilters from "../../components/customer/ProductFilters";

const Home = () => {
  const dispatch = useDispatch();
  const { items, pagination, loading, error } = useProducts();
  const { items: categories } = useCategories();
  const { filters, update, clear } = useProductFilters();

  useEffect(() => {
    dispatch(
      fetchProductsThunk({
        page: filters.page,
        limit: 12,
        search: filters.search,
        category: filters.category,
        status: filters.status,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        sort: filters.sort,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategoriesThunk({ page: 1, limit: 100, status: "active" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--color-text)" }}
        >
          Shop Our Products
        </h1>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          {pagination.total} product{pagination.total === 1 ? "" : "s"} available
        </p>
      </div>

      <ProductFilters
        search={filters.search}
        onSearchChange={(v) => update({ search: v, page: 1 })}
        category={filters.category}
        onCategoryChange={(v) => update({ category: v, page: 1 })}
        categories={categories}
        status={filters.status}
        onStatusChange={(v) => update({ status: v, page: 1 })}
        minPrice={filters.minPrice}
        onMinPriceChange={(v) => update({ minPrice: v, page: 1 })}
        maxPrice={filters.maxPrice}
        onMaxPriceChange={(v) => update({ maxPrice: v, page: 1 })}
        sort={filters.sort}
        onSortChange={(v) => update({ sort: v, page: 1 })}
        onClear={clear}
      />

      <ProductGrid
        products={items}
        loading={loading}
        error={error}
        emptyMessage="No products match your filters."
      />

      {pagination.pages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p style={{ color: "var(--color-text-muted)" }}>
            Page {pagination.page} of {pagination.pages}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => update({ page: Math.max(1, filters.page - 1) })}
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
              type="button"
              onClick={() =>
                update({ page: Math.min(pagination.pages, filters.page + 1) })
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
    </div>
  );
};

export default Home;