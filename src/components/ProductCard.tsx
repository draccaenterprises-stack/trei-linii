import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/mock-data";
import { formatRON } from "@/lib/format";

const badgeStyles: Record<string, string> = {
  "new drop": "bg-charcoal text-cream",
  limited: "bg-washed-red text-cream",
  "best seller": "bg-olive text-cream",
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/product/$handle"
      params={{ handle: product.handle }}
      className="group block"
    >
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
      <div className="pt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm md:text-base font-display tracking-tight">
            {product.title}
          </h3>
          <p className="font-mono-xs opacity-50 mt-1">
            {product.colors.length} colors · {product.sizes.length} sizes
          </p>
        </div>
        <div className="text-sm tabular-nums">{formatRON(product.price)}</div>
      </div>
    </Link>
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
