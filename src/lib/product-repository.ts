import type { Collection, Product } from "./catalog-types";
import { fetchCollections, fetchProductByHandle, fetchProducts } from "./shopify";

export interface ProductRepository {
  listProducts(): Promise<Product[]>;
  getProduct(handle: string): Promise<Product | undefined>;
  listCollections(): Promise<Collection[]>;
}

export const productRepository: ProductRepository = {
  listProducts: fetchProducts,
  getProduct: fetchProductByHandle,
  listCollections: fetchCollections,
};

export function createFixtureProductRepository({
  products,
  collections = [],
}: {
  products: Product[];
  collections?: Collection[];
}): ProductRepository {
  const previewProducts = products.map<Product>((product) => ({
    ...product,
    isPreview: true,
    status: "preview",
    badge: undefined,
    variants: undefined,
  }));

  return {
    async listProducts() {
      return previewProducts;
    },
    async getProduct(handle) {
      return previewProducts.find((product) => product.handle === handle);
    },
    async listCollections() {
      return collections;
    },
  };
}

export async function loadCatalog(repository: ProductRepository = productRepository) {
  const [products, collections] = await Promise.all([
    repository.listProducts(),
    repository.listCollections(),
  ]);

  return { products, collections };
}
