# Trei Linii - raport final de verificare

Generat: 2026-07-06T17:38:19.554Z
Commit: 381bc7b
Branch: edit/edt-72c91914-2355-440e-85b0-05d2e9207382
URL public verificat: https://blank-atelier-canvas.lovable.app

## Rezultat

Status: NU TRECE. Exista verificari locale esuate.

## Verificari automate

[!] lint
    Comanda: npm run lint
    Status: failed, exit 2
    Output relevant:
        at doMatch (/dev-server/node_modules/@eslint/config-array/dist/cjs/index.cjs:422:13)
        at match (/dev-server/node_modules/@eslint/config-array/dist/cjs/index.cjs:756:11)
        at /dev-server/node_modules/@eslint/config-array/dist/cjs/index.cjs:772:10
        at Array.some (<anonymous>)
        at pathMatches (/dev-server/node_modules/@eslint/config-array/dist/cjs/index.cjs:767:44)
        at /dev-server/node_modules/@eslint/config-array/dist/cjs/index.cjs:1368:8
        at FlatConfigArray.forEach (<anonymous>)
    npm notice
    npm notice New major version of npm available! 10.9.4 -> 11.18.0
    npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.18.0
    npm notice To update run: npm install -g npm@11.18.0
    npm notice

[x] build
    Comanda: npm run build
    Status: passed, exit 0
    Output relevant:
    node_modules/@tanstack/react-query/build/modern/useMutationState.js (1:0): Module level directives cause errors when bundled, "use client" in "node_modules/@tanstack/react-query/build/modern/useMutationState.js" was ignored.
    node_modules/@tanstack/react-query/build/modern/useInfiniteQuery.js (1:0): Module level directives cause errors when bundled, "use client" in "node_modules/@tanstack/react-query/build/modern/useInfiniteQuery.js" was ignored.
    node_modules/@tanstack/react-query/build/modern/IsRestoringProvider.js (1:0): Module level directives cause errors when bundled, "use client" in "node_modules/@tanstack/react-query/build/modern/IsRestoringProvider.js" was ignored.
    node_modules/@tanstack/react-query/build/modern/useMutation.js (1:0): Module level directives cause errors when bundled, "use client" in "node_modules/@tanstack/react-query/build/modern/useMutation.js" was ignored.
    node_modules/@tanstack/react-query/build/modern/useSuspenseInfiniteQuery.js (1:0): Module level directives cause errors when bundled, "use client" in "node_modules/@tanstack/react-query/build/modern/useSuspenseInfiniteQuery.js" was ignored.
    node_modules/@tanstack/react-query/build/modern/useSuspenseQuery.js (1:0): Module level directives cause errors when bundled, "use client" in "node_modules/@tanstack/react-query/build/modern/useSuspenseQuery.js" was ignored.
    node_modules/@tanstack/react-query/build/modern/useSuspenseQueries.js (1:0): Module level directives cause errors when bundled, "use client" in "node_modules/@tanstack/react-query/build/modern/useSuspenseQueries.js" was ignored.
    node_modules/@tanstack/react-router/dist/esm/matchContext.js (1:0): Module level directives cause errors when bundled, "use client" in "node_modules/@tanstack/react-router/dist/esm/matchContext.js" was ignored.
    node_modules/@tanstack/react-router/dist/esm/Transitioner.js (1:0): Module level directives cause errors when bundled, "use client" in "node_modules/@tanstack/react-router/dist/esm/Transitioner.js" was ignored.
    node_modules/@tanstack/react-query/build/modern/errorBoundaryUtils.js (1:0): Module level directives cause errors when bundled, "use client" in "node_modules/@tanstack/react-query/build/modern/errorBoundaryUtils.js" was ignored.
    node_modules/@tanstack/react-query/build/modern/useBaseQuery.js (1:0): Module level directives cause errors when bundled, "use client" in "node_modules/@tanstack/react-query/build/modern/useBaseQuery.js" was ignored.
    [nitro]  WARN  [cloudflare] Wrangler config main is overridden and will be ignored.

[ ] public storefront
    Comanda: npm run verify:storefront -- https://blank-atelier-canvas.lovable.app --min-products=8 --check-public-admin --check-public-assets
    Status: blocked, exit 1
    Nota: Poate ramane blocat pana cand Lovable publica ultima versiune a storefront-ului.
    Output relevant:
    > verify:storefront
    > node scripts/verify-storefront.mjs https://blank-atelier-canvas.lovable.app --min-products=8 --check-public-admin --check-public-assets
    Storefront verification failed for https://blank-atelier-canvas.lovable.app
    - /shop: produse vizibile insuficiente (0/8); probabil ruleaza o versiune Lovable nepublicata

[x] public SEO/static assets
    Comanda: npm run verify:seo -- https://blank-atelier-canvas.lovable.app
    Status: passed, exit 0
    Nota: Poate ramane blocat pana cand Lovable publica ultima versiune de robots/sitemap.
    Output relevant:
    > verify:seo
    > node scripts/verify-public-seo.mjs https://blank-atelier-canvas.lovable.app
    Public SEO verification passed for https://blank-atelier-canvas.lovable.app

[x] source secret/demo scan
    Comanda: rg -n "<forbidden patterns>" src public .env.example --glob "!routeTree.gen.ts"
    Status: passed, exit 1
    Nota: Exit 1 inseamna ca rg nu a gasit match-uri.

[x] npm audit lockfile
    Comanda: npm install --package-lock-only --ignore-scripts
    Status: passed, exit 0
    Output relevant:
    up to date in 2s
    145 packages are looking for funding
      run `npm fund` for details
    npm notice operation is not supported.
    npm notice operation is not supported.

[!] dependency audit
    Comanda: npm audit --audit-level=moderate
    Status: failed, exit 1
    Output relevant:
    { error: 'operation is not supported.' }
    npm notice operation is not supported.
    npm notice operation is not supported.
    npm warn audit 404 Not Found - POST https://europe-west1-npm.pkg.dev/lovable-core-prod/sandbox-npm-cache/-/npm/v1/security/audits/quick - operation is not supported.
    npm error audit endpoint returned an error
    npm error A complete log of this run can be found in: /root/.npm/_logs/2026-07-06T17_38_18_316Z-debug-0.log

[ ] Shopify readiness
    Comanda: npm run verify:shopify
    Status: blocked, exit 1
    Nota: Blocat pana cand tokenul Shopify nou este setat in env.
    Output relevant:
    > verify:shopify
    > node scripts/verify-shopify-readiness.mjs
    Shopify readiness failed:
    - Lipseste VITE_SHOPIFY_STORE_DOMAIN.
    - Lipseste VITE_SHOPIFY_STOREFRONT_TOKEN.

## Blocaje inainte de comenzi reale

- Token Shopify Storefront nou, rotit si setat in Lovable env.
- Lovable republished dupa ultimul push GitHub, ca site-ul public sa serveasca fisierele actuale.
- Produse reale publicate pe canalul Shopify Headless.
- Test checkout real Shopify cu o comanda de test.
- Date firma reale si politici legale finale validate pentru Romania.
- Klaviyo configurat sau newsletter dezactivat daca nu se foloseste.

