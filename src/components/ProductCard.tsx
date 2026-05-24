import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/mock-data";
import { formatRON } from "@/lib/format";
import { useCart } from "@/lib/cart-context";

const badgeStyles: Record<string, string> = {
  noutate: "bg-charcoal text-cream",
  limitat: "bg-washed-red text-cream",
  "stoc limitat": "bg-olive text-cream",
};

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const availableSizes = product.sizes.filter((size) => product.stock[size] > 0);

  return (
    <article className="group">
      <Link to="/product/$handle" params={{ handle: product.handle }} className="block">
        <div className="relative img-zoom aspect-[4/5] bg-warm-grey">
          <img
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            />
          )}
          {product.badge && (
            <span
              className={`absolute top-3 left-3 px-2 py-1 font-mono-xs ${badgeStyles[product.badge]}`}
            >
              {product.badge}
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
            {product.colors.length} culori · {product.sizes.length} mărimi
          </p>
        </div>
        <div className="text-sm tabular-nums">{formatRON(product.price)}</div>
      </div>

      <div className="mt-4 grid grid-cols-4 border border-border">
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
              aria-label={`Adaugă ${product.title}, mărimea ${size}, în coș`}
            >
              {size}
            </button>
          );
        })}
      </div>
      <p className="mt-2 font-mono-xs opacity-45">
        Adaugă rapid: {availableSizes.length ? availableSizes.join(" / ") : "stoc epuizat"}
      </p>
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
