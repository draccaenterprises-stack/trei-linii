import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ShopifyCollectionNode, ShopifyProductNode } from "@/lib/shopify-contract";

const serverFns = vi.hoisted(() => ({
  addCartLinesInShopify: vi.fn(),
  createCartInShopify: vi.fn(),
  fetchCollectionsFromShopify: vi.fn(),
  fetchProductFromShopify: vi.fn(),
  fetchProductsFromShopify: vi.fn(),
  removeCartLinesInShopify: vi.fn(),
  updateCartLinesInShopify: vi.fn(),
}));

vi.mock("@/lib/shopify.functions", () => serverFns);

const provisionalProduct: ShopifyProductNode = {
  id: "gid://shopify/Product/1",
  handle: "model1-tricou",
  title: "model1 tricou",
  description: "Produs provizoriu publicat în Shopify.",
  availableForSale: true,
  totalInventory: 3,
  tags: [],
  featuredImage: null,
  priceRange: {
    minVariantPrice: { amount: "129.00", currencyCode: "RON" },
  },
  collections: {
    nodes: [{ handle: "colectie-1", title: "Colectie 1" }],
  },
  images: {
    nodes: [{ url: "https://cdn.shopify.com/model1.jpg", altText: "Model 1" }],
  },
  variants: {
    nodes: [
      {
        id: "gid://shopify/ProductVariant/11",
        title: "M",
        availableForSale: true,
        quantityAvailable: 3,
        selectedOptions: [{ name: "Mărime", value: "M" }],
        price: { amount: "129.00", currencyCode: "RON" },
      },
    ],
  },
};

const provisionalCollection: ShopifyCollectionNode = {
  handle: "colectie-1",
  title: "Colectie 1",
  description: "Colecție provizorie.",
  image: null,
  products: { nodes: [{ id: provisionalProduct.id }] },
};

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("VITE_SHOPIFY_STORE_DOMAIN", "example.myshopify.com");
  vi.stubEnv("VITE_SHOPIFY_SERVER_PROXY", "true");
  vi.stubEnv("VITE_ENABLE_PREVIEW_CATALOG", "false");
  serverFns.fetchProductsFromShopify.mockResolvedValue({
    products: { nodes: [provisionalProduct] },
  });
  serverFns.fetchProductFromShopify.mockResolvedValue({ product: provisionalProduct });
  serverFns.fetchCollectionsFromShopify.mockResolvedValue({
    collections: {
      nodes: [
        provisionalCollection,
        {
          ...provisionalCollection,
          handle: "frontpage",
          title: "Home page",
        },
      ],
    },
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("catalogul Shopify publicat", () => {
  it("păstrează produsele și colecțiile cu denumiri provizorii", async () => {
    const { fetchCollections, fetchProducts } = await import("@/lib/shopify");

    await expect(fetchProducts()).resolves.toMatchObject([
      {
        handle: "model1-tricou",
        title: "model1 tricou",
        collection: "colectie-1",
      },
    ]);
    await expect(fetchCollections()).resolves.toMatchObject([
      {
        handle: "colectie-1",
        title: "Colectie 1",
      },
    ]);
  });

  it("deschide produsul publicat după handle", async () => {
    const { fetchProductByHandle } = await import("@/lib/shopify");

    await expect(fetchProductByHandle("model1-tricou")).resolves.toMatchObject({
      handle: "model1-tricou",
      title: "model1 tricou",
    });
  });
});
