import { describe, expect, it } from "vitest";
import {
  cartReducer,
  initialCartState,
  parsePersistedCart,
  reconcileCartLines,
  serializeCart,
  type CartLine,
} from "@/lib/cart-state";
import { fixtureProduct } from "../fixtures/product";

const baseLine: CartLine = {
  lineId: "gid://shopify/ProductVariant/1-M-Crem",
  productId: "gid://shopify/Product/1",
  merchandiseId: "gid://shopify/ProductVariant/1",
  handle: "tricou-linie",
  title: "Tricou Linie",
  image: "https://cdn.shopify.com/product.webp",
  price: 189,
  size: "M",
  color: "Crem",
  quantity: 1,
};

describe("cartReducer", () => {
  it("adauga si combina aceeasi varianta", () => {
    const first = cartReducer(initialCartState, { type: "add", line: baseLine });
    const second = cartReducer(first, { type: "add", line: { ...baseLine, quantity: 2 } });

    expect(second.isOpen).toBe(true);
    expect(second.lines).toHaveLength(1);
    expect(second.lines[0]?.quantity).toBe(3);
  });

  it("elimina linia cand cantitatea ajunge la zero", () => {
    const state = cartReducer(
      { lines: [baseLine], isOpen: true },
      { type: "quantity", lineId: baseLine.lineId, quantity: 0 },
    );

    expect(state.lines).toEqual([]);
  });

  it("combina liniile cand optiunile devin identice", () => {
    const other = {
      ...baseLine,
      lineId: "gid://shopify/ProductVariant/2-L-Negru",
      merchandiseId: "gid://shopify/ProductVariant/2",
      size: "L",
      color: "Negru",
      quantity: 2,
    };
    const state = cartReducer(
      { lines: [baseLine, other], isOpen: true },
      { type: "options", lineId: baseLine.lineId, line: { ...baseLine, ...other, quantity: 1 } },
    );

    expect(state.lines).toHaveLength(1);
    expect(state.lines[0]?.quantity).toBe(3);
  });
});

describe("persistenta cosului", () => {
  it("accepta numai schema versionata curenta", () => {
    expect(parsePersistedCart(serializeCart([baseLine]))).toEqual([baseLine]);
    expect(parsePersistedCart(JSON.stringify({ version: 3, lines: [baseLine] }))).toEqual([]);
    expect(parsePersistedCart("nu este json")).toEqual([]);
  });

  it("acceptă o imagine lipsă fără să piardă coșul", () => {
    const line = { ...baseLine, image: "" };
    expect(parsePersistedCart(serializeCart([line]))).toEqual([line]);
  });
});

describe("reconcilierea coșului", () => {
  it("actualizează snapshotul și limitează cantitatea la stocul curent", () => {
    const product = { ...fixtureProduct, title: "Linie actualizată", price: 199 };
    const staleLine: CartLine = {
      ...baseLine,
      quantity: 5,
      price: 179,
      title: "Titlu vechi",
      merchandiseId: "gid://shopify/ProductVariant/11",
      lineId: "variant-vechi",
      size: "S",
      color: "Crem",
    };

    const result = reconcileCartLines([staleLine], [product]);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      title: "Linie actualizată",
      price: 199,
      quantity: 2,
      merchandiseId: "gid://shopify/ProductVariant/11",
    });
  });

  it("elimină variantele care nu mai sunt disponibile", () => {
    const unavailableLine: CartLine = {
      ...baseLine,
      merchandiseId: "gid://shopify/ProductVariant/12",
      lineId: "variant-indisponibil",
      size: "M",
      color: "Crem",
    };

    expect(reconcileCartLines([unavailableLine], [fixtureProduct])).toEqual([]);
  });
});
