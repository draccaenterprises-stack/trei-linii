Diagnoză strict READ-ONLY pentru commit `7ec3bf75ca0e66c9f8b864b7809c74deda106dbe`. Nu am modificat niciun fișier, produs sau setare.

## 1. Motivul concret al eșecului preview-ului

Atât preview-ul Lovable, cât și `bun run build` local eșuează **înainte** de a atinge codul aplicației, cu aceeași eroare de rezolvare de modul din `vite.config.ts`:

```
Error: Cannot find package '/dev-server/node_modules/h3-v2/index.js'
  imported from /dev-server/node_modules/@tanstack/start-server-core/dist/esm/request-response.js
failed to load config from /dev-server/vite.config.ts
```

Cauza rădăcină: în `bun.lock` există aliasul `"h3-v2": "npm:h3@2.0.1-rc.20"`, dar directorul `node_modules/h3-v2/` este gol (conține doar un `node_modules/` subdirector, fără `package.json`, fără `index.js`). Pachetul `@tanstack/start-server-core` importă `h3-v2` la încărcarea configului Vite, iar Node ESM aruncă `ERR_PACKAGE_PATH_NOT_EXPORTED`/`legacyMainResolve` pentru că fișierele lipsesc. Preview-ul Lovable rulează același Vite → același crash → mesajul „Couldn't update the preview".

Contradicția cu „build local npm trece": buildul care „trece" local nu este pe același commit / același `node_modules`. Pe checkout-ul curent al commit-ului 7ec3bf7, cu `node_modules` produs de `bun install`, atât `vite build`, cât și `vite dev` eșuează identic. Este un install/hoist corupt pentru aliasul `h3-v2`, nu o eroare în codul din `src/`.

## 2. Typecheck

`bunx tsgo --noEmit` returnează o singură eroare, preexistentă și neblocantă pentru preview:
- `tests/setup.ts:21` — `IntersectionObserverMock` nu implementează `scrollMargin` (adăugat într-o versiune nouă a lib.dom.d.ts). Nu afectează buildul de producție (fișier de test), dar există.

Restul codului aplicației (`src/**`) trece typecheck.

## 3. Booleene cerute

1. **Conexiunea Shopify furnizează la build domeniul + Storefront token?** → **NU** (parțial). Fișierul `.env.production` are `VITE_SHOPIFY_STORE_DOMAIN=<set>` (aa01qm-mq.myshopify.com) dar `VITE_SHOPIFY_STOREFRONT_TOKEN=<empty>`. Conexiunea a fost instalată la nivel de proiect, însă valoarea tokenului nu este injectată în `.env.production` folosit de Vite. Nu există alt `.env`/`.env.local` care să suprascrie.
2. **URL-ul Customer Account este configurat?** → **NU**. `VITE_CUSTOMER_ACCOUNT_URL=<empty>` în `.env.production`.
3. **Ce condiții mai țin proiectul în pre-launch conform `src/lib/site.ts`** (`deriveSiteMode`): trecerea la `live-shop` cere `siteMode === "live-shop"` PLUS toate: `shopifyStoreDomain`, `shopifyStorefrontToken`, `company`, `cui`, `regCom`, `address` și (`!customerAccountRequired || customerAccountUrl`). Pe commit-ul curent lipsesc / sunt goale:
   - `VITE_SITE_MODE` = `pre-launch` (setat explicit — chiar dacă restul ar fi complet, tot ar rămâne pre-launch)
   - `VITE_SHOPIFY_STOREFRONT_TOKEN` — gol
   - `VITE_CUSTOMER_ACCOUNT_URL` — gol (iar `VITE_REQUIRE_CUSTOMER_ACCOUNT=true`)
   - `VITE_LEGAL_COMPANY`, `VITE_LEGAL_CUI`, `VITE_LEGAL_REG_COM`, `VITE_LEGAL_ADDRESS` — niciunul nu este prezent în `.env.production` (deci `company`/`cui`/`regCom`/`address` se rezolvă la string gol în `publicConfig`).

Orice unul dintre punctele de mai sus menține `SITE_MODE = "pre-launch"`.

## Concluzie

- Preview-ul eșuează pentru că `node_modules/h3-v2` este corupt/gol pe commit-ul 7ec3bf7; nu este vină de cod din `src/`.
- Buildul de producție eșuează pe acest checkout din aceeași cauză; ce trece „local npm" trebuie să fie pe alt `node_modules`.
- Shopify: doar domeniul ajunge la build, tokenul Storefront lipsește din env; Customer Account URL lipsește; iar `VITE_SITE_MODE=pre-launch` + datele legale goale ar bloca oricum tranziția la `live-shop`.

Nu propun nicio modificare în acest plan — este o diagnoză. Confirmă dacă vrei să trec în build mode pentru a repara oricare dintre puncte (reinstalare curată pentru `h3-v2`, injectarea tokenului Storefront în env, completarea Customer Account URL / datelor legale, fix la mock-ul `IntersectionObserver`).