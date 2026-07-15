import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { fixtureProduct } from "../fixtures/product";

const addItem = vi.fn(() => ({ ok: true as const }));

vi.mock("@tanstack/react-router", () => ({
  Link: React.forwardRef<
    HTMLAnchorElement,
    React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      to: string;
      params?: { handle?: string };
    }
  >(({ to, params, children, ...props }, ref) => (
    <a ref={ref} href={params?.handle ? `/product/${params.handle}` : to} {...props}>
      {children}
    </a>
  )),
}));

vi.mock("@/lib/cart-context", () => ({
  useCart: () => ({ addItem }),
}));

vi.mock("@/lib/site-context", () => ({
  useSite: () => ({
    siteMode: "live-shop",
    productCardBackImageFirst: false,
    productCardShowPreviewBadge: false,
    productCardShowLiveBadges: false,
    productCardQuickAdd: true,
    productCardMetaText: "Design pe spate",
  }),
}));

vi.mock("@/lib/shopify", async () => {
  const actual = await vi.importActual<typeof import("@/lib/shopify")>("@/lib/shopify");
  return { ...actual, canPurchaseProduct: () => true };
});

vi.mock("@/components/ResponsiveImage", () => ({
  ResponsiveImage: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

import { ProductCard } from "@/components/ProductCard";

describe("ProductCard quick add", () => {
  it("ascunde quick add când culoarea este ambiguă", () => {
    render(<ProductCard product={fixtureProduct} showQuickView={false} />);
    expect(screen.queryByRole("button", { name: /Adaugă .* mărimea/ })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Vezi produsul" })).toBeVisible();
  });

  it("permite quick add pentru o singură culoare", async () => {
    const user = userEvent.setup();
    const singleColor = { ...fixtureProduct, colors: [fixtureProduct.colors[0]!] };
    render(<ProductCard product={singleColor} showQuickView={false} />);
    await user.click(
      screen.getByRole("button", { name: `Adaugă ${singleColor.title}, mărimea S, în coș` }),
    );
    expect(addItem).toHaveBeenCalledWith(singleColor, "S", "Crem");
  });
});
