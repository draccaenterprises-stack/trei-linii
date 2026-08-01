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

/** Mirrors the live store: 20 + 10 + 10 active products at 219 RON, drafts excluded. */
const catalogPlan = [
  { handle: "colectie-1", title: "Colectie 1", size: 20 },
  { handle: "colecția-2-urme", title: "Colecția 2 — URME", size: 10 },
  { handle: "colectia-3-straturi", title: "Colecția 3 — STRATURI", size: 10 },
];

const descriptionHtml =
  "<p>Trei straturi neregulate traversează spatele ca o secțiune prin materie.</p>" +
  "<p>Design 3LINII fără text, imprimat DTF și poziționat sus, centrat pe spate.</p>" +
  "<p>Tricou unisex heavyweight, croială oversized. Disponibil în Negru, Alb, Olive și Crem.</p>";

function makeNode(collection: (typeof catalogPlan)[number], index: number): ShopifyProductNode {
  const id = `gid://shopify/Product/${collection.handle}-${index}`;
  return {
    id,
    handle: `${collection.handle}-${index}-tricou-oversized`,
    title: `Piesa ${index + 1} — Tricou oversized`,
    description: "Paragraf unu.Paragraf doi.",
    descriptionHtml,
    availableForSale: true,
    totalInventory: 12,
    tags: [],
    featuredImage: null,
    priceRange: { minVariantPrice: { amount: "219.0", currencyCode: "RON" } },
    collections: {
      nodes: [
        { handle: "frontpage", title: "Home page" },
        { handle: collection.handle, title: collection.title },
      ],
    },
    images: {
      nodes: [
        { url: `https://cdn.shopify.com/${index}-light.svg`, altText: "vector textile deschise" },
        { url: `https://cdn.shopify.com/${index}-black-01.png`, altText: "fotografie purtată" },
        { url: `https://cdn.shopify.com/${index}-white-01.png`, altText: "fotografie purtată" },
      ],
    },
    variants: {
      nodes: ["S", "M", "L"].map((size) => ({
        id: `gid://shopify/ProductVariant/${collection.handle}-${index}-${size}`,
        title: size,
        availableForSale: true,
        quantityAvailable: 12,
        selectedOptions: [
          { name: "Mărime", value: size },
          { name: "Culoare", value: "Negru" },
        ],
        price: { amount: "219.0", currencyCode: "RON" },
      })),
    },
  };
}

const productNodes = catalogPlan.flatMap((collection) =>
  Array.from({ length: collection.size }, (_, index) => makeNode(collection, index)),
);

const collectionNodes: ShopifyCollectionNode[] = [
  {
    handle: "frontpage",
    title: "Home page",
    description: "",
    image: null,
    products: { nodes: productNodes.slice(0, 20).map((product) => ({ id: product.id })) },
  },
  ...catalogPlan.map<ShopifyCollectionNode>((collection) => ({
    handle: collection.handle,
    title: collection.title,
    description: "",
    image: null,
    products: {
      nodes: productNodes
        .filter((product) => product.collections.nodes.some((c) => c.handle === collection.handle))
        .map((product) => ({ id: product.id })),
    },
  })),
];

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("VITE_SHOPIFY_STORE_DOMAIN", "example.myshopify.com");
  vi.stubEnv("VITE_SHOPIFY_SERVER_PROXY", "true");
  vi.stubEnv("VITE_ENABLE_PREVIEW_CATALOG", "false");
  serverFns.fetchProductsFromShopify.mockResolvedValue({ products: { nodes: productNodes } });
  serverFns.fetchCollectionsFromShopify.mockResolvedValue({
    collections: { nodes: collectionNodes },
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("catalogul live 3LINII", () => {
  it("expune cele trei colecții reale, fără colecția de sistem", async () => {
    const { fetchCollections } = await import("@/lib/shopify");
    const collections = await fetchCollections();

    expect(collections.map((collection) => collection.title)).toEqual([
      "Colectie 1",
      "Colecția 2 — URME",
      "Colecția 3 — STRATURI",
    ]);
    expect(collections.map((collection) => collection.count)).toEqual([20, 10, 10]);
  });

  it("încarcă toate cele 40 de produse reale și niciun produs de test", async () => {
    const { fetchProducts } = await import("@/lib/shopify");
    const products = await fetchProducts();

    expect(products).toHaveLength(40);
    expect(
      products.some((product) => /^(model\d|test|produs-test)/i.test(product.handle)),
    ).toBe(false);
  });

  it("păstrează prețul de 219 RON pe produs și pe fiecare variantă", async () => {
    const { fetchProducts } = await import("@/lib/shopify");
    const products = await fetchProducts();

    expect(new Set(products.map((product) => product.price))).toEqual(new Set([219]));
    expect(new Set(products.map((product) => product.money.currencyCode))).toEqual(
      new Set(["RON"]),
    );
    expect(products.every((product) => (product.variants?.length ?? 0) === 3)).toBe(true);
  });

  it("așază fotografiile purtate înaintea fișierelor vectoriale", async () => {
    const { fetchProducts, getPhotoImages } = await import("@/lib/shopify");
    const [product] = await fetchProducts();

    expect(product!.images[0]).toContain("black-01.png");
    expect(product!.images.at(-1)).toContain(".svg");
    expect(getPhotoImages(product!).every((url) => !url.endsWith(".svg"))).toBe(true);
  });

  it("separă descrierea în paragrafe distincte", async () => {
    const { fetchProducts, getDescriptionParagraphs } = await import("@/lib/shopify");
    const [product] = await fetchProducts();
    const paragraphs = getDescriptionParagraphs(product!);

    expect(paragraphs).toHaveLength(3);
    expect(paragraphs[0]).toContain("Trei straturi neregulate");
    expect(paragraphs[2]).toContain("heavyweight");
    expect(paragraphs.join("")).not.toContain("<");
  });
});

describe("parsarea descrierilor", () => {
  it("nu păstrează markup și acceptă text simplu cu linii noi", async () => {
    const { parseDescriptionParagraphs } = await import("@/lib/shopify");

    expect(
      parseDescriptionParagraphs('<p>Unu <img src=x onerror="alert(1)"> &amp; doi</p><p>Trei</p>'),
    ).toEqual(["Unu & doi", "Trei"]);
    expect(parseDescriptionParagraphs(null, "Unu\n\nDoi")).toEqual(["Unu", "Doi"]);
  });
});
