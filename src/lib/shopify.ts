/**
 * Shopify Storefront API integration.
 *
 * Preview fixtures are available only in local development. Production never
 * replaces a failed or empty Shopify catalog with demonstrative products.
 */

import type {
  Badge,
  Collection,
  ColorVariant,
  Product,
  ProductVariant,
  Size,
} from "./catalog-types";
import type {
  ShopifyCollectionNode,
  ShopifyGraphQlResponse,
  ShopifyProductNode,
  ShopifySelectedOption,
} from "./shopify-contract";
import {
  addCartLinesInShopify,
  createCartInShopify,
  fetchCollectionsFromShopify,
  fetchProductFromShopify,
  fetchProductsFromShopify,
  removeCartLinesInShopify,
  updateCartLinesInShopify,
} from "./shopify.functions";
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  COLLECTIONS_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  PRODUCTS_QUERY,
} from "./shopify-queries";
import { SITE_MODE, externalConfig, hasLegalBusinessDetails } from "./site";

function normalizeStoreDomain(value?: string) {
  if (!value) return undefined;

  return value
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .trim();
}

export const shopifyConfig = {
  domain: normalizeStoreDomain(externalConfig.shopify.domain),
  token: externalConfig.shopify.token || undefined,
  serverProxyEnabled: externalConfig.shopify.serverProxyEnabled,
  apiVersion: externalConfig.shopify.apiVersion,
};

export const isShopifyConfigured = () =>
  Boolean(shopifyConfig.domain && (shopifyConfig.token || shopifyConfig.serverProxyEnabled));

export const isE2ECommerceFixtureEnabled = () =>
  import.meta.env.MODE === "e2e-commerce" && externalConfig.shopify.e2eCommerceFixtureEnabled;

export const isPreviewCatalogEnabled = () =>
  (import.meta.env.DEV || import.meta.env.MODE.startsWith("e2e")) &&
  externalConfig.shopify.previewCatalogEnabled;

export class CatalogUnavailableError extends Error {
  constructor(message = "Catalogul nu este disponibil momentan.", options?: ErrorOptions) {
    super(message, options);
    this.name = "CatalogUnavailableError";
  }
}

async function storefrontFetch<T>(
  query: string,
  variables: Record<string, unknown> | undefined,
  serverRequest: () => Promise<T>,
): Promise<T> {
  if (!shopifyConfig.domain) {
    throw new Error("Magazinul nu este disponibil momentan.");
  }

  if (shopifyConfig.serverProxyEnabled) {
    return serverRequest();
  }
  if (!shopifyConfig.token) {
    throw new Error("Magazinul nu este disponibil momentan.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const response = await fetch(
      `https://${shopifyConfig.domain}/api/${shopifyConfig.apiVersion}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": shopifyConfig.token,
        },
        body: JSON.stringify({ query, variables }),
        signal: controller.signal,
      },
    );

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

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/** A vector asset is an isolated design file: an .svg URL or alt text mentioning "vector". */
export function isVectorMedia(media: { url: string; alt?: string | null }) {
  const path = media.url.split(/[?#]/)[0]?.toLowerCase() ?? "";
  return path.endsWith(".svg") || normalizeText(media.alt ?? "").includes("vector");
}

/** Worn photography first, isolated vector design last; relative order kept inside each group. */
export function sortMediaPhotosFirst<T extends { url: string; alt?: string | null }>(
  media: T[],
): T[] {
  return [...media.filter((item) => !isVectorMedia(item)), ...media.filter(isVectorMedia)];
}

/** Photo URLs for a product, falling back to every image when only vectors exist. */
export function getPhotoImages(product: {
  media?: Array<{ url: string; alt?: string | null }>;
  images: string[];
}): string[] {
  const source = product.media?.length
    ? product.media
    : product.images.map((url) => ({ url, alt: "" }));
  const photos = source.filter((item) => !isVectorMedia(item)).map((item) => item.url);
  return photos.length ? photos : product.images;
}

/** Finds the isolated design asset whose alt text matches a keyword (diacritics-insensitive). */
export function findVectorImage(
  product: { media?: Array<{ url: string; alt?: string | null }> },
  altKeyword: string,
): string | undefined {
  const needle = normalizeText(altKeyword);
  return product.media?.find(
    (item) => isVectorMedia(item) && normalizeText(item.alt ?? "").includes(needle),
  )?.url;
}



function isSystemCollection(handle: string, title: string) {
  const normalizedHandle = normalizeText(handle);
  const normalizedTitle = normalizeText(title);
  return (
    normalizedHandle === "frontpage" ||
    normalizedHandle === "home-page" ||
    normalizedTitle === "home page" ||
    normalizedTitle === "homepage"
  );
}

function unique<T>(items: T[]) {
  return [...new Set(items)];
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

function mapShopifyProduct(product: ShopifyProductNode): Product {
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
      quantityAvailable: variant.quantityAvailable ?? null,
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

  const media = sortMediaPhotosFirst(
    product.images.nodes.map((image, imageIndex) => ({
      url: image.url,
      alt: image.altText?.trim() || `${product.title} - imagine ${imageIndex + 1}`,
    })),
  );
  if (!media.length && product.featuredImage?.url) {
    media.push({
      url: product.featuredImage.url,
      alt: product.featuredImage.altText?.trim() || product.title,
    });
  }

  const money = {
    amount: Number(product.priceRange.minVariantPrice.amount),
    currencyCode: product.priceRange.minVariantPrice.currencyCode,
  };
  const status = variants.some((variant) => variant.availableForSale) ? "active" : "sold-out";

  const publicCollectionNodes = product.collections.nodes.filter(
    (collection) => !isSystemCollection(collection.handle, collection.title),
  );
  const firstCollection = publicCollectionNodes[0];
  const publicCollections = unique(publicCollectionNodes.map((collection) => collection.handle));
  const publicCollection = firstCollection?.handle ?? "selectia-deschisa";
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    money,
    price: money.amount,
    status,
    collection: publicCollection,
    collections: publicCollections.length ? publicCollections : [publicCollection],
    badge: badgeFromProduct(product, variants),
    media,
    images: media.map((item) => item.url),
    description: product.description?.trim() || "Descrierea acestei piese va fi publicată curând.",
    vibe: product.description?.trim() || "Piesă din selecția Trei Linii.",
    fitNote: "Consultă variantele disponibile și ghidul de mărimi înainte de comandă.",
    sizes: sizes.length ? sizes : ["S", "M", "L", "XL"],
    colors: colors.length ? colors : [{ name: "Standard", hex: colorHex("Standard") }],
    stock,
    variants,
  };
}

function mapShopifyCollection(collection: ShopifyCollectionNode): Collection {
  return {
    handle: collection.handle,
    title: collection.title,
    description: collection.description?.trim() || "Descrierea colecției va fi publicată curând.",
    image: collection.image?.url ?? "",
    count: collection.products.nodes.length,
    productIds: collection.products.nodes.map((product) => product.id),
  };
}

export function findSelectedVariant(
  product: Product,
  size: Size,
  color: string,
): ProductVariant | undefined {
  return product.variants?.find((variant) => variant.size === size && variant.color === color);
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

export function canPurchaseProduct(product?: Product) {
  if (isE2ECommerceFixtureEnabled()) {
    return Boolean(
      product &&
      !product.isPreview &&
      product.variants?.some(
        (variant) =>
          variant.availableForSale &&
          isShopifyProductVariantId(variant.id) &&
          (variant.quantityAvailable === null || variant.quantityAvailable > 0),
      ),
    );
  }

  if (!product || product.isPreview || SITE_MODE !== "live-shop") return false;
  if (!hasLegalBusinessDetails() || !isShopifyConfigured()) return false;

  return Boolean(
    product.variants?.some(
      (variant) =>
        variant.availableForSale &&
        isShopifyProductVariantId(variant.id) &&
        (variant.quantityAvailable === null || variant.quantityAvailable > 0),
    ),
  );
}

async function previewProducts() {
  const { products } = await import("./mock-data");
  const commerceFixture = isE2ECommerceFixtureEnabled();
  return products.map((product) => ({
    ...product,
    isPreview: !commerceFixture,
    status: commerceFixture ? ("active" as const) : ("preview" as const),
    badge: undefined,
    variants: commerceFixture
      ? product.colors.flatMap((color, colorIndex) =>
          product.sizes.map((size) => ({
            id: `gid://shopify/ProductVariant/e2e-${product.id}-${colorIndex}-${size}`,
            size,
            color: color.name,
            availableForSale: (product.stock[size] ?? 0) > 0,
            quantityAvailable: product.stock[size] ?? 0,
          })),
        )
      : undefined,
  }));
}

async function previewCollections() {
  const { collections } = await import("./mock-data");
  return collections;
}

export async function fetchProducts(): Promise<Product[]> {
  if (!isShopifyConfigured()) {
    if (isPreviewCatalogEnabled()) return previewProducts();
    if (SITE_MODE === "pre-launch") return [];
    throw new CatalogUnavailableError("Conexiunea cu magazinul nu este configurată.");
  }

  try {
    const data = await storefrontFetch<{
      products: {
        nodes: ShopifyProductNode[];
      };
    }>(PRODUCTS_QUERY, undefined, fetchProductsFromShopify);

    // Shopify publication controls are the source of truth. Product names such as
    // "Model 1" are valid working titles and must not disappear from the storefront.
    return data.products.nodes.map(mapShopifyProduct);
  } catch (error) {
    console.error("Nu am putut citi produsele din Shopify.", error);
    if (isPreviewCatalogEnabled()) return previewProducts();
    if (SITE_MODE === "pre-launch") return [];
    throw new CatalogUnavailableError("Nu am putut încărca produsele.", { cause: error });
  }
}

export async function fetchProductByHandle(handle: string): Promise<Product | undefined> {
  if (!isShopifyConfigured()) {
    if (isPreviewCatalogEnabled()) {
      return (await previewProducts()).find((product) => product.handle === handle);
    }
    if (SITE_MODE === "pre-launch") return undefined;
    throw new CatalogUnavailableError("Conexiunea cu magazinul nu este configurată.");
  }

  try {
    const data = await storefrontFetch<{
      product: ShopifyProductNode | null;
    }>(PRODUCT_BY_HANDLE_QUERY, { handle }, () => fetchProductFromShopify({ data: { handle } }));

    if (data.product) return mapShopifyProduct(data.product);

    const products = await fetchProducts();
    return products.find((p) => p.handle === handle);
  } catch (error) {
    console.error(`Nu am putut citi produsul ${handle} din Shopify.`, error);
    if (isPreviewCatalogEnabled()) {
      return (await previewProducts()).find((product) => product.handle === handle);
    }
    if (SITE_MODE === "pre-launch") return undefined;
    throw new CatalogUnavailableError("Nu am putut încărca produsul.", { cause: error });
  }
}

export async function fetchCollections(): Promise<Collection[]> {
  if (!isShopifyConfigured()) {
    if (isPreviewCatalogEnabled()) return previewCollections();
    if (SITE_MODE === "pre-launch") return [];
    throw new CatalogUnavailableError("Conexiunea cu magazinul nu este configurată.");
  }

  try {
    const data = await storefrontFetch<{
      collections: {
        nodes: ShopifyCollectionNode[];
      };
    }>(COLLECTIONS_QUERY, undefined, fetchCollectionsFromShopify);

    return data.collections.nodes
      .filter((collection) => !isSystemCollection(collection.handle, collection.title))
      .map(mapShopifyCollection);
  } catch (error) {
    console.error("Nu am putut citi colecțiile din Shopify.", error);
    if (isPreviewCatalogEnabled()) return previewCollections();
    if (SITE_MODE === "pre-launch") return [];
    throw new CatalogUnavailableError("Nu am putut încărca colecțiile.", { cause: error });
  }
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
}

function validateCartLines(lines: Array<{ merchandiseId: string; quantity: number }>) {
  if (!lines.length) throw new Error("Coșul nu conține produse.");
  if (
    lines.some(
      (line) =>
        !isShopifyProductVariantId(line.merchandiseId) ||
        !Number.isInteger(line.quantity) ||
        line.quantity < 1 ||
        line.quantity > 20,
    )
  ) {
    throw new Error("Coșul conține o variantă sau o cantitate invalidă.");
  }
}

function validateCartId(cartId: string) {
  if (!cartId.startsWith("gid://shopify/Cart/")) throw new Error("Coș Shopify invalid.");
}

export async function createCart(
  lines: Array<{ merchandiseId: string; quantity: number }> = [],
): Promise<ShopifyCart> {
  validateCartLines(lines);
  const data = await storefrontFetch<{
    cartCreate: {
      cart: ShopifyCart | null;
      userErrors: Array<{ message: string }>;
    };
  }>(CART_CREATE_MUTATION, { input: { lines } }, () => createCartInShopify({ data: { lines } }));

  if (data.cartCreate.userErrors.length) {
    console.error("Shopify cartCreate userErrors.", data.cartCreate.userErrors);
    throw new Error("Nu am putut pregăti finalizarea comenzii.");
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
  validateCartId(cartId);
  validateCartLines(lines);
  const data = await storefrontFetch<{
    cartLinesAdd: {
      cart: ShopifyCart | null;
      userErrors: Array<{ message: string }>;
    };
  }>(CART_LINES_ADD_MUTATION, { cartId, lines }, () =>
    addCartLinesInShopify({ data: { cartId, lines } }),
  );

  if (data.cartLinesAdd.userErrors.length) {
    console.error("Shopify cartLinesAdd userErrors.", data.cartLinesAdd.userErrors);
    throw new Error("Nu am putut actualiza coșul.");
  }
  if (!data.cartLinesAdd.cart) {
    throw new Error("Shopify nu a returnat coșul actualizat.");
  }

  return data.cartLinesAdd.cart;
}

export async function updateCartLines(
  cartId: string,
  lines: Array<{ id: string; merchandiseId: string; quantity: number }>,
): Promise<ShopifyCart> {
  validateCartId(cartId);
  validateCartLines(lines);
  if (lines.some((line) => !line.id.startsWith("gid://shopify/CartLine/"))) {
    throw new Error("Linie de coș invalidă.");
  }

  const data = await storefrontFetch<{
    cartLinesUpdate: {
      cart: ShopifyCart | null;
      userErrors: Array<{ message: string }>;
    };
  }>(CART_LINES_UPDATE_MUTATION, { cartId, lines }, () =>
    updateCartLinesInShopify({ data: { cartId, lines } }),
  );

  if (data.cartLinesUpdate.userErrors.length) {
    console.error("Shopify cartLinesUpdate userErrors.", data.cartLinesUpdate.userErrors);
    throw new Error("Nu am putut actualiza coșul.");
  }
  if (!data.cartLinesUpdate.cart) throw new Error("Shopify nu a returnat coșul actualizat.");
  return data.cartLinesUpdate.cart;
}

export async function removeCartLines(cartId: string, lineIds: string[]): Promise<ShopifyCart> {
  validateCartId(cartId);
  if (!lineIds.length || lineIds.some((lineId) => !lineId.startsWith("gid://shopify/CartLine/"))) {
    throw new Error("Linie de coș invalidă.");
  }

  const data = await storefrontFetch<{
    cartLinesRemove: {
      cart: ShopifyCart | null;
      userErrors: Array<{ message: string }>;
    };
  }>(CART_LINES_REMOVE_MUTATION, { cartId, lineIds }, () =>
    removeCartLinesInShopify({ data: { cartId, lineIds } }),
  );

  if (data.cartLinesRemove.userErrors.length) {
    console.error("Shopify cartLinesRemove userErrors.", data.cartLinesRemove.userErrors);
    throw new Error("Nu am putut actualiza coșul.");
  }
  if (!data.cartLinesRemove.cart) throw new Error("Shopify nu a returnat coșul actualizat.");
  return data.cartLinesRemove.cart;
}

export function buildShopifyCheckoutUrl(
  checkoutUrl: string,
  requireCustomerAccount = externalConfig.shopify.customerAccountRequired,
) {
  const destination = new URL(checkoutUrl);
  const allowedHosts = new Set([
    shopifyConfig.domain?.toLowerCase(),
    ...externalConfig.shopify.checkoutHosts,
  ]);

  if (destination.protocol !== "https:" || !allowedHosts.has(destination.hostname.toLowerCase())) {
    throw new Error("Destinația de checkout nu este permisă.");
  }

  if (requireCustomerAccount) destination.searchParams.set("sso", "silent");
  return destination.toString();
}

export function redirectToShopifyCheckout(checkoutUrl: string) {
  window.location.assign(buildShopifyCheckoutUrl(checkoutUrl));
}
