/**
 * Shopify Storefront API service module.
 *
 * This is a clean placeholder layer. The demo currently uses local mock data
 * (see `mock-data.ts`). When the brand is ready to go live, wire these
 * functions to the real Shopify Storefront API and remove the mock fallbacks.
 *
 * Required environment variables (do NOT hardcode):
 *   VITE_SHOPIFY_STORE_DOMAIN       e.g. blank-atelier.myshopify.com
 *   VITE_SHOPIFY_STOREFRONT_TOKEN   public Storefront API access token
 *   VITE_SHOPIFY_API_VERSION        e.g. 2024-10
 */

import { products as mockProducts, collections as mockCollections, type Product, type Collection } from "./mock-data";

export const shopifyConfig = {
  domain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN as string | undefined,
  token: import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string | undefined,
  apiVersion: (import.meta.env.VITE_SHOPIFY_API_VERSION as string | undefined) ?? "2024-10",
};

export const isShopifyConfigured = () =>
  Boolean(shopifyConfig.domain && shopifyConfig.token);

// ---------- Storefront query helper (placeholder) ----------

async function storefrontFetch<T>(_query: string, _variables?: Record<string, unknown>): Promise<T> {
  // TODO: implement fetch to
  // `https://${shopifyConfig.domain}/api/${shopifyConfig.apiVersion}/graphql.json`
  // with header `X-Shopify-Storefront-Access-Token: ${shopifyConfig.token}`
  throw new Error("Shopify Storefront not yet wired. Using mock data.");
}

// ---------- Products ----------

export async function fetchProducts(): Promise<Product[]> {
  if (!isShopifyConfigured()) return mockProducts;
  // TODO: GraphQL query `products(first: 50) { ... }`
  return storefrontFetch<Product[]>("query { products }");
}

export async function fetchProductByHandle(handle: string): Promise<Product | undefined> {
  if (!isShopifyConfigured()) return mockProducts.find((p) => p.handle === handle);
  // TODO: GraphQL query `productByHandle(handle: $handle) { ... }`
  return storefrontFetch<Product | undefined>("query productByHandle($handle: String!) { ... }", { handle });
}

// ---------- Collections ----------

export async function fetchCollections(): Promise<Collection[]> {
  if (!isShopifyConfigured()) return mockCollections;
  // TODO: GraphQL query `collections(first: 20) { ... }`
  return storefrontFetch<Collection[]>("query { collections }");
}

// ---------- Cart ----------

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
}

export async function createCart(): Promise<ShopifyCart> {
  if (!isShopifyConfigured()) {
    // Demo placeholder — real flow would call `cartCreate` mutation.
    return {
      id: "demo-cart",
      checkoutUrl: "https://checkout.shopify.com/demo-checkout-redirect",
    };
  }
  // TODO: mutation `cartCreate { cart { id checkoutUrl } }`
  return storefrontFetch<ShopifyCart>("mutation { cartCreate { cart { id checkoutUrl } } }");
}

export async function addCartLines(
  _cartId: string,
  _lines: Array<{ merchandiseId: string; quantity: number }>,
): Promise<ShopifyCart> {
  if (!isShopifyConfigured()) {
    return {
      id: "demo-cart",
      checkoutUrl: "https://checkout.shopify.com/demo-checkout-redirect",
    };
  }
  // TODO: mutation `cartLinesAdd(cartId: $cartId, lines: $lines) { cart { id checkoutUrl } }`
  return storefrontFetch<ShopifyCart>("mutation cartLinesAdd { ... }");
}

/**
 * Redirect the browser to Shopify's hosted checkout.
 * In production: pass `cart.checkoutUrl` returned by `cartCreate`.
 * Never build a custom checkout — Shopify handles payment.
 */
export function redirectToShopifyCheckout(checkoutUrl: string) {
  window.location.href = checkoutUrl;
}
