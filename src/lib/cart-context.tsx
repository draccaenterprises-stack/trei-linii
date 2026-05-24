import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product, Size } from "./mock-data";
import { getSelectedVariantId } from "./shopify";

export interface CartLine {
  lineId: string;
  productId: string;
  merchandiseId?: string;
  handle: string;
  title: string;
  image: string;
  price: number;
  size: Size;
  color: string;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (product: Product, size: Size, color: string, quantity?: number) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "trei-linii-cart-v3";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* noop */
    }
  }, [lines]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
    const count = lines.reduce((s, l) => s + l.quantity, 0);
    return {
      lines,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      addItem: (product, size, color, quantity = 1) => {
        const merchandiseId = getSelectedVariantId(product, size, color);
        const lineId = `${merchandiseId ?? product.id}-${size}-${color}`;
        setLines((prev) => {
          const existing = prev.find((l) => l.lineId === lineId);
          if (existing) {
            return prev.map((l) =>
              l.lineId === lineId ? { ...l, quantity: l.quantity + quantity } : l,
            );
          }
          return [
            ...prev,
            {
              lineId,
              productId: product.id,
              merchandiseId,
              handle: product.handle,
              title: product.title,
              image: product.images[0],
              price: product.price,
              size,
              color,
              quantity,
            },
          ];
        });
        setIsOpen(true);
      },
      removeItem: (lineId) => setLines((prev) => prev.filter((l) => l.lineId !== lineId)),
      updateQuantity: (lineId, quantity) =>
        setLines((prev) =>
          prev
            .map((l) => (l.lineId === lineId ? { ...l, quantity } : l))
            .filter((l) => l.quantity > 0),
        ),
      clear: () => setLines([]),
      subtotal,
      count,
    };
  }, [lines, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
