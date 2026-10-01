import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const SLIDES = [
  {
    title: "Shop the best products",
    subtitle: "Discover top brands, great prices, and fast delivery.",
    ctaLabel: "Start Shopping",
    ctaLink: "/?sort=-createdAt",
    bgGradient: "linear-gradient(135deg, #1e3fae 0%, #2b5bd6 100%)",
  },
  {
    title: "Fresh deals every day",
    subtitle: "Save up to 30% on selected items across all categories.",
    ctaLabel: "Browse Deals",
    ctaLink: "/?category=",
    bgGradient: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
  },
  {
    title: "Fast & secure delivery",
    subtitle: "Free shipping on orders over $50. Track every package live.",
    ctaLabel: "Shop Now",
    ctaLink: "/",
    bgGradient: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
  },
];

const HeroSlider = () => {
  const [active, setActive] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const total = SLIDES.length;

  const goNext = () => setActive((i) => (i + 1) % total);
  const goPrev = () => setActive((i) => (i - 1 + total) % total);

  // Auto-play every 5s
  useEffect(() => {
    const t = setInterval(goNext, 5000);
    return () => clearInterval(t);
  }, [active]);

  // Swipe handlers
  const onTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
    touchEndX.current = e.changedTouches[0].screenX;
  };
  const onTouchMove = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
  };
  const onTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) < 40) return;
    if (diff > 0) goNext();
    else goPrev();
  };

  return (
    <div
      className="group relative w-full overflow-hidden rounded-2xl"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className="flex min-w-full flex-col items-start justify-center gap-3 px-6 py-10 text-white sm:px-10 sm:py-14 md:py-16"
            style={{ background: s.bgGradient }}
          >
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
              {s.title}
            </h1>
            <p className="max-w-xl text-sm text-white/85 sm:text-base">
              {s.subtitle}
            </p>
            <Link
              to={s.ctaLink}
              className="mt-2 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-slate-100"
              style={{ color: "var(--color-primary)" }}
            >
              {s.ctaLabel}
              <span aria-hidden>→</span>
            </Link>
          </div>
        ))}
      </div>

      {/* Prev arrow */}
      <button
        type="button"
        onClick={goPrev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur transition hover:bg-white md:opacity-0 md:group-hover:opacity-100"
        style={{ color: "var(--color-text)" }}
      >
        <FiChevronLeft size={18} />
      </button>

      {/* Next arrow */}
      <button
        type="button"
        onClick={goNext}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur transition hover:bg-white md:opacity-0 md:group-hover:opacity-100"
        style={{ color: "var(--color-text)" }}
      >
        <FiChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === active ? 22 : 6,
              backgroundColor:
                i === active ? "#ffffff" : "rgba(255, 255, 255, 0.55)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;