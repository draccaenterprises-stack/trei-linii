import { describe, expect, it } from "vitest";
import { deriveSiteMode } from "@/lib/site";

const readyConfig = {
  siteMode: "live-shop" as const,
  shopifyStoreDomain: "store.myshopify.com",
  shopifyStorefrontToken: "public-token",
  company: "Trei Linii SRL",
  cui: "RO123",
  regCom: "J00/1/2026",
  address: "București",
};

describe("site mode", () => {
  it("activează live numai când configurația comercială minimă este completă", () => {
    expect(deriveSiteMode(readyConfig)).toBe("live-shop");
    expect(deriveSiteMode({ ...readyConfig, company: "" })).toBe("pre-launch");
    expect(deriveSiteMode({ ...readyConfig, shopifyStorefrontToken: "" })).toBe("pre-launch");
  });

  it("respectă cererea explicită de pre-lansare", () => {
    expect(deriveSiteMode({ ...readyConfig, siteMode: "pre-launch" })).toBe("pre-launch");
  });
});
