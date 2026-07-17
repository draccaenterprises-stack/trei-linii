import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { executeStorefrontQuery } from "@/lib/shopify.server";

const originalToken = process.env.SHOPIFY_STOREFRONT_TOKEN;

describe("Shopify server proxy", () => {
  beforeEach(() => {
    process.env.SHOPIFY_STOREFRONT_TOKEN = "server-only-test-token";
  });

  afterEach(() => {
    if (originalToken === undefined) delete process.env.SHOPIFY_STOREFRONT_TOKEN;
    else process.env.SHOPIFY_STOREFRONT_TOKEN = originalToken;
    vi.unstubAllGlobals();
  });

  it("trimite tokenul numai în requestul server-side și returnează datele", async () => {
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      expect(headers.get("X-Shopify-Storefront-Access-Token")).toBe("server-only-test-token");
      return new Response(JSON.stringify({ data: { shop: { name: "Trei Linii" } } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      executeStorefrontQuery<{ shop: { name: string } }>("query { shop { name } }", undefined, {
        domain: "store.myshopify.com",
        apiVersion: "2026-01",
      }),
    ).resolves.toEqual({ shop: { name: "Trei Linii" } });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("respinge domenii nepermise înainte de request", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      executeStorefrontQuery("query { shop { name } }", undefined, {
        domain: "example.com",
        apiVersion: "2026-01",
      }),
    ).rejects.toThrow("Domeniul Shopify");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
