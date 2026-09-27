import { useState } from "react";

const ProductImageGallery = ({ images = [], alt = "" }) => {
  const [active, setActive] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div
        className="flex aspect-square w-full items-center justify-center rounded-xl border text-4xl font-bold"
        style={{
          backgroundColor: "rgba(37, 99, 235, 0.08)",
          borderColor: "var(--color-border)",
          color: "var(--color-primary)",
        }}
      >
        {alt?.[0]?.toUpperCase() || "?"}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        className="aspect-square w-full overflow-hidden rounded-xl border"
        style={{
          backgroundColor: "var(--color-surface-alt)",
          borderColor: "var(--color-border)",
        }}
      >
        <img
          src={images[active]}
          alt={alt}
          className="h-full w-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition"
              style={{
                borderColor:
                  i === active
                    ? "var(--color-primary)"
                    : "var(--color-border)",
              }}
            >
              <img
                src={url}
                alt={`${alt} ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;