import { describe, expect, it } from "vitest";
import { buildCollectionGroups } from "@/routes/shop";
import type { Collection, Product } from "@/lib/catalog-types";

const titles = [
  "Trei Pași",
  "Aceeași Masă",
  "Gesturi",
  "Distanță Personală",
  "Trecere",
  "Urme de Ploaie",
  "Umbre la 17:00",
  "Obiecte Mutate",
  "Respirație Comună",
  "După Plecare",
];

function makeProduct(id: string, title: string, collection: string): Product {
  return {
    id,
    handle: id,
    title,
    money: { amount: 189, currencyCode: "RON" },
    price: 189,
    status: "active",
    collection,
    collections: [collection],
    media: [],
    images: [],
    description: "Descriere.",
    vibe: "",
    fitNote: "",
    sizes: ["M"],
    colors: [],
    stock: { M: 1 },
  };
}

const urmeProducts = titles.map((title, index) =>
  makeProduct(`gid://shopify/Product/${index + 100}`, title, "colecția-2-urme"),
);
// Shopify's products query returns a different order than the curated collection.
const shuffled = [urmeProducts[3], urmeProducts[0], ...urmeProducts.slice(4), urmeProducts[1], urmeProducts[2]];
const orphan = makeProduct("gid://shopify/Product/999", "model1 tricou", "");

const collections: Collection[] = [
  {
    handle: "colectie-1",
    title: "Colectie 1",
    description: "",
    image: "",
    count: 1,
    productIds: ["gid://shopify/Product/1"],
  },
  {
    handle: "colecția-2-urme",
    title: "Colecția 2 — URME",
    description: "",
    image: "",
    count: 10,
    productIds: urmeProducts.map((product) => product.id),
  },
];

const products = [makeProduct("gid://shopify/Product/1", "Soft Architecture", "colectie-1"), ...shuffled, orphan];

describe("grupurile de colecții pe /shop", () => {
  const groups = buildCollectionGroups(products, collections, []);

  it("afișează doar colecțiile reale, fără selecția sintetică", () => {
    expect(groups.map((group) => group.collection.title)).toEqual([
      "Colectie 1",
      "Colecția 2 — URME",
    ]);
    expect(groups.some((group) => group.collection.handle === "selectia-deschisa")).toBe(false);
  });

  it("randează toate cele 10 produse ale colecției 2, în ordinea colecției", () => {
    const urme = groups.find((group) => group.collection.handle === "colecția-2-urme");
    expect(urme?.products).toHaveLength(10);
    expect(urme?.products.map((product) => product.title)).toEqual(titles);
  });
});
