import { z } from "zod";
import type { Product, Size } from "./catalog-types";

export interface CartLine {
  lineId: string;
  productId: string;
  merchandiseId: string;
  product?: Product;
  handle: string;
  title: string;
  image: string;
  price: number;
  size: Size;
  color: string;
  quantity: number;
}

export interface CartState {
  lines: CartLine[];
  isOpen: boolean;
}

export type CartAction =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "reconcile"; lines: CartLine[] }
  | { type: "open" }
  | { type: "close" }
  | { type: "add"; line: CartLine }
  | { type: "remove"; lineId: string }
  | { type: "quantity"; lineId: string; quantity: number }
  | { type: "options"; lineId: string; line: CartLine }
  | { type: "clear" };

export const initialCartState: CartState = { lines: [], isOpen: false };

function boundedQuantity(quantity: number) {
  return Math.min(20, Math.max(1, Math.floor(quantity)));
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { ...state, lines: action.lines };
    case "reconcile":
      return { ...state, lines: action.lines.slice(0, 50) };
    case "open":
      return { ...state, isOpen: true };
    case "close":
      return { ...state, isOpen: false };
    case "add": {
      const existing = state.lines.find((line) => line.lineId === action.line.lineId);
      const lines = existing
        ? state.lines.map((line) =>
            line.lineId === action.line.lineId
              ? { ...line, quantity: boundedQuantity(line.quantity + action.line.quantity) }
              : line,
          )
        : [...state.lines, { ...action.line, quantity: boundedQuantity(action.line.quantity) }];
      return { lines, isOpen: true };
    }
    case "remove":
      return { ...state, lines: state.lines.filter((line) => line.lineId !== action.lineId) };
    case "quantity":
      if (action.quantity <= 0) {
        return { ...state, lines: state.lines.filter((line) => line.lineId !== action.lineId) };
      }
      return {
        ...state,
        lines: state.lines.map((line) =>
          line.lineId === action.lineId
            ? { ...line, quantity: boundedQuantity(action.quantity) }
            : line,
        ),
      };
    case "options": {
      const current = state.lines.find((line) => line.lineId === action.lineId);
      if (!current) return state;
      const duplicate = state.lines.find(
        (line) => line.lineId === action.line.lineId && line.lineId !== action.lineId,
      );
      const mergedLine = {
        ...action.line,
        quantity: boundedQuantity(action.line.quantity + (duplicate?.quantity ?? 0)),
      };
      const lines = state.lines
        .filter((line) => line.lineId !== action.lineId && line.lineId !== duplicate?.lineId)
        .concat(mergedLine);
      return { ...state, lines };
    }
    case "clear":
      return { ...state, lines: [] };
  }
}

export function reconcileCartLines(lines: CartLine[], products: Product[]): CartLine[] {
  const reconciled = new Map<string, CartLine>();

  for (const line of lines) {
    const product = products.find(
      (candidate) => candidate.id === line.productId || candidate.handle === line.handle,
    );
    const variant = product?.variants?.find(
      (candidate) =>
        candidate.id === line.merchandiseId ||
        (candidate.size === line.size && candidate.color === line.color),
    );

    if (!product || product.status !== "active" || !variant?.availableForSale) continue;
    if (variant.quantityAvailable === 0) continue;

    const lineId = `${variant.id}-${variant.size}-${variant.color}`;
    const available = variant.quantityAvailable ?? 20;
    const quantity = Math.min(boundedQuantity(line.quantity), Math.max(1, available));
    const nextLine: CartLine = {
      ...line,
      lineId,
      productId: product.id,
      merchandiseId: variant.id,
      product,
      handle: product.handle,
      title: product.title,
      image: product.images[0] ?? "",
      price: product.price,
      size: variant.size,
      color: variant.color,
      quantity,
    };
    const existing = reconciled.get(lineId);
    if (existing) {
      existing.quantity = Math.min(available, boundedQuantity(existing.quantity + quantity));
    } else {
      reconciled.set(lineId, nextLine);
    }
  }

  return Array.from(reconciled.values()).slice(0, 50);
}

const productSnapshotSchema = z.custom<Product>(
  (value) =>
    typeof value === "object" &&
    value !== null &&
    typeof (value as Product).id === "string" &&
    Array.isArray((value as Product).images),
);

const cartLineSchema = z.object({
  lineId: z.string().min(1).max(500),
  productId: z.string().min(1).max(500),
  merchandiseId: z.string().startsWith("gid://shopify/ProductVariant/"),
  product: productSnapshotSchema.optional(),
  handle: z.string().min(1).max(250),
  title: z.string().min(1).max(300),
  image: z.string().max(2_000),
  price: z.number().finite().nonnegative(),
  size: z.string().min(1).max(40),
  color: z.string().min(1).max(100),
  quantity: z.number().int().min(1).max(20),
});

const persistedCartSchema = z.object({
  version: z.literal(4),
  lines: z.array(cartLineSchema).max(50),
});

export function parsePersistedCart(raw: string | null): CartLine[] {
  if (!raw) return [];

  try {
    const parsed = persistedCartSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data.lines : [];
  } catch {
    return [];
  }
}

export function serializeCart(lines: CartLine[]) {
  return JSON.stringify({ version: 4, lines });
}
