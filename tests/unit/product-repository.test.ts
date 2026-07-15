import { describe, expect, it } from "vitest";
import { createFixtureProductRepository, loadCatalog } from "@/lib/product-repository";
import { fixtureProduct } from "../fixtures/product";

describe("ProductRepository", () => {
  it("marchează fixture-urile ca preview necomercial", async () => {
    const repository = createFixtureProductRepository({ products: [fixtureProduct] });
    const product = await repository.getProduct(fixtureProduct.handle);

    expect(product).toMatchObject({ isPreview: true, status: "preview" });
    expect(product?.variants).toBeUndefined();
    expect(await repository.getProduct("inexistent")).toBeUndefined();
  });

  it("încarcă produsele și colecțiile prin același contract", async () => {
    const collection = {
      handle: "editia-unu",
      title: "Ediția I",
      description: "Prima ediție.",
      image: "",
      count: 1,
    };
    const repository = createFixtureProductRepository({
      products: [fixtureProduct],
      collections: [collection],
    });

    const catalog = await loadCatalog(repository);
    expect(catalog.products).toHaveLength(1);
    expect(catalog.collections).toEqual([collection]);
  });
});
