/**
 * Modul pentru Shopify Storefront API.
 *
 * Demo-ul folosește momentan date mock din `mock-data.ts`.
 * Pentru producție, produsele se adaugă în Shopify Admin, iar frontend-ul citește
 * produsele, variantele, stocul și checkoutUrl prin Storefront API.
 *
 * Variabile necesare:
 *   VITE_SHOPIFY_STORE_DOMAIN       ex. trei-linii.myshopify.com
 *   VITE_SHOPIFY_STOREFRONT_TOKEN   token public Storefront API
 *   VITE_SHOPIFY_API_VERSION        ex. 2024-10
 */

import {
  collections as mockCollections,
  products as mockProducts,
  type Collection,
  type Product,
} from "./mock-data";

export const shopifyConfig = {
  domain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN as string | undefined,
  token: import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string | undefined,
  apiVersion: (import.meta.env.VITE_SHOPIFY_API_VERSION as string | undefined) ?? "2024-10",
};

export const isShopifyConfigured = () => Boolean(shopifyConfig.domain && shopifyConfig.token);

type ShopifyGraphQlResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

async function storefrontFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!shopifyConfig.domain || !shopifyConfig.token) {
    throw new Error("Shopify nu este configurat.");
  }

  const response = await fetch(
    `https://${shopifyConfig.domain}/api/${shopifyConfig.apiVersion}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": shopifyConfig.token,
      },
      body: JSON.stringify({ query, variables }),
    },
  );

  if (!response.ok) {
    throw new Error(`Shopify a răspuns cu status ${response.status}.`);
  }

  const payload = (await response.json()) as ShopifyGraphQlResponse<T>;
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("; "));
  }
  if (!payload.data) {
    throw new Error("Răspuns Shopify fără data.");
  }

  return payload.data;
}

export async function fetchProducts(): Promise<Product[]> {
  if (!isShopifyConfigured()) return mockProducts;
  // Următorul pas: mapare Product Shopify -> Product intern.
  return mockProducts;
}

export async function fetchProductByHandle(handle: string): Promise<Product | undefined> {
  if (!isShopifyConfigured()) return mockProducts.find((p) => p.handle === handle);
  // Următorul pas: productByHandle + mapare variant IDs.
  return mockProducts.find((p) => p.handle === handle);
}

export async function fetchCollections(): Promise<Collection[]> {
  if (!isShopifyConfigured()) return mockCollections;
  // Următorul pas: mapare Collection Shopify -> Collection intern.
  return mockCollections;
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
}

export async function createCart(): Promise<ShopifyCart> {
  const data = await storefrontFetch<{
    cartCreate: {
      cart: ShopifyCart | null;
      userErrors: Array<{ message: string }>;
    };
  }>(`
    mutation CartCreate {
      cartCreate {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          message
        }
      }
    }
  `);

  if (data.cartCreate.userErrors.length) {
    throw new Error(data.cartCreate.userErrors.map((error) => error.message).join("; "));
  }
  if (!data.cartCreate.cart) {
    throw new Error("Shopify nu a returnat coșul.");
  }

  return data.cartCreate.cart;
}

export async function addCartLines(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>,
): Promise<ShopifyCart> {
  const data = await storefrontFetch<{
    cartLinesAdd: {
      cart: ShopifyCart | null;
      userErrors: Array<{ message: string }>;
    };
  }>(
    `
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          message
        }
      }
    }
  `,
    { cartId, lines },
  );

  if (data.cartLinesAdd.userErrors.length) {
    throw new Error(data.cartLinesAdd.userErrors.map((error) => error.message).join("; "));
  }
  if (!data.cartLinesAdd.cart) {
    throw new Error("Shopify nu a returnat coșul actualizat.");
  }

  return data.cartLinesAdd.cart;
}

export function redirectToShopifyCheckout(checkoutUrl: string) {
  window.location.href = checkoutUrl;
}
