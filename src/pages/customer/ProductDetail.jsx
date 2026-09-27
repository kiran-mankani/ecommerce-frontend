import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiShoppingCart, FiMinus, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import { getProductByIdApi } from "../../services/productService";
import ProductImageGallery from "../../components/customer/ProductImageGallery";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getProductByIdApi(id);
      setProduct(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load product";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <Loader size="lg" />;
  if (error || !product)
    return (
      <ErrorState message={error || "Product not found"} onRetry={load} />
    );

  const hasDiscount = product.discount > 0;
  const finalPrice = hasDiscount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const isOutOfStock = product.stock <= 0;
  const maxQty = Math.max(1, product.stock);

  const inc = () => setQty((q) => Math.min(maxQty, q + 1));
  const dec = () => setQty((q) => Math.max(1, q - 1));

  const handleAddToCart = () => {
    toast("Cart functionality arrives in Phase 8");
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium transition hover:opacity-70"
        style={{ color: "var(--color-text-muted)" }}
      >
        <FiArrowLeft size={16} /> Back
      </button>

      <div className="grid gap-8 md:grid-cols-2">
        <ProductImageGallery images={product.images} alt={product.name} />

        <div className="space-y-5">
          {product.categoryId?.name && (
            <Link
              to={`/?category=${product.categoryId._id}`}
              className="inline-block text-xs font-medium uppercase tracking-wide"
              style={{ color: "var(--color-primary)" }}
            >
              {product.categoryId.name}
            </Link>
          )}

          <h1
            className="text-2xl font-bold leading-tight md:text-3xl"
            style={{ color: "var(--color-text)" }}
          >
            {product.name}
          </h1>

          {product.brand && (
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Brand:{" "}
              <span style={{ color: "var(--color-text)" }}>
                {product.brand}
              </span>
            </p>
          )}

          <div className="flex items-baseline gap-3">
            <span
              className="text-3xl font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              ${finalPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <>
                <span
                  className="text-base line-through"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  ${product.price.toFixed(2)}
                </span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
                  style={{ backgroundColor: "var(--color-warning)" }}
                >
                  -{product.discount}%
                </span>
              </>
            )}
          </div>

          <div
            className="text-sm font-medium"
            style={{
              color: isOutOfStock
                ? "var(--color-danger)"
                : "var(--color-success)",
            }}
          >
            {isOutOfStock
              ? "Out of stock"
              : `In stock: ${product.stock} available`}
          </div>

          <div className="flex items-center gap-3">
            <div
              className="flex items-center rounded-lg border"
              style={{ borderColor: "var(--color-border)" }}
            >
              <button
                type="button"
                onClick={dec}
                disabled={isOutOfStock || qty <= 1}
                className="px-3 py-2.5 transition hover:bg-slate-50 disabled:opacity-50"
                style={{ color: "var(--color-text)" }}
              >
                <FiMinus size={14} />
              </button>
              <span
                className="w-10 text-center text-sm font-semibold"
                style={{ color: "var(--color-text)" }}
              >
                {qty}
              </span>
              <button
                type="button"
                onClick={inc}
                disabled={isOutOfStock || qty >= maxQty}
                className="px-3 py-2.5 transition hover:bg-slate-50 disabled:opacity-50"
                style={{ color: "var(--color-text)" }}
              >
                <FiPlus size={14} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <FiShoppingCart size={16} />
              {isOutOfStock ? "Out of stock" : "Add to Cart"}
            </button>
          </div>

          <div
            className="border-t pt-5"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h2
              className="mb-2 text-sm font-bold"
              style={{ color: "var(--color-text)" }}
            >
              Description
            </h2>
            <p
              className="whitespace-pre-line text-sm leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;