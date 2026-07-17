import { describe, expect, it } from "vitest";
import { deriveSiteMode } from "@/lib/site";

const readyConfig = {
  siteMode: "live-shop" as const,
  shopifyStoreDomain: "store.myshopify.com",
  shopifyStorefrontToken: "public-token",
  shopifyServerProxyEnabled: false,
  company: "Trei Linii SRL",
  cui: "RO123",
  regCom: "J00/1/2026",
  address: "București",
  customerAccountRequired: true,
  customerAccountUrl: "https://account.treilinii.ro",
};

describe("site mode", () => {
  it("activează live numai când configurația comercială minimă este completă", () => {
    expect(deriveSiteMode(readyConfig)).toBe("live-shop");
    expect(deriveSiteMode({ ...readyConfig, company: "" })).toBe("pre-launch");
    expect(deriveSiteMode({ ...readyConfig, shopifyStorefrontToken: "" })).toBe("pre-launch");
    expect(
      deriveSiteMode({
        ...readyConfig,
        shopifyStorefrontToken: "",
        shopifyServerProxyEnabled: true,
      }),
    ).toBe("live-shop");
    expect(deriveSiteMode({ ...readyConfig, customerAccountUrl: "" })).toBe("pre-launch");
    expect(
      deriveSiteMode({
        ...readyConfig,
        customerAccountRequired: false,
        customerAccountUrl: "",
      }),
    ).toBe("live-shop");
  });

  it("respectă cererea explicită de pre-lansare", () => {
    expect(deriveSiteMode({ ...readyConfig, siteMode: "pre-launch" })).toBe("pre-launch");
  });
});
