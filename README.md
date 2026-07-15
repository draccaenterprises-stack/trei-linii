# Trei Linii storefront

Storefront editorial pentru Trei Linii, construit cu React 19, TanStack Start, TypeScript,
Tailwind CSS și Shopify Storefront API. Aplicația folosește SSR și pre-rendering pentru rutele
publice, iar producția pornește implicit în mod sigur de pre-lansare.

## Pornire locală

Cerințe: Node.js 20+ și npm.

```bash
npm ci
npm run dev
```

Vite afișează adresa locală disponibilă. Catalogul vizual din `src/lib/mock-data.ts` este folosit
numai în dezvoltare și în testele E2E. Nu este introdus automat în build-ul de producție.

## Comenzi

```bash
npm run dev              # server local
npm run build            # build SSR + pre-render rute statice
npm run preview          # Worker local din .output
npm run format:check     # verificare Prettier
npm run lint             # ESLint, fără warnings
npm run typecheck        # TypeScript strict
npm run test             # teste unitare și de componente
npm run test:coverage    # teste cu raport de coverage
npm run test:e2e         # Playwright: mobil, tabletă și desktop
npm run test:a11y        # axe pe rutele principale
npm run verify:security  # secret scan, headere și npm audit
npm run verify:perf      # Lighthouse, 3 rulări per scenariu
npm run verify:all       # release gate local
```

Verificări împotriva unui server pornit:

```bash
npm run verify:storefront -- http://localhost:4176
npm run verify:seo -- http://localhost:4176
```

Pentru un deploy public, înlocuiește URL-ul local cu URL-ul public.

## Modurile site-ului

`VITE_SITE_MODE=pre-launch` este valoarea implicită și sigură. Catalogul real, comenzile și
checkout-ul devin active numai când sunt îndeplinite simultan condițiile următoare:

- `VITE_SITE_MODE=live-shop`;
- domeniul și tokenul public Shopify Storefront sunt configurate;
- conturile Shopify sunt configurate, iar URL-ul de autentificare este setat;
- datele comerciale obligatorii sunt completate;
- produsul are o variantă Shopify reală și disponibilă.

Dacă lipsește oricare condiție, aplicația nu simulează tranzacții: ascunde sau dezactivează
acțiunea și păstrează paginile într-o stare coerentă de pre-lansare.

## Configurare

Lista completă și explicațiile sunt în `.env.example`. Variabilele principale sunt:

```text
VITE_SITE_URL
VITE_SITE_MODE
VITE_SHOPIFY_STORE_DOMAIN
VITE_SHOPIFY_STOREFRONT_TOKEN
VITE_SHOPIFY_API_VERSION
VITE_CHECKOUT_HOSTS
VITE_REQUIRE_CUSTOMER_ACCOUNT
VITE_CUSTOMER_ACCOUNT_URL
VITE_LEGAL_COMPANY
VITE_LEGAL_CUI
VITE_LEGAL_REG_COM
VITE_LEGAL_ADDRESS
VITE_CONTACT_EMAIL
VITE_CONTACT_FORM_ENDPOINT
VITE_KLAVIYO_COMPANY_ID
VITE_KLAVIYO_LIST_ID
VITE_GA_ID
VITE_META_PIXEL_ID
```

Numai tokenul public Storefront poate fi expus printr-o variabilă `VITE_`. Tokenurile Shopify
Admin, cheile private și alte secrete nu trebuie adăugate în frontend, în repository sau în
variabile publice. `.env.production` rămâne fără token și în mod `pre-launch`; mediul de deploy
furnizează valorile reale.

## Shopify

Produsele și colecțiile se administrează în Shopify și trebuie publicate pe canalul folosit de
Storefront API. Frontend-ul preia din Shopify:

- titlul, descrierea, handle-ul și imaginile;
- prețul și moneda;
- colecțiile;
- variantele de mărime și culoare;
- disponibilitatea și cantitatea, când API-ul o oferă;
- URL-ul de checkout emis de Shopify Cart API.

Checkout-ul este configurat pentru conturi Shopify obligatorii. Linkul de cont folosește URL-ul
copiat din `Settings > Customer accounts`, iar redirecționarea la checkout adaugă `sso=silent`
pentru a recunoaște sesiunea activă a clientului. Enforcement-ul trebuie activat și în
`Settings > Checkout > Customer contact method`; controlul din frontend nu îl înlocuiește.

Produsele interne de test și colecțiile de sistem sunt filtrate. Catalogul real nu este redenumit
și nu este completat cu produse locale în producție. Checkout-ul acceptă numai URL-uri HTTPS ale
hosturilor configurate.

Adaptorul principal este în `src/lib/shopify.ts`, repository-ul comercial în
`src/lib/product-repository.ts`, iar starea coșului în `src/lib/cart-context.tsx` și
`src/lib/cart-state.ts`.

## SEO, privacy și securitate

- fiecare rută publică are metadata, canonical și HTML SSR;
- sitemapul și `robots.txt` sunt generate la build;
- rutele statice indexabile sunt pre-randate în `.output/public`;
- schema JSON-LD folosește aceleași modele ca paginile;
- analytics și marketing pornesc numai după consimțământ;
- formularele externe rămân ascunse când adaptorul nu este configurat;
- headerele recomandate pentru hosting sunt în `public/_headers`;
- redirecturile de checkout sunt validate prin allowlist.

## Deploy

`npm run build` generează Worker-ul și fișierele publice în `.output`. După deploy trebuie rulate
cel puțin verificările de storefront, SEO și Shopify readiness pe URL-ul public. Publicarea nu este
considerată completă până când produsele reale, datele comerciale și un checkout de test sunt
confirmate în mediul de producție.

## Baseline curent

Build-ul verificat după curățarea dependențelor produce aproximativ 492 KB JavaScript pentru
chunk-ul principal (circa 154 KB gzip) și 67 KB CSS (circa 12 KB gzip). Pragurile funcționale,
Lighthouse și securitate sunt impuse de scripturile de release, nu doar de dimensiunea bundle-ului.
