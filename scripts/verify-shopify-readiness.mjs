import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const env = {
  ...readEnvFile(".env.production"),
  ...readEnvFile(".env"),
  ...readEnvFile(".env.local"),
  ...process.env,
};
const domain = normalizeDomain(env.VITE_SHOPIFY_STORE_DOMAIN ?? env.SHOPIFY_STORE_DOMAIN);
const token = env.VITE_SHOPIFY_STOREFRONT_TOKEN ?? env.SHOPIFY_STOREFRONT_TOKEN;
const compromisedToken = env.COMPROMISED_SHOPIFY_STOREFRONT_TOKEN?.trim();
const apiVersion = env.VITE_SHOPIFY_API_VERSION ?? env.SHOPIFY_API_VERSION ?? "2026-01";
const minProducts = Number(env.MIN_SHOPIFY_PRODUCTS ?? 1);
const minCollections = Number(env.MIN_SHOPIFY_COLLECTIONS ?? 1);
const checkoutHosts = (env.VITE_CHECKOUT_HOSTS ?? "")
  .split(",")
  .map((value) => normalizeDomain(value))
  .filter(Boolean);
const customerAccountRequired = !["false", "0"].includes(
  (env.VITE_REQUIRE_CUSTOMER_ACCOUNT ?? "true").trim().toLowerCase(),
);
const customerAccountUrl = env.VITE_CUSTOMER_ACCOUNT_URL?.trim() ?? "";
const errors = [];
const warnings = [];

function readEnvFile(fileName) {
  const filePath = resolve(process.cwd(), fileName);
  if (!existsSync(filePath)) return {};
  const values = {};
  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const separator = trimmed.indexOf("=");
    const key = trimmed.slice(0, separator).trim();
    const raw = trimmed.slice(separator + 1).trim();
    values[key] = unquote(raw);
  }
  return values;
}

function unquote(value) {
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
    .trim()
    .toLowerCase();
}

async function storefrontFetch(query, variables = {}) {
  const response = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`Shopify Storefront API status ${response.status}`);
  const payload = await response.json();
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("; "));
  }
  return payload.data;
}

function assertMutation(name, payload) {
  const userErrors = payload?.userErrors ?? [];
  if (userErrors.length)
    errors.push(`${name}: ${userErrors.map((error) => error.message).join("; ")}`);
  if (!payload?.cart?.id?.startsWith("gid://shopify/Cart/")) {
    errors.push(`${name}: Shopify nu a returnat un cart ID valid.`);
  }
  return payload?.cart;
}

if (!domain) errors.push("Lipsește VITE_SHOPIFY_STORE_DOMAIN.");
if (!token) errors.push("Lipsește VITE_SHOPIFY_STOREFRONT_TOKEN din mediul de verificare.");
if (token && compromisedToken && token === compromisedToken) {
  errors.push("Tokenul Storefront coincide cu valoarea marcată drept compromisă.");
}
if (!/^\d{4}-\d{2}$/.test(apiVersion)) errors.push("Versiunea Shopify API este invalidă.");
if (!Number.isInteger(minProducts) || minProducts < 1) {
  errors.push("MIN_SHOPIFY_PRODUCTS trebuie să fie un întreg pozitiv.");
}
if (!Number.isInteger(minCollections) || minCollections < 1) {
  errors.push("MIN_SHOPIFY_COLLECTIONS trebuie să fie un întreg pozitiv.");
}
if (!checkoutHosts.length) errors.push("VITE_CHECKOUT_HOSTS nu conține nicio gazdă permisă.");
if (customerAccountRequired) {
  try {
    const accountUrl = new URL(customerAccountUrl);
    if (accountUrl.protocol !== "https:") throw new Error();
  } catch {
    errors.push(
      "VITE_CUSTOMER_ACCOUNT_URL trebuie să conțină URL-ul HTTPS copiat din Shopify Customer accounts.",
    );
  }
}

if (!errors.length) {
  try {
    const data = await storefrontFetch(
      `
        query Readiness($productCount: Int!, $collectionCount: Int!) {
          shop { name }
          products(first: $productCount) {
            nodes {
              id
              title
              handle
              description
              availableForSale
              images(first: 2) { nodes { url } }
              variants(first: 100) {
                nodes { id availableForSale quantityAvailable }
              }
            }
          }
          collections(first: $collectionCount) {
            nodes { id handle title products(first: 1) { nodes { id } } }
          }
        }
      `,
      { productCount: Math.max(minProducts, 50), collectionCount: Math.max(minCollections, 20) },
    );

    const products = data.products.nodes;
    const collections = data.collections.nodes.filter(
      (collection) => !["frontpage", "all"].includes(collection.handle.toLowerCase()),
    );
    if (products.length < minProducts) {
      errors.push(`Shopify are ${products.length}/${minProducts} produse publicate pe Storefront.`);
    }
    if (collections.length < minCollections) {
      errors.push(`Shopify are ${collections.length}/${minCollections} colecții comerciale.`);
    }

    for (const product of products) {
      if (/\b(?:test|demo|placeholder)\b/i.test(`${product.title} ${product.handle}`)) {
        errors.push(`${product.title}: titlu sau handle intern de test.`);
      }
      if (!product.description?.trim()) warnings.push(`${product.title}: descriere goală.`);
      if (!product.images.nodes.length)
        errors.push(`${product.title}: lipsește imaginea principală.`);
      if (!product.variants.nodes.length)
        errors.push(`${product.title}: nu are variante Storefront.`);
      if (!product.availableForSale)
        warnings.push(`${product.title}: indisponibil pentru vânzare.`);
      for (const variant of product.variants.nodes) {
        if (!variant.id.startsWith("gid://shopify/ProductVariant/")) {
          errors.push(`${product.title}: variantă fără ProductVariant GID valid.`);
        }
      }
    }

    const variant = products
      .flatMap((product) => product.variants.nodes)
      .find((candidate) => candidate.availableForSale && candidate.quantityAvailable !== 0);
    if (!variant) {
      errors.push("Nu există nicio variantă disponibilă pentru testarea coșului Shopify.");
    } else {
      const created = await storefrontFetch(
        `mutation Create($input: CartInput!) {
          cartCreate(input: $input) {
            cart { id checkoutUrl lines(first: 10) { nodes { id quantity } } }
            userErrors { field message }
          }
        }`,
        { input: { lines: [{ merchandiseId: variant.id, quantity: 1 }] } },
      );
      let cart = assertMutation("cartCreate", created.cartCreate);
      const checkoutHost = cart?.checkoutUrl
        ? new URL(cart.checkoutUrl).hostname.toLowerCase()
        : "";
      if (!checkoutHost || !checkoutHosts.includes(checkoutHost)) {
        errors.push(
          `cartCreate: checkoutUrl folosește o gazdă nepermisă (${checkoutHost || "absentă"}).`,
        );
      }

      const firstLineId = cart?.lines?.nodes?.[0]?.id;
      if (!firstLineId) {
        errors.push("cartCreate: lipsește cart line ID.");
      } else {
        const updated = await storefrontFetch(
          `mutation Update($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
            cartLinesUpdate(cartId: $cartId, lines: $lines) {
              cart { id checkoutUrl lines(first: 10) { nodes { id quantity } } }
              userErrors { field message }
            }
          }`,
          { cartId: cart.id, lines: [{ id: firstLineId, quantity: 1 }] },
        );
        cart = assertMutation("cartLinesUpdate", updated.cartLinesUpdate) ?? cart;

        const added = await storefrontFetch(
          `mutation Add($cartId: ID!, $lines: [CartLineInput!]!) {
            cartLinesAdd(cartId: $cartId, lines: $lines) {
              cart { id checkoutUrl lines(first: 10) { nodes { id quantity } } }
              userErrors { field message }
            }
          }`,
          { cartId: cart.id, lines: [{ merchandiseId: variant.id, quantity: 1 }] },
        );
        cart = assertMutation("cartLinesAdd", added.cartLinesAdd) ?? cart;

        const removableId = cart?.lines?.nodes?.[0]?.id;
        if (removableId) {
          const removed = await storefrontFetch(
            `mutation Remove($cartId: ID!, $lineIds: [ID!]!) {
              cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
                cart { id checkoutUrl }
                userErrors { field message }
              }
            }`,
            { cartId: cart.id, lineIds: [removableId] },
          );
          assertMutation("cartLinesRemove", removed.cartLinesRemove);
        }
      }
    }

    if (!errors.length) {
      console.log(`Shopify readiness passed for ${domain}.`);
      console.log(
        `Shop: ${data.shop.name}; produse: ${products.length}; colecții: ${collections.length}.`,
      );
    }
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }
}

if (warnings.length) {
  console.warn("Shopify warnings:");
  warnings.forEach((warning) => console.warn(`- ${warning}`));
}
if (errors.length) {
  console.error("Shopify readiness failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
