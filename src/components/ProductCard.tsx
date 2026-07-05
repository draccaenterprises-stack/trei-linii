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
  // Animation runs on every device — mobile is the primary sales channel.
  const reduced = false;

  const [phase, setPhase] = React.useState<
    "shrink" | "line" | "bands" | "gallery" | "closing"
  >(reduced ? "gallery" : "shrink");
  const [closing, setClosing] = React.useState(false);

  React.useEffect(() => {
    if (reduced) return undefined;
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setPhase("line"), 420));
    timers.push(window.setTimeout(() => setPhase("bands"), 1020));
    timers.push(window.setTimeout(() => setPhase("gallery"), 1700));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [reduced]);

  // body scroll lock
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleClose = React.useCallback(() => {
    if (closing) return;
    setClosing(true);
    if (reduced) {
      window.setTimeout(onClose, 0);
      return;
    }
    window.setTimeout(onClose, 320);
  }, [closing, onClose, reduced]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  // Derived visibility
  const showShrink = !reduced && !closing && (phase === "shrink" || phase === "line");
  const shrinkToEllipse = !reduced && (phase === "line" || phase === "bands" || phase === "gallery");
  const showLine = !reduced && !closing && (phase === "line" || phase === "bands");
  const showBands = !reduced && (phase === "bands" || phase === "gallery" || closing);
  const showGallery = phase === "gallery";

  // origin coordinates (viewport) – for transform origins
  const originX = `${origin.x + origin.width / 2}px`;
  const originY = `${origin.y + origin.height / 2}px`;

  // Overlay background becomes paper once bands appear; before that keep transparent
  const overlayBg = reduced || showBands ? "#faf8f2" : "transparent";

  return (
    <div
      className="fixed inset-0 z-[100]"
      style={{
        background: overlayBg,
        transition: `background 200ms ${EASING}`,
        opacity: closing && (phase === "gallery" || reduced) ? 0 : 1,
        // fade whole thing on close for a graceful exit
        ...(closing ? { transition: `opacity 200ms ${EASING}, background 200ms ${EASING}` } : {}),
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Galerie ${product.title}`}
    >
      {/* Shrinking clone of the button */}
      {showShrink && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            left: origin.x,
            top: origin.y,
            width: origin.width,
            height: origin.height,
            background: "rgba(232,229,221,0.62)",
            backdropFilter: "blur(10px)",
            borderRadius: shrinkToEllipse ? "50%" : "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transformOrigin: "center center",
            transform: shrinkToEllipse
              ? `translate(${origin.width / 2 - 26}px, ${origin.height / 2 - 8}px) scale(${52 / origin.width}, ${16 / origin.height})`
              : "none",
            transition: `transform 420ms ${EASING}, border-radius 420ms ${EASING}, opacity 150ms ${EASING}`,
            opacity: phase === "line" ? 0 : 1,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 16,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#1a1a18",
              opacity: phase === "shrink" ? 1 : 0,
              transition: `opacity 150ms ${EASING}`,
            }}
          >
            Vezi produs
          </span>
        </div>
      )}

      {/* Vertical line */}
      {showLine && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            left: origin.x + origin.width / 2 - 2.5,
            top: 0,
            width: 5,
            height: "100vh",
            background: "#1a1a18",
            borderRadius: 3,
            transformOrigin: `center ${originY}`,
            transform: phase === "line" ? "scaleY(1)" : "scaleY(0.012)",
            transition: `transform 580ms ${EASING}`,
            opacity: phase === "bands" ? 0 : 1,
          }}
        />
      )}

      {/* Three stacked bands */}
      {showBands && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            display: "grid",
            gridTemplateRows: "1fr 1.2fr 1.3fr",
            gap: 10,
            pointerEvents: "none",
          }}
        >
          {["#1a1a18", "#1a1a18", "#ff006f"].map((color, i) => (
            <div
              key={i}
              style={{
                background: color,
                transformOrigin: `${originX} center`,
                transform:
                  closing
                    ? "scaleX(1)"
                    : phase === "bands" || phase === "gallery"
                      ? "scaleX(1)"
                      : "scaleX(0.0045)",
                transition: `transform 640ms ${EASING}`,
                opacity: closing ? 0 : 1,
                transitionProperty: closing ? "opacity" : "transform",
                transitionDuration: closing ? "160ms" : "640ms",
              }}
            />
          ))}
        </div>
      )}

      {/* Gallery */}
      <GalleryLayer
        product={product}
        visible={showGallery && !closing}
        closing={closing}
        onClose={handleClose}
        reduced={reduced}
      />
    </div>
  );
}

function GalleryLayer({
  product,
  visible,
  closing,
  onClose,
  reduced,
}: {
  product: Product;
  visible: boolean;
  closing: boolean;
  onClose: () => void;
  reduced: boolean;
}) {
  const active = visible || reduced;

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{
        background: "#faf8f2",
        opacity: closing ? 0 : active ? 1 : 0,
        transform: closing ? "scale(1)" : active ? "scale(1)" : "scale(0.94)",
        transition: closing
          ? `opacity 160ms ${EASING}`
          : `opacity 460ms ${EASING}, transform 620ms ${EASING}`,
        pointerEvents: active && !closing ? "auto" : "none",
        zIndex: 2,
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
}: {
  products: Product[];
  carousel?: boolean;
}) {
  if (carousel) {
    return (
      <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
        {products.map((p) => (
          <div key={p.id} className="w-[74%] shrink-0 snap-start md:w-[300px]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-6 md:gap-y-16">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
