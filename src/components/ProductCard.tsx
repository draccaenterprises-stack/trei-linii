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
const quickViewImageCache = new Set<string>();

export function preloadQuickViewImages(product: Pick<Product, "images">) {
  if (typeof window === "undefined") return;

  const sources = window.matchMedia("(hover: hover)").matches
    ? product.images
    : product.images.slice(0, 1);

  sources.forEach((src) => {
    if (quickViewImageCache.has(src)) return;
    quickViewImageCache.add(src);

    const image = new Image();
    image.decoding = "async";
    image.src = src;
    if (typeof image.decode === "function") {
      void image.decode().catch(() => undefined);
    }
  });
}

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
  const cloneRef = React.useRef<HTMLDivElement>(null);
  const cloneTextRef = React.useRef<HTMLSpanElement>(null);
  const bandsRef = React.useRef<HTMLDivElement>(null);
  const bandRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const galleryRef = React.useRef<HTMLDivElement>(null);
  const animationsRef = React.useRef<Animation[]>([]);
  const closingRef = React.useRef(false);

  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  React.useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const baseOptions: KeyframeAnimationOptions = { fill: "forwards", easing: EASING };
    const animations: Animation[] = [];

    const clone = cloneRef.current;
    const cloneText = cloneTextRef.current;
    const gallery = galleryRef.current;
    const bands = bandRefs.current.filter(Boolean) as HTMLDivElement[];

    if (reducedMotion) {
      if (clone) clone.style.opacity = "0";
      if (bandsRef.current) bandsRef.current.style.opacity = "0";
      if (gallery) {
        gallery.style.opacity = "1";
        gallery.style.transform = "translate3d(0, 0, 0)";
      }
      setOpen(true);
      return undefined;
    }

    if (clone) {
      animations.push(
        clone.animate(
          [
            { transform: "translate3d(0, 0, 0) scale3d(1, 1, 1)" },
            { transform: "translate3d(0, 0, 0) scale3d(1, 0.055, 1)" },
          ],
          { ...baseOptions, duration: mobile ? 180 : 165 },
        ),
        clone.animate([{ opacity: 1 }, { opacity: 0 }], {
          ...baseOptions,
          duration: 150,
          delay: mobile ? 145 : 130,
        }),
      );
    }

    if (cloneText) {
      animations.push(
        cloneText.animate([{ opacity: 1 }, { opacity: 0 }], {
          ...baseOptions,
          duration: 90,
        }),
      );
    }

    bands.forEach((band, index) => {
      animations.push(
        band.animate(
          [
            {
              opacity: 1,
              transform: "translate3d(-104%, 0, 0)",
              offset: 0,
              easing: EASING,
            },
            {
              opacity: 1,
              transform: "translate3d(0, 0, 0)",
              offset: 0.46,
              easing: EASING,
            },
            {
              opacity: 1,
              transform: "translate3d(0, 0, 0)",
              offset: 0.58,
              easing: EASING,
            },
            { opacity: 1, transform: "translate3d(104%, 0, 0)", offset: 1 },
          ],
          {
            ...baseOptions,
            easing: "linear",
            duration: mobile ? 720 : 660,
            delay: (mobile ? 20 : 10) + index * (mobile ? 58 : 46),
          },
        ),
      );
    });

    if (gallery) {
      animations.push(
        gallery.animate([{ opacity: 0 }, { opacity: 1 }], {
          ...baseOptions,
          duration: mobile ? 420 : 360,
          delay: mobile ? 330 : 280,
        }),
        gallery.animate(
          [
            { transform: `translate3d(0, ${mobile ? 18 : 12}px, 0)` },
            { transform: "translate3d(0, 0, 0)" },
          ],
          {
            ...baseOptions,
            duration: mobile ? 500 : 420,
            delay: mobile ? 300 : 250,
          },
        ),
      );
    }

    animationsRef.current = animations;
    let cancelled = false;
    void Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
      if (cancelled || closingRef.current) return;

      animations.forEach((animation) => {
        try {
          animation.commitStyles();
        } catch {
          // Safari can omit commitStyles for some completed animations.
        }
        animation.cancel();
      });

      if (clone) {
        clone.style.opacity = "0";
        clone.style.willChange = "auto";
      }
      if (bandsRef.current) {
        bandsRef.current.style.opacity = "0";
        bandsRef.current.style.willChange = "auto";
      }
      bands.forEach((band) => {
        band.style.opacity = "0";
        band.style.willChange = "auto";
      });
      if (gallery) {
        gallery.style.opacity = "1";
        gallery.style.transform = "translate3d(0, 0, 0)";
        gallery.style.willChange = "auto";
      }
      if (rootRef.current) rootRef.current.style.willChange = "auto";
      animationsRef.current = [];
      setOpen(true);
    });

    return () => {
      cancelled = true;
      animations.forEach((animation) => animation.cancel());
    };
  }, [origin.height, origin.width, origin.x, origin.y, product.images]);

  const handleClose = React.useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onClose();
      return;
    }

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
        galleryRef.current.animate(
          [
            {
              opacity: getComputedStyle(galleryRef.current).opacity,
              transform: getComputedStyle(galleryRef.current).transform,
            },
            { opacity: 0, transform: "translate3d(0, 10px, 0)" },
          ],
          {
            ...closeOptions,
            duration: 210,
          },
        ),
      );
    }

    if (bandsRef.current) {
      closeAnimations.push(
        bandsRef.current.animate(
          [{ opacity: getComputedStyle(bandsRef.current).opacity }, { opacity: 0 }],
          {
            ...closeOptions,
            duration: 180,
          },
        ),
      );
    }

    if (rootRef.current) {
      closeAnimations.push(
        rootRef.current.animate(
          [{ opacity: getComputedStyle(rootRef.current).opacity }, { opacity: 0 }],
          {
            ...closeOptions,
            duration: 210,
          },
        ),
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

  return (
    <div
      ref={rootRef}
      data-quick-view-root
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
          zIndex: 4,
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

      <div
        ref={bandsRef}
        data-quick-view-bands
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          display: "grid",
          gridTemplateRows: "1fr 1.2fr 1.3fr",
          gap: 10,
          pointerEvents: "none",
          opacity: 1,
          zIndex: 3,
          willChange: "opacity",
        }}
      >
        {["#000000", "#000000", "#ff006f"].map((color, i) => (
          <div
            key={i}
            ref={(node) => {
              bandRefs.current[i] = node;
            }}
            data-quick-view-band={i + 1}
            style={{
              background: color,
              transform: "translate3d(-104%, 0, 0)",
              opacity: 1,
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
      data-quick-view-gallery
      className="fixed inset-0 flex flex-col overflow-y-auto overscroll-y-contain"
      style={{
        background: "#faf8f2",
        opacity: 0,
        transform: "translate3d(0, 18px, 0)",
        pointerEvents: interactive ? "auto" : "none",
        zIndex: 2,
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
      }}
    >
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-charcoal/10 bg-[#faf8f2] px-5 py-4 md:bg-[#faf8f2]/95 md:px-10 md:py-6 md:backdrop-blur">
        <button
          type="button"
          onClick={onClose}
          aria-label="Inchide galeria"
          className="inline-flex items-center justify-center border border-charcoal bg-transparent text-charcoal hover:bg-charcoal hover:text-cream transition-colors"
          style={{ width: 44, height: 44 }}
        >
          <ArrowLeft strokeWidth={1.5} className="h-5 w-5" />
        </button>
        <div className="flex min-w-0 flex-1 items-baseline justify-between gap-4">
          <h2 className="min-w-0 flex-1 font-display text-xl leading-tight md:truncate md:text-[32px] md:leading-none">
            {product.title}
          </h2>
          <span className="font-mono-xs whitespace-nowrap" style={{ color: "#ff006f" }}>
            {product.isPreview ? "In pregatire" : formatRON(product.price)}
          </span>
        </div>
      </div>

      {/* Slider */}
      <div
        className="flex shrink-0 items-start overflow-x-auto overflow-y-hidden py-6 [scrollbar-width:none] md:py-8 [&::-webkit-scrollbar]:hidden"
        style={{
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          overscrollBehaviorX: "contain",
          // @ts-expect-error CSS custom prop
          "--gh": "min(62svh, 680px)",
          "--gw": "calc(min(62svh, 680px) * 3 / 4)",
          paddingInline: "max(20px, calc(50% - (min(62svh, 680px) * 3 / 4) / 2))",
          gap: "24px",
        }}
      >
        {product.images.map((src, i) => (
          <figure
            key={i}
            className="shrink-0 flex flex-col items-center"
            style={{
              scrollSnapAlign: "center",
              width: "calc(min(62svh, 680px) * 3 / 4)",
            }}
          >
            <img
              src={src}
              alt={`${product.title} - ${i + 1}`}
              decoding="async"
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
              style={{
                width: "100%",
                height: "min(62svh, 680px)",
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

      <QuickViewPurchaseControls product={product} onAdded={onClose} />
    </div>
  );
}

function QuickViewPurchaseControls({
  product,
  onAdded,
}: {
  product: Product;
  onAdded: () => void;
}) {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = React.useState(product.colors[0]?.name ?? "");
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState("");
  const stock = React.useMemo(
    () => getStockForColor(product, selectedColor),
    [product, selectedColor],
  );
  const hasStock = product.sizes.some((size) => (stock[size] ?? 0) > 0);
  const selectedStock = selectedSize ? (stock[selectedSize] ?? 0) : 0;

  if (product.isPreview) {
    return (
      <div className="border-t border-charcoal/15 px-5 py-8 md:px-10 md:py-10">
        <div className="mx-auto max-w-4xl border border-charcoal/20 px-5 py-5 md:px-7">
          <p className="font-mono-xs text-[#ff006f]">Pozitie demonstrativa</p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Aceasta piesa arata ritmul colectiei pana la publicarea produsului final in Shopify. Nu
            poate fi adaugata in cos.
          </p>
        </div>
      </div>
    );
  }

  const addToCart = () => {
    if (!selectedSize) {
      setMessage("Alege o marime pentru a continua.");
      return;
    }

    addItem(product, selectedSize, selectedColor);
    setMessage("");
    onAdded();
  };

  return (
    <div className="border-t border-charcoal/15 px-5 py-8 md:px-10 md:py-10">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-12 md:items-start">
        <div className="md:col-span-5">
          <p className="font-mono-xs text-[#ff006f]">Adauga direct in cos</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
            {product.description}
          </p>
          <p className="mt-5 font-display text-3xl">{formatRON(product.price)}</p>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <div>
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono-xs">Culoare</p>
              <p className="text-sm text-muted-foreground">{selectedColor}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.colors.map((color) => {
                const active = selectedColor === color.name;
                return (
                  <button
                    key={color.name}
                    type="button"
                    aria-label={`Alege culoarea ${color.name}`}
                    aria-pressed={active}
                    onClick={() => {
                      setSelectedColor(color.name);
                      setSelectedSize(null);
                      setMessage("");
                    }}
                    className={`h-11 w-11 border p-1 transition-colors ${
                      active ? "border-charcoal" : "border-charcoal/20 hover:border-charcoal/55"
                    }`}
                  >
                    <span className="block h-full w-full" style={{ backgroundColor: color.hex }} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <p className="font-mono-xs">Marime</p>
            <div className="mt-3 grid grid-cols-4 border border-charcoal/25">
              {product.sizes.map((size) => {
                const disabled = (stock[size] ?? 0) <= 0;
                const active = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    disabled={disabled}
                    aria-pressed={active}
                    onClick={() => {
                      setSelectedSize(size);
                      setMessage("");
                    }}
                    className={`h-12 border-r border-charcoal/25 font-mono-xs transition-colors last:border-r-0 ${
                      active ? "bg-charcoal text-cream" : "hover:bg-charcoal/5"
                    } disabled:cursor-not-allowed disabled:opacity-30 disabled:line-through`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedSize && selectedStock > 0 && selectedStock <= 4 && (
            <p className="mt-3 font-mono-xs text-[#ff006f]">
              Ultimele {selectedStock} piese pe marimea {selectedSize}
            </p>
          )}
          {message && <p className="mt-3 font-mono-xs text-[#ff006f]">{message}</p>}

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={addToCart}
              disabled={!hasStock}
              className="group inline-flex min-h-12 items-center gap-4 bg-charcoal px-6 font-mono-xs text-cream disabled:cursor-not-allowed disabled:opacity-40"
            >
              {hasStock ? "Adauga in cos" : "Stoc epuizat"}
              {hasStock && (
                <span className="h-px w-10 origin-left scale-x-[0.6] bg-[#ff006f] transition-transform group-hover:scale-x-100" />
              )}
            </button>
            <Link
              to="/product/$handle"
              params={{ handle: product.handle }}
              className="inline-flex min-h-12 items-center border border-charcoal px-5 font-mono-xs transition-colors hover:bg-charcoal hover:text-cream"
            >
              Vezi pagina produsului
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductCard({
  product,
  showQuickView = true,
}: {
  product: Product;
  showQuickView?: boolean;
}) {
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
              onPointerEnter={() => preloadQuickViewImages(product)}
              onPointerDown={() => preloadQuickViewImages(product)}
              onFocus={() => preloadQuickViewImages(product)}
              aria-label={`Vezi produs ${product.title}`}
              className="pc-view-btn absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
              style={{
                padding: "13px 28px",
                background: "rgba(232,229,221,0.94)",
                boxShadow: "0 8px 24px rgba(20,18,14,0.12)",
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
        <QuickViewOverlay product={product} origin={overlay} onClose={() => setOverlay(null)} />
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
