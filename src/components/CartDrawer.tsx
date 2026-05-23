import { useState } from "react";
import { useCart, type CartLine } from "@/lib/cart-context";
import { X, Plus, Minus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { formatRON } from "@/lib/format";
import {
  addCartLines,
  createCart,
  isShopifyConfigured,
  redirectToShopifyCheckout,
} from "@/lib/shopify";

export function CartDrawer() {
  const { isOpen, close, lines, removeItem, updateQuantity, subtotal } = useCart();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-charcoal/40" onClick={close} />
      <aside className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-background flex flex-col">
        <div className="h-16 px-5 flex items-center justify-between border-b border-border">
          <span className="font-mono-xs">Coș ({lines.length})</span>
          <button onClick={close} aria-label="Închide coșul">
            <X className="h-5 w-5" strokeWidth={1.25} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
            <p className="font-display text-2xl">Coșul este gol.</p>
            <Link to="/shop" onClick={close} className="font-mono-xs underline underline-offset-4">
              Continuă cumpărăturile
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-border">
              {lines.map((l) => (
                <CartRow key={l.lineId} line={l} onRemove={removeItem} onQty={updateQuantity} />
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
}: {
  line: CartLine;
  onRemove: (id: string) => void;
  onQty: (id: string, q: number) => void;
}) {
  return (
    <div className="flex gap-4 py-4">
      <div className="w-20 h-24 bg-warm-grey shrink-0">
        <img
          src={line.image}
          alt={line.title}
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
              Elimină
            </button>
          </div>
          <p className="font-mono-xs opacity-50 mt-1">
            {line.color} · {line.size}
          </p>
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
        Livrarea și taxele se calculează la finalizarea comenzii.
      </p>
      <ShopifyCheckoutButton />
      <Link to="/cart" className="block text-center font-mono-xs underline underline-offset-4">
        Vezi coșul complet
      </Link>
    </div>
  );
}

export function ShopifyCheckoutButton({ className = "" }: { className?: string }) {
  const { lines } = useCart();
  const [loading, setLoading] = useState(false);
  const shopifyReady = isShopifyConfigured();

  const handleCheckout = async () => {
    if (!shopifyReady) return;
    setLoading(true);
    try {
      // Placeholder: în producție se folosesc ID-urile variantelor Shopify, nu ID-urile mock.
      const cart = await createCart();
      const updatedCart = await addCartLines(
        cart.id,
        lines.map((l) => ({ merchandiseId: l.productId, quantity: l.quantity })),
      );
      redirectToShopifyCheckout(updatedCart.checkoutUrl);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || lines.length === 0 || !shopifyReady}
      className={`w-full bg-charcoal text-cream py-4 font-mono-xs hover:bg-charcoal/90 transition-colors disabled:opacity-50 ${className}`}
    >
      {!shopifyReady
        ? "Finalizare Shopify neconfigurată"
        : loading
          ? "Se redirecționează…"
          : "Continuă spre finalizarea Shopify →"}
    </button>
  );
}
