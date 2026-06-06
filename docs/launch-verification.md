# Trei Linii - verificare lansare

Ultima actualizare: 2026-06-04.

## Status curent

- Frontend custom Trei Linii este conectat la Shopify Storefront API.
- Produsele, colectiile, variantele, preturile si imaginile se citesc din Shopify cand sunt publicate pe canalul Headless.
- Daca Shopify nu intoarce catalog, site-ul foloseste date locale de pre-lansare ca sa nu arate gol.
- Daca Shopify are mai putin de 8 produse publicate, catalogul vizual este completat cu produse mock de pre-lansare. Acestea sunt doar pentru prezentare pana sunt inlocuite cu produse reale in Shopify.
- Checkout custom nu este construit. Cosul creeaza un cart Shopify si redirectioneaza catre `checkoutUrl`.
- Adminul actual este temporar, local, protejat cu PIN prin env si dezactivat implicit in build-ul public.
- GitHub `main` contine ultima versiune verificata local.
- Deployment-ul public Lovable `https://blank-atelier-canvas.lovable.app` a fost verificat cu catalog vizual de 8 produse.
- Verificatorul automat `npm run verify:storefront -- <URL> --min-products=8` trece pe URL-ul public.

## Cerinte verificate

- Brand: Trei Linii, texte publice in romana, fara link public catre admin.
- Homepage: hero, trust strip, produse recomandate, structura/colectii, lookbook, FAQ si lista de lansare.
- Shop: pana la 8 produse vizuale, filtre pe colectii, sortare in modul magazin activ.
- Product detail: imagini, variante, marimi, tabel marimi, ingrijire, CTA pre-lansare sau adaugare in cos.
- Cart: sumar, cantitati, eliminare produse, buton pentru plata securizata.
- Shopify: configurat pentru `aa01qm-mq.myshopify.com` cu token Storefront public.
- Legal/static: livrare, retur, schimb marime, termeni, confidentialitate, cookies, FAQ, contact, despre, lookbook, ghid marimi.
- Admin local: status site, copy homepage, sectiuni active/inactive, produse/colectii featured, card produs, trust badges, FAQ, noutati, footer, contact/social, date legale, pagini suport/legal, status Shopify, backup/import JSON. In public trebuie sa ramana dezactivat pana exista auth real pe server.

## Comenzi de verificare

```bash
npm run verify:launch
npm run build
npm run lint
npm run verify:storefront -- http://127.0.0.1:5175 --min-products=8
npm run verify:storefront -- https://blank-atelier-canvas.lovable.app --min-products=8 --check-public-admin --check-public-assets
npm run verify:seo -- https://blank-atelier-canvas.lovable.app
npm run verify:shopify
```

`npm run verify:launch` ruleaza lint, build, verificarea storefront-ului public,
verificarea SEO/static assets publice, scanarea surselor pentru texte/secrete interzise,
auditul de dependinte si verificarea Shopify readiness. Rezultatul este scris in
`docs/final-verification-report.md`.

Pentru audit de secret compromis, seteaza doar local `COMPROMISED_SHOPIFY_STOREFRONT_TOKEN`
in `.env` sau in shell. Nu pune tokenuri reale sau compromise in cod, documentatie publica
sau fisiere commitate.

## QA browser obligatoriu

- `/`
- `/shop`
- `/product/tricou-accent-line-08`
- `/collections`
- `/lookbook`
- `/about`
- `/faq`
- `/contact`
- `/cart`
- `/delivery`
- `/returns`
- `/exchange`
- `/terms`
- `/privacy`
- `/cookies`
- `/admin`

Pentru fiecare ruta:

- fara overflow orizontal pe mobil;
- fara texte Lovable/demo/model test in interfata publica;
- `robots.txt` si `sitemap.xml` fara comentarii TODO sau texte temporare;
- logo vizibil;
- pagina nu este 404;
- adminul nu apare in navigatia publica.

Pentru admin:

- in build public, `/admin` afiseaza doar mesajul "Admin local dezactivat";
- adminul editorial este doar pentru serverul de dezvoltare local, cu `VITE_ENABLE_LOCAL_ADMIN=true`;
- dupa confirmarea locala apar toate panourile editoriale;
- backup-ul local se genereaza si include campurile de footer;
- panoul Shopify arata Storefront API configurat cand env Shopify este setat.

Pentru magazin activ:

- modul `Magazin activ` afiseaza preturi si cos;
- produsul poate fi adaugat in cos dupa alegerea marimii;
- pagina `/cart` afiseaza produsul, subtotalul si CTA de plata securizata;
- produsele fara variante Shopify reale nu pot porni redirectionarea de plata.

## De reverificat inainte de lansare publica

- Tokenul Storefront compromis anterior trebuie rotit in Shopify inainte de comenzi reale.
- Variabilele de mediu Shopify trebuie completate in Lovable dupa token rotation: `VITE_SHOPIFY_STORE_DOMAIN`, `VITE_SHOPIFY_STOREFRONT_TOKEN`, `VITE_SHOPIFY_API_VERSION`.
- Newsletter: `VITE_KLAVIYO_COMPANY_ID` si `VITE_KLAVIYO_LIST_ID` trebuie setate in Lovable daca formularul de email ramane activ.
- Analytics: `VITE_GA_ID` si `VITE_META_PIXEL_ID` se seteaza doar cu ID-uri reale validate si se incarca numai dupa accept cookies.
- Produsele finale Shopify trebuie publicate pe canalul Headless.
- Shopify store fara password storefront sau cu domeniu custom public configurat.
- Date firma reale completate in admin: nume firma, CUI, Registrul Comertului, adresa.
- Politici legale finale validate pentru Romania.
- Test checkout real cu o comanda de test in Shopify.

## Verificare Shopify dupa token rotation

Ruleaza local, dupa ce setezi env cu tokenul nou in `.env`, `.env.local` sau in shell.
Daca vrei sa verifici explicit ca nu folosesti tokenul vechi, seteaza si
`COMPROMISED_SHOPIFY_STOREFRONT_TOKEN` doar local:

```bash
npm run verify:shopify
```

Scriptul verifica:

- tokenul Storefront nu este tokenul compromis anterior;
- Storefront API raspunde pentru domeniul configurat;
- exista produse publicate pe Storefront;
- produsele au variante Shopify `ProductVariant` reale;
- `cartCreate` returneaza `checkoutUrl`.

## Verificari rulate pe 2026-06-04

- `npm run build` - trecut.
- `npm run lint` - trecut cu warning-uri existente `react-refresh/only-export-components`, fara erori.
- `npm run verify:storefront -- http://127.0.0.1:5175 --min-products=8` - trecut.
- `npm run verify:storefront -- https://blank-atelier-canvas.lovable.app --min-products=8 --check-public-admin --check-public-assets` - trecut.
- `npm audit --audit-level=moderate`, cu lockfile temporar - 0 vulnerabilitati.
- Public bundle check - tokenul Storefront compromis anterior nu apare in JS-ul public.
- Public `/admin` - admin local dezactivat.
- Responsive `/shop` la 375, 390, 430, 768, 1024 si 1440 px - 8 produse si fara overflow orizontal.
