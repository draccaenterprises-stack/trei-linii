import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";
import { formatRON } from "@/lib/format";
import { useCart, type CartLine } from "@/lib/cart-context";
import { useSite } from "@/lib/site-context";
import {
  addCartLines,
  createCart,
  getStockForColor,
  isShopifyConfigured,
  isShopifyProductVariantId,
  redirectToShopifyCheckout,
} from "@/lib/shopify";

export function CartDrawer() {
  const { isOpen, close, lines, removeItem, updateQuantity, updateOptions, subtotal } = useCart();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-charcoal/40" onClick={close} />
      <aside className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-background flex flex-col">
        <div className="h-16 px-5 flex items-center justify-between border-b border-border">
          <span className="font-mono-xs">Cos ({lines.length})</span>
          <button onClick={close} aria-label="Inchide cosul">
            <X className="h-5 w-5" strokeWidth={1.25} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
            <p className="font-display text-2xl">Cosul este gol.</p>
            <Link to="/shop" onClick={close} className="font-mono-xs underline underline-offset-4">
              Continua cumparaturile
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-border">
              {lines.map((line) => (
                <CartRow
                  key={line.lineId}
                  line={line}
                  onRemove={removeItem}
                  onQty={updateQuantity}
                  onOptions={updateOptions}
                />
              ))}
            </div>
            <CheckoutFooter subtotal={subtotal} />
          </>
        )}
      </aside>
    </div>
  );
}

function CartRow({
  line,
  onRemove,
  onQty,
  onOptions,
}: {
  line: CartLine;
  onRemove: (id: string) => void;
  onQty: (id: string, q: number) => void;
  onOptions: (id: string, size: string, color: string) => void;
}) {
  const product = line.product;
  const colorStock = product ? getStockForColor(product, line.color) : null;
  const availableSizes = product?.sizes.filter((size) => colorStock && colorStock[size] > 0) ?? [];
  const hasVariantControls = Boolean(product);

  const handleColorChange = (color: string) => {
    if (!product) return;
    const nextStock = getStockForColor(product, color);
    const nextSize =
      nextStock[line.size] > 0 ? line.size : product.sizes.find((s) => nextStock[s] > 0);
    onOptions(line.lineId, nextSize ?? line.size, color);
  };

  return (
    <div className="flex gap-4 py-4">
      <div className="w-20 h-24 bg-warm-grey shrink-0">
        <img
          src={line.image}
          alt={line.title}
          decoding="async"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-display">{line.title}</h4>
            <button
              onClick={() => onRemove(line.lineId)}
              className="font-mono-xs opacity-60 hover:opacity-100"
            >
              Elimina
            </button>
          </div>
          {hasVariantControls ? (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <label className="font-mono-xs opacity-70">
                Culoare
                <select
                  value={line.color}
                  onChange={(event) => handleColorChange(event.target.value)}
                  className="mt-1 w-full border border-border bg-transparent px-2 py-2 text-xs outline-none"
                >
                  {product?.colors.map((color) => (
                    <option key={color.name} value={color.name}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="font-mono-xs opacity-70">
                Marime
                <select
                  value={line.size}
                  onChange={(event) => onOptions(line.lineId, event.target.value, line.color)}
                  className="mt-1 w-full border border-border bg-transparent px-2 py-2 text-xs outline-none"
                >
                  {product?.sizes.map((size) => (
                    <option key={size} value={size} disabled={!availableSizes.includes(size)}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ) : (
            <p className="font-mono-xs opacity-50 mt-1">
              {line.color} / {line.size}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center border border-border">
            <button
              className="h-8 w-8 grid place-items-center"
              onClick={() => onQty(line.lineId, line.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-6 text-center text-sm tabular-nums">{line.quantity}</span>
            <button
              className="h-8 w-8 grid place-items-center"
              onClick={() => onQty(line.lineId, line.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <span className="text-sm tabular-nums">{formatRON(line.price * line.quantity)}</span>
        </div>
      </div>
    </div>
  );
}

export function CheckoutFooter({ subtotal }: { subtotal: number }) {
  return (
    <div className="border-t border-border p-5 space-y-4">
      <div className="flex justify-between font-mono-xs">
        <span>Subtotal</span>
        <span className="tabular-nums text-base">{formatRON(subtotal)}</span>
      </div>
      <p className="font-mono-xs opacity-50">
        Livrarea si taxele se calculeaza la finalizarea comenzii.
      </p>
      <ShopifyCheckoutButton />
      <Link to="/cart" className="block text-center font-mono-xs underline underline-offset-4">
        Vezi cosul complet
      </Link>
    </div>
  );
}

export function ShopifyCheckoutButton({ className = "" }: { className?: string }) {
  const { lines } = useCart();
  const { siteMode } = useSite();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const shopifyReady = isShopifyConfigured();
  const hasRealShopifyVariants = lines.every((line) =>
    isShopifyProductVariantId(line.merchandiseId),
  );
  const canCheckout =
    siteMode === "live-shop" && shopifyReady && lines.length > 0 && hasRealShopifyVariants;

  const handleCheckout = async () => {
    if (!canCheckout) return;

    setLoading(true);
    setError(null);

    try {
      const cart = await createCart();
      const updatedCart = await addCartLines(
        cart.id,
        lines.map((line) => ({
          merchandiseId: line.merchandiseId as string,
          quantity: line.quantity,
        })),
      );

      redirectToShopifyCheckout(updatedCart.checkoutUrl);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Nu am putut porni finalizarea securizata a comenzii.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleCheckout}
        disabled={loading || !canCheckout}
        className={`w-full bg-charcoal text-cream py-4 font-mono-xs hover:bg-charcoal/90 transition-colors disabled:opacity-50 ${className}`}
      >
        {siteMode === "pre-launch"
          ? "Plata disponibila la lansare"
          : !shopifyReady
            ? "Finalizarea comenzii este indisponibila momentan"
            : !hasRealShopifyVariants
              ? "Adauga produse disponibile"
              : loading
                ? "Se redirectioneaza..."
                : "Continua spre plata securizata"}
      </button>
      {error && <p className="font-mono-xs text-red-700">{error}</p>}
    </div>
  );
}
