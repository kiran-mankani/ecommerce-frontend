import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  FiShoppingCart,
  FiArrowLeft,
  FiMinus,
  FiPlus,
  FiZap,
} from "react-icons/fi";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import PriceDisplay from "../../components/shop/PriceDisplay";
import StockBadge from "../../components/shop/StockBadge";
import { getProductByIdApi } from "../../services/productService";
import { addToCartThunk } from "../../store/slices/cartSlice";
import useAuth from "../../hooks/useAuth";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getProductByIdApi(id);
      setProduct(res.data);
      setActiveImg(0);
      setQty(1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const goToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }
    try {
      setAdding(true);
      const res = await dispatch(
        addToCartThunk({ productId: product._id, quantity: qty })
      );
      if (addToCartThunk.fulfilled.match(res)) {
        navigate("/cart");
      } else {
        toast.error(res.payload || "Out of stock");
      }
    } finally {
      setAdding(false);
    }
  };

  const addToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    try {
      setAdding(true);
      const res = await dispatch(
        addToCartThunk({ productId: product._id, quantity: qty })
      );
      if (addToCartThunk.fulfilled.match(res)) {
        toast.success("Added to cart");
      } else {
        toast.error(res.payload || "Out of stock");
      }
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <Loader size="lg" />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!product) return null;

  const images = product.images?.length ? product.images : [];
  const outOfStock = product.stock <= 0 || product.inStock === false;
  const maxQty = Math.max(1, product.stock || 1);
  const isLowStock = !outOfStock && product.stock <= 5;

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium hover:underline"
        style={{ color: "var(--color-text-muted)" }}
      >
        <FiArrowLeft size={16} /> Back
      </button>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Gallery */}
        <div className="space-y-3">
          <div
            className="aspect-square w-full overflow-hidden rounded-xl border"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            {images.length > 0 ? (
              <img
                src={images[activeImg]}
                alt={product.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-5xl font-bold"
                style={{
                  backgroundColor: "rgba(37, 99, 235, 0.08)",
                  color: "var(--color-primary)",
                }}
              >
                {product.name?.[0]?.toUpperCase() || "?"}
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImg(i)}
                  className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2"
                  style={{
                    borderColor:
                      i === activeImg
                        ? "var(--color-primary)"
                        : "var(--color-border)",
                  }}
                >
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          {product.categoryId?.name && (
            <Link
              to={`/?category=${product.categoryId._id}`}
              className="text-xs font-semibold uppercase tracking-wide hover:underline"
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
              Brand: {product.brand}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <PriceDisplay
              price={product.price}
              discount={product.discount}
              size="lg"
            />
            <StockBadge stock={product.stock} />
          </div>

          {/* Low stock warning */}
          {isLowStock && (
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--color-warning)" }}
            >
              ⚡ Only {product.stock} left in stock — order soon!
            </p>
          )}

          <p
            className="whitespace-pre-line text-sm leading-relaxed"
            style={{ color: "var(--color-text)" }}
          >
            {product.description}
          </p>

          {/* Quantity + Action buttons — hidden for admin */}
          {!isAdmin && (
            <div className="flex flex-col gap-3 pt-3">
              {/* Quantity selector */}
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text)" }}
                >
                  Quantity
                </span>
                <div
                  className="flex items-center rounded-lg border"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1 || outOfStock}
                    className="px-3 py-2 disabled:opacity-40"
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
                    onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                    disabled={qty >= maxQty || outOfStock}
                    className="px-3 py-2 disabled:opacity-40"
                    style={{ color: "var(--color-text)" }}
                  >
                    <FiPlus size={14} />
                  </button>
                </div>

                {!outOfStock && (
                  <span
                    className="text-xs font-medium"
                    style={{
                      color:
                        product.stock <= 5
                          ? "var(--color-warning)"
                          : "var(--color-text-muted)",
                    }}
                  >
                    {product.stock <= 5
                      ? `Only ${product.stock} left!`
                      : `${product.stock} available`}
                  </span>
                )}
              </div>

              {/* Add to Cart + Buy Now */}
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={addToCart}
                  disabled={outOfStock || adding}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border py-3 text-sm font-semibold transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    borderColor: "var(--color-primary)",
                    color: "var(--color-primary)",
                    backgroundColor: "var(--color-surface)",
                  }}
                >
                  <FiShoppingCart size={16} />
                  {outOfStock ? "Out of stock" : "Add to Cart"}
                </button>

                <button
                  type="button"
                  onClick={goToCart}
                  disabled={outOfStock || adding}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  <FiZap size={16} />
                  {outOfStock ? "Unavailable" : "Buy Now"}
                </button>
              </div>
            </div>
          )}

          {isAdmin && (
            <div
              className="rounded-lg border p-3 text-xs"
              style={{
                backgroundColor: "var(--color-surface-alt)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-muted)",
              }}
            >
              You are viewing this as an admin. To manage this product, go to{" "}
              <Link
                to="/admin/products"
                className="font-semibold hover:underline"
                style={{ color: "var(--color-primary)" }}
              >
                Admin → Products
              </Link>
              .
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;