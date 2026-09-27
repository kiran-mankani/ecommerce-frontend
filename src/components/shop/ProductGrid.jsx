import ProductCard from "./ProductCard";
import EmptyState from "../common/EmptyState";

const ProductGrid = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <EmptyState
        title="No products found"
        message="Try adjusting your search or filters."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
};

export default ProductGrid;