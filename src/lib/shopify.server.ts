import "@tanstack/react-start/server-only";

import type { ShopifyGraphQlResponse } from "./shopify-contract";

type StorefrontRuntimeConfig = {
  domain: string;
  apiVersion: string;
};

function storefrontToken() {
  return (
    process.env.SHOPIFY_STOREFRONT_TOKEN?.trim() ||
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim() ||
    ""
  );
}

function validateRuntimeConfig({ domain, apiVersion }: StorefrontRuntimeConfig) {
  const normalizedDomain = domain
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .trim()
    .toLowerCase();

  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(normalizedDomain)) {
    throw new Error("Domeniul Shopify configurat nu este valid.");
  }
  if (!/^\d{4}-\d{2}$/.test(apiVersion)) {
    throw new Error("Versiunea Shopify Storefront API nu este validă.");
  }

  return normalizedDomain;
}

export async function executeStorefrontQuery<T>(
  query: string,
  variables: Record<string, unknown> | undefined,
  config: StorefrontRuntimeConfig,
): Promise<T> {
  const token = storefrontToken();
  if (!token) {
    throw new Error("Conexiunea securizată cu Shopify nu este configurată.");
  }

  const domain = validateRuntimeConfig(config);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const response = await fetch(`https://${domain}/api/${config.apiVersion}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Shopify a răspuns cu status ${response.status}.`);
    }

    const payload = (await response.json()) as ShopifyGraphQlResponse<T>;
    if (payload.errors?.length) {
      console.error("Shopify Storefront a returnat erori GraphQL.", payload.errors);
      throw new Error("Magazinul nu a putut procesa cererea.");
    }
    if (!payload.data) {
      throw new Error("Magazinul a returnat un răspuns incomplet.");
    }

    return payload.data;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Conexiunea cu magazinul a expirat.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
