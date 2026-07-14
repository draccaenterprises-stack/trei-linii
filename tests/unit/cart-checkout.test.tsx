import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/cart-context", () => ({
  useCart: () => ({ lines: [] }),
}));

vi.mock("@/lib/site-context", () => ({
  useSite: () => ({ siteMode: "pre-launch" }),
}));

vi.mock("@/lib/shopify", () => ({
  canPurchaseProduct: () => false,
  createCart: vi.fn(),
  getStockForColor: () => ({}),
  isShopifyConfigured: () => false,
  isShopifyProductVariantId: () => false,
  redirectToShopifyCheckout: vi.fn(),
}));

import { ShopifyCheckoutButton } from "@/components/CartDrawer";

describe("checkout guard", () => {
  it("nu expune checkout activ în pre-lansare", () => {
    render(<ShopifyCheckoutButton />);
    expect(screen.getByRole("button", { name: "Plata disponibilă la lansare" })).toBeDisabled();
  });
});
