import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

loadEnvFile(".env");
loadEnvFile(".env.local");

const env = process.env;

const domain = normalizeDomain(env.VITE_SHOPIFY_STORE_DOMAIN ?? env.SHOPIFY_STORE_DOMAIN);
const token = env.VITE_SHOPIFY_STOREFRONT_TOKEN ?? env.SHOPIFY_STOREFRONT_TOKEN;
const compromisedToken = env.COMPROMISED_SHOPIFY_STOREFRONT_TOKEN?.trim();
const apiVersion = env.VITE_SHOPIFY_API_VERSION ?? env.SHOPIFY_API_VERSION ?? "2026-01";
const minProducts = Number(env.MIN_SHOPIFY_PRODUCTS ?? 1);

const errors = [];
const warnings = [];

function loadEnvFile(fileName) {
  const filePath = resolve(process.cwd(), fileName);
  if (!existsSync(filePath)) return;

  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    if (!key || process.env[key] !== undefined) continue;

    process.env[key] = unquoteEnvValue(rawValue);
  }
}

function unquoteEnvValue(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function normalizeDomain(value) {
  return value
    ?.replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .trim();
}

async function storefrontFetch(query, variables) {
  const response = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify Storefront API status ${response.status}`);
  }

  const payload = await response.json();
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("; "));
  }

  return payload.data;
}

if (!domain) errors.push("Lipseste VITE_SHOPIFY_STORE_DOMAIN.");
if (!token) errors.push("Lipseste VITE_SHOPIFY_STOREFRONT_TOKEN.");
if (token && compromisedToken && token === compromisedToken) {
  errors.push("Tokenul Storefront este tokenul compromis anterior. Genereaza unul nou in Shopify.");
}
if (!Number.isFinite(minProducts) || minProducts < 1) {
  errors.push("MIN_SHOPIFY_PRODUCTS trebuie sa fie un numar pozitiv.");
}

if (!errors.length) {
  try {
    const data = await storefrontFetch(
      `
      query ReadinessProducts($first: Int!) {
        shop {
          name
        }
        products(first: $first) {
          nodes {
            id
            title
            handle
            availableForSale
            images(first: 1) {
              nodes {
                url
              }
            }
            variants(first: 20) {
              nodes {
                id
                title
                availableForSale
              }
            }
          }
        }
      }
    `,
      { first: Math.max(minProducts, 8) },
    );

    const products = data.products.nodes;
    if (products.length < minProducts) {
      errors.push(
        `Shopify are doar ${products.length}/${minProducts} produse publicate pe Storefront.`,
      );
    }

    for (const product of products) {
      if (!product.availableForSale)
        warnings.push(`${product.title}: produs indisponibil pentru vanzare.`);
      if (!product.images.nodes.length)
        warnings.push(`${product.title}: lipseste imaginea principala.`);
      if (!product.variants.nodes.length) {
        errors.push(`${product.title}: nu are variante Storefront.`);
        continue;
      }

      const hasRealVariant = product.variants.nodes.some((variant) =>
        variant.id.startsWith("gid://shopify/ProductVariant/"),
      );
      if (!hasRealVariant)
        errors.push(`${product.title}: variantele nu au ID Shopify ProductVariant valid.`);
    }

    const cartData = await storefrontFetch(`
      mutation ReadinessCartCreate {
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

    const cartErrors = cartData.cartCreate.userErrors.map((error) => error.message);
    if (cartErrors.length) errors.push(`cartCreate userErrors: ${cartErrors.join("; ")}`);
    if (!cartData.cartCreate.cart?.checkoutUrl) {
      errors.push("cartCreate nu a returnat checkoutUrl.");
    }

    if (!errors.length) {
      console.log(`Shopify readiness passed for ${domain}`);
      console.log(`Shop: ${data.shop.name}`);
      console.log(`Produse Storefront gasite: ${products.length}`);
      if (warnings.length) {
        console.warn("Warnings:");
        for (const warning of warnings) console.warn(`- ${warning}`);
      }
    }
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }
}

if (errors.length) {
  console.error("Shopify readiness failed:");
  for (const error of errors) console.error(`- ${error}`);
  if (warnings.length) {
    console.error("Warnings:");
    for (const warning of warnings) console.error(`- ${warning}`);
  }
  process.exit(1);
}
