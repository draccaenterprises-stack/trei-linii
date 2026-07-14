import { describe, expect, it } from "vitest";
import {
  buildBreadcrumbSchema,
  buildProductSchema,
  buildSiteSchema,
  serializeJsonLd,
} from "@/lib/schema";
import { fixtureProduct } from "../fixtures/product";

describe("JSON-LD", () => {
  it("omite datele indisponibile din Organization", () => {
    const schema = buildSiteSchema({
      siteUrl: "https://example.com",
      siteName: "Trei Linii",
      logo: "https://example.com/logo.png",
      image: "https://example.com/og.jpg",
      description: "Descriere",
    });
    expect(schema["@graph"][0]).not.toHaveProperty("email");
  });

  it("adaugă Offer numai pentru un produs cumpărabil", () => {
    const unavailable = buildProductSchema({
      product: fixtureProduct,
      url: "https://example.com/product/linie-01",
      purchasable: false,
    });
    const available = buildProductSchema({
      product: fixtureProduct,
      url: "https://example.com/product/linie-01",
      purchasable: true,
    });

    expect(unavailable).not.toHaveProperty("offers");
    expect(available.offers).toMatchObject({ price: 189, priceCurrency: "RON" });
  });

  it("numerotează breadcrumb-urile în ordinea dată", () => {
    const schema = buildBreadcrumbSchema([
      { name: "Acasă", url: "https://example.com" },
      { name: "Shop", url: "https://example.com/shop" },
    ]);
    expect(schema.itemListElement.map((item) => item.position)).toEqual([1, 2]);
  });

  it("neutralizează secvențele care pot închide scriptul JSON-LD", () => {
    const serialized = serializeJsonLd({ title: "</script><script>alert(1)</script>" });
    expect(serialized).not.toContain("<");
    expect(JSON.parse(serialized)).toEqual({ title: "</script><script>alert(1)</script>" });
  });
});
