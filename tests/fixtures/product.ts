import type { Product } from "@/lib/catalog-types";

export const fixtureProduct: Product = {
  id: "gid://shopify/Product/1",
  handle: "linie-01",
  title: "Linie 01",
  money: { amount: 189, currencyCode: "RON" },
  price: 189,
  status: "active",
  collection: "editia-unu",
  collections: ["editia-unu"],
  media: [{ url: "https://cdn.shopify.com/a.webp", alt: "Linie 01" }],
  images: ["https://cdn.shopify.com/a.webp"],
  description: "Descriere completă pentru produs.",
  vibe: "Construcție liniară.",
  fitNote: "Croială oversized.",
  sizes: ["S", "M"],
  colors: [
    { name: "Crem", hex: "#f1ead9" },
    { name: "Negru", hex: "#111111" },
  ],
  stock: { S: 2, M: 0 },
  variants: [
    {
      id: "gid://shopify/ProductVariant/11",
      size: "S",
      color: "Crem",
      availableForSale: true,
      quantityAvailable: 2,
    },
    {
      id: "gid://shopify/ProductVariant/12",
      size: "M",
      color: "Crem",
      availableForSale: false,
      quantityAvailable: 0,
    },
  ],
};
