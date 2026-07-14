import { describe, expect, it } from "vitest";
import {
  findSelectedVariant,
  getSelectedVariantId,
  getStockForColor,
  isShopifyProductVariantId,
} from "@/lib/shopify";
import { fixtureProduct as product } from "../fixtures/product";

describe("variante Shopify", () => {
  it("gaseste varianta exacta si ID-ul Shopify", () => {
    expect(findSelectedVariant(product, "S", "Crem")?.id).toContain("ProductVariant/11");
    expect(getSelectedVariantId(product, "S", "Crem")).toContain("ProductVariant/11");
    expect(isShopifyProductVariantId("gid://shopify/ProductVariant/11")).toBe(true);
    expect(isShopifyProductVariantId("preview-11")).toBe(false);
  });

  it("calculeaza stocul pe culoare", () => {
    expect(getStockForColor(product, "Crem")).toEqual({ S: 2, M: 0 });
  });
});
