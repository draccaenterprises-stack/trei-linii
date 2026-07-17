import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type {
  ShopifyCartLineInput,
  ShopifyCartLineUpdateInput,
  ShopifyCartPayload,
  ShopifyCollectionNode,
  ShopifyProductNode,
} from "./shopify-contract";
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  COLLECTIONS_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  PRODUCTS_QUERY,
} from "./shopify-queries";
import { executeStorefrontQuery } from "./shopify.server";
import { externalConfig } from "./site";

const variantIdSchema = z.string().regex(/^gid:\/\/shopify\/ProductVariant\/[A-Za-z0-9_-]+$/);
const cartIdSchema = z.string().regex(/^gid:\/\/shopify\/Cart\/[A-Za-z0-9?&=._-]+$/);
const cartLineIdSchema = z.string().regex(/^gid:\/\/shopify\/CartLine\/[A-Za-z0-9?&=._-]+$/);
const quantitySchema = z.number().int().min(1).max(20);
const cartLineSchema = z.object({
  merchandiseId: variantIdSchema,
  quantity: quantitySchema,
});
const cartLineUpdateSchema = cartLineSchema.extend({ id: cartLineIdSchema });

function runtimeConfig() {
  return {
    domain: externalConfig.shopify.domain,
    apiVersion: externalConfig.shopify.apiVersion,
  };
}

export const fetchProductsFromShopify = createServerFn({ method: "GET" }).handler(async () =>
  executeStorefrontQuery<{ products: { nodes: ShopifyProductNode[] } }>(
    PRODUCTS_QUERY,
    undefined,
    runtimeConfig(),
  ),
);

export const fetchProductFromShopify = createServerFn({ method: "GET" })
  .validator(
    z.object({
      handle: z
        .string()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .max(255),
    }),
  )
  .handler(async ({ data }) =>
    executeStorefrontQuery<{ product: ShopifyProductNode | null }>(
      PRODUCT_BY_HANDLE_QUERY,
      { handle: data.handle },
      runtimeConfig(),
    ),
  );

export const fetchCollectionsFromShopify = createServerFn({ method: "GET" }).handler(async () =>
  executeStorefrontQuery<{ collections: { nodes: ShopifyCollectionNode[] } }>(
    COLLECTIONS_QUERY,
    undefined,
    runtimeConfig(),
  ),
);

export const createCartInShopify = createServerFn({ method: "POST" })
  .validator(z.object({ lines: z.array(cartLineSchema).min(1).max(100) }))
  .handler(async ({ data }) =>
    executeStorefrontQuery<{ cartCreate: ShopifyCartPayload }>(
      CART_CREATE_MUTATION,
      { input: { lines: data.lines satisfies ShopifyCartLineInput[] } },
      runtimeConfig(),
    ),
  );

export const addCartLinesInShopify = createServerFn({ method: "POST" })
  .validator(
    z.object({
      cartId: cartIdSchema,
      lines: z.array(cartLineSchema).min(1).max(100),
    }),
  )
  .handler(async ({ data }) =>
    executeStorefrontQuery<{ cartLinesAdd: ShopifyCartPayload }>(
      CART_LINES_ADD_MUTATION,
      { cartId: data.cartId, lines: data.lines satisfies ShopifyCartLineInput[] },
      runtimeConfig(),
    ),
  );

export const updateCartLinesInShopify = createServerFn({ method: "POST" })
  .validator(
    z.object({
      cartId: cartIdSchema,
      lines: z.array(cartLineUpdateSchema).min(1).max(100),
    }),
  )
  .handler(async ({ data }) =>
    executeStorefrontQuery<{ cartLinesUpdate: ShopifyCartPayload }>(
      CART_LINES_UPDATE_MUTATION,
      { cartId: data.cartId, lines: data.lines satisfies ShopifyCartLineUpdateInput[] },
      runtimeConfig(),
    ),
  );

export const removeCartLinesInShopify = createServerFn({ method: "POST" })
  .validator(
    z.object({
      cartId: cartIdSchema,
      lineIds: z.array(cartLineIdSchema).min(1).max(100),
    }),
  )
  .handler(async ({ data }) =>
    executeStorefrontQuery<{ cartLinesRemove: ShopifyCartPayload }>(
      CART_LINES_REMOVE_MUTATION,
      { cartId: data.cartId, lineIds: data.lineIds },
      runtimeConfig(),
    ),
  );
