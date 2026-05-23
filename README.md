# Trei Linii storefront

Frontend ecommerce custom generat în Lovable pentru brandul Trei Linii.

## Dezvoltare locală

```bash
npm install
npm run dev
```

Verificări:

```bash
npm run build
npm run lint
```

## Date demo

Proiectul folosește momentan produse, categorii, FAQ, recenzii și setări homepage mock din:

```text
src/lib/mock-data.ts
src/lib/site-context.tsx
```

Aceste date sunt temporare până conectăm Shopify.

## Cum se adaugă produse

Da: în producție produsele se adaugă direct din Shopify Admin.

Shopify trebuie să gestioneze:

- produse
- titluri și descrieri
- prețuri
- imagini
- variante precum mărime și culoare
- stoc
- reduceri
- checkout
- plăți
- comenzi
- taxe
- livrare și integrări cu firme de curierat

Frontend-ul custom citește catalogul din Shopify și trimite clientul la Shopify Checkout.

## Integrare Shopify

Layer-ul de integrare este aici:

```text
src/lib/shopify.ts
```

Variabile necesare:

```text
VITE_SHOPIFY_STORE_DOMAIN=magazinul-tau.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=token_public_storefront
VITE_SHOPIFY_API_VERSION=2024-10
```

Pașii următori:

1. Înlocuim citirea produselor mock cu query-uri Shopify Storefront API.
2. Mapăm handle-urile Shopify la ruta `/product/$handle`.
3. Folosim ID-urile variantelor Shopify pentru coș.
4. Folosim `cartCreate` și `cartLinesAdd`.
5. Redirecționăm către `checkoutUrl` primit de la Shopify.

Nu construim checkout custom.
