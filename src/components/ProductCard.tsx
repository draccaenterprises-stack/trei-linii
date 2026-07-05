import { Link } from "@tanstack/react-router";
import { ArrowLeft, Flame, PackageCheck, Percent } from "lucide-react";
import * as React from "react";
import type { Product } from "@/lib/mock-data";
import { formatRON } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { useSite } from "@/lib/site-context";
import { getStockForColor } from "@/lib/shopify";

const badgeStyles: Record<string, string> = {
  noutate: "bg-charcoal text-cream",
  limitat: "bg-washed-red text-cream",
  "stoc limitat": "bg-olive text-cream",
};

const EASING = "cubic-bezier(0.16, 1, 0.3, 1)";

/** Full-screen animated quick-view overlay. */
export function QuickViewOverlay({
  product,
  origin,
  onClose,
}: {
  product: Product;
  origin: { x: number; y: number; width: number; height: number };
  onClose: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const paperRef = React.useRef<HTMLDivElement>(null);
  const cloneRef = React.useRef<HTMLDivElement>(null);
  const cloneTextRef = React.useRef<HTMLSpanElement>(null);
  const lineRef = React.useRef<HTMLDivElement>(null);
  const bandsRef = React.useRef<HTMLDivElement>(null);
  const bandRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const galleryRef = React.useRef<HTMLDivElement>(null);
  const animationsRef = React.useRef<Animation[]>([]);
  const closingRef = React.useRef(false);

  // body scroll lock
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  React.useEffect(() => {
    product.images.forEach((src) => {
      const img = new Image();
      img.src = src;
      if (typeof img.decode === "function") {
        void img.decode().catch(() => undefined);
      }
    });

    const cloneFinal = `translate3d(${origin.width / 2 - 26}px, ${origin.height / 2 - 8}px, 0) scale(${52 / origin.width}, ${16 / origin.height})`;
    const baseOptions: KeyframeAnimationOptions = { fill: "forwards", easing: EASING };
    const animations: Animation[] = [];

    const clone = cloneRef.current;
    const cloneText = cloneTextRef.current;
    const line = lineRef.current;
    const paper = paperRef.current;
    const gallery = galleryRef.current;
    const bands = bandRefs.current.filter(Boolean) as HTMLDivElement[];

    if (clone) {
      animations.push(
        clone.animate(
          [{ transform: "translate3d(0, 0, 0)" }, { transform: cloneFinal }],
          { ...baseOptions, duration: 420 },
        ),
        clone.animate([{ opacity: 1 }, { opacity: 0 }], {
          ...baseOptions,
          duration: 150,
          delay: 420,
        }),
      );
    }

    if (cloneText) {
      animations.push(
        cloneText.animate([{ opacity: 1 }, { opacity: 0 }], {
          ...baseOptions,
          duration: 150,
        }),
      );
    }

    if (line) {
      animations.push(
        line.animate(
          [
            { opacity: 1, transform: "scaleY(0.012)" },
            { opacity: 1, transform: "scaleY(1)" },
          ],
          { ...baseOptions, duration: 580, delay: 420 },
        ),
        line.animate([{ opacity: 1 }, { opacity: 0 }], {
          ...baseOptions,
          duration: 150,
          delay: 1020,
        }),
      );
    }

    bands.forEach((band, index) => {
      animations.push(
        band.animate(
          [
            { opacity: 1, transform: "scaleX(0.0045)" },
            { opacity: 1, transform: "scaleX(1)" },
          ],
          { ...baseOptions, duration: 640, delay: 1020 + index * 100 },
        ),
      );
    });

    if (paper) {
      animations.push(
        paper.animate([{ opacity: 0 }, { opacity: 1 }], {
          ...baseOptions,
          duration: 200,
          delay: 1020,
        }),
      );
    }

    if (gallery) {
      animations.push(
        gallery.animate([{ opacity: 0 }, { opacity: 1 }], {
          ...baseOptions,
          duration: 460,
          delay: 1700,
        }),
        gallery.animate([{ transform: "scale(0.94)" }, { transform: "scale(1)" }], {
          ...baseOptions,
          duration: 620,
          delay: 1700,
        }),
      );
    }

    animationsRef.current = animations;
    let cancelled = false;
    void Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
      if (!cancelled && !closingRef.current) setOpen(true);
    });

    return () => {
      cancelled = true;
      animations.forEach((animation) => animation.cancel());
    };
  }, [origin.height, origin.width, product.images]);

  const handleClose = React.useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;

    animationsRef.current.forEach((animation) => {
      try {
        animation.commitStyles();
      } catch {
        // Ignore browsers that cannot commit styles for a cancelled animation.
      }
      animation.cancel();
    });

    const closeOptions: KeyframeAnimationOptions = { fill: "forwards", easing: EASING };
    const closeAnimations: Animation[] = [];

    if (galleryRef.current) {
      closeAnimations.push(
        galleryRef.current.animate([{ opacity: getComputedStyle(galleryRef.current).opacity }, { opacity: 0 }], {
          ...closeOptions,
          duration: 160,
        }),
      );
    }

    if (bandsRef.current) {
      closeAnimations.push(
        bandsRef.current.animate([{ opacity: getComputedStyle(bandsRef.current).opacity }, { opacity: 0 }], {
          ...closeOptions,
          duration: 160,
        }),
      );
    }

    if (rootRef.current) {
      closeAnimations.push(
        rootRef.current.animate([{ opacity: getComputedStyle(rootRef.current).opacity }, { opacity: 0 }], {
          ...closeOptions,
          duration: 200,
        }),
      );
    }

    if (closeAnimations.length === 0) {
      onClose();
      return;
    }

    void Promise.allSettled(closeAnimations.map((animation) => animation.finished)).then(onClose);
  }, [onClose]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  // origin coordinates (viewport) – for transform origins
  const originX = `${origin.x + origin.width / 2}px`;
  const originY = `${origin.y + origin.height / 2}px`;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100]"
      style={{
        background: "transparent",
        opacity: 1,
        willChange: "opacity",
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Galerie ${product.title}`}
    >
      {/* Paper background (own layer, only opacity animates) */}
      <div
        ref={paperRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          background: "#faf8f2",
          opacity: 0,
          pointerEvents: "none",
          willChange: "opacity",
        }}
      />

      {/* Shrinking clone of the button — only transform + opacity animate.
          No border-radius transition, no backdrop-filter during animation. */}
      <div
        ref={cloneRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          left: origin.x,
          top: origin.y,
          width: origin.width,
          height: origin.height,
          // Opaque approximation of the translucent button — avoids backdrop-filter repaints on mobile.
          background: "#e8e5dd",
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transformOrigin: "center center",
          transform: "translate3d(0, 0, 0)",
          opacity: 1,
          pointerEvents: "none",
          willChange: "transform, opacity",
          backfaceVisibility: "hidden",
        }}
      >
        <span
          ref={cloneTextRef}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#1a1a18",
            opacity: 1,
            willChange: "opacity",
          }}
        >
          Vezi produs
        </span>
      </div>

      {/* Vertical line — transform scaleY only */}
      <div
        ref={lineRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          left: origin.x + origin.width / 2 - 2.5,
          top: 0,
          width: 5,
          height: "100vh",
          background: "#1a1a18",
          transformOrigin: `center ${originY}`,
          transform: "scaleY(0.012)",
          opacity: 0,
          willChange: "transform, opacity",
          backfaceVisibility: "hidden",
        }}
      />

      {/* Three stacked bands — transform scaleX only */}
      <div
        ref={bandsRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          display: "grid",
          gridTemplateRows: "1fr 1.2fr 1.3fr",
          gap: 10,
          pointerEvents: "none",
          opacity: 1,
          willChange: "opacity",
        }}
      >
        {["#1a1a18", "#1a1a18", "#ff006f"].map((color, i) => (
          <div
            key={i}
            ref={(node) => {
              bandRefs.current[i] = node;
            }}
            style={{
              background: color,
              transformOrigin: `${originX} center`,
              transform: "scaleX(0.0045)",
              opacity: 0,
              willChange: "transform, opacity",
              backfaceVisibility: "hidden",
            }}
          />
        ))}
      </div>


      {/* Gallery */}
      <GalleryLayer
        product={product}
        layerRef={galleryRef}
        interactive={open}
        onClose={handleClose}
      />
    </div>
  );
}

function GalleryLayer({
  product,
  layerRef,
  interactive,
  onClose,
}: {
  product: Product;
  layerRef: React.RefObject<HTMLDivElement | null>;
  interactive: boolean;
  onClose: () => void;
}) {
  return (
    <div
      ref={layerRef}
      className="fixed inset-0 flex flex-col"
      style={{
        background: "#faf8f2",
        opacity: 0,
        transform: "scale(0.94)",
        pointerEvents: interactive ? "auto" : "none",
        zIndex: 2,
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
      }}
    >
      {/* Top bar */}
      <div className="flex items-center gap-4 px-5 md:px-10 pt-5 md:pt-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Inchide galeria"
          className="inline-flex items-center justify-center border border-charcoal bg-transparent text-charcoal hover:bg-charcoal hover:text-cream transition-colors"
          style={{ width: 44, height: 44 }}
        >
          <ArrowLeft strokeWidth={1.5} className="h-5 w-5" />
        </button>
        <div className="flex items-baseline gap-4 min-w-0">
          <h2
            className="font-display whitespace-nowrap"
            style={{ fontSize: 32, lineHeight: 1 }}
          >
            {product.title}
          </h2>
          <span
            className="font-mono-xs whitespace-nowrap"
            style={{ color: "#ff006f" }}
          >
            {formatRON(product.price)}
          </span>
        </div>
      </div>

      {/* Slider */}
      <div
        className="flex-1 flex items-center overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          scrollSnapType: "x mandatory",
          // @ts-expect-error CSS custom prop
          "--gh": "min(66vh, 720px)",
          "--gw": "calc(min(66vh, 720px) * 3 / 4)",
          paddingInline: "calc(50% - (min(66vh, 720px) * 3 / 4) / 2)",
          gap: "24px",
        }}
      >
        {product.images.map((src, i) => (
          <figure
            key={i}
            className="shrink-0 flex flex-col items-center"
            style={{
              scrollSnapAlign: "center",
              width: "calc(min(66vh, 720px) * 3 / 4)",
            }}
          >
            <img
              src={src}
              alt={`${product.title} - ${i + 1}`}
              style={{
                width: "100%",
                height: "min(66vh, 720px)",
                objectFit: "cover",
                display: "block",
              }}
            />
            <figcaption
              className="font-mono-xs mt-3 text-charcoal/60"
              style={{ textAlign: "center" }}
            >
              {i === 0 ? "spate · design" : `vedere ${i + 1}`}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Bottom CTA to real product page */}
      <div className="px-5 md:px-10 pb-6 md:pb-8 flex justify-center">
        <Link
          to="/product/$handle"
          params={{ handle: product.handle }}
          className="inline-flex border border-charcoal px-6 py-3 font-mono-xs hover:bg-charcoal hover:text-cream transition-colors"
        >
          Vezi pagina produsului
        </Link>
      </div>
    </div>
  );
}

export function ProductCard({ product, showQuickView = true }: { product: Product; showQuickView?: boolean }) {
  const { addItem } = useCart();
  const {
    siteMode,
    productCardBackImageFirst,
    productCardShowPreviewBadge,
    productCardShowLiveBadges,
    productCardQuickAdd,
    productCardMetaText,
  } = useSite();
  const quickAddColor = product.colors[0]?.name ?? "";
  const quickAddStock = getStockForColor(product, quickAddColor);
  const availableSizes = product.sizes.filter((size) => quickAddStock[size] > 0);
  const showPrice = siteMode === "live-shop";
  const primaryImage = productCardBackImageFirst
    ? (product.images[1] ?? product.images[0])
    : product.images[0];
  const hoverImage = primaryImage === product.images[0] ? product.images[1] : product.images[0];
  const lowStockCount = availableSizes.length;

  const viewBtnRef = React.useRef<HTMLButtonElement>(null);
  const [overlay, setOverlay] = React.useState<null | {
    x: number;
    y: number;
    width: number;
    height: number;
  }>(null);

  const openQuickView = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = viewBtnRef.current?.getBoundingClientRect();
    if (!rect) return;
    setOverlay({ x: rect.left, y: rect.top, width: rect.width, height: rect.height });
  };

  return (
    <article className="product-card group">
      <Link to="/product/$handle" params={{ handle: product.handle }} className="block">
        <div className="relative img-zoom aspect-[3/4] bg-warm-grey">
          <img
            src={primaryImage}
            alt={`${product.title} - vedere produs`}
            decoding="async"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {hoverImage && hoverImage !== primaryImage && (
            <img
              src={hoverImage}
              alt=""
              decoding="async"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            />
          )}
          {siteMode === "live-shop" && productCardShowLiveBadges && product.badge && (
            <span
              className={`absolute top-3 left-3 px-2 py-1 font-mono-xs ${badgeStyles[product.badge]}`}
            >
              {product.badge}
            </span>
          )}
          {siteMode === "pre-launch" && productCardShowPreviewBadge && (
            <span className="absolute top-3 left-3 px-2 py-1 font-mono-xs bg-charcoal text-cream">
              previzualizare
            </span>
          )}
          {siteMode === "live-shop" && (
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 bg-cream/95 px-2 py-1 font-mono-xs text-charcoal">
                <PackageCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
                240gsm
              </span>
              <span className="inline-flex items-center gap-1 bg-cream/95 px-2 py-1 font-mono-xs text-charcoal">
                <Flame className="h-3.5 w-3.5" strokeWidth={1.5} />
                {lowStockCount <= 2 ? "stoc mic" : "oversized"}
              </span>
              <span className="inline-flex items-center gap-1 bg-[#ff006f] px-2 py-1 font-mono-xs text-cream">
                <Percent className="h-3.5 w-3.5" strokeWidth={1.5} />
                bundle
              </span>
            </div>
          )}

          {/* "Vezi produs" floating button — hover on desktop, always visible on mobile */}
          {showQuickView && (
            <button
              ref={viewBtnRef}
              type="button"
              onClick={openQuickView}
              aria-label={`Vezi produs ${product.title}`}
              className="pc-view-btn absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
              style={{
                padding: "13px 28px",
                background: "rgba(232,229,221,0.62)",
                backdropFilter: "blur(10px)",
                border: "none",
                borderRadius: 14,
                fontFamily: "var(--font-display)",
                fontSize: 16,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#1a1a18",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Vezi produs
            </button>
          )}

        </div>
      </Link>

      <div className="pt-4 flex items-start justify-between gap-3">
        <div>
          <Link to="/product/$handle" params={{ handle: product.handle }} className="block">
            <h3 className="text-sm md:text-base font-display tracking-tight">{product.title}</h3>
          </Link>
          <p className="font-mono-xs opacity-50 mt-1">
            {productCardMetaText} - {product.sizes.length} marimi
          </p>
        </div>
        {showPrice && <div className="text-sm tabular-nums">{formatRON(product.price)}</div>}
      </div>

      {siteMode === "live-shop" && productCardQuickAdd ? (
        <>
          <div
            className="mt-4 grid border border-border"
            style={{ gridTemplateColumns: `repeat(${product.sizes.length}, minmax(0, 1fr))` }}
          >
            {product.sizes.map((size) => {
              const disabled = quickAddStock[size] === 0;
              return (
                <button
                  type="button"
                  key={size}
                  disabled={disabled}
                  onPointerUp={(event) => {
                    event.preventDefault();
                    addItem(product, size, product.colors[0].name);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      addItem(product, size, product.colors[0].name);
                    }
                  }}
                  className="h-10 font-mono-xs border-r border-border last:border-r-0 hover:bg-charcoal hover:text-cream transition-colors disabled:opacity-30 disabled:line-through disabled:hover:bg-transparent disabled:hover:text-charcoal"
                  aria-label={`Adauga ${product.title}, marimea ${size}, in cos`}
                >
                  {size}
                </button>
              );
            })}
          </div>
          <p className="mt-2 font-mono-xs opacity-45">
            Adauga rapid: {availableSizes.length ? availableSizes.join(" / ") : "stoc epuizat"}
          </p>
        </>
      ) : (
        <Link
          to="/product/$handle"
          params={{ handle: product.handle }}
          className="mt-4 inline-flex border border-charcoal px-4 py-2 font-mono-xs hover:bg-charcoal hover:text-cream transition-colors"
        >
          {siteMode === "pre-launch" ? "Vezi previzualizarea" : "Vezi produsul"}
        </Link>
      )}

      {overlay && (
        <QuickViewOverlay
          product={product}
          origin={overlay}
          onClose={() => setOverlay(null)}
        />
      )}
    </article>
  );
}

export function ProductGrid({
  products,
  carousel = false,
  showQuickView = true,
}: {
  products: Product[];
  carousel?: boolean;
  showQuickView?: boolean;
}) {
  if (carousel) {
    return (
      <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
        {products.map((p) => (
          <div key={p.id} className="w-[74%] shrink-0 snap-start md:w-[300px]">
            <ProductCard product={p} showQuickView={showQuickView} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-6 md:gap-y-16">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} showQuickView={showQuickView} />
      ))}
    </div>
  );
}

