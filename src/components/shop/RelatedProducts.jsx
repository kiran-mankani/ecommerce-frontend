import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import ProductCard from "./ProductCard";
import { getRandomProductsApi } from "../../services/productService";

const RelatedProducts = ({ currentProductId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  /* Fetch 12 random products (excluding current) */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        // 👇 CHANGE 6 → 12 (or 18, or however many you want)
        const data = await getRandomProductsApi(12, currentProductId);
        if (mounted) setProducts(data || []);
      } catch {
        if (mounted) setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [currentProductId]);

  /* Re-bind custom nav arrows once Swiper + refs are ready */
  useEffect(() => {
    if (!swiperRef.current) return;
    const swiper = swiperRef.current;
    if (
      swiper.params.navigation &&
      typeof swiper.params.navigation !== "boolean"
    ) {
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
      swiper.navigation.destroy();
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, [products]);

  // Hide section if no products
  if (!loading && products.length === 0) return null;

  return (
    <section className="mt-12">
      {/* Header + arrows */}
      <div className="mb-4 flex items-center justify-between">
        <h2
          className="text-lg font-bold sm:text-xl md:text-2xl"
          style={{ color: "var(--color-text)" }}
        >
          Related Products
        </h2>

        <div className="flex gap-2">
          <button
            ref={prevRef}
            type="button"
            aria-label="Previous products"
            className="flex h-9 w-9 items-center justify-center rounded-full border text-lg font-bold transition hover:shadow-md disabled:opacity-40 sm:h-10 sm:w-10"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            ‹
          </button>
          <button
            ref={nextRef}
            type="button"
            aria-label="Next products"
            className="flex h-9 w-9 items-center justify-center rounded-full border text-lg font-bold transition hover:shadow-md disabled:opacity-40 sm:h-10 sm:w-10"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            ›
          </button>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-xl"
              style={{ backgroundColor: "var(--color-surface-alt)" }}
            />
          ))}
        </div>
      ) : (
        <Swiper
          modules={[Autoplay, Navigation, A11y]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          slidesPerView={1.2}
          spaceBetween={12}
          loop
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          grabCursor
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 14 },
            768: { slidesPerView: 3, spaceBetween: 16 },
            1024: { slidesPerView: 4, spaceBetween: 18 },
          }}
          className="!pb-2"
        >
          {products.map((product) => (
            <SwiperSlide key={product._id} className="!h-auto">
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
};

export default RelatedProducts;