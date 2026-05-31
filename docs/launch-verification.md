# Trei Linii - verificare lansare

Ultima actualizare: 2026-05-31.

## Status curent

- Frontend custom Trei Linii este conectat la Shopify Storefront API.
- Produsele, colectiile, variantele, preturile si imaginile se citesc din Shopify cand sunt publicate pe canalul Headless.
- Daca Shopify nu intoarce catalog, site-ul foloseste date locale de pre-lansare ca sa nu arate gol.
- Checkout custom nu este construit. Cosul creeaza un cart Shopify si redirectioneaza catre `checkoutUrl`.
- Adminul actual este temporar, local, protejat cu PIN si salveaza in browser.

## Cerinte verificate

- Brand: Trei Linii, texte publice in romana, fara link public catre admin.
- Homepage: hero, trust strip, produse recomandate, structura/colectii, lookbook, FAQ si lista de lansare.
- Shop: lista produse, filtre pe colectii, sortare in modul magazin activ.
- Product detail: imagini, variante, marimi, tabel marimi, ingrijire, CTA pre-lansare sau adaugare in cos.
- Cart: sumar, cantitati, eliminare produse, buton pentru plata securizata.
- Shopify: configurat pentru `aa01qm-mq.myshopify.com` cu token Storefront public.
- Legal/static: livrare, retur, schimb marime, termeni, confidentialitate, cookies, FAQ, contact, despre, lookbook, ghid marimi.
- Admin local: status site, copy homepage, sectiuni active/inactive, produse/colectii featured, card produs, trust badges, FAQ, noutati, footer, contact/social, date legale, pagini suport/legal, status Shopify, backup/import JSON.

## Comenzi de verificare

```bash
npm run build
npm run lint
```

## QA browser obligatoriu

- `/`
- `/shop`
- `/product/previzualizare-design-spate-01`
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
- logo vizibil;
- pagina nu este 404;
- adminul nu apare in navigatia publica.

Pentru admin:

- `/admin` cere PIN pe sesiune blocata;
- dupa PIN apar toate panourile editoriale;
- backup-ul local se genereaza si include campurile de footer;
- panoul Shopify arata Storefront API configurat.

Pentru magazin activ:

- modul `Magazin activ` afiseaza preturi si cos;
- produsul poate fi adaugat in cos dupa alegerea marimii;
- pagina `/cart` afiseaza produsul, subtotalul si CTA de plata securizata;
- produsele fara variante Shopify reale nu pot porni redirectionarea de plata.

## De reverificat inainte de lansare publica

- Publicare Lovable dupa ultimul push GitHub.
- Variabilele de mediu setate in Lovable: `VITE_SHOPIFY_STORE_DOMAIN`, `VITE_SHOPIFY_STOREFRONT_TOKEN`, `VITE_SHOPIFY_API_VERSION`.
- Produsele Shopify publicate pe canalul Headless.
- Shopify store fara password storefront sau cu domeniu custom public configurat.
- Date firma reale completate in admin: nume firma, CUI, Registrul Comertului, adresa.
- Politici legale finale validate pentru Romania.
- Test checkout real cu o comanda de test in Shopify.
