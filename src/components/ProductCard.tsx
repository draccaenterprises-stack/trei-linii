import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/mock-data";
import { formatRON } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { useSite } from "@/lib/site-context";

const badgeStyles: Record<string, string> = {
  noutate: "bg-charcoal text-cream",
  limitat: "bg-washed-red text-cream",
  "stoc limitat": "bg-olive text-cream",
};

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const {
    siteMode,
    productCardBackImageFirst,
    productCardShowPreviewBadge,
    productCardShowLiveBadges,
    productCardQuickAdd,
    productCardMetaText,
  } = useSite();
  const availableSizes = product.sizes.filter((size) => product.stock[size] > 0);
  const showPrice = siteMode === "live-shop";
  const primaryImage = productCardBackImageFirst
    ? (product.images[1] ?? product.images[0])
    : product.images[0];
  const hoverImage = primaryImage === product.images[0] ? product.images[1] : product.images[0];

  return (
    <article className="group">
      <Link to="/product/$handle" params={{ handle: product.handle }} className="block">
        <div className="relative img-zoom aspect-[3/4] bg-warm-grey">
          <img
            src={primaryImage}
            alt={`${product.title} - vedere produs`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {hoverImage && hoverImage !== primaryImage && (
            <img
              src={hoverImage}
              alt=""
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
        </div>
      </Link>

      <div className="pt-4 flex items-start justify-between gap-3">
        <div>
          <Link to="/product/$handle" params={{ handle: product.handle }} className="block">
            <h3 className="text-sm md:text-base font-display tracking-tight">{product.title}</h3>
          </Link>
          <p className="font-mono-xs opacity-50 mt-1">
            {productCardMetaText} · {product.sizes.length} marimi
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
              const disabled = product.stock[size] === 0;
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
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-6 md:gap-y-16">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
