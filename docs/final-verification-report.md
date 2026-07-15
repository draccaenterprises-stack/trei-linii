# Trei Linii - raport final de verificare

Generat: 2026-07-14T23:01:45.684Z
Commit de bază: eebb832
Branch: codex/live-collections-manifest
URL public verificat: https://blank-atelier-canvas.lovable.app

## Rezultat

CODUL TRECE - activarea comercială mai are verificări externe.

- CXD-001 - CXD-039: implementate în cod și acoperite de gate-ul local.
- CXD-040: gate local complet; verificările externe sunt marcate separat.

## Verificări

[x] release gate local
    Comandă: npm run verify:all
    Status: passed; exit 0
    All matched files use Prettier code style!
     Test Files  17 passed (17)
          Tests  42 passed (42)
       Duration  1.86s (transform 482ms, setup 1.53s, import 1.25s, tests 936ms, environment 7.34s)
    All files          |   79.49 |    71.09 |   82.85 |   82.85 |
    ✓ built in 1.35s
    ✓ built in 346ms
    ✓ built in 1.50s
    Pre-render OK: 17 rute statice scrise în .output/public.
      8 skipped
      91 passed (34.5s)
    Storefront verification passed for http://127.0.0.1:4179 (18 routes).
    Public SEO verification passed for http://127.0.0.1:4179.
    Build local verificat complet la http://127.0.0.1:4179.
    Verificare securitate OK: 377 fișiere sursă/build scanate.
    found 0 vulnerabilities
    home-mobile: LCP 2190ms, CLS 0.003, TBT 0ms, performance 94
    catalog-mobile: LCP 2074ms, CLS 0.001, TBT 0ms, performance 97
    home-desktop: LCP 127ms, CLS 0.000, TBT 0ms, performance 97
    Lighthouse OK: mediană din 3 rulări/scenariu. Rapoarte: /Users/coasa/Downloads/trei-linii-live-redesign/reports/lighthouse

[ ] storefront public
    Comandă: npm run verify:storefront -- https://blank-atelier-canvas.lovable.app
    Status: external; exit 1
    Notă: Poate rămâne extern până când ultimul commit este publicat.
    - /faq: conținut interzis /Edit with Lovable/i
    - /size-guide: conținut interzis /Edit with Lovable/i
    - /livrare: conținut interzis /Edit with Lovable/i
    - /retur: conținut interzis /Edit with Lovable/i
    - /schimb-marime: conținut interzis /Edit with Lovable/i
    - /termeni-si-conditii: conținut interzis /Edit with Lovable/i
    - /termeni-si-conditii: text esențial absent /Termeni și condiții/i
    - /confidentialitate: conținut interzis /Edit with Lovable/i
    - /confidentialitate: text esențial absent /Confidențialitate/i
    - /cookies: conținut interzis /Edit with Lovable/i
    - /anpc: conținut interzis /Edit with Lovable/i
    - /sol: conținut interzis /Edit with Lovable/i
    - /cart: lipsește meta description SSR
    - /cart: canonical absent sau indică altă rută
    - /cart: lipsește noindex
    - /cart: conținut interzis /Edit with Lovable/i
    - /cart: text esențial absent /Coș/i
    - /admin: trebuie să răspundă 404, răspunde 200

[ ] SEO public
    Comandă: npm run verify:seo -- https://blank-atelier-canvas.lovable.app
    Status: external; exit 1
    Notă: Poate rămâne extern până când robots, sitemap și build-ul nou sunt publicate.
    - robots.txt: lipsește Disallow: /mcp
    - robots.txt: lipsește Disallow: /.mcp
    - robots.txt: lipsește Disallow: /.well-known/oauth-protected-resource
    - sitemap.xml: lipsește ruta /shop/lista
    - sitemap.xml: lipsește ruta /manifest
    - sitemap.xml: lipsește ruta /livrare
    - sitemap.xml: lipsește ruta /retur
    - sitemap.xml: lipsește ruta /schimb-marime
    - sitemap.xml: lipsește ruta /termeni-si-conditii
    - sitemap.xml: lipsește ruta /confidentialitate
    - sitemap.xml: lipsește ruta /anpc
    - sitemap.xml: lipsește ruta /sol
    - /shop/lista: canonical incorect
    - /favicon-64.png: status 404
    - /favicon-64.png: content-type nu este imagine
    - /apple-touch-icon.png: status 404
    - /apple-touch-icon.png: content-type nu este imagine
    - /admin: status 200, așteptat 404

[ ] Shopify readiness
    Comandă: npm run verify:shopify
    Status: external; exit 1
    Notă: Necesită tokenul Storefront și catalogul real în mediul de verificare.
    > verify:shopify
    > node scripts/verify-shopify-readiness.mjs
    Shopify readiness failed:
    - Lipsește VITE_SHOPIFY_STOREFRONT_TOKEN din mediul de verificare.

## Inputuri externe pentru activarea live-shop

- tokenul public Shopify Storefront setat numai în mediul de deploy;
- produse și colecții reale publicate pe canalul Storefront/Headless;
- datele comerciale reale și textele juridice validate;
- o comandă Shopify de test și confirmarea hostului de checkout;
- endpointurile opționale pentru contact, newsletter și analytics, dacă vor fi folosite;
- republicarea deploy-ului după integrarea ultimului commit.

Niciunul dintre aceste inputuri nu cere schimbări de arhitectură; în lipsa lor, producția rămâne în pre-lansare sigură.
