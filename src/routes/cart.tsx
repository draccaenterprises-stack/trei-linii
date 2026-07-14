import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import { ShopifyCheckoutButton } from "@/components/CartDrawer";
import { useCart } from "@/lib/cart-context";
import { formatRON } from "@/lib/format";
import { getStockForColor } from "@/lib/shopify";
import { trackEvent } from "@/lib/analytics";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () =>
    pageMeta({
      path: "/cart",
      title: "Coș - Trei Linii",
      description: "Produsele selectate în coșul Trei Linii.",
      noIndex: true,
    }),
});

function CartPage() {
  const { lines, removeItem, updateQuantity, updateOptions, subtotal } = useCart();

  useEffect(() => {
    trackEvent("view_cart", {
      itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
      value: subtotal,
      currency: "RON",
    });
  }, [lines, subtotal]);

  if (lines.length === 0) {
    return (
      <div className="px-5 py-32 text-center">
        <p className="font-mono-xs opacity-60">Coș</p>
        <h1 className="font-display text-5xl md:text-7xl mt-2">Coșul este gol.</h1>
        <Link
          to="/shop"
          className="inline-block mt-8 bg-charcoal text-cream px-6 py-3 font-mono-xs"
        >
          Continuă cumpărăturile
        </Link>
      </div>
    );
  }

  return (
    <div className="px-5 md:px-10 py-12 md:py-20">
      <div className="mx-auto max-w-[1400px]">
        <p className="font-mono-xs opacity-60">Coș</p>
        <h1 className="font-display text-5xl md:text-7xl mt-2">Produse - {lines.length}</h1>

        <div className="mt-12 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 divide-y divide-border border-y border-border">
            {lines.map((l) => (
              <CartPageLine
                key={l.lineId}
                line={l}
                onRemove={removeItem}
                onQty={updateQuantity}
                onOptions={updateOptions}
              />
            ))}
          </div>

          <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            <div className="bg-cream p-6 border border-border space-y-5">
              <h2 className="font-display text-2xl">Sumar comandă</h2>
              <div className="flex justify-between font-mono-xs">
                <span>Subtotal</span>
                <span className="tabular-nums text-base">{formatRON(subtotal)}</span>
              </div>
              <div className="flex justify-between font-mono-xs">
                <span>Livrare</span>
                <span>Calculată la finalizare</span>
              </div>
              <div className="border-t border-border pt-4 flex justify-between" aria-live="polite">
                <span className="font-mono-xs">Total</span>
                <span className="tabular-nums text-lg">{formatRON(subtotal)}</span>
              </div>
              <ShopifyCheckoutButton />
              <p className="font-mono-xs opacity-50 text-center">
                Vei fi redirecționat către finalizarea securizată a comenzii.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function CartPageLine({
  line,
  onRemove,
  onQty,
  onOptions,
}: {
  line: ReturnType<typeof useCart>["lines"][number];
  onRemove: (id: string) => void;
  onQty: (id: string, quantity: number) => void;
  onOptions: (id: string, size: string, color: string) => void;
}) {
  const product = line.product;
  const colorStock = product ? getStockForColor(product, line.color) : null;
  const availableSizes = product?.sizes.filter((size) => colorStock && colorStock[size] > 0) ?? [];

  const handleColorChange = (color: string) => {
    if (!product) return;
    const nextStock = getStockForColor(product, color);
    const nextSize =
      nextStock[line.size] > 0 ? line.size : product.sizes.find((s) => nextStock[s] > 0);
    onOptions(line.lineId, nextSize ?? line.size, color);
  };

  return (
    <div className="py-6 flex gap-5">
      <div className="w-28 h-36 bg-warm-grey shrink-0">
        <ResponsiveImage
          src={line.image}
          alt={line.title}
          width={1000}
          height={1200}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col justify-between gap-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <Link
              to="/product/$handle"
              params={{ handle: line.handle }}
              className="font-display text-xl hover:opacity-60"
            >
              {line.title}
            </Link>
            <button
              type="button"
              onClick={() => onRemove(line.lineId)}
              className="font-mono-xs opacity-60 hover:opacity-100"
              aria-label={`Elimină ${line.title} din coș`}
            >
              Elimină
            </button>
          </div>

          {product ? (
            <div className="mt-4 grid sm:grid-cols-2 gap-3 max-w-md">
              <label className="font-mono-xs opacity-70">
                Culoare
                <select
                  value={line.color}
                  onChange={(event) => handleColorChange(event.target.value)}
                  className="mt-1 w-full border border-border bg-transparent px-3 py-2 outline-none"
                >
                  {product.colors.map((color) => (
                    <option key={color.name} value={color.name}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="font-mono-xs opacity-70">
                Mărime
                <select
                  value={line.size}
                  onChange={(event) => onOptions(line.lineId, event.target.value, line.color)}
                  className="mt-1 w-full border border-border bg-transparent px-3 py-2 outline-none"
                >
                  {product.sizes.map((size) => (
                    <option key={size} value={size} disabled={!availableSizes.includes(size)}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ) : (
            <p className="font-mono-xs opacity-60 mt-2">
              {line.color} - Mărime {line.size}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center border border-border">
            <button
              type="button"
              className="h-9 w-9 grid place-items-center"
              onClick={() => onQty(line.lineId, line.quantity - 1)}
              aria-label={`Scade cantitatea pentru ${line.title}`}
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center tabular-nums">{line.quantity}</span>
            <button
              type="button"
              className="h-9 w-9 grid place-items-center"
              onClick={() => onQty(line.lineId, line.quantity + 1)}
              aria-label={`Crește cantitatea pentru ${line.title}`}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <span className="tabular-nums">{formatRON(line.price * line.quantity)}</span>
        </div>
      </div>
    </div>
  );
}
