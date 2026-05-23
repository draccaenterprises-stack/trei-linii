# BLANK ATELIER storefront

Custom ecommerce frontend generated in Lovable for a minimal streetwear brand.

## Local development

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run build
npm run lint
```

## Current demo data

The project currently uses mock products, collections, FAQ, reviews and homepage controls from:

```text
src/lib/mock-data.ts
src/lib/site-context.tsx
```

This is temporary. It lets us refine the design before connecting Shopify.

## Shopify product workflow

Yes: production products should be added directly in Shopify.

Shopify should manage:

- products
- titles and descriptions
- prices
- images
- variants such as size and color
- stock/inventory
- discounts
- checkout
- payments
- orders
- taxes
- shipping and delivery integrations

The custom frontend should only read product/catalog data from Shopify and send the customer to Shopify Checkout.

## Shopify integration points

The placeholder integration layer is here:

```text
src/lib/shopify.ts
```

Expected environment variables:

```text
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your_storefront_public_token
VITE_SHOPIFY_API_VERSION=2024-10
```

Next production step:

1. Replace mock product reads with Shopify Storefront API queries.
2. Map Shopify product handles to `/product/$handle`.
3. Use Shopify variant IDs for cart lines.
4. Use `cartCreate` and `cartLinesAdd`.
5. Redirect to Shopify `checkoutUrl`.

Do not build a custom checkout for this storefront.
