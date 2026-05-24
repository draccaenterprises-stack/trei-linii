# Trei Linii storefront

Frontend ecommerce custom generat in Lovable pentru brandul Trei Linii.

## Dezvoltare locala

```bash
npm install
npm run dev
```

Verificari:

```bash
npm run build
npm run lint
```

## Date demo

Proiectul poate afisa produse, categorii, FAQ, recenzii si setari homepage mock din:

```text
src/lib/mock-data.ts
src/lib/site-context.tsx
```

Aceste date raman fallback pana exista produse publicate in Shopify pe canalul Headless.

## Cum se adauga produse

Produsele reale se adauga direct din Shopify Admin.

Shopify gestioneaza:

- produse
- titluri si descrieri
- preturi
- imagini
- variante precum marime si culoare
- stoc
- reduceri
- checkout
- plati
- comenzi
- taxe
- livrare si integrari cu firme de curierat

Frontend-ul custom citeste catalogul din Shopify si trimite clientul la Shopify Checkout.

## Integrare Shopify

Layer-ul de integrare este aici:

```text
src/lib/shopify.ts
```

Variabile recomandate:

```text
VITE_SHOPIFY_STORE_DOMAIN=aa01qm-mq.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=token_public_storefront
VITE_SHOPIFY_API_VERSION=2026-01
```

Status integrare:

1. Produsele si colectiile sunt citite prin Shopify Storefront API.
2. Ruta `/product/$handle` cauta produsul dupa handle-ul Shopify.
3. Cosul foloseste ID-urile variantelor Shopify cand produsul vine din Shopify.
4. Checkout-ul foloseste `cartCreate` si `cartLinesAdd`.
5. Clientul este redirectionat catre `checkoutUrl` primit de la Shopify.

Nu construim checkout custom.

Pentru Trei Linii, domeniul Shopify curent este `aa01qm-mq.myshopify.com`.
Tokenul Storefront este public si poate fi folosit din browser, dar variabilele de mediu raman metoda recomandata pentru Lovable/deploy. Daca Shopify nu are inca produse publicate pe canalul Headless, frontend-ul pastreaza produsele demo ca site-ul sa nu para gol.
