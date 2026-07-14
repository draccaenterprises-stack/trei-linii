import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Product, Size } from "./catalog-types";
import { trackEvent } from "./analytics";
import {
  cartReducer,
  initialCartState,
  parsePersistedCart,
  reconcileCartLines,
  serializeCart,
  type CartLine,
} from "./cart-state";
import { canPurchaseProduct, findSelectedVariant, isShopifyProductVariantId } from "./shopify";
import { productRepository } from "./product-repository";

export type { CartLine } from "./cart-state";

export type CartActionResult = { ok: true } | { ok: false; message: string };

interface CartContextValue {
  lines: CartLine[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (product: Product, size: Size, color: string, quantity?: number) => CartActionResult;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  updateOptions: (lineId: string, size: Size, color: string) => void;
  clear: () => void;
  subtotal: number;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "trei-linii-cart-v4";

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  const [hydrated, setHydrated] = useState(false);
  const reconciled = useRef(false);
  const { lines, isOpen } = state;

  useEffect(() => {
    try {
      dispatch({ type: "hydrate", lines: parsePersistedCart(localStorage.getItem(STORAGE_KEY)) });
    } catch {
      /* noop */
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    try {
      if (hydrated) localStorage.setItem(STORAGE_KEY, serializeCart(lines));
    } catch {
      /* noop */
    }
  }, [hydrated, lines]);

  useEffect(() => {
    if (!hydrated || reconciled.current) return undefined;
    reconciled.current = true;
    if (!lines.length) return undefined;

    let active = true;
    void productRepository
      .listProducts()
      .then((products) => {
        if (active) dispatch({ type: "reconcile", lines: reconcileCartLines(lines, products) });
      })
      .catch(() => {
        // Keep the validated local snapshot when the catalog is temporarily unavailable.
      });

    return () => {
      active = false;
    };
  }, [hydrated, lines]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
    const count = lines.reduce((s, l) => s + l.quantity, 0);
    return {
      lines,
      isOpen,
      open: () => dispatch({ type: "open" }),
      close: () => dispatch({ type: "close" }),
      addItem: (product, size, color, quantity = 1) => {
        if (!canPurchaseProduct(product)) {
          return { ok: false, message: "Produsul nu poate fi comandat momentan." };
        }
        const variant = findSelectedVariant(product, size, color);
        if (
          !variant?.availableForSale ||
          !isShopifyProductVariantId(variant.id) ||
          variant.quantityAvailable === 0
        ) {
          return { ok: false, message: "Varianta aleasă nu mai este disponibilă." };
        }
        const lineId = `${variant.id}-${size}-${color}`;
        const existingQuantity = lines.find((line) => line.lineId === lineId)?.quantity ?? 0;
        const available = variant.quantityAvailable ?? 20;
        if (existingQuantity + quantity > available) {
          return { ok: false, message: "Nu mai sunt suficiente produse în stoc." };
        }
        const line: CartLine = {
          lineId,
          productId: product.id,
          merchandiseId: variant.id,
          product,
          handle: product.handle,
          title: product.title,
          image: product.images[0] ?? "",
          price: product.price,
          size,
          color,
          quantity,
        };
        dispatch({ type: "add", line });
        trackEvent("add_to_cart", {
          itemId: product.id,
          quantity,
          value: product.price * quantity,
          currency: "RON",
        });
        return { ok: true };
      },
      removeItem: (lineId) => dispatch({ type: "remove", lineId }),
      updateQuantity: (lineId, quantity) => {
        const line = lines.find((item) => item.lineId === lineId);
        const variant = line?.product?.variants?.find(
          (candidate) => candidate.id === line.merchandiseId,
        );
        const available = variant?.quantityAvailable ?? 20;
        dispatch({ type: "quantity", lineId, quantity: Math.min(quantity, available) });
      },
      updateOptions: (lineId, size, color) => {
        const line = lines.find((item) => item.lineId === lineId);
        if (!line?.product) return;
        const variant = findSelectedVariant(line.product, size, color);
        if (
          !variant?.availableForSale ||
          variant.quantityAvailable === 0 ||
          !isShopifyProductVariantId(variant.id)
        )
          return;
        dispatch({
          type: "options",
          lineId,
          line: {
            ...line,
            lineId: `${variant.id}-${size}-${color}`,
            merchandiseId: variant.id,
            size,
            color,
            quantity: Math.min(line.quantity, variant.quantityAvailable ?? 20),
          },
        });
      },
      clear: () => dispatch({ type: "clear" }),
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
