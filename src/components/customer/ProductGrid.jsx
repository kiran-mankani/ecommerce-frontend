import ProductCard from "./ProductCard";

const ProductGrid = ({ products, loading, error, emptyMessage = "No products found." }) => {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-xl border"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <div
              className="aspect-square"
              style={{ backgroundColor: "var(--color-surface-alt)" }}
            />
            <div className="space-y-2 p-3">
              <div
                className="h-3 w-3/4 rounded"
                style={{ backgroundColor: "var(--color-surface-alt)" }}
              />
              <div
                className="h-3 w-1/2 rounded"
                style={{ backgroundColor: "var(--color-surface-alt)" }}
              />
              <div
                className="mt-3 h-4 w-1/3 rounded"
                style={{ backgroundColor: "var(--color-surface-alt)" }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-xl border p-10 text-center text-sm"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
          color: "var(--color-danger)",
        }}
      >
        {error}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div
        className="rounded-xl border p-10 text-center text-sm"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
          color: "var(--color-text-muted)",
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
};

export default ProductGrid;