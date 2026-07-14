import { useState } from "react";
import { Link } from "@tanstack/react-router";
import * as Dialog from "@radix-ui/react-dialog";
import { Minus, Plus, X } from "lucide-react";
import { formatRON } from "@/lib/format";
import { useCart, type CartLine } from "@/lib/cart-context";
import { useSite } from "@/lib/site-context";
import {
  canPurchaseProduct,
  createCart,
  getStockForColor,
  isShopifyConfigured,
  isShopifyProductVariantId,
  redirectToShopifyCheckout,
} from "@/lib/shopify";
import { hasLegalBusinessDetails } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { FeedbackRegion } from "@/components/FeedbackRegion";

export function CartDrawer() {
  const { isOpen, close, lines, removeItem, updateQuantity, updateOptions, subtotal, count } =
    useCart();

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-charcoal/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out" />
        <Dialog.Content className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col bg-background shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right">
          <div className="h-16 px-5 flex items-center justify-between border-b border-border">
            <Dialog.Title className="font-mono-xs">Coș ({count})</Dialog.Title>
            <Dialog.Description className="sr-only">
              Produsele selectate și opțiunile pentru finalizarea comenzii.
            </Dialog.Description>
            <Dialog.Close asChild>
              <button
                type="button"
                className="grid h-11 w-11 place-items-center"
                aria-label="Închide coșul"
              >
                <X className="h-5 w-5" strokeWidth={1.25} />
              </button>
            </Dialog.Close>
          </div>

          {lines.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
              <p className="font-display text-2xl">Coșul este gol.</p>
              <Link
                to="/shop"
                onClick={close}
                className="font-mono-xs underline underline-offset-4"
              >
                Continuă cumpărăturile
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
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
        <ResponsiveImage
          src={line.image}
          alt={line.title}
          width={1000}
          height={1200}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-display">{line.title}</h4>
            <button
              type="button"
              onClick={() => onRemove(line.lineId)}
              className="font-mono-xs opacity-60 hover:opacity-100"
              aria-label={`Elimină ${line.title} din coș`}
            >
              Elimină
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
                Mărime
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
              type="button"
              className="h-8 w-8 grid place-items-center"
              onClick={() => onQty(line.lineId, line.quantity - 1)}
              aria-label={`Scade cantitatea pentru ${line.title}`}
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-6 text-center text-sm tabular-nums">{line.quantity}</span>
            <button
              type="button"
              className="h-8 w-8 grid place-items-center"
              onClick={() => onQty(line.lineId, line.quantity + 1)}
              aria-label={`Crește cantitatea pentru ${line.title}`}
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
  const { close } = useCart();

  return (
    <div className="border-t border-border p-5 space-y-4">
      <div className="flex justify-between font-mono-xs">
        <span>Subtotal</span>
        <span className="tabular-nums text-base">{formatRON(subtotal)}</span>
      </div>
      <p className="font-mono-xs opacity-50">
        Livrarea și taxele se calculează la finalizarea comenzii.
      </p>
      <ShopifyCheckoutButton />
      <Link
        to="/cart"
        onClick={close}
        className="block text-center font-mono-xs underline underline-offset-4"
      >
        Vezi coșul complet
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
  const hasPurchasableProducts = lines.every((line) => canPurchaseProduct(line.product));
  const canCheckout =
    siteMode === "live-shop" &&
    hasLegalBusinessDetails() &&
    shopifyReady &&
    lines.length > 0 &&
    hasRealShopifyVariants &&
    hasPurchasableProducts;

  const handleCheckout = async () => {
    if (!canCheckout) return;

    setLoading(true);
    setError(null);

    try {
      trackEvent("begin_checkout", {
        itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
        value: lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
        currency: "RON",
      });
      const cart = await createCart(
        lines.map((line) => ({
          merchandiseId: line.merchandiseId as string,
          quantity: line.quantity,
        })),
      );

      redirectToShopifyCheckout(cart.checkoutUrl);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Nu am putut porni finalizarea securizată a comenzii.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading || !canCheckout}
        className={`w-full bg-charcoal text-cream py-4 font-mono-xs hover:bg-charcoal/90 transition-colors disabled:opacity-50 ${className}`}
      >
        {siteMode === "pre-launch"
          ? "Plata disponibilă la lansare"
          : !shopifyReady
            ? "Finalizarea comenzii este indisponibilă momentan"
            : !hasLegalBusinessDetails()
              ? "Comenzile vor fi activate după completarea datelor comerciale"
              : !hasRealShopifyVariants
                ? "Adaugă produse disponibile"
                : !hasPurchasableProducts
                  ? "Actualizează produsele din coș"
                  : loading
                    ? "Se redirecționează..."
                    : "Continuă spre plata securizată"}
      </button>
      <FeedbackRegion message={error} tone="error" />
    </div>
  );
}
