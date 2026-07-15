import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  addCartLines,
  buildShopifyCheckoutUrl,
  createCart,
  removeCartLines,
  shopifyConfig,
  updateCartLines,
} from "@/lib/shopify";

const originalConfig = { ...shopifyConfig };
const merchandiseId = "gid://shopify/ProductVariant/11";
const cartId = "gid://shopify/Cart/1";
const cartLineId = "gid://shopify/CartLine/1";

function responseFor(operation: string) {
  return new Response(
    JSON.stringify({
      data: {
        [operation]: {
          cart: { id: cartId, checkoutUrl: "https://store.myshopify.com/checkouts/1" },
          userErrors: [],
        },
      },
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}

describe("Shopify cart adapter", () => {
  beforeEach(() => {
    shopifyConfig.domain = "store.myshopify.com";
    shopifyConfig.token = "public-token";
    shopifyConfig.apiVersion = "2026-01";
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string, init?: RequestInit) => {
        const query = JSON.parse(String(init?.body)).query as string;
        if (query.includes("cartLinesAdd")) return responseFor("cartLinesAdd");
        if (query.includes("cartLinesUpdate")) return responseFor("cartLinesUpdate");
        if (query.includes("cartLinesRemove")) return responseFor("cartLinesRemove");
        return responseFor("cartCreate");
      }),
    );
  });

  afterEach(() => {
    Object.assign(shopifyConfig, originalConfig);
    vi.unstubAllGlobals();
  });

  it("creează, adaugă, actualizează și elimină linii valide", async () => {
    const lines = [{ merchandiseId, quantity: 1 }];
    await expect(createCart(lines)).resolves.toMatchObject({ id: cartId });
    await expect(addCartLines(cartId, lines)).resolves.toMatchObject({ id: cartId });
    await expect(
      updateCartLines(cartId, [{ id: cartLineId, merchandiseId, quantity: 2 }]),
    ).resolves.toMatchObject({ id: cartId });
    await expect(removeCartLines(cartId, [cartLineId])).resolves.toMatchObject({ id: cartId });
  });

  it("respinge config absent și date de coș invalide înainte de rețea", async () => {
    shopifyConfig.token = undefined;
    await expect(createCart([{ merchandiseId, quantity: 1 }])).rejects.toThrow(
      "Magazinul nu este disponibil",
    );
    await expect(createCart([{ merchandiseId: "preview-1", quantity: 1 }])).rejects.toThrow(
      "variantă sau o cantitate invalidă",
    );
  });

  it("păstrează allowlist-ul și adaugă SSO pentru conturile obligatorii", () => {
    expect(buildShopifyCheckoutUrl("https://store.myshopify.com/checkouts/1?locale=ro", true)).toBe(
      "https://store.myshopify.com/checkouts/1?locale=ro&sso=silent",
    );
    expect(buildShopifyCheckoutUrl("https://store.myshopify.com/checkouts/1", false)).toBe(
      "https://store.myshopify.com/checkouts/1",
    );
    expect(() => buildShopifyCheckoutUrl("https://example.com/checkouts/1", true)).toThrow(
      "Destinația de checkout nu este permisă",
    );
  });
});
