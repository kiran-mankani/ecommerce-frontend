import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import useProducts from "../../hooks/useProducts";
import useCategories from "../../hooks/useCategories";
import { fetchProductsThunk } from "../../store/slices/productSlice";
import { fetchCategoriesThunk } from "../../store/slices/categorySlice";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import ProductGrid from "../../components/shop/ProductGrid";
import ProductFilters from "../../components/shop/ProductFilters";
import ProductSearchBar from "../../components/shop/ProductSearchBar";
import Pagination from "../../components/shop/Pagination";

const Home = () => {
  const dispatch = useDispatch();
  const { items, pagination, loading, error } = useProducts();
  const { items: categories } = useCategories();

  const [params, setParams] = useSearchParams();

  const search = params.get("search") || "";
  const category = params.get("category") || "";
  const page = parseInt(params.get("page") || "1", 10);

  const paramsKey = useMemo(
    () => `${search}|${category}|${page}`,
    [search, category, page]
  );

  /**
   * Update query params.
   * - Changing `search` clears `category` + resets `page`
   * - Changing `category` clears `search` + resets `page`
   * - Changing `page` keeps the other two
   */
  const update = (patch) => {
    const next = new URLSearchParams(params);

    Object.entries(patch).forEach(([k, v]) => {
      if (v === "" || v === null || v === undefined) next.delete(k);
      else next.set(k, String(v));
    });

    if ("search" in patch) {
      next.delete("category");
      next.delete("page");
    }
    if ("category" in patch) {
      next.delete("search");
      next.delete("page");
    }

    setParams(next);
  };

  useEffect(() => {
    dispatch(
      fetchProductsThunk({
        search,
        category,
        status: "active", // customers only see active products
        page,
        limit: 12,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey, dispatch]);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategoriesThunk({ page: 1, limit: 100, status: "active" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeCategoryName =
    categories.find((c) => c._id === category)?.name || "";

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div
        className="rounded-2xl p-6 text-white md:p-8"
        style={{
          background:
            "linear-gradient(160deg, var(--color-brand-gradient-start) 0%, var(--color-brand-gradient-end) 100%)",
        }}
      >
        <h1 className="text-2xl font-bold md:text-3xl">
          Shop the best products
        </h1>
        <p className="mt-1 max-w-xl text-sm text-white/80">
          Discover top brands, great prices, and fast delivery.
        </p>
      </div>

      {/* Mobile search */}
      <div className="md:hidden">
        <ProductSearchBar
          initial={search}
          onChange={(v) => update({ search: v })}
        />
      </div>

      {/* Layout */}
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        {/* Sidebar filters */}
        <div className="hidden md:block">
          <ProductFilters
            categories={categories}
            activeCategory={category}
            onCategoryChange={(id) => update({ category: id })}
            onClearAll={() => setParams(new URLSearchParams())}
          />
        </div>

        {/* Main */}
        <div className="space-y-5">
          {/* Desktop search + active filter */}
          <div className="hidden items-center gap-3 md:flex">
            <div className="flex-1">
              <ProductSearchBar
                initial={search}
                onChange={(v) => update({ search: v })}
              />
            </div>
            {activeCategoryName && (
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: "rgba(37, 99, 235, 0.1)",
                  color: "var(--color-primary)",
                }}
              >
                {activeCategoryName}
              </span>
            )}
          </div>

          {loading && items.length === 0 ? (
            <Loader size="lg" />
          ) : error && items.length === 0 ? (
            <ErrorState
              message={error}
              onRetry={() =>
                dispatch(
                  fetchProductsThunk({
                    search,
                    category,
                    status: "active",
                    page,
                    limit: 12,
                  })
                )
              }
            />
          ) : (
            <>
              <p
                className="text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                {pagination.total} product{pagination.total === 1 ? "" : "s"} found
              </p>

              <ProductGrid items={items} />

              {pagination.pages > 1 && (
                <div className="pt-4">
                  <Pagination
                    page={pagination.page}
                    pages={pagination.pages}
                    onChange={(p) => {
                      update({ page: p });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;