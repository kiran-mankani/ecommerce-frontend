import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  FiShoppingCart,
  FiArrowLeft,
  FiMinus,
  FiPlus,
  FiZap,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import PriceDisplay from "../../components/shop/PriceDisplay";
import StockBadge from "../../components/shop/StockBadge";
import RelatedProducts from "../../components/shop/RelatedProducts";
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

  // Carousel state
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

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

  const images = product?.images?.length ? product.images : [];

  const goPrev = () => {
    if (images.length < 2) return;
    setActiveImg((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const goNext = () => {
    if (images.length < 2) return;
    setActiveImg((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  // Keyboard arrow support
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  // Touch handlers for swipe
  const onTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
    touchEndX.current = e.changedTouches[0].screenX;
    setIsDragging(true);
  };
  const onTouchMove = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
  };
  const onTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) < 40) return; // ignore small swipes
    if (diff > 0) goNext();
    else goPrev();
  };

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

  const outOfStock = product.stock <= 0 || product.inStock === false;
  const maxQty = Math.max(1, product.stock || 1);
  const isLowStock = !outOfStock && product.stock <= 5;
  const hasMultiple = images.length > 1;

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
        {/* ================== GALLERY / CAROUSEL ================== */}
        <div className="space-y-3">
          {/* Main image frame */}
          <div
            className="group relative aspect-square w-full select-none overflow-hidden rounded-xl border"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {images.length > 0 ? (
              <img
                src={images[activeImg]}
                alt={product.name}
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-300"
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

            {/* Prev arrow */}
            {hasMultiple && (
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur transition hover:bg-white md:opacity-0 md:group-hover:opacity-100"
                style={{ color: "var(--color-text)" }}
              >
                <FiChevronLeft size={18} />
              </button>
            )}

            {/* Next arrow */}
            {hasMultiple && (
              <button
                type="button"
                onClick={goNext}
                aria-label="Next image"
                className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur transition hover:bg-white md:opacity-0 md:group-hover:opacity-100"
                style={{ color: "var(--color-text)" }}
              >
                <FiChevronRight size={18} />
              </button>
            )}

            {/* Counter badge */}
            {hasMultiple && (
              <span className="absolute right-2 top-2 z-10 rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                {activeImg + 1} / {images.length}
              </span>
            )}

            {/* Dot indicators (mobile-friendly) */}
            {hasMultiple && (
              <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    aria-label={`Go to image ${i + 1}`}
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: i === activeImg ? 20 : 6,
                      backgroundColor:
                        i === activeImg
                          ? "#ffffff"
                          : "rgba(255, 255, 255, 0.6)",
                      boxShadow: "0 0 4px rgba(0,0,0,0.3)",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnails strip */}
          {hasMultiple && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((url, i) => {
                const active = i === activeImg;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    aria-label={`Show image ${i + 1}`}
                    className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition"
                    style={{
                      borderColor: active
                        ? "var(--color-primary)"
                        : "var(--color-border)",
                      opacity: active ? 1 : 0.7,
                    }}
                  >
                    <img
                      src={url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ================== INFO ================== */}
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

          {!isAdmin && (
            <div className="flex flex-col gap-3 pt-3">
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

      {/* ================== RELATED PRODUCTS SLIDER ================== */}
      <RelatedProducts currentProductId={product._id} />
    </div>
  );
};

export default ProductDetail;