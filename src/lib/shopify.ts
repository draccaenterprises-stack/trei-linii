/**
 * Shopify Storefront API integration.
 *
 * Products can fall back to local pre-launch data while Shopify has no
 * products published to the Headless storefront. Checkout only runs for real
 * Shopify ProductVariant IDs.
 */

import {
  collections as mockCollections,
  products as mockProducts,
  type Badge,
  type Collection,
  type ColorVariant,
  type Product,
  type ProductVariant,
  type Size,
} from "./mock-data";

const DEFAULT_STORE_DOMAIN = "aa01qm-mq.myshopify.com";

function normalizeStoreDomain(value?: string) {
  if (!value) return undefined;

  return value
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .trim();
}

export const shopifyConfig = {
  domain: normalizeStoreDomain(
    (import.meta.env.VITE_SHOPIFY_STORE_DOMAIN as string | undefined) ?? DEFAULT_STORE_DOMAIN,
  ),
  token: (import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string | undefined) ?? undefined,
  apiVersion: (import.meta.env.VITE_SHOPIFY_API_VERSION as string | undefined) ?? "2026-01",
};

export const isShopifyConfigured = () => Boolean(shopifyConfig.domain && shopifyConfig.token);

type ShopifyGraphQlResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

type ShopifyMoney = {
  amount: string;
  currencyCode: string;
};

type ShopifyImage = {
  url: string;
  altText?: string | null;
};

type ShopifySelectedOption = {
  name: string;
  value: string;
};

type ShopifyProductNode = {
  id: string;
  handle: string;
  title: string;
  description: string;
  availableForSale: boolean;
  totalInventory?: number | null;
  tags: string[];
  featuredImage: ShopifyImage | null;
  priceRange: {
    minVariantPrice: ShopifyMoney;
  };
  collections: {
    nodes: Array<{
      handle: string;
      title: string;
    }>;
  };
  images: {
    nodes: ShopifyImage[];
  };
  variants: {
    nodes: Array<{
      id: string;
      title: string;
      availableForSale: boolean;
      quantityAvailable?: number | null;
      selectedOptions: ShopifySelectedOption[];
      price: ShopifyMoney;
    }>;
  };
};

type ShopifyCollectionNode = {
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products: {
    nodes: Array<{ id: string }>;
  };
};

async function storefrontFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!shopifyConfig.domain || !shopifyConfig.token) {
    throw new Error("Magazinul nu este disponibil momentan.");
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
    throw new Error(`Shopify a raspuns cu status ${response.status}.`);
  }

  const payload = (await response.json()) as ShopifyGraphQlResponse<T>;
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((error) => error.message).join("; "));
  }
  if (!payload.data) {
    throw new Error("Raspuns Shopify fara data.");
  }

  return payload.data;
}

const PRODUCT_FIELDS = `
  id
  handle
  title
  description
  availableForSale
  tags
  featuredImage {
    url
    altText
  }
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
  collections(first: 3) {
    nodes {
      handle
      title
    }
  }
  images(first: 10) {
    nodes {
      url
      altText
    }
  }
  variants(first: 100) {
    nodes {
      id
      title
      availableForSale
      selectedOptions {
        name
        value
      }
      price {
        amount
        currencyCode
      }
    }
  }
`;

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function isInternalTestLabel(value: string) {
  const normalized = normalizeText(value);
  return (
    /^model\s*\d+/.test(normalized) ||
    /^colectie\s*\d+/.test(normalized) ||
    /^collection\s*\d+/.test(normalized) ||
    normalized.includes(" test") ||
    normalized.endsWith(" test") ||
    normalized === "home page" ||
    normalized === "homepage"
  );
}

function publicProductTitle(title: string, index = 0) {
  if (isInternalTestLabel(title))
    return `Previzualizare design spate ${String(index + 1).padStart(2, "0")}`;
  return title;
}

function unique<T>(items: T[]) {
  return [...new Set(items)];
}

function publicProductHandle(product: ShopifyProductNode, index = 0) {
  if (isInternalTestLabel(product.title) || isInternalTestLabel(product.handle)) {
    return `previzualizare-design-spate-${String(index + 1).padStart(2, "0")}`;
  }

  return product.handle;
}

function publicProductDescription(product: ShopifyProductNode) {
  if (isInternalTestLabel(product.title) || isInternalTestLabel(product.description)) {
    return "Previzualizare pentru directia Trei Linii: tricou oversized cu fata curata si design minimalist pe spate.";
  }

  return (
    product.description?.trim() ??
    "Tricou Trei Linii cu croiala oversized, material dens si finisaj curat."
  );
}

function selectedOptionValue(
  options: ShopifySelectedOption[],
  acceptedNames: string[],
): string | undefined {
  const normalizedNames = acceptedNames.map(normalizeText);
  return options.find((option) => normalizedNames.includes(normalizeText(option.name)))?.value;
}

function fallbackSize(options: ShopifySelectedOption[]) {
  const values = options
    .map((option) => option.value)
    .filter((value) => value && normalizeText(value) !== "default title");
  const knownSize = values.find((value) =>
    ["xs", "s", "m", "l", "xl", "xxl", "xxxl"].includes(normalizeText(value)),
  );

  return knownSize ?? "Unica";
}

function fallbackColor(options: ShopifySelectedOption[]) {
  const explicitColor = selectedOptionValue(options, ["color", "colour", "culoare"]);
  if (explicitColor) return explicitColor;

  const values = options
    .map((option) => option.value)
    .filter((value) => value && normalizeText(value) !== "default title");
  const nonSizeValue = values.find(
    (value) => !["xs", "s", "m", "l", "xl", "xxl", "xxxl"].includes(normalizeText(value)),
  );

  return nonSizeValue ?? "Standard";
}

function colorHex(name: string) {
  const normalized = normalizeText(name);
  const palette: Record<string, string> = {
    alb: "#f7f5ed",
    white: "#f7f5ed",
    crem: "#f1ead9",
    cream: "#f1ead9",
    negru: "#111111",
    black: "#111111",
    carbune: "#2b2a28",
    charcoal: "#2b2a28",
    gri: "#8e8b84",
    grey: "#8e8b84",
    gray: "#8e8b84",
    olive: "#6b7a3a",
    verde: "#6b7a3a",
    albastru: "#8aa9c8",
    blue: "#8aa9c8",
    rosu: "#e43d30",
    red: "#e43d30",
    nisip: "#c6b89a",
    sand: "#c6b89a",
    standard: "#e8e3d6",
  };

  return palette[normalized] ?? "#d8d2c6";
}

function badgeFromProduct(
  product: ShopifyProductNode,
  variants: ProductVariant[],
): Badge | undefined {
  const tags = product.tags.map(normalizeText);
  if (tags.some((tag) => ["noutate", "new", "new drop", "nou"].includes(tag))) return "noutate";
  if (tags.some((tag) => ["limitat", "limited", "limited edition"].includes(tag))) {
    return "limitat";
  }

  const availableQuantity = variants.reduce(
    (sum, variant) => sum + (variant.quantityAvailable ?? (variant.availableForSale ? 1 : 0)),
    0,
  );

  if (availableQuantity > 0 && availableQuantity <= 5) return "stoc limitat";
  return undefined;
}

function mapShopifyProduct(product: ShopifyProductNode, index = 0): Product {
  const variants = product.variants.nodes.map<ProductVariant>((variant) => {
    const size =
      selectedOptionValue(variant.selectedOptions, ["size", "marime"]) ??
      fallbackSize(variant.selectedOptions);
    const color = fallbackColor(variant.selectedOptions);

    return {
      id: variant.id,
      size,
      color,
      availableForSale: variant.availableForSale,
      quantityAvailable: variant.quantityAvailable,
    };
  });

  const sizes = unique(variants.map((variant) => variant.size)).filter(Boolean);
  const colors = unique(variants.map((variant) => variant.color)).map<ColorVariant>((name) => ({
    name,
    hex: colorHex(name),
  }));

  const stock = sizes.reduce<Record<Size, number>>((acc, size) => {
    const matchingVariants = variants.filter((variant) => variant.size === size);
    acc[size] = matchingVariants.reduce(
      (sum, variant) => sum + (variant.quantityAvailable ?? (variant.availableForSale ? 99 : 0)),
      0,
    );
    return acc;
  }, {});

  const images = product.images.nodes.map((image) => image.url);
  if (!images.length && product.featuredImage?.url) images.push(product.featuredImage.url);

  const firstCollection = product.collections.nodes[0];
  const publicCollection = firstCollection
    ? isInternalTestLabel(firstCollection.title) || isInternalTestLabel(firstCollection.handle)
      ? "spate"
      : firstCollection.handle
    : "tricouri";
  const firstMockImage = mockProducts[0]?.images[0] ?? "";

  return {
    id: product.id,
    handle: publicProductHandle(product, index),
    title: publicProductTitle(product.title, index),
    price: Number(product.priceRange.minVariantPrice.amount),
    collection: publicCollection,
    badge: badgeFromProduct(product, variants),
    images: images.length ? images : [firstMockImage],
    description: publicProductDescription(product),
    vibe:
      mockProducts[index % mockProducts.length]?.vibe ??
      "Design minimalist construit pentru purtare zilnica.",
    fitNote:
      "Croiala oversized. Verifica tabelul de marimi inainte de comanda pentru potrivirea corecta.",
    sizes: sizes.length ? sizes : ["S", "M", "L", "XL"],
    colors: colors.length ? colors : [{ name: "Standard", hex: colorHex("Standard") }],
    stock,
    variants,
  };
}

function mapShopifyCollection(collection: ShopifyCollectionNode, index: number): Collection {
  const fallback = mockCollections[index % mockCollections.length];
  const looksInternal =
    isInternalTestLabel(collection.title) || isInternalTestLabel(collection.handle);

  return {
    handle: looksInternal ? fallback.handle : collection.handle,
    title: looksInternal ? fallback.title : collection.title,
    description: looksInternal
      ? fallback.description
      : collection.description?.trim() || fallback.description,
    image: collection.image?.url ?? fallback.image,
    count: collection.products.nodes.length,
  };
}

function mergeCollections(collections: Collection[]) {
  const byHandle = new Map(collections.map((collection) => [collection.handle, collection]));

  for (const collection of mockCollections) {
    if (!byHandle.has(collection.handle)) byHandle.set(collection.handle, collection);
  }

  return [...byHandle.values()];
}

export function findSelectedVariant(
  product: Product,
  size: Size,
  color: string,
): ProductVariant | undefined {
  return (
    product.variants?.find((variant) => variant.size === size && variant.color === color) ??
    product.variants?.find((variant) => variant.size === size) ??
    product.variants?.find((variant) => variant.color === color)
  );
}

export function getStockForColor(product: Product, color: string): Record<Size, number> {
  if (!product.variants?.length) return product.stock;

  return product.sizes.reduce<Record<Size, number>>((stock, size) => {
    stock[size] =
      product.variants
        ?.filter((variant) => variant.size === size && variant.color === color)
        .reduce(
          (sum, variant) =>
            sum + (variant.quantityAvailable ?? (variant.availableForSale ? 99 : 0)),
          0,
        ) ?? 0;
    return stock;
  }, {});
}

export function getSelectedVariantId(product: Product, size: Size, color: string) {
  return findSelectedVariant(product, size, color)?.id;
}

export function isShopifyProductVariantId(value?: string) {
  return Boolean(value?.startsWith("gid://shopify/ProductVariant/"));
}

export async function fetchProducts(): Promise<Product[]> {
  if (!isShopifyConfigured()) return mockProducts;

  try {
    const data = await storefrontFetch<{
      products: {
        nodes: ShopifyProductNode[];
      };
    }>(`
      query Products {
        products(first: 50) {
          nodes {
            ${PRODUCT_FIELDS}
          }
        }
      }
    `);

    const products = data.products.nodes.map(mapShopifyProduct);
    return products.length ? products : mockProducts;
  } catch (error) {
    console.error("Nu am putut citi produsele din Shopify.", error);
    return mockProducts;
  }
}

export async function fetchProductByHandle(handle: string): Promise<Product | undefined> {
  if (!isShopifyConfigured()) return mockProducts.find((p) => p.handle === handle);

  try {
    const data = await storefrontFetch<{
      product: ShopifyProductNode | null;
    }>(
      `
      query ProductByHandle($handle: String!) {
        product(handle: $handle) {
          ${PRODUCT_FIELDS}
        }
      }
    `,
      { handle },
    );

    if (data.product) return mapShopifyProduct(data.product);

    const products = await fetchProducts();
    return (
      products.find((p) => p.handle === handle) ?? mockProducts.find((p) => p.handle === handle)
    );
  } catch (error) {
    console.error(`Nu am putut citi produsul ${handle} din Shopify.`, error);
    const products = await fetchProducts();
    return (
      products.find((p) => p.handle === handle) ?? mockProducts.find((p) => p.handle === handle)
    );
  }
}

export async function fetchCollections(): Promise<Collection[]> {
  if (!isShopifyConfigured()) return mockCollections;

  try {
    const data = await storefrontFetch<{
      collections: {
        nodes: ShopifyCollectionNode[];
      };
    }>(`
      query Collections {
        collections(first: 20) {
          nodes {
            handle
            title
            description
            image {
              url
              altText
            }
            products(first: 100) {
              nodes {
                id
              }
            }
          }
        }
      }
    `);

    const collections = data.collections.nodes.map(mapShopifyCollection);
    return collections.length ? mergeCollections(collections) : mockCollections;
  } catch (error) {
    console.error("Nu am putut citi colectiile din Shopify.", error);
    return mockCollections;
  }
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
    throw new Error("Shopify nu a returnat cosul.");
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
    throw new Error("Shopify nu a returnat cosul actualizat.");
  }

  return data.cartLinesAdd.cart;
}

export function redirectToShopifyCheckout(checkoutUrl: string) {
  window.location.href = checkoutUrl;
}
